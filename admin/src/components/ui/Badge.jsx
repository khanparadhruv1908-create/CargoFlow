import React from 'react';

/**
 * Modern Badge Component
 * Variants: primary, success, warning, danger, default
 */
export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100/50 shadow-sm shadow-emerald-500/5",
    warning: "bg-amber-50 text-amber-600 border-amber-100/50 shadow-sm shadow-amber-500/5",
    danger: "bg-rose-50 text-rose-600 border-rose-100/50 shadow-sm shadow-rose-500/5",
    primary: "bg-primary/5 text-primary border-primary/20",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-full text-[10px] 
      font-black uppercase tracking-[0.1em] border 
      ${variants[variant] || variants.default} ${className}
    `}>
      {children}
    </span>
  );
};
