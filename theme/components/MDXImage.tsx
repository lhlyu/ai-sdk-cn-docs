import { safeImageSrc } from '../safe-url';

export default function MDXImage({
  alt = '',
  src,
  srcLight,
  width,
  height,
}: {
  alt?: string;
  src?: string;
  srcLight?: string;
  srcDark?: string;
  width?: number;
  height?: number;
}) {
  const imgSrc = safeImageSrc(src ?? srcLight);
  if (!imgSrc) return <div className="doc-placeholder">MDXImage 缺少 src</div>;
  return <img alt={alt} height={height} src={imgSrc} width={width} />;
}
