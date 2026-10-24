import React from 'react';
import { CheckCircle2, AlertTriangle, Compass, Lightbulb } from 'lucide-react';

export default function FeedbackCard({
  type = 'correct', // 'correct' | 'issues' | 'alignment' | 'actionable'
  title,
  items = [],
}) {
  const configs = {
    correct: {
      defaultTitle: 'Correct Movement Observations',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-200',
      titleColor: 'text-emerald-950',
      dotColor: 'bg-emerald-500',
    },
    issues: {
      defaultTitle: 'Potential Form Deviations',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-200',
      titleColor: 'text-amber-950',
      dotColor: 'bg-amber-500',
    },
    alignment: {
      defaultTitle: 'Joint Alignment & Kinematics',
      icon: Compass,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50/50',
      borderColor: 'border-sky-200',
      titleColor: 'text-sky-950',
      dotColor: 'bg-sky-500',
    },
    actionable: {
      defaultTitle: 'Actionable Improvement Suggestions',
      icon: Lightbulb,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50/50',
      borderColor: 'border-teal-200',
      titleColor: 'text-teal-950',
      dotColor: 'bg-teal-500',
    },
  };

  const config = configs[type] || configs.correct;
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  if (!items || items.length === 0) {
    return (
      <div className={`rounded-xl border p-5 ${config.borderColor} bg-white shadow-xs`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
          <h4 className={`text-sm font-semibold ${config.titleColor}`}>{displayTitle}</h4>
        </div>
        <p className="text-xs text-slate-400 italic">No specific feedback reported for this category.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-5 transition-all shadow-xs ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <h4 className={`text-sm font-semibold ${config.titleColor}`}>{displayTitle}</h4>
      </div>

      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0 mt-2`} />
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
