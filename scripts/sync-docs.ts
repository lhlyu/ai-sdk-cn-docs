import { $, Glob } from 'bun';

type SourceRecord = {
  sourceHash: string;
  sourceCommit: string;
};

type PageStatus =
  | 'new'
  | 'changed'
  | 'unchanged'
  | 'missing_target'
  | 'removed'
  | 'orphan_target';

type ReportItem = {
  path: string;
  sourcePath?: string;
  targetPath?: string;
  sourceHash?: string;
  previousSourceHash?: string;
  sourceCommit?: string;
  status: PageStatus;
};

const repoUrl = 'https://github.com/vercel/ai.git';
const root = process.cwd();
const tempRoot = joinPath(root, '.tmp');
const cloneDir = joinPath(tempRoot, 'vercel-ai');
const enDir = joinPath(root, 'content/en');
const zhDir = joinPath(root, 'content/zh');
const metadataDir = joinPath(root, 'metadata');
const sourcesPath = joinPath(metadataDir, 'sources.json');
const reportPath = joinPath(metadataDir, 'sync-report.json');

await mkdir(tempRoot);
await mkdir(metadataDir);
await rm(cloneDir);

await $`git clone --depth 1 --filter=blob:none --sparse ${repoUrl} ${cloneDir}`.quiet();
await $`git -C ${cloneDir} sparse-checkout set content`.quiet();
const sourceCommit = (await $`git -C ${cloneDir} rev-parse HEAD`.text()).trim();

await rm(enDir);
await mkdir(joinPath(root, 'content'));
await cp(joinPath(cloneDir, 'content'), enDir);

const previous = await readJson<Record<string, SourceRecord>>(sourcesPath, {});
const enFiles = await listMdxFiles(enDir);
const zhFiles = await listMdxFiles(zhDir);
const zhFileSet = new Set(zhFiles);
const nextSources: Record<string, SourceRecord> = {};
const report: ReportItem[] = [];

for (const relPath of enFiles) {
  const sourcePath = joinPath(enDir, relPath);
  const targetPath = joinPath(zhDir, relPath);
  const sourceHash = await sha256File(sourcePath);
  const previousSourceHash = previous[relPath]?.sourceHash;
  const hasTarget = await Bun.file(targetPath).exists();

  let status: PageStatus;
  if (!previousSourceHash) {
    status = hasTarget ? 'changed' : 'new';
  } else if (previousSourceHash !== sourceHash) {
    status = hasTarget ? 'changed' : 'missing_target';
  } else {
    status = hasTarget ? 'unchanged' : 'missing_target';
  }

  nextSources[relPath] = {
    sourceHash,
    sourceCommit,
  };

  report.push({
    path: relPath,
    sourcePath: relativePath(root, sourcePath),
    targetPath: relativePath(root, targetPath),
    sourceHash,
    previousSourceHash,
    sourceCommit,
    status,
  });
}

for (const relPath of Object.keys(previous).sort()) {
  if (!nextSources[relPath]) {
    report.push({
      path: relPath,
      targetPath: relativePath(root, joinPath(zhDir, relPath)),
      previousSourceHash: previous[relPath]?.sourceHash,
      status: 'removed',
    });
  }
}

for (const relPath of zhFileSet) {
  if (!nextSources[relPath]) {
    report.push({
      path: relPath,
      targetPath: relativePath(root, joinPath(zhDir, relPath)),
      status: 'orphan_target',
    });
  }
}

report.sort((left, right) => left.path.localeCompare(right.path));
await writeJson(sourcesPath, nextSources);
await writeJson(reportPath, {
  source: {
    repo: repoUrl,
    commit: sourceCommit,
  },
  summary: summarize(report),
  items: report,
});

console.log(`synced vercel/ai content at ${sourceCommit}`);
console.table(summarize(report));
console.log(`report: ${relativePath(root, reportPath)}`);

async function listMdxFiles(dir: string): Promise<string[]> {
  const glob = new Glob('**/*.mdx');
  const files: string[] = [];

  try {
    for await (const file of glob.scan({ cwd: dir, onlyFiles: true })) {
      files.push(file);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('No such file or directory')) {
      return [];
    }
    throw error;
  }

  return files.sort();
}

async function sha256File(file: string): Promise<string> {
  const data = await Bun.file(file).arrayBuffer();
  const hash = new Bun.CryptoHasher('sha256');
  hash.update(data);
  return `sha256:${hash.digest('hex')}`;
}

async function readJson<T>(path: string, fallback: T): Promise<T> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return fallback;
  }

  return JSON.parse(await file.text()) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await Bun.write(path, `${JSON.stringify(value, null, 2)}\n`);
}

function summarize(items: ReportItem[]) {
  return items.reduce<Record<PageStatus, number>>(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    {
      new: 0,
      changed: 0,
      unchanged: 0,
      missing_target: 0,
      removed: 0,
      orphan_target: 0,
    },
  );
}

async function mkdir(path: string): Promise<void> {
  await $`mkdir -p ${path}`.quiet();
}

async function rm(path: string): Promise<void> {
  await $`rm -rf ${path}`.quiet();
}

async function cp(from: string, to: string): Promise<void> {
  await $`cp -R ${from} ${to}`.quiet();
}

function joinPath(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/^([^/])/, '$1');
}

function relativePath(from: string, to: string): string {
  const normalizedFrom = trimTrailingSlash(from);
  const normalizedTo = to.replace(/\/+/g, '/');
  return normalizedTo.startsWith(`${normalizedFrom}/`)
    ? normalizedTo.slice(normalizedFrom.length + 1)
    : normalizedTo;
}

function trimTrailingSlash(path: string): string {
  return path.replace(/\/+$/, '');
}
