
import React, { useId } from 'react';

export type InputVariant = 'primary' | 'secondary';
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  variant = 'primary',
  inputSize = 'md',
  error,
  helperText,
  fullWidth = true,
  required,
  disabled,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const variants: Record<InputVariant, string> = {
    primary:
      'bg-white border-[#D8D0C7] text-[#333333]',

    secondary:
      'bg-[#F1ECE5] border-[#D8CABC] text-[#542433]',
  };

  const sizes: Record<InputSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const hasError = Boolean(error);

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[#403A36]"
        >
          {label}

          {required && (
            <span
              className="ml-1 text-red-600"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Input field */}
      <input
        {...props}
        id={inputId}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
        className={`
          w-full rounded-lg border outline-none
          transition-all duration-200
          focus:border-[#542433]
          focus:ring-2 focus:ring-[#542433]/20
          ${variants[variant]}
          ${sizes[inputSize]}
          ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${disabled ? 'cursor-not-allowed opacity-60' : ''}
          ${className}
        `}
      />

      {/* Helper text */}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-1 text-xs text-[#777777]"
        >
          {helperText}
        </p>
      )}

      {/* Validation error */}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
