import React from 'react';
import { GameLog } from '../types';
import { X, History } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: GameLog[];
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full rounded-t-3xl shadow-2xl flex flex-col max-h-[75vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
             <History className="text-emerald-600" />
             <h2 className="text-xl font-bold">比賽記錄 (History)</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">回合</th>
                <th className="px-4 py-3">隊伍</th>
                <th className="px-4 py-3">投擲者</th>
                <th className="px-4 py-3 text-center">分數</th>
                <th className="px-4 py-3 text-right">累積</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...logs].reverse().map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-400">{log.round}</td>
                  <td className={`px-4 py-3 font-bold ${log.teamId === 'A' ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {log.teamName}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{log.throwerName}</td>
                  <td className="px-4 py-3 text-center">
                    {log.points === 0 ? (
                       <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold border border-red-200">失誤</span>
                    ) : (
                       <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{log.points}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-slate-800 text-base">
                    {log.scoreAfter}
                    {log.note && (
                        <div className="text-[10px] text-orange-600 font-medium mt-0.5">{log.note}</div>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 italic">
                        尚無投擲記錄
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;