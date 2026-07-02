import IndexCards from './IndexCards';

export default function Support() {
  return (
    <IndexCards
      cards={[
        {
          title: '故障排除',
          description: '查看常见错误和修复方式。',
          href: '/docs/troubleshooting',
        },
        {
          title: 'GitHub Issues',
          description: '向 AI SDK 仓库反馈问题。',
          href: 'https://github.com/vercel/ai/issues',
        },
        {
          title: '参考文档',
          description: '查看 API、类型和工具函数说明。',
          href: '/docs/reference',
        },
      ]}
    />
  );
}
