import React from 'react';

const variants = {
  primary: 'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white',
  secondary: 'bg-[--color-secondary] hover:bg-[--color-secondary-light] text-white',
  outline: 'border-2 border-[--color-primary] text-[--color-primary] hover:bg-[--color-primary] hover:text-white',
  ghost: 'text-[--color-secondary] hover:bg-gray-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-xl
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
