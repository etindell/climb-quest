import React from 'react';

export function Card({
  children,
  className = '',
  padding = 'md',
  onClick,
  hoverable = false,
  style,
  ...props
}) {
  const paddingSizes = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm
        ${paddingSizes[padding]}
        ${hoverable ? 'hover:shadow-md cursor-pointer transition-shadow duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold ${className}`} style={{ color: '#1E3A5F' }}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm ${className}`} style={{ color: '#6B7C93' }}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
