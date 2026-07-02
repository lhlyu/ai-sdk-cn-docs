import IndexCards from './IndexCards';

export default function CommunityModelCards() {
  return (
    <IndexCards
      cards={[
        {
          title: 'OpenRouter',
          description: '通过统一接口访问多个模型。',
          href: '/providers/community-providers/openrouter',
        },
        {
          title: 'Ollama',
          description: '连接本地运行的模型。',
          href: '/providers/community-providers/ollama',
        },
        {
          title: 'Cloudflare Workers AI',
          description: '在 Cloudflare 平台上使用模型。',
          href: '/providers/community-providers/cloudflare-workers-ai',
        },
        {
          title: 'Custom Providers',
          description: '构建自定义模型提供商。',
          href: '/providers/community-providers/custom-providers',
        },
        {
          title: '更多社区提供商',
          description: '查看社区维护的提供商列表。',
          href: '/providers/community-providers',
        },
      ]}
    />
  );
}
