export default function InlinePrompt({ initialInput }: { initialInput?: string }) {
  return (
    <div className="doc-inline-prompt">
      <div className="doc-inline-prompt-label">Prompt</div>
      <div>{initialInput}</div>
    </div>
  );
}
