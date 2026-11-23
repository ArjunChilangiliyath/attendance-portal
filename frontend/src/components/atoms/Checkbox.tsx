
import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export default function Checkbox({
  label,
  description,
  indeterminate = false,
  id,
  className = '',
  disabled,
  ...props
}: CheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const generatedId = useRef(
    `checkbox-${Math.random().toString(36).slice(2, 9)}`
  );
  const checkboxId = id ?? generatedId.current;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        {...props}
        ref={checkboxRef}
        id={checkboxId}
        type="checkbox"
        disabled={disabled}
        className="
          mt-0.5 h-5 w-5 shrink-0 cursor-pointer
          appearance-none rounded border border-[#BDB5AC]
          bg-white
          checked:border-[#542433] checked:bg-[#542433]
          indeterminate:border-[#542433] indeterminate:bg-[#542433]
          [background-position:center]
          checked:bg-no-repeat
          checked:[background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22m3 8 3.2 3.2L13 4.5%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')]
          indeterminate:bg-no-repeat
          indeterminate:[background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 8h10%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22/%3E%3C/svg%3E')]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#542433] focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
        "
      />

      {(label || description) && (
        <label
          htmlFor={checkboxId}
          className={`flex flex-col gap-0.5 ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          {label && (
            <span className="text-sm font-medium text-[#403A36]">
              {label}
            </span>
          )}

          {description && (
            <span className="text-xs text-[#777777]">
              {description}
            </span>
          )}
        </label>
      )}
    </div>
  );
}
