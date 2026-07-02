import type { ReactNode } from 'react';

export default function Tab({ children }: { children?: ReactNode }) {
  return <div className="doc-tab-panel">{children}</div>;
}
