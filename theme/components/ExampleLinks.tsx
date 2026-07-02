import { safeHref } from '../safe-url';

type ExampleLink = {
  title?: string;
  link?: string;
};

export default function ExampleLinks({ examples }: { examples?: ExampleLink[] }) {
  if (!Array.isArray(examples) || examples.length === 0) {
    return <div className="doc-placeholder">ExampleLinks 缺少 examples</div>;
  }

  return (
    <ul>
      {examples.map((example, index) => {
        const href = safeHref(example.link);
        if (!href) return null;
        return (
          <li key={index}>
            <a href={href}>{example.title}</a>
          </li>
        );
      })}
    </ul>
  );
}
