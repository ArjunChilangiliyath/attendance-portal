
import type { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[#E5F2E9] text-[#28613D]',
  danger: 'bg-[#F8E6E6] text-[#A33333]',
  warning: 'bg-[#FFF1D6] text-[#8A5A0A]',
  info: 'bg-[#E5EDF7] text-[#315B88]',
  neutral: 'bg-[#EEEAE5] text-[#625B54]',
};

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-[#28613D]',
  danger: 'bg-[#A33333]',
  warning: 'bg-[#8A5A0A]',
  info: 'bg-[#315B88]',
  neutral: 'bg-[#625B54]',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`
        inline-flex w-fit items-center gap-1.5
        rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotClasses[variant]}`}
          aria-hidden="true"
        />
      )}

      {children}
    </span>
  );
}
