import type { ReactNode } from 'react';

export default function Tabs({ children, items }: { children?: ReactNode; items?: string[] }) {
  return (
    <div className="doc-tabs">
      {items?.length ? (
        <div className="doc-tabs-header">
          {items.map((item) => (
            <span className="doc-tabs-label" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
}
