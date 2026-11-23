
import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

function getInitials(name?: string) {
  if (!name?.trim()) return '';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({
  src,
  name,
  alt,
  size = 'md',
  className = '',
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = getInitials(name);
  const showImage = Boolean(src) && !imageFailed;

  return (
    <div
      className={`
        ${sizeClasses[size]}
        flex shrink-0 items-center justify-center
        overflow-hidden rounded-full
        bg-[#E9DFD2] font-semibold text-[#542433]
        ${className}
      `}
      role="img"
      aria-label={alt ?? name ?? 'User avatar'}
    >
      {showImage ? (
        <img
          {...props}
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-1/2 w-1/2"
          aria-hidden="true"
        >
          <path
            d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
