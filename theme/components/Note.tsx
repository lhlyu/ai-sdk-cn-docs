import type { ReactNode } from 'react';

export default function Note({ children, type }: { children?: ReactNode; type?: string }) {
  return <div className={`doc-callout${type === 'warning' ? ' doc-callout-warning' : ''}`}>{children}</div>;
}
