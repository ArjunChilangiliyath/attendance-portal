import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  rounded = 'md',
  className = '',
  count = 1,
}) => {
  const roundedStyles: Record<string, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`
            animate-pulse bg-[#E9DFD2]
            ${roundedStyles[rounded]}
            ${className}
          `}
          style={{
            width,
            height,
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;