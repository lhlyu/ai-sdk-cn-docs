import type { ReactNode } from 'react';

export default function Card({ children, description, title }: { children?: ReactNode; description?: string; title?: string }) {
  return (
    <div className="doc-card">
      {title ? <div className="doc-card-title">{title}</div> : null}
      {description ? <p className="doc-card-desc">{description}</p> : null}
      {children}
    </div>
  );
}
