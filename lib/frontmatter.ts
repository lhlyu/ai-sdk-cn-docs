const stringFrontmatterKeys = new Set(['title', 'description']);

export function normalizeMdxFrontmatter(content: string): string {
  if (!content.startsWith('---\n')) {
    return content;
  }

  const end = content.indexOf('\n---', 4);
  if (end === -1) {
    return content;
  }

  const frontmatter = content.slice(4, end);
  const normalized = frontmatter
    .split('\n')
    .map(line => normalizeFrontmatterLine(line))
    .join('\n');

  return `---\n${normalized}${content.slice(end)}`;
}

function normalizeFrontmatterLine(line: string): string {
  const match = line.match(/^(\s*)([A-Za-z0-9_-]+):(\s*)(.*)$/);
  if (!match) {
    return line;
  }

  const [, indent, key, spacing, rawValue] = match;
  if (!key || !stringFrontmatterKeys.has(key)) {
    return line;
  }

  const value = rawValue ?? '';
  const trimmed = value.trimStart();
  if (
    trimmed === '' ||
    trimmed.startsWith('"') ||
    trimmed.startsWith("'") ||
    trimmed.startsWith('|') ||
    trimmed.startsWith('>')
  ) {
    return line;
  }

  return `${indent}${key}:${spacing}${JSON.stringify(value.trim())}`;
}
