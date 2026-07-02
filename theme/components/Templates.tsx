import IndexCards from './IndexCards';

const templates = {
  'starter-kits': [
    {
      title: 'Next.js 智能体',
      description: '使用 AI SDK UI 构建流式聊天体验。',
      href: '/cookbook/next/stream-text',
    },
    {
      title: 'Node.js 示例',
      description: '在服务端直接调用 AI SDK Core。',
      href: '/cookbook/node/generate-text',
    },
    {
      title: 'API Server',
      description: '在常见 Node 框架中暴露 AI 接口。',
      href: '/cookbook/api-servers',
    },
  ],
  'feature-exploration': [
    {
      title: '工具调用',
      description: '让模型调用类型安全的工具。',
      href: '/docs/ai-sdk-core/tools-and-tool-calling',
    },
    {
      title: '结构化输出',
      description: '使用 schema 生成可验证对象。',
      href: '/docs/ai-sdk-core/generating-structured-data',
    },
    {
      title: '多模态提示词',
      description: '处理图片、PDF、音频等输入。',
      href: '/docs/foundations/prompts',
    },
  ],
  frameworks: [
    {
      title: 'Next.js',
      description: 'App Router 和 Pages Router 集成。',
      href: '/docs/getting-started/nextjs-app-router',
    },
    {
      title: 'Nuxt',
      description: '在 Nuxt 应用中接入 AI SDK。',
      href: '/docs/getting-started/nuxt',
    },
    {
      title: 'Svelte',
      description: '在 Svelte 应用中构建聊天界面。',
      href: '/docs/getting-started/svelte',
    },
  ],
  'generative-ui': [
    {
      title: '生成式用户界面',
      description: '让模型驱动 UI 组件渲染。',
      href: '/docs/ai-sdk-ui/generative-user-interfaces',
    },
    {
      title: 'React Server Components',
      description: '使用 RSC 流式返回 UI。',
      href: '/docs/ai-sdk-rsc/streaming-react-components',
    },
    {
      title: '聊天中渲染界面',
      description: '在对话过程中展示结构化视图。',
      href: '/cookbook/next/render-visual-interface-in-chat',
    },
  ],
  security: [
    {
      title: '工具审批',
      description: '为敏感工具调用加入人工确认。',
      href: '/docs/agents/tool-approvals',
    },
    {
      title: '策略审批',
      description: '用策略约束智能体行为。',
      href: '/docs/agents/policy-tool-approvals',
    },
    {
      title: '错误处理',
      description: '处理模型、工具和流式响应错误。',
      href: '/docs/ai-sdk-core/error-handling',
    },
  ],
} as const;

export default function Templates({ type = 'starter-kits' }: { type?: string }) {
  const cards = templates[type as keyof typeof templates] ?? templates['starter-kits'];
  return <IndexCards cards={[...cards]} />;
}
