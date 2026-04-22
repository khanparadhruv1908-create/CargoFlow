import React from 'react';
import { X } from 'lucide-react';

/**
 * Modern Modal Component
 * Features: Backdrop blur, entrance animations, clean close button
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-xl",
  footer
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`
        relative w-full ${maxWidth} bg-white rounded-[32px] shadow-2xl 
        animate-in zoom-in-95 slide-in-from-bottom-10 duration-500
        flex flex-col overflow-hidden
      `}>
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
          <div>
            <h3 className="text-xl font-black text-secondary tracking-tight">{title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Operation Terminal</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
