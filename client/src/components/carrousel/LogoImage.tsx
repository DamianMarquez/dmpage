import { useState } from "react";

interface Props {
  src?: string;
  alt: string;
  fallback: string;
  className: string;
  fallbackClassName: string;
}

export default function LogoImage({
  src,
  alt,
  fallback,
  className,
  fallbackClassName,
}: Props) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const hasError = failedSrc === src;

  if (!src || hasError) {
    return <span className={fallbackClassName}>{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
