import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';
import { defineConfig, type RspressPlugin, type SidebarGroup, type SidebarItem } from '@rspress/core';
import { normalizeMdxFrontmatter } from './lib/frontmatter';
import sync from './metadata/sync.json';

type DocPage = {
  filepath: string;
  relPath: string;
  routePath: string;
  title: string;
};

type MutableGroup = SidebarGroup & {
  folders: Map<string, MutableGroup>;
};

type AdditionalPage = {
  routePath: string;
  content?: string;
  filepath?: string;
};

type SyncInfo = {
  syncedAt: string;
  displayTime: string;
  sourceCommit?: string;
  shortSourceCommit?: string;
};

const root = process.cwd();
const zhRoot = join(root, 'content/zh');
const syncInfo = readSyncInfo();
const pages = readPages();
const aliasPages: AdditionalPage[] = [
  aliasPage('/docs', '/docs/introduction', '文档'),
  aliasPage('/providers', '/providers/ai-sdk-providers', 'Providers'),
  aliasPage('/cookbook', '/cookbook/guides', 'Cookbook'),
  aliasPage('/examples', '/cookbook/guides', 'Examples'),
  aliasPage('/playground', '/docs/ai-sdk-core/generating-text', 'Playground'),
  aliasPage('/cookbook/guides/gemini-2-5', '/cookbook/guides/gemini', 'Gemini'),
  aliasPage('/docs/troubleshooting/common-issues/azure-stream-slow', '/docs/troubleshooting/azure-stream-slow', 'Azure OpenAI 流式传输缓慢'),
  aliasPage('/examples/api-servers/node-js-http-server', '/cookbook/api-servers/node-http-server', 'Node.js HTTP Server'),
  aliasPage('/examples/api-servers/express', '/cookbook/api-servers/express', 'Express'),
  aliasPage('/examples/api-servers/hono', '/cookbook/api-servers/hono', 'Hono'),
  aliasPage('/examples/api-servers/fastify', '/cookbook/api-servers/fastify', 'Fastify'),
  aliasPage('/examples/api-servers/nest', '/cookbook/api-servers/nest', 'Nest'),
  aliasPage('/examples/node/generating-text/generate-text', '/cookbook/node/generate-text', 'Generate Text'),
  aliasPage('/examples/node/generating-text/stream-text', '/cookbook/node/stream-text', 'Stream Text'),
  aliasPage('/examples/node/generating-structured-data/generate-object', '/cookbook/node/generate-object', 'Generate Object'),
  aliasPage('/examples/node/streaming-structured-data/stream-object', '/cookbook/node/stream-object', 'Stream Object'),
  aliasPage('/examples/next-pages/basics/generating-text', '/cookbook/next/generate-text', 'Next.js Generate Text'),
  aliasPage('/examples/next-pages/basics/streaming-text-generation', '/cookbook/next/stream-text', 'Next.js Stream Text'),
  aliasPage('/examples/next-pages/basics/generating-object', '/cookbook/next/generate-object', 'Next.js Generate Object'),
  aliasPage('/examples/next-pages/basics/streaming-object-generation', '/cookbook/next/stream-object', 'Next.js Stream Object'),
  aliasPage('/examples/next-app/basics/generating-text', '/cookbook/next/generate-text', 'Next.js Generate Text'),
  aliasPage('/examples/next-app/basics/streaming-text-generation', '/cookbook/next/stream-text', 'Next.js Stream Text'),
  aliasPage('/examples/next-app/basics/generating-object', '/cookbook/next/generate-object', 'Next.js Generate Object'),
  aliasPage('/examples/next-app/basics/streaming-object-generation', '/cookbook/next/stream-object', 'Next.js Stream Object'),
  aliasPage('/examples/next-app/interface', '/docs/advanced/rendering-ui-with-language-models', 'Interface Examples'),
  aliasPage('/examples/next-app/interface/route-components', '/docs/ai-sdk-rsc/streaming-react-components', 'Route Components'),
  aliasPage('/examples/next-app/interface/stream-component-updates', '/docs/advanced/rendering-ui-with-language-models', 'Stream Component Updates'),
  aliasPage('/examples/next-app/tools', '/docs/ai-sdk-core/tools-and-tool-calling', 'Tools'),
  aliasPage('/examples/next-app/tools/render-interface-during-tool-call', '/cookbook/next/render-visual-interface-in-chat', 'Render Interface During Tool Call'),
  aliasPage('/examples/next-app/state-management/ai-ui-states', '/docs/ai-sdk-rsc/generative-ui-state', 'AI UI States'),
  aliasPage('/examples/next-app/state-management/save-and-restore-states', '/docs/ai-sdk-rsc/saving-and-restoring-states', 'Save and Restore States'),
  aliasPage('/examples/providers/intercepting-fetch-requests', '/cookbook/node/intercept-fetch-requests', 'Intercept Fetch Requests'),
];
const zhCnI18n: Record<string, string> = {
  languagesText: '语言',
  themeText: '主题',
  versionsText: '版本',
  menuTitle: '菜单',
  outlineTitle: '本页目录',
  scrollToTopText: '回到顶部',
  lastUpdatedText: '最后更新于',
  lastUpdatedAuthorText: '作者',
  prevPageText: '上一页',
  nextPageText: '下一页',
  sourceCodeText: '源码',
  searchPlaceholderText: '搜索',
  searchPanelCancelText: '取消',
  searchNoResultsText: '未找到匹配结果',
  searchSuggestedQueryText: '试试搜索其他关键词',
  'overview.filterNameText': '筛选',
  'overview.filterPlaceholderText': '搜索 API',
  'overview.filterNoResultText': '未找到匹配的 API',
  openInText: '在 {{name}} 中打开',
  copyMarkdownText: '复制 Markdown',
  copyMarkdownLinkText: '复制 Markdown 链接',
  editLinkText: '编辑此页面',
  codeButtonGroupCopyButtonText: '复制代码',
  codeButtonGroupWrapButtonText: '切换代码换行',
  notFoundText: '页面未找到',
  takeMeHomeText: '返回首页',
  promptCopyText: '复制 Prompt',
  promptCopiedText: '已复制',
  promptExpandText: '展开',
  promptCollapseText: '折叠',
};

export default defineConfig({
  root: '.',
  lang: 'zh-CN',
  title: 'AI SDK 中文文档',
  description: 'AI SDK 是一个 TypeScript 工具包，用于通过 React、Next.js、Vue、Svelte、Node.js 等技术构建 AI 应用和智能体。',
  logoText: 'AI SDK 中文文档',
  logoHref: '/',
  outDir: 'dist',
  builderConfig: {
    performance: {
      buildCache: false,
    },
  },
  i18nSource(source) {
    for (const [key, value] of Object.entries(zhCnI18n)) {
      source[key] ??= {};
      source[key]['zh-CN'] = value;
    }
    return source;
  },
  route: {
    cleanUrls: true,
    exclude: [
      'README.md',
      'rspress.config.ts',
      'theme/**',
      'content/**',
      'scripts/**',
      'tools/**',
      'lib/**',
      'app/**',
      'components/**',
      'metadata/**',
      'dist/**',
      'doc_build/**',
      '.rspress/**',
      'node_modules/**',
    ],
  },
  themeConfig: {
    darkMode: true,
    enableContentAnimation: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/vercel/ai',
      },
    ],
    nav: [
      { text: '文档', link: '/docs/introduction', activeMatch: '^/docs/' },
      { text: 'Cookbook', link: '/cookbook/guides', activeMatch: '^/cookbook/' },
      { text: 'Providers', link: '/providers/ai-sdk-providers', activeMatch: '^/providers/' },
    ],
    sidebar: buildSidebar(pages),
  },
  markdown: {
    crossCompilerCache: false,
    link: {
      checkDeadLinks: false,
      checkAnchors: false,
    },
    image: {
      checkDeadImages: false,
    },
  },
  plugins: [contentPagesPlugin()],
});

function contentPagesPlugin(): RspressPlugin {
  return {
    name: 'content-pages',
    addPages(): AdditionalPage[] {
      return [
        {
          routePath: '/',
          content: [
            '---',
            'title: AI SDK 中文文档',
            'description: AI SDK 中文文档',
            'pageType: doc-wide',
            'sidebar: false',
            'outline: false',
            'footer: false',
            '---',
            '',
            '<div className="doc-home">',
            '',
            'AI SDK 是一个 TypeScript 工具包，用于通过 React、Next.js、Vue、Svelte、Node.js 等技术构建 AI 应用和智能体。',
            '',
            ...homeSyncStatus(syncInfo),
            '',
            '<div className="doc-home-actions">',
            '<ButtonLink href="/docs/introduction">开始阅读</ButtonLink>',
            '<ButtonLink href="/docs/getting-started/nextjs-app-router">快速入门</ButtonLink>',
            '<ButtonLink href="/providers/ai-sdk-providers">模型提供商</ButtonLink>',
            '</div>',
            '',
            '<IndexCards',
            '  cards={[',
            "    { title: '文档', description: '理解 AI SDK 的核心概念、模型调用、工具调用和流式输出。', href: '/docs/introduction' },",
            "    { title: 'Cookbook', description: '按场景查看可直接落地的应用示例和实践指南。', href: '/cookbook/guides' },",
            "    { title: 'Providers', description: '查找 OpenAI、Anthropic、Google、Azure 等模型提供商集成。', href: '/providers/ai-sdk-providers' },",
            '  ]}',
            '/>',
            '',
            '## 常用入口',
            '',
            '<IndexCards',
            '  cards={[',
            "    { title: '生成文本', description: '使用 generateText 和 streamText 构建基础文本生成。', href: '/docs/ai-sdk-core/generating-text' },",
            "    { title: '工具调用', description: '让模型调用函数、访问外部系统并返回结构化结果。', href: '/docs/ai-sdk-core/tools-and-tool-calling' },",
            "    { title: '聊天机器人', description: '使用 AI SDK UI 构建流式聊天体验。', href: '/docs/ai-sdk-ui/chatbot' },",
            "    { title: 'Next.js App Router', description: '从 Next.js App Router 项目开始集成 AI SDK。', href: '/docs/getting-started/nextjs-app-router' },",
            '  ]}',
            '/>',
            '',
            '</div>',
          ].join('\n'),
        },
        ...aliasPages,
        ...pages.map((page) => ({
          routePath: page.routePath,
          content: prepareMdxForRspress(readFileSync(page.filepath, 'utf8')),
        })),
      ];
    },
  };
}

function readSyncInfo(): SyncInfo | undefined {
  const syncPath = join(root, 'metadata/sync.json');
  const info = sync as {
    syncedAt?: unknown;
    sourceCommit?: unknown;
  };

  if (typeof info.syncedAt !== 'string') {
    throw new Error(`${syncPath}: missing syncedAt`);
  }

  const sourceCommit = typeof info.sourceCommit === 'string' ? info.sourceCommit : undefined;
  return {
    syncedAt: info.syncedAt,
    displayTime: formatSyncTime(info.syncedAt),
    sourceCommit,
    shortSourceCommit: sourceCommit?.slice(0, 7),
  };
}

function homeSyncStatus(info: SyncInfo | undefined): string[] {
  if (!info) return [];

  return [
    `<div className="doc-sync-status">`,
    `<span>最近同步</span>`,
    `<time dateTime="${info.syncedAt}">${info.displayTime}</time>`,
    info.shortSourceCommit ? `<code>${info.shortSourceCommit}</code>` : '',
    `</div>`,
  ].filter(Boolean);
}

function formatSyncTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid syncedAt: ${value}`);
  }

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function aliasPage(routePath: string, target: string, title: string): AdditionalPage {
  return {
    routePath,
    content: [
      '---',
      `title: ${title}`,
      `description: ${title}`,
      '---',
      '',
      `# ${title}`,
      '',
      `[打开页面](${target})`,
    ].join('\n'),
  };
}

function readPages(): DocPage[] {
  return listMdxFiles(zhRoot).map((filepath) => {
    const raw = readFileSync(filepath, 'utf8');
    const parsed = matter(normalizeMdxFrontmatter(raw));
    const relPath = relative(zhRoot, filepath);
    const routePath = `/${pathToSlugs(relPath).join('/')}`;

    return {
      filepath,
      relPath,
      routePath,
      title: stringValue(parsed.data.title) ?? titleFromSlug(routePath.split('/').at(-1) ?? 'index'),
    };
  });
}

function buildSidebar(items: DocPage[]): Record<string, Array<SidebarGroup | SidebarItem>> {
  const topLevel = new Map<string, DocPage[]>();
  for (const page of items) {
    const first = page.routePath.split('/').filter(Boolean)[0] ?? '';
    if (!topLevel.has(first)) topLevel.set(first, []);
    topLevel.get(first)?.push(page);
  }

  const sidebar: Record<string, Array<SidebarGroup | SidebarItem>> = {};
  for (const [section, sectionPages] of topLevel) {
    sidebar[`/${section}/`] = buildSidebarItems(sectionPages);
  }

  return sidebar;
}

function buildSidebarItems(items: DocPage[]): Array<SidebarGroup | SidebarItem> {
  const rootGroup: MutableGroup = {
    text: '',
    items: [],
    folders: new Map(),
  };

  for (const page of items) {
    insertPage(rootGroup, page);
  }

  return rootGroup.items as Array<SidebarGroup | SidebarItem>;
}

function insertPage(rootGroup: MutableGroup, page: DocPage): void {
  const routeParts = page.routePath.split('/').filter(Boolean);
  const fileName = page.relPath.split('/').at(-1);
  const isIndex = fileName === 'index.mdx';
  const folderParts = isIndex ? routeParts : routeParts.slice(0, -1);

  let current = rootGroup;
  for (const part of folderParts) {
    current = getOrCreateGroup(current, part);
  }

  if (isIndex) {
    current.text = page.title;
    current.link = page.routePath;
    return;
  }

  current.items.push({
    text: page.title,
    link: page.routePath,
  });
}

function getOrCreateGroup(parent: MutableGroup, slug: string): MutableGroup {
  const existing = parent.folders.get(slug);
  if (existing) return existing;

  const group: MutableGroup = {
    text: titleFromSlug(slug),
    items: [],
    folders: new Map(),
    collapsible: true,
    collapsed: slug !== 'docs',
  };
  parent.folders.set(slug, group);
  parent.items.push(group);
  return group;
}

function listMdxFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listMdxFiles(path);
      return entry.isFile() && entry.name.endsWith('.mdx') ? [path] : [];
    })
    .sort();
}

function pathToSlugs(path: string): string[] {
  const withoutExt = path.replace(/\.mdx$/, '');
  const parts = withoutExt.split('/');
  const normalized = parts.at(-1) === 'index' ? parts.slice(0, -1) : parts;
  return normalized.map(stripOrderPrefix).map((part) => (part === '00-introduction' ? 'introduction' : part));
}

function stripOrderPrefix(value: string): string {
  return value.replace(/^\d+-/, '');
}

function titleFromSlug(value: string): string {
  return stripOrderPrefix(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function prepareMdxForRspress(content: string): string {
  const normalized = normalizeMdxFrontmatter(content)
    .replace(
      /^```([A-Za-z0-9_-]+)([^\n]*)$/gm,
      (_match, lang: string, meta: string) => {
        const normalizedLang = normalizeFenceLang(lang);
        const cleanedMeta = meta
          .replace(/\s+\bfile=(?:"[^"]+"|'[^']+'|`[^`]+`|[^\s]+)/g, '')
          .trimEnd();
        return `\`\`\`${normalizedLang}${cleanedMeta ? ` ${cleanedMeta.trimStart()}` : ''}`;
      },
    )
    .replace(/<(\d+(?:\.\d+)?[a-zA-Z]+)\b/g, '&lt;$1')
    .replace(/<Check\s+size=\{\s*$/gm, '<Check />')
    .replace(/node:/g, 'node\\:')
    .replace(/\bfrom\s+(['"])(fs|fs\/promises|path)\1/g, 'from $1$2-module$1')
    .replace(/\bimport\s+([A-Za-z_$][\w$]*)\s+from\s+(['"])(fs|path)\2/g, 'import $1 from $2$3-module$2');

  return closeDanglingNote(normalized);
}

function normalizeFenceLang(lang: string): string {
  const normalized = lang.toLowerCase();
  if (normalized === 'env' || normalized === 'sh' || normalized === 'rego') return 'bash';
  if (normalized === 'typescript') return 'ts';
  if (normalized === 'javascript') return 'js';
  if (normalized === 'markdown') return 'md';
  return normalized;
}

function closeDanglingNote(content: string): string {
  const opens = content.match(/<Note\b[^>]*>/g)?.length ?? 0;
  const closes = content.match(/<\/Note>/g)?.length ?? 0;
  if (opens <= closes) return content;
  return `${content.trimEnd()}\n</Note>\n`;
}
