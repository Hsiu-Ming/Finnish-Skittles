import React from 'react';
import { RotateCcw, Check, X } from 'lucide-react';

interface KeypadProps {
  onSelect: (points: number) => void;
  onConfirm: () => void;
  onUndo: () => void;
  selectedPoints: number | null;
  canUndo: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onSelect, onConfirm, onUndo, selectedPoints, canUndo }) => {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="px-4 pb-8 pt-2 max-w-lg mx-auto w-full">
      {/* Confirmation & Display Area */}
      <div className="flex gap-4 mb-5 h-16">
        {/* LCD Display */}
        <div className={`
          flex-1 rounded-2xl border flex items-center justify-center text-2xl font-black tracking-widest transition-all duration-200 shadow-inner relative overflow-hidden group
          ${selectedPoints !== null 
            ? 'border-slate-300 bg-slate-50 text-slate-800' 
            : 'border-slate-100 bg-slate-50/50 text-slate-300'
          }
        `}>
          {selectedPoints === null ? (
            <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">Select Score</span>
          ) : selectedPoints === 0 ? (
            <span className="flex items-center gap-2 text-red-500 animate-pulse-fast">
              <X size={28} strokeWidth={3} /> MISS
            </span> 
          ) : (
            <span className="scale-110">{selectedPoints}</span>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={onConfirm}
          disabled={selectedPoints === null}
          className={`
            flex-[1.2] rounded-2xl flex items-center justify-center gap-3 text-lg font-bold transition-all duration-200
            ${selectedPoints !== null 
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30 hover:bg-slate-800 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          <Check size={24} strokeWidth={3} />
          <span>確認</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {buttons.map(num => (
          <button
            key={num}
            onClick={() => onSelect(num)}
            className={`
              h-14 rounded-2xl font-bold text-2xl transition-all duration-150 relative overflow-hidden
              ${selectedPoints === num 
                ? 'bg-slate-800 text-white shadow-md scale-[1.02] ring-2 ring-slate-800 ring-offset-2' 
                : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md active:bg-slate-50 active:scale-95'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-4 gap-3">
         <button
            onClick={() => onSelect(0)}
            className={`
              col-span-2 h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-150
              ${selectedPoints === 0 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500 ring-offset-2' 
                : 'bg-white text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200 active:scale-95'
              }
            `}
          >
            <X size={20} strokeWidth={3} />
            失誤 (0)
          </button>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`
              col-span-2 h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-150
              ${canUndo 
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 border border-slate-200' 
                : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
              }
            `}
          >
            <RotateCcw size={18} />
            復原
          </button>
      </div>
    </div>
  );
};

export default Keypad;