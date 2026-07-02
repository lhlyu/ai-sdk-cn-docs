import type { ReactNode } from 'react';

type PropertyItem = {
  name?: string;
  type?: string;
  description?: ReactNode;
  isRequired?: boolean;
  isOptional?: boolean;
  properties?: PropertyGroup[];
  parameters?: PropertyItem[];
};

type PropertyGroup = {
  parameters?: PropertyItem[];
};

export default function PropertiesTable({ content }: { content?: PropertyItem[] }) {
  if (!Array.isArray(content) || content.length === 0) {
    return <div className="doc-placeholder">PropertiesTable 缺少 content</div>;
  }

  return (
    <div className="doc-properties-wrap">
      <table className="doc-properties">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>{content.map((item, index) => <PropertyRows item={item} key={index} />)}</tbody>
      </table>
    </div>
  );
}

function PropertyRows({ item, depth = 0 }: { item: PropertyItem; depth?: number }) {
  const nested = item.properties?.flatMap((group) => group.parameters ?? []) ?? item.parameters ?? [];

  return (
    <>
      <tr>
        <td style={{ paddingLeft: `${depth * 20 + 12}px` }}>
          <span className="doc-property-name">{item.name}</span>
          {item.isRequired ? <span className="doc-tag">必填</span> : null}
          {item.isOptional ? <span className="doc-tag">可选</span> : null}
        </td>
        <td className="doc-property-type">{item.type}</td>
        <td>{item.description}</td>
      </tr>
      {nested.map((child, index) => (
        <PropertyRows item={child} depth={depth + 1} key={index} />
      ))}
    </>
  );
}
