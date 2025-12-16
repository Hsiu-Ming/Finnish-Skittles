import React from 'react';
import { Trophy, Printer, RotateCcw, CircleX, PenTool } from 'lucide-react';
import { Team } from '../types';

interface WinnerModalProps {
  winner: Team;
  reason: string;
  onRestart: () => void;
  onPrint: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, reason, onRestart, onPrint }) => {
  const isElimination = reason.includes("淘汰") || reason.includes("eliminated");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 print:hidden animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl animate-scale-in border border-white/20 relative overflow-hidden">
        {/* Background confetti effect would go here */}
        
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${isElimination ? 'bg-red-100' : 'bg-yellow-100'}`}>
          {isElimination ? (
              <CircleX size={48} className="text-red-500" />
          ) : (
              <Trophy size={48} className="text-yellow-600 drop-shadow-sm" />
          )}
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">
            {isElimination ? "比賽結束" : "勝利！"}
        </h2>
        <div className="text-2xl font-bold text-emerald-600 mb-2">{winner.name} 獲勝</div>
        <p className="text-sm text-slate-500 mb-8 bg-slate-50 py-2 px-4 rounded-lg inline-block font-medium">
            {reason}
        </p>

        <div className="space-y-3">
          <button 
            onClick={onPrint}
            className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all shadow-lg active:scale-[0.98]"
          >
            <PenTool size={18} />
            簽名並列印 (Sign & Print)
          </button>
          
          <button 
            onClick={onRestart}
            className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            <RotateCcw size={18} />
            開始新的一局
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;