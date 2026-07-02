import type { ReactNode } from 'react';

export default function MissingComponent({ name, children }: { name?: string; children?: ReactNode }) {
  return (
    <span className="doc-placeholder doc-placeholder-inline">
      {name ? `官方组件 ${name} 尚未本地化。` : '官方组件尚未本地化。'}
      {children}
    </span>
  );
}
