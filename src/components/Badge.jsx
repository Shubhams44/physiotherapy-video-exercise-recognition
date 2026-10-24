import React from 'react';

/**
 * Reusable Status & Category Badge
 */
export default function Badge({
  children,
  variant = 'teal',
  size = 'md',
  dot = false,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1 font-semibold',
  };

  const variantStyles = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200 border',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 border',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 border',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 border',
    blue: 'bg-sky-50 text-sky-700 border-sky-200 border',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 border',
  };

  const dotColors = {
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    slate: 'bg-slate-400',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-sky-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.teal} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-teal-500'}`} />
      )}
      {children}
    </span>
  );
}
