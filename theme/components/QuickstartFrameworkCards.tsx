import IndexCards from './IndexCards';

export default function QuickstartFrameworkCards() {
  return (
    <IndexCards
      cards={[
        {
          title: 'Next.js App Router',
          description: '使用 App Router 构建聊天应用。',
          href: '/docs/getting-started/nextjs-app-router',
        },
        {
          title: 'Next.js Pages Router',
          description: '在 Pages Router 项目中接入 AI SDK。',
          href: '/docs/getting-started/nextjs-pages-router',
        },
        {
          title: 'Svelte',
          description: '在 Svelte 应用中使用 AI SDK UI。',
          href: '/docs/getting-started/svelte',
        },
        {
          title: 'Nuxt',
          description: '在 Nuxt 服务端路由中调用模型。',
          href: '/docs/getting-started/nuxt',
        },
        {
          title: 'Node.js',
          description: '在纯 Node.js 服务中使用 AI SDK Core。',
          href: '/docs/getting-started/nodejs',
        },
        {
          title: 'Expo',
          description: '在移动应用中集成 AI SDK。',
          href: '/docs/getting-started/expo',
        },
      ]}
    />
  );
}
