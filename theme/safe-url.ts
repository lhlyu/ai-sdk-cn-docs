const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const SAFE_IMAGE_PROTOCOLS = new Set(['http:', 'https:']);

export function safeHref(value: string | undefined): string | undefined {
  return safeUrl(value, SAFE_PROTOCOLS, true);
}

export function safeImageSrc(value: string | undefined): string | undefined {
  return safeUrl(value, SAFE_IMAGE_PROTOCOLS, false);
}

function safeUrl(value: string | undefined, protocols: Set<string>, allowHash: boolean): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith('//')) return undefined;
  if (trimmed.startsWith('/')) return trimmed;
  if (allowHash && trimmed.startsWith('#')) return trimmed;

  try {
    const url = new URL(trimmed);
    return protocols.has(url.protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}
