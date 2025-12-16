import React from 'react';
import { GameState } from '../types';
import SignaturePad from './SignaturePad';
import { Printer, X } from 'lucide-react';

interface PrintReportProps {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
}

const PrintReport: React.FC<PrintReportProps> = ({ gameState, isOpen, onClose }) => {
  // Get all unique rounds from history to build the rows
  const maxRound = gameState.history.length > 0 
    ? Math.max(...gameState.history.map(l => l.round)) 
    : 0;
  
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);

  // If not open, we hide it completely from screen, but it might still be needed for print?
  // Strategy: We use a fixed overlay that is visible when isOpen is true.
  // We use standard CSS to ensure this overlay takes over when printing.

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto animate-fade-in flex flex-col">
      
      {/* Action Bar - Hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h2 className="font-bold text-lg flex items-center gap-2">
           預覽與簽名 (Preview & Sign)
        </h2>
        <div className="flex gap-3">
          <button 
             onClick={onClose}
             className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <X size={18} /> 關閉
          </button>
          <button 
             onClick={() => window.print()}
             className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
          >
            <Printer size={18} /> 確認列印
          </button>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="flex-1 bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white overflow-y-auto">
        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-8 md:p-12 print:shadow-none print:w-full print:max-w-none print:p-0 text-black font-sans">
          
          {/* Report Content */}
          
          {/* Header */}
          <div className="text-center border-b-4 border-black pb-4 mb-6">
            <h1 className="text-3xl font-black mb-2 uppercase tracking-widest">Mölkky Match Report</h1>
            <div className="flex justify-center gap-8 text-sm font-medium text-gray-600">
              <p>日期: {new Date().toLocaleDateString()}</p>
              <p>時間: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Score Summary Box */}
          <div className="flex border-2 border-black mb-8 rounded-lg overflow-hidden">
            {/* Team A Summary */}
            <div className="flex-1 border-r-2 border-black p-4 text-center bg-gray-50">
              <h2 className="text-xl font-bold mb-2 text-emerald-800">{gameState.teamA.name}</h2>
              <div className="text-6xl font-black mb-2">{gameState.teamA.score}</div>
              {gameState.winnerId === 'A' && (
                <div className="text-white bg-black font-bold inline-block px-4 py-1 rounded-full text-sm mb-2">
                  WINNER (獲勝)
                </div>
              )}
              <div className="text-xs mt-2 text-gray-500 border-t border-gray-300 pt-2 text-left">
                <span className="font-bold">Roster:</span> {gameState.teamA.roster.join(', ')}
              </div>
            </div>

            {/* Team B Summary */}
            <div className="flex-1 p-4 text-center bg-gray-50">
              <h2 className="text-xl font-bold mb-2 text-blue-800">{gameState.teamB.name}</h2>
              <div className="text-6xl font-black mb-2">{gameState.teamB.score}</div>
              {gameState.winnerId === 'B' && (
                <div className="text-white bg-black font-bold inline-block px-4 py-1 rounded-full text-sm mb-2">
                  WINNER (獲勝)
                </div>
              )}
              <div className="text-xs mt-2 text-gray-500 border-t border-gray-300 pt-2 text-left">
                <span className="font-bold">Roster:</span> {gameState.teamB.roster.join(', ')}
              </div>
            </div>
          </div>

          {/* Detailed Side-by-Side Log */}
          <h3 className="text-lg font-bold mb-2 uppercase border-b-2 border-black pb-1">投擲記錄 (Score Sheet)</h3>
          
          <table className="w-full text-sm border-collapse border-2 border-black text-center table-fixed mb-8">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-1 w-12">Rd</th>
                
                {/* Team A Header */}
                <th className="border-y border-l border-black p-1 bg-emerald-100/50" colSpan={3}>
                  {gameState.teamA.name}
                </th>
                
                {/* Divider */}
                <th className="w-1 border-y border-black bg-black"></th>

                {/* Team B Header */}
                <th className="border border-black p-1 bg-blue-100/50" colSpan={3}>
                  {gameState.teamB.name}
                </th>
              </tr>
              <tr className="bg-gray-100 text-xs">
                <th className="border border-black p-1">#</th>
                
                {/* Team A Cols */}
                <th className="border border-black p-1 w-[25%]">Thrower</th>
                <th className="border border-black p-1">Pts</th>
                <th className="border border-black p-1">Total</th>
                
                <th className="border-x border-black bg-black w-1"></th>

                {/* Team B Cols */}
                <th className="border border-black p-1 w-[25%]">Thrower</th>
                <th className="border border-black p-1">Pts</th>
                <th className="border border-black p-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((roundNum) => {
                const logA = gameState.history.find(l => l.round === roundNum && l.teamId === 'A');
                const logB = gameState.history.find(l => l.round === roundNum && l.teamId === 'B');

                return (
                  <tr key={roundNum} className="even:bg-gray-50">
                    {/* Round Number */}
                    <td className="border border-black p-2 font-bold text-gray-500">{roundNum}</td>

                    {/* Team A Data */}
                    <td className="border border-black p-2 text-left px-3 overflow-hidden text-ellipsis whitespace-nowrap">
                      {logA?.throwerName || '-'}
                    </td>
                    <td className="border border-black p-2 font-bold text-lg">
                      {logA ? (logA.points === 0 ? 'X' : logA.points) : ''}
                      {logA?.note && <div className="text-[9px] leading-tight text-red-600 font-normal">{logA.note}</div>}
                    </td>
                    <td className="border border-black p-2 font-black text-lg bg-emerald-50/30">
                      {logA?.scoreAfter || ''}
                    </td>

                    {/* Thick Divider */}
                    <td className="border-x border-black bg-black w-1"></td>

                    {/* Team B Data */}
                    <td className="border border-black p-2 text-left px-3 overflow-hidden text-ellipsis whitespace-nowrap">
                      {logB?.throwerName || '-'}
                    </td>
                    <td className="border border-black p-2 font-bold text-lg">
                      {logB ? (logB.points === 0 ? 'X' : logB.points) : ''}
                      {logB?.note && <div className="text-[9px] leading-tight text-red-600 font-normal">{logB.note}</div>}
                    </td>
                    <td className="border border-black p-2 font-black text-lg bg-blue-50/30">
                      {logB?.scoreAfter || ''}
                    </td>
                  </tr>
                );
              })}
              {rounds.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 italic border border-black">
                    尚未開始比賽
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Signature Section */}
          <div className="mt-4 pt-4 border-t-2 border-black page-break-inside-avoid">
             <h3 className="text-sm font-bold uppercase mb-4 text-slate-500">比賽確認 (Verification)</h3>
             <div className="grid grid-cols-3 gap-8">
                <SignaturePad label="裁判簽名 (Referee)" />
                <SignaturePad label={`${gameState.teamA.name} 隊長`} />
                <SignaturePad label={`${gameState.teamB.name} 隊長`} />
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PrintReport;