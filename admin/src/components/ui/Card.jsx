import React from 'react';

/**
 * Premium Card Component
 * Features: Soft shadows, 16px rounded corners, subtle borders
 */
export const Card = ({ children, className = "", noPadding = false }) => (
  <div className={`bg-white rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ${className}`}>
    <div className={noPadding ? "" : "p-0"}>
      {children}
    </div>
  </div>
);

export const CardHeader = ({ title, subtitle, icon: Icon, action, className = "" }) => (
  <div className={`px-6 py-5 border-b border-slate-50 flex items-center justify-between ${className}`}>
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          <Icon size={18} />
        </div>
      )}
      <div>
        <h3 className="text-base font-bold text-secondary leading-none mb-1.5">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{subtitle}</p>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`px-6 py-4 bg-slate-50/50 border-t border-slate-50 rounded-b-2xl ${className}`}>
    {children}
  </div>
);
