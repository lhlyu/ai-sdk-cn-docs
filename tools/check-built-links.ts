import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? 'dist';
const missing = new Set<string>();

for (const file of listHtmlFiles(root)) {
  const html = await Bun.file(file).text();
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const target = value.split('#')[0]?.split('?')[0];
    if (!target || target === '/' || target.startsWith('/static/')) continue;
    if (!targetExists(target)) missing.add(`${file}: ${value}`);
  }
}

if (missing.size > 0) {
  console.error(`missing built links: ${missing.size}`);
  for (const item of [...missing].sort()) console.error(item);
  process.exit(1);
}

console.log('built links ok');

function listHtmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(path);
    return entry.isFile() && path.endsWith('.html') ? [path] : [];
  });
}

function targetExists(pathname: string): boolean {
  const path = decodeURIComponent(pathname);
  const candidates = [
    join(root, path, 'index.html'),
    join(root, `${path}.html`),
    join(root, path.slice(1)),
    join(root, path.slice(1), 'index.html'),
    join(root, `${path.slice(1)}.html`),
  ];
  return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}
