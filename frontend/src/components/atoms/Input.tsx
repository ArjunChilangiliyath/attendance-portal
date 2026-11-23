
import React, { useId, useRef, useState } from 'react';

export type InputVariant = 'primary' | 'secondary';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'password' | 'search';

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type'
  > {
  label?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  inputVariant?: InputType;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  type?: React.HTMLInputTypeAttribute;
  onClear?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  variant = 'primary',
  inputSize = 'md',
  inputVariant = 'text',
  error,
  helperText,
  fullWidth = true,
  required,
  disabled,
  className = '',
  id,
  type,
  value,
  defaultValue,
  onChange,
  onClear,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const inputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(
    String(defaultValue ?? '')
  );

  const isControlled = value !== undefined;

  const currentValue = isControlled
    ? String(value ?? '')
    : internalValue;

  const variants: Record<InputVariant, string> = {
    primary: 'bg-white border-[#D8D0C7] text-[#333333]',
    secondary: 'bg-[#F1ECE5] border-[#D8CABC] text-[#542433]',
  };

  const sizes: Record<InputSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const hasError = Boolean(error);

  const actualType =
    inputVariant === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : inputVariant === 'search'
        ? 'search'
        : type || 'text';

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }

    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    onClear?.();
    inputRef.current?.focus();
  };

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

      {/* Input wrapper */}
      <div className="relative">

        {/* Search icon */}
        {inputVariant === 'search' && (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}

        {/* Input field */}
        <input
          {...props}
          ref={inputRef}
          id={inputId}
          type={actualType}
          value={value}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
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
            ${inputVariant === 'search' ? 'pl-10 pr-10' : ''}
            ${inputVariant === 'password' ? 'pr-11' : ''}
            ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            ${className}
          `}
        />

        {/* Password visibility toggle */}
        {inputVariant === 'password' && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? 'Hide password' : 'Show password'
            }
            aria-pressed={showPassword}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-[#777777] transition-colors
              hover:text-[#542433]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11 11 0 0 1 12 5c5 0 9 5 9 7a10 10 0 0 1-3.2 4.1M6.2 6.2C3.8 7.8 2 10.4 2 12c0 2 5 7 10 7 1 0 2-.3 2.9-.7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </button>
        )}

        {/* Search clear button */}
        {inputVariant === 'search' &&
          currentValue &&
          (!isControlled || onClear) && (
            <button
              type="button"
              disabled={disabled}
              onClick={handleClear}
              aria-label="Clear search"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-[#777777] transition-colors
                hover:text-[#542433]
                disabled:cursor-not-allowed
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="m18 6-12 12M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
      </div>

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
