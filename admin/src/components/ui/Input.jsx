import React from 'react';

/**
 * Modern Input Component
 * Features: Icons, validation states, clear focus states
 */
export const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  className = "", 
  containerClassName = "",
  ...props 
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full bg-slate-50/50 border border-slate-100 rounded-2xl 
            py-3 ${Icon ? 'pl-12' : 'px-5'} pr-5 
            text-sm font-semibold text-secondary placeholder:text-slate-300
            focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 
            hover:border-slate-200 transition-all outline-none
            ${error ? 'border-rose-200 focus:border-rose-400 focus:ring-rose-500/5' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-wider">
          {error}
        </p>
      )}
    </div>
  );
};

export const Select = ({ 
  label, 
  error, 
  options = [], 
  className = "", 
  containerClassName = "",
  ...props 
}) => (
  <div className={`space-y-1.5 ${containerClassName}`}>
    {label && (
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
    )}
    <select
      className={`
        w-full bg-slate-50/50 border border-slate-100 rounded-2xl 
        py-3 px-5 text-sm font-semibold text-secondary appearance-none
        focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 
        hover:border-slate-200 transition-all outline-none cursor-pointer
        ${error ? 'border-rose-200 focus:border-rose-400 focus:ring-rose-500/5' : ''}
        ${className}
      `}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && (
      <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-wider">
        {error}
      </p>
    )}
  </div>
);
