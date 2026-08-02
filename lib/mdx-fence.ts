const fenceLinePattern = /^ {0,3}(`{3,}|~{3,})/;

/**
 * 逐行检查 Markdown 代码围栏是否配对。
 * 识别行首（最多 3 个空格）至少 3 个反引号或波浪线的围栏行；
 * 闭合围栏必须与开启围栏同字符且长度不小于开启围栏。
 * 返回错误描述；围栏配对正常时返回 null。
 */
export function findCodeFenceError(content: string): string | null {
  const lines = content.split("\n");
  let openFence: { marker: string; line: number } | null = null;

  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(fenceLinePattern);
    if (!match) continue;

    const marker = match[1];
    if (openFence) {
      if (
        marker[0] === openFence.marker[0] &&
        marker.length >= openFence.marker.length
      ) {
        openFence = null;
      }
    } else {
      openFence = { marker, line: index + 1 };
    }
  }

  if (!openFence) return null;

  // 若首行是围栏、且去掉它之后其余内容恰好平衡，
  // 说明模型多加了未闭合的外层包裹围栏，优先定位到第 1 行。
  const firstLine = lines[0]?.match(fenceLinePattern);
  if (firstLine && findCodeFenceError(lines.slice(1).join("\n")) === null) {
    return "unclosed code fence starting at line 1 (outer wrapper fence)";
  }

  return `unclosed code fence starting at line ${openFence.line}`;
}

/**
 * 去掉模型偶发在翻译结果最外层包裹的完整代码围栏（如 ```mdx ... ```）。
 * 仅当首行是围栏、末行是相同围栏、且剥离后内容以 frontmatter 开头时才剥离，
 * 避免误伤正常以代码块开头/结尾的文档。
 */
export function stripOuterCodeFence(content: string): string {
  const match = content.match(
    /^ {0,3}(`{3,}|~{3,})[ \t]*[^\n]*\n([\s\S]*?)\n {0,3}\1[ \t]*$/,
  );
  if (match) {
    const inner = match[2];
    if (
      inner.trimStart().startsWith("---\n") &&
      findCodeFenceError(inner) === null
    ) {
      return inner;
    }
  }

  // 模型偶发只加未闭合的首行包裹围栏；去掉首行后其余内容平衡时剥掉它。
  const lines = content.split("\n");
  const firstLine = lines[0]?.match(fenceLinePattern);
  if (firstLine) {
    const rest = lines.slice(1).join("\n");
    if (
      rest.trimStart().startsWith("---\n") &&
      findCodeFenceError(rest) === null
    ) {
      return rest;
    }
  }

  return content;
}
