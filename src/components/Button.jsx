import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Healthcare/Product Button
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-xs',
    md: 'text-sm px-4 py-2.5 gap-2 shadow-xs',
    lg: 'text-base px-6 py-3 gap-2.5 shadow-sm font-semibold',
  };

  const variantStyles = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 shadow-teal-700/20 shadow-md',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 border border-slate-200',
    outline: 'bg-transparent border border-teal-600 text-teal-700 hover:bg-teal-50 focus:ring-teal-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-700 shadow-md',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
