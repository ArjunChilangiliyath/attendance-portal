
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#542433] focus-visible:ring-offset-2';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[#542433] text-white',

    secondary:
      'bg-[#E9DFD2] text-[#542433] border border-[#D8CABC]',
  };

  const hoverColors: Record<ButtonVariant, string> = {
    primary: 'bg-[#784456]',
    secondary: 'bg-[#542433]',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        group
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${(disabled || loading) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {/* Animated hover background */}
      <span
        aria-hidden="true"
        className={`
          absolute left-1/2 top-1/2 -z-10
          h-0 w-0 -translate-x-1/2 -translate-y-1/2
          rounded-full transition-all duration-500 ease-out
          group-hover:h-[300%] group-hover:w-[150%]
          ${hoverColors[variant]}
        `}
      />

      {/* Decorative left shape */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-full opacity-10"
      >
        <svg
          viewBox="0 0 487 487"
          className="h-full w-auto"
          fill="white"
        >
          <path d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z" />
        </svg>
      </span>

      {/* Button content */}
      <span
        className={`
          relative z-10 inline-flex items-center gap-2
          transition-colors duration-300
          ${variant === 'secondary' ? 'group-hover:text-white' : ''}
        `}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}

        {children}
      </span>
    </button>
  );
};

export default Button;
