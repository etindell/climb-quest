import React from 'react';

// Using explicit colors for Edge compatibility
const variants = {
  primary: 'bg-teal-400 hover:bg-teal-500 text-white',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
  outline: 'border-2 border-teal-400 text-teal-500 hover:bg-teal-400 hover:text-white',
  ghost: 'text-slate-700 hover:bg-gray-100',
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
  style,
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
        flex items-center justify-center
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
