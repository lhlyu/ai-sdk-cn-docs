import { Glob } from 'bun';
import matter from 'gray-matter';
import { normalizeMdxFrontmatter } from '../lib/frontmatter';

const root = process.cwd();
const zhDir = `${root}/content/zh`;

const glob = new Glob('**/*.mdx');
const files: string[] = [];
try {
  for await (const file of glob.scan({ cwd: zhDir, onlyFiles: true })) {
    files.push(`${zhDir}/${file}`);
  }
} catch (error) {
  if (error instanceof Error && error.message.includes('No such file or directory')) {
    throw new Error('content/zh does not exist');
  }
  throw error;
}

const errors: string[] = [];

for (const file of files) {
  const content = await Bun.file(file).text();
  if (!content.startsWith('---\n')) {
    errors.push(`${file}: missing frontmatter`);
  }

  try {
    matter(normalizeMdxFrontmatter(content));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`${file}: invalid frontmatter: ${message}`);
  }

  const fenceMatches = content.match(/```/g) ?? [];
  if (fenceMatches.length % 2 !== 0) {
    errors.push(`${file}: unbalanced markdown code fences`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log(`validated ${files.length} Chinese MDX file(s)`);
