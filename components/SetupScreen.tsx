import React, { useState } from 'react';
import { Users, Play, Crown } from 'lucide-react';

interface SetupScreenProps {
  onStart: (
    nameA: string, 
    rosterA: string[], 
    nameB: string, 
    rosterB: string[], 
    startTeam: 'A' | 'B'
  ) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [nameA, setNameA] = useState('隊伍 A');
  const [rosterA, setRosterA] = useState('隊長 A\n選手 2');
  
  const [nameB, setNameB] = useState('隊伍 B');
  const [rosterB, setRosterB] = useState('隊長 B\n選手 4');
  
  const [startTeam, setStartTeam] = useState<'A' | 'B'>('A');

  const handleStart = () => {
    const parseRoster = (text: string) => text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    const rA = parseRoster(rosterA);
    const rB = parseRoster(rosterB);

    const finalRA = rA.length > 0 ? rA : ['隊長 A'];
    const finalRB = rB.length > 0 ? rB : ['隊長 B'];

    onStart(nameA, finalRA, nameB, finalRB, startTeam);
  };

  const getCaptainName = (roster: string) => {
    const names = roster.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    return names.length > 0 ? names[0] : '尚未輸入';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
          <h1 className="text-3xl font-black text-white tracking-wide relative z-10 drop-shadow-md">Mölkky Master</h1>
          <p className="text-emerald-100 mt-2 text-sm font-medium relative z-10">芬蘭木棋專業計分器</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Team A */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-l-4 border-emerald-500 pl-3">
              <Users size={20} className="text-emerald-600" />
              <h3>隊伍 A 設定</h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">隊伍名稱</label>
              <input 
                type="text" 
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all font-bold text-black placeholder-slate-400"
                placeholder="例如：猛虎隊"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">隊員名單 (每行一位，第一位為隊長)</label>
              <textarea 
                value={rosterA}
                onChange={(e) => setRosterA(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none resize-none transition-all text-sm leading-relaxed font-bold text-black placeholder-slate-400"
                placeholder="隊長姓名&#10;隊員姓名..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">隊長 (自動帶入)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Crown size={18} className="text-yellow-500" fill="currentColor" />
                </div>
                <input 
                    type="text" 
                    value={getCaptainName(rosterA)}
                    readOnly
                    className="w-full p-3 pl-10 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 focus:outline-none cursor-default"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Team B */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-l-4 border-blue-500 pl-3">
              <Users size={20} className="text-blue-600" />
              <h3>隊伍 B 設定</h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">隊伍名稱</label>
              <input 
                type="text" 
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all font-bold text-black placeholder-slate-400"
                placeholder="例如：飛龍隊"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">隊員名單 (每行一位，第一位為隊長)</label>
              <textarea 
                value={rosterB}
                onChange={(e) => setRosterB(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-all text-sm leading-relaxed font-bold text-black placeholder-slate-400"
                placeholder="隊長姓名&#10;隊員姓名..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">隊長 (自動帶入)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Crown size={18} className="text-yellow-500" fill="currentColor" />
                </div>
                <input 
                    type="text" 
                    value={getCaptainName(rosterB)}
                    readOnly
                    className="w-full p-3 pl-10 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 focus:outline-none cursor-default"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <Crown size={14} />
              先攻隊伍
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setStartTeam('A')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex justify-center items-center gap-2 ${
                  startTeam === 'A' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-[1.02]' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {nameA || '隊伍 A'}
              </button>
              <button 
                onClick={() => setStartTeam('B')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex justify-center items-center gap-2 ${
                  startTeam === 'B' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 transform scale-[1.02]' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {nameB || '隊伍 B'}
              </button>
            </div>
          </div>

          <button 
            onClick={handleStart}
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-300 hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play size={22} fill="currentColor" />
            開始比賽
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;