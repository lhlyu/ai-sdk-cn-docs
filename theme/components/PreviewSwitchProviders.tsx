import IndexCards from './IndexCards';

export default function PreviewSwitchProviders() {
  return (
    <IndexCards
      cards={[
        {
          title: '选择提供商',
          description: '了解 AI SDK 如何统一模型提供商接口。',
          href: '/docs/foundations/providers-and-models',
        },
        {
          title: '官方提供商',
          description: '查看 OpenAI、Anthropic、Google 等官方集成。',
          href: '/providers/ai-sdk-providers',
        },
        {
          title: '社区提供商',
          description: '查看社区维护的模型和平台集成。',
          href: '/providers/community-providers',
        },
      ]}
    />
  );
}
