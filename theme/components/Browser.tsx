import type { ReactNode } from 'react';

export default function Browser({ children }: { children?: ReactNode }) {
  return <div className="doc-browser">{children}</div>;
}
