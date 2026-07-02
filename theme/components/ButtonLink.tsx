import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { safeHref } from '../safe-url';

export default function ButtonLink({ children, href, prefix }: AnchorHTMLAttributes<HTMLAnchorElement> & { prefix?: ReactNode }) {
  const safe = safeHref(href);
  if (!safe) return null;

  return (
    <a className="doc-button-link" href={safe}>
      {prefix}
      {children}
    </a>
  );
}
