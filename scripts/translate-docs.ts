import logUpdate from "log-update";
import { normalizeMdxFrontmatter } from "../lib/frontmatter";
import {
  findCodeFenceError,
  stripOuterCodeFence,
} from "../lib/mdx-fence";

type PageStatus =
  | "new"
  | "changed"
  | "unchanged"
  | "missing_target"
  | "removed"
  | "orphan_target";

type ReportItem = {
  path: string;
  sourcePath?: string;
  targetPath?: string;
  sourceHash?: string;
  sourceCommit?: string;
  status: PageStatus;
};

type SyncReport = {
  source?: {
    commit?: string;
  };
  summary: Record<PageStatus, number>;
  items: ReportItem[];
};

type TranslationRecord = {
  sourceHash: string;
  sourceCommit: string;
  translatedAt?: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

class RetryableTranslationError extends Error {}

const root = process.cwd();
const reportPath = `${root}/metadata/sync-report.json`;
const glossaryPath = `${root}/metadata/glossary.json`;
const translationStatePath = `${root}/metadata/translation-state.json`;
const translateStatuses = new Set<PageStatus>([
  "new",
  "changed",
  "missing_target",
]);
const baseUrl = trimTrailingSlash(requiredEnv("OPENAI_BASE_URL"));
const apiKey = requiredEnv("OPENAI_API_KEY");
const model = requiredEnv("OPENAI_MODEL_ID");
const maxTokens = parsePositiveInt(Bun.env.OPENAI_MAX_TOKENS);
const limit = parsePositiveInt(Bun.env.TRANSLATE_LIMIT);
const concurrency = parsePositiveInt(Bun.env.TRANSLATE_CONCURRENCY) ?? 3;
const dryRun = Bun.env.TRANSLATE_DRY_RUN === "1";
const interactiveProgress = process.stdout.isTTY && Bun.env.CI !== "1";

const report = await readJson<SyncReport>(reportPath);
const glossary = await readJson<Record<string, string>>(glossaryPath);
const translationState = await readTranslationState();
const targets = report.items.filter(
  (item) =>
    translateStatuses.has(item.status) && item.sourcePath && item.targetPath,
).filter(
  (item) => translationState[item.path]?.sourceHash !== item.sourceHash,
);

if (targets.length === 0) {
  console.log("no documents need translation");
  printSkippedSummary(report.items);
  process.exit(0);
}

const selectedTargets = limit ? targets.slice(0, limit) : targets;
const skippedByLimit = targets.length - selectedTargets.length;
persistProgress(
  `translating ${selectedTargets.length}/${targets.length} document(s) with ${model}, concurrency=${concurrency}${maxTokens ? `, max_tokens=${maxTokens}` : ""}`,
);
if (dryRun) {
  persistProgress("dry-run enabled, no files will be written");
}
printSkippedSummary(report.items);

let completed = 0;
let failed = 0;
const failedItems: string[] = [];
let nextIndex = 0;
let stateWriteQueue = Promise.resolve();

await Promise.all(
  Array.from(
    { length: Math.min(concurrency, selectedTargets.length) },
    async () => {
      while (nextIndex < selectedTargets.length) {
        const index = nextIndex;
        nextIndex += 1;
        const item = selectedTargets[index];
        if (!item) continue;

        try {
          await translateItem(item, index + 1, selectedTargets.length);
          completed += 1;
          renderProgress(
            completed,
            selectedTargets.length,
            `done ${item.path}`,
          );
        } catch (error) {
          failed += 1;
          failedItems.push(
            `${item.path}: ${error instanceof Error ? error.message : String(error)}`,
          );
          completed += 1;
          renderProgress(
            completed,
            selectedTargets.length,
            `failed ${item.path}`,
          );
          finishProgress();
          console.error(error instanceof Error ? error.message : error);
        }
      }
    },
  ),
);

if (skippedByLimit > 0) {
  persistProgress(
    `skipped ${skippedByLimit} document(s) because TRANSLATE_LIMIT=${limit}`,
  );
}

if (failed > 0) {
  persistProgress(
    `translation finished with ${failed} failed document(s) skipped`,
  );
  for (const failedItem of failedItems) {
    console.error(failedItem);
  }
} else {
  persistProgress("translation finished");
}

async function translateItem(
  item: ReportItem,
  index: number,
  total: number,
): Promise<void> {
  const label = `[${index}/${total}]`;
  if (!item.sourcePath || !item.targetPath) {
    throw new Error(`${item.path}: missing sourcePath or targetPath`);
  }

  const sourcePath = `${root}/${item.sourcePath}`;
  const targetPath = `${root}/${item.targetPath}`;
  const source = await Bun.file(sourcePath).text();
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    renderProgress(completed, total, `${label} translating ${item.path}`);
    if (dryRun) {
      renderProgress(
        completed + 1,
        total,
        `${label} would translate ${item.path}`,
      );
      return;
    }

    try {
      const translated = await translateMdx(source, item.path, glossary);
      validateTranslatedMdx(translated, item.path);
      await ensureParentDir(targetPath);
      await Bun.write(targetPath, ensureTrailingNewline(translated));
      await markTranslated(item);
      return;
    } catch (error) {
      if (error instanceof RetryableTranslationError && attempt < maxAttempts) {
        persistProgress(
          `${label} retrying ${item.path} (attempt ${attempt}/${maxAttempts})`,
        );
        continue;
      }
      throw error;
    }
  }
}

async function translateMdx(
  source: string,
  path: string,
  glossary: Record<string, string>,
): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
      thinking: { type: "disabled" },
      reasoning_effort: "high",
      stream: false,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: [
            "你是专业技术文档本地化译者。把英文 MDX 文档翻译成简体中文。",
            "必须保持 MDX 结构可编译。",
            "保留 frontmatter 字段名，只翻译 title 和 description 的自然语言值。",
            "frontmatter 的 title 和 description 必须输出为合法 YAML 字符串；如果值包含或保留反引号、@、冒号、引号等特殊字符，必须用双引号包裹并正确转义。",
            "不要翻译代码块、行内代码、import/export、JSX 组件名、组件属性名、URL、包名、API 名、类型名、变量名、专有名词。",
            "Markdown 链接 URL 必须保持不变，链接文字可自然翻译。",
            "不要添加解释、不要包裹 Markdown 代码围栏、只输出翻译后的完整 MDX 文件内容。",
          ].join("\n"),
        },
        {
          role: "user",
          content: [
            `文件路径：${path}`,
            "",
            "术语表 JSON：",
            JSON.stringify(glossary, null, 2),
            "",
            "英文 MDX：",
            source,
          ].join("\n"),
        },
      ],
    }),
  });

  const body = (await response.json()) as ChatCompletionResponse;
  if (!response.ok) {
    throw new Error(
      `translation request failed for ${path}: ${body.error?.message ?? response.statusText}`,
    );
  }

  const choice = body.choices?.[0];
  const finishReason = choice?.finish_reason;
  if (finishReason && finishReason !== "stop") {
    throw new RetryableTranslationError(
      `translation did not finish cleanly for ${path}: finish_reason=${finishReason}${formatUsage(body.usage)}`,
    );
  }

  const content = choice?.message?.content;
  if (!content) {
    throw new Error(`translation response is empty for ${path}`);
  }

  return normalizeMdxFrontmatter(stripOuterCodeFence(content.trim()));
}

function validateTranslatedMdx(content: string, path: string): void {
  if (!content.startsWith("---\n")) {
    throw new RetryableTranslationError(
      `${path}: translated MDX missing frontmatter`,
    );
  }

  const fenceError = findCodeFenceError(content);
  if (fenceError) {
    throw new RetryableTranslationError(
      `${path}: translated MDX has unbalanced markdown code fences (${fenceError})`,
    );
  }
}

function formatUsage(usage: ChatCompletionResponse["usage"]): string {
  if (!usage) return "";

  return `, prompt_tokens=${usage.prompt_tokens ?? "unknown"}, completion_tokens=${usage.completion_tokens ?? "unknown"}, total_tokens=${usage.total_tokens ?? "unknown"}`;
}

async function readJson<T>(path: string): Promise<T> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    throw new Error(`${path} does not exist, run bun run docs:sync first`);
  }

  return JSON.parse(await file.text()) as T;
}

async function readJsonWithFallback<T>(path: string, fallback: T): Promise<T> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return fallback;
  }

  return JSON.parse(await file.text()) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await Bun.write(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function readTranslationState(): Promise<
  Record<string, TranslationRecord>
> {
  const state = await readJsonWithFallback<Record<string, TranslationRecord>>(
    translationStatePath,
    {},
  );
  if (Object.keys(state).length > 0) {
    return state;
  }

  return readJsonWithFallback<Record<string, TranslationRecord>>(
    `${root}/metadata/sources.json`,
    {},
  );
}

async function markTranslated(item: ReportItem): Promise<void> {
  if (!item.sourceHash) {
    throw new Error(`${item.path}: missing sourceHash in sync report`);
  }

  const sourceCommit = item.sourceCommit ?? report.source?.commit;
  if (!sourceCommit) {
    throw new Error(`${item.path}: missing sourceCommit in sync report`);
  }

  translationState[item.path] = {
    sourceHash: item.sourceHash,
    sourceCommit,
    translatedAt: new Date().toISOString(),
  };
  stateWriteQueue = stateWriteQueue.then(() =>
    writeJson(translationStatePath, sortRecordByKey(translationState)),
  );
  await stateWriteQueue;
}

function sortRecordByKey<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  );
}

async function ensureParentDir(path: string): Promise<void> {
  const index = path.lastIndexOf("/");
  if (index <= 0) return;

  await $mkdir(path.slice(0, index));
}

async function $mkdir(path: string): Promise<void> {
  const { $ } = await import("bun");
  await $`mkdir -p ${path}`.quiet();
}

function renderProgress(done: number, total: number, message: string): void {
  const width = 28;
  const ratio = total === 0 ? 1 : done / total;
  const filled = Math.round(width * ratio);
  const bar = `${"=".repeat(filled)}${"-".repeat(width - filled)}`;
  const percent = Math.round(ratio * 100)
    .toString()
    .padStart(3, " ");
  const count = `${done}/${total}`.padStart(`${total}/${total}`.length, " ");
  const line = `[${bar}] ${percent}% ${count} ${message}`;

  updateProgress(line);
}

function updateProgress(line: string): void {
  if (!interactiveProgress) {
    console.log(line);
    return;
  }

  logUpdate(truncateLine(line));
}

function finishProgress(): void {
  if (interactiveProgress) {
    logUpdate.done();
  }
}

function persistProgress(line: string): void {
  if (interactiveProgress) {
    logUpdate.persist(line);
    return;
  }

  console.log(line);
}

function truncateLine(value: string): string {
  const columns = process.stdout.columns ?? 100;
  if (value.length <= columns) return value;

  return `${value.slice(0, Math.max(columns - 3, 0))}...`;
}

function printSkippedSummary(items: ReportItem[]): void {
  const removed = items.filter((item) => item.status === "removed").length;
  const orphanTarget = items.filter(
    (item) => item.status === "orphan_target",
  ).length;

  if (removed > 0) {
    persistProgress(
      `removed upstream document(s): ${removed}; not deleting local zh files`,
    );
  }
  if (orphanTarget > 0) {
    persistProgress(
      `orphan zh document(s): ${orphanTarget}; not deleting local zh files`,
    );
  }
}

function requiredEnv(name: string): string {
  const value = Bun.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith("\n") ? value : `${value}\n`;
}

export {};
