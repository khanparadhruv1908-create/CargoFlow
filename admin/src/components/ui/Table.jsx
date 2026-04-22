import React from 'react';

/**
 * Modern Table Component
 * Features: Zebra rows, hover effects, clean typography, responsive wrapper
 */
export const Table = ({ children, className = "" }) => (
  <div className="w-full overflow-x-auto custom-scrollbar">
    <table className={`w-full text-left border-separate border-spacing-0 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-slate-50/80 sticky top-0 z-10">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-slate-100/60">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = "", onClick, stripe = false }) => (
  <tr 
    className={`
      transition-all duration-200 group
      ${onClick ? 'cursor-pointer' : ''} 
      ${stripe ? 'odd:bg-white even:bg-slate-50/30' : 'bg-white'}
      hover:bg-primary/[0.02] 
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableHeader = ({ children, className = "" }) => (
  <th className={`
    px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] 
    border-b border-slate-100 first:rounded-tl-xl last:rounded-tr-xl
    ${className}
  `}>
    {children}
  </th>
);

export const TableCell = ({ children, className = "", align = "left" }) => (
  <td className={`
    px-6 py-4 text-sm font-medium text-slate-600 leading-relaxed
    group-hover:text-secondary transition-colors
    text-${align}
    ${className}
  `}>
    {children}
  </td>
);
