import IndexCards from './IndexCards';

export default function OfficialModelCards() {
  return (
    <IndexCards
      cards={[
        {
          title: 'OpenAI',
          description: 'GPT、Responses API、图像、语音和实时能力。',
          href: '/providers/ai-sdk-providers/openai',
        },
        {
          title: 'Anthropic',
          description: 'Claude 模型、工具调用和计算机使用能力。',
          href: '/providers/ai-sdk-providers/anthropic',
        },
        {
          title: 'Google',
          description: 'Gemini 模型、多模态输入和 Vertex AI 支持。',
          href: '/providers/ai-sdk-providers/google',
        },
        {
          title: 'xAI',
          description: 'Grok 系列模型。',
          href: '/providers/ai-sdk-providers/xai',
        },
        {
          title: 'Azure OpenAI',
          description: '通过 Azure 部署使用 OpenAI 模型。',
          href: '/providers/ai-sdk-providers/azure',
        },
        {
          title: '更多官方提供商',
          description: '查看所有 AI SDK 官方提供商。',
          href: '/providers/ai-sdk-providers',
        },
      ]}
    />
  );
}
