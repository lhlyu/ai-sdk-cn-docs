import IndexCards from './IndexCards';

type StaticCard = { title: string; description: string; href: string };

// 一组只渲染固定卡片的组件，共用同一套 IndexCards 布局。
function staticCards(cards: StaticCard[]) {
  return function StaticCardsComponent() {
    return <IndexCards cards={cards} />;
  };
}

export const OfficialModelCards = staticCards([
  { title: 'OpenAI', description: 'GPT、Responses API、图像、语音和实时能力。', href: '/providers/ai-sdk-providers/openai' },
  { title: 'Anthropic', description: 'Claude 模型、工具调用和计算机使用能力。', href: '/providers/ai-sdk-providers/anthropic' },
  { title: 'Google', description: 'Gemini 模型、多模态输入和 Vertex AI 支持。', href: '/providers/ai-sdk-providers/google' },
  { title: 'xAI', description: 'Grok 系列模型。', href: '/providers/ai-sdk-providers/xai' },
  { title: 'Azure OpenAI', description: '通过 Azure 部署使用 OpenAI 模型。', href: '/providers/ai-sdk-providers/azure' },
  { title: '更多官方提供商', description: '查看所有 AI SDK 官方提供商。', href: '/providers/ai-sdk-providers' },
]);

export const CommunityModelCards = staticCards([
  { title: 'OpenRouter', description: '通过统一接口访问多个模型。', href: '/providers/community-providers/openrouter' },
  { title: 'Ollama', description: '连接本地运行的模型。', href: '/providers/community-providers/ollama' },
  { title: 'Cloudflare Workers AI', description: '在 Cloudflare 平台上使用模型。', href: '/providers/community-providers/cloudflare-workers-ai' },
  { title: 'Custom Providers', description: '构建自定义模型提供商。', href: '/providers/community-providers/custom-providers' },
  { title: '更多社区提供商', description: '查看社区维护的提供商列表。', href: '/providers/community-providers' },
]);

export const QuickstartFrameworkCards = staticCards([
  { title: 'Next.js App Router', description: '使用 App Router 构建聊天应用。', href: '/docs/getting-started/nextjs-app-router' },
  { title: 'Next.js Pages Router', description: '在 Pages Router 项目中接入 AI SDK。', href: '/docs/getting-started/nextjs-pages-router' },
  { title: 'Svelte', description: '在 Svelte 应用中使用 AI SDK UI。', href: '/docs/getting-started/svelte' },
  { title: 'Nuxt', description: '在 Nuxt 服务端路由中调用模型。', href: '/docs/getting-started/nuxt' },
  { title: 'Node.js', description: '在纯 Node.js 服务中使用 AI SDK Core。', href: '/docs/getting-started/nodejs' },
  { title: 'Expo', description: '在移动应用中集成 AI SDK。', href: '/docs/getting-started/expo' },
]);

export const PreviewSwitchProviders = staticCards([
  { title: '选择提供商', description: '了解 AI SDK 如何统一模型提供商接口。', href: '/docs/foundations/providers-and-models' },
  { title: '官方提供商', description: '查看 OpenAI、Anthropic、Google 等官方集成。', href: '/providers/ai-sdk-providers' },
  { title: '社区提供商', description: '查看社区维护的模型和平台集成。', href: '/providers/community-providers' },
]);

export const Support = staticCards([
  { title: '故障排除', description: '查看常见错误和修复方式。', href: '/docs/troubleshooting' },
  { title: 'GitHub Issues', description: '向 AI SDK 仓库反馈问题。', href: 'https://github.com/vercel/ai/issues' },
  { title: '参考文档', description: '查看 API、类型和工具函数说明。', href: '/docs/reference' },
]);
