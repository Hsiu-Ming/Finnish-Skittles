import React from 'react';
import { GameState } from '../types';

interface PrintReportProps {
  gameState: GameState;
}

const PrintReport: React.FC<PrintReportProps> = ({ gameState }) => {
  // Get all unique rounds from history to build the rows
  const maxRound = gameState.history.length > 0 
    ? Math.max(...gameState.history.map(l => l.round)) 
    : 0;
  
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full min-h-screen bg-white z-[9999] p-8 font-sans text-black">
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
      
      <table className="w-full text-sm border-collapse border-2 border-black text-center table-fixed">
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

      {/* Signature / Footer */}
      <div className="mt-8 pt-8 border-t-2 border-black flex justify-between text-sm text-gray-500">
        <div>裁判簽名: _________________</div>
        <div>隊長確認: _________________ / _________________</div>
      </div>
    </div>
  );
};

export default PrintReport;