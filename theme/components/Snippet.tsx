export default function Snippet({ text }: { text?: string; dark?: boolean; prompt?: boolean }) {
  if (!text) return <div className="doc-placeholder">Snippet 缺少 text</div>;
  return (
    <div className="doc-snippet">
      <code>{text}</code>
    </div>
  );
}
