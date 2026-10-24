import React from 'react';
import Badge from './Badge';

export default function MetricCard({
  title,
  value,
  unit = '',
  target,
  status = 'neutral', // 'optimal' | 'warning' | 'attention' | 'neutral'
  icon: Icon,
  description,
}) {
  const statusConfig = {
    optimal: {
      badgeText: 'Optimal',
      badgeVariant: 'emerald',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/30',
      textColor: 'text-emerald-700',
    },
    acceptable: {
      badgeText: 'Acceptable',
      badgeVariant: 'teal',
      borderColor: 'border-teal-200',
      bgColor: 'bg-teal-50/20',
      textColor: 'text-teal-700',
    },
    warning: {
      badgeText: 'Attention',
      badgeVariant: 'amber',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/30',
      textColor: 'text-amber-700',
    },
    neutral: {
      badgeText: 'Estimated',
      badgeVariant: 'slate',
      borderColor: 'border-slate-200',
      bgColor: 'bg-white',
      textColor: 'text-slate-900',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.neutral;

  return (
    <div className={`rounded-xl border p-4 sm:p-5 transition-all shadow-xs ${currentStatus.borderColor} ${currentStatus.bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className={`w-4 h-4 ${currentStatus.textColor}`} />}
          <Badge variant={currentStatus.badgeVariant} size="sm">
            {currentStatus.badgeText}
          </Badge>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
          {value !== undefined && value !== null ? value : '--'}
        </span>
        {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
      </div>

      {target && (
        <div className="text-xs text-slate-500 mb-2 font-mono">
          <span className="text-slate-400">Target Range:</span> {target}
        </div>
      )}

      {description && (
        <p className="text-xs text-slate-600 border-t border-slate-100 pt-2 mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
