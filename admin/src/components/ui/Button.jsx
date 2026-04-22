import React from 'react';

/**
 * Modern Button Component
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 */
export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  icon: Icon,
  isLoading = false,
  ...props 
}) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/20 hover:shadow-primary/30",
    secondary: "bg-[#0F172A] text-white hover:bg-slate-800",
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-secondary",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 font-bold",
    success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 font-bold",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider",
    md: "px-5 py-2.5 text-sm font-bold",
    lg: "px-7 py-3.5 text-base font-bold flex gap-3",
  };

  return (
    <button 
      className={`
        inline-flex items-center justify-center rounded-xl transition-all duration-300 
        active:scale-95 disabled:opacity-50 disabled:pointer-events-none 
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && (
        <Icon size={size === 'sm' ? 14 : 18} className={children ? 'mr-2' : ''} />
      )}
      {children}
    </button>
  );
};
