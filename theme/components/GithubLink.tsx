import { safeHref } from '../safe-url';

export default function GithubLink({ link }: { link?: string }) {
  const safe = safeHref(link);
  if (!safe) return <div className="doc-placeholder">GithubLink 链接无效</div>;
  return <a href={safe}>在 GitHub 查看源码</a>;
}
