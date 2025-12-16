import React from 'react';
import { Team } from '../types';
import { User, TriangleAlert, Target, Crown } from 'lucide-react';

interface ScoreboardProps {
  teamA: Team;
  teamB: Team;
  currentTurn: 'A' | 'B';
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teamA, teamB, currentTurn }) => {
  
  const renderTeamPanel = (team: Team, isActive: boolean) => {
    const isFaultRisk = team.faults === 2;
    const isTeamA = team.id === 'A';
    
    // Color Themes
    const theme = isTeamA 
      ? { 
          text: 'text-emerald-900', 
          sub: 'text-emerald-600', 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-500', 
          gradient: 'from-emerald-50/50 to-white',
          pill: 'bg-emerald-100 text-emerald-800'
        }
      : { 
          text: 'text-blue-900', 
          sub: 'text-blue-600', 
          bg: 'bg-blue-50', 
          border: 'border-blue-500', 
          gradient: 'from-blue-50/50 to-white',
          pill: 'bg-blue-100 text-blue-800'
        };

    return (
      <div className={`
        flex-1 relative flex flex-col items-center transition-all duration-500 ease-out overflow-hidden
        ${isActive ? 'bg-white' : 'bg-slate-50/80'}
      `}>
        {/* Active Indicator Bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-300 ${isActive ? theme.border : 'bg-transparent'}`} />
        
        {/* Background Gradient for Active State */}
        {isActive && (
          <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-60 pointer-events-none`} />
        )}

        <div className="relative w-full h-full flex flex-col items-center pt-8 pb-4 px-2 z-10">
          
          {/* Team Name */}
          <div className={`font-black text-xl tracking-tight mb-4 transition-colors duration-300 ${isActive ? theme.text : 'text-slate-400'}`}>
            {team.name}
          </div>

          {/* Thrower Badge */}
          <div className={`
              flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-bold mb-4 transition-all duration-300
              ${isActive 
                ? 'bg-white shadow-lg shadow-black/5 ring-1 ring-black/5 text-slate-800 translate-y-0 scale-100' 
                : 'bg-slate-200/50 text-slate-400 translate-y-2 scale-95'
              }
          `}>
            {isActive ? <User size={16} className={theme.sub} /> : <User size={16} />}
            <span className="truncate max-w-[140px]">{team.roster[team.currentThrowerIndex]}</span>
          </div>

          {/* Big Score */}
          <div className="relative my-2">
            <div className={`
              text-[6rem] sm:text-[7rem] leading-[0.85] font-black tracking-tighter transition-all duration-300
              ${isActive ? `${theme.text} drop-shadow-sm scale-110` : 'text-slate-300 scale-100 blur-[0.5px]'}
            `}>
              {team.score}
            </div>
            <div className={`
               text-center text-[10px] font-bold uppercase tracking-widest mt-2
               ${isActive ? 'text-slate-400' : 'text-slate-300'}
            `}>
              Target: 50
            </div>
          </div>

          <div className="flex-1" />

          {/* Fault Indicators (LED Style) */}
          <div className={`
            flex gap-3 p-3 rounded-2xl transition-all duration-300 mb-6
            ${isActive ? 'bg-white shadow-sm ring-1 ring-slate-100' : 'opacity-50'}
          `}>
            {[1, 2, 3].map((i) => {
              const isFilled = i <= team.faults;
              return (
                <div 
                  key={i}
                  className={`
                    w-4 h-4 rounded-full border transition-all duration-300
                    ${isFilled 
                      ? 'bg-red-500 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-110' 
                      : 'bg-slate-100 border-slate-200 inner-shadow'
                    }
                  `}
                />
              );
            })}
          </div>

          {/* Status Badge */}
          <div className="h-12 w-full flex items-center justify-center">
             <div className={`
               transition-all duration-500 transform
               ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
             `}>
               <div className={`
                 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold shadow-md ring-1 ring-inset ring-white/50
                 ${isFaultRisk 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-200' 
                    : `${theme.pill} ring-0`
                 }
               `}>
                 {isFaultRisk ? <TriangleAlert size={16} fill="currentColor" className="text-white" /> : <Target size={16} />}
                 {isFaultRisk ? '淘汰邊緣' : '投擲中'}
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-full relative">
       {/* Vertical Divider Line with "VS" */}
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center h-[80%] pointer-events-none">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
       </div>

      {renderTeamPanel(teamA, currentTurn === 'A')}
      {renderTeamPanel(teamB, currentTurn === 'B')}
    </div>
  );
};

export default Scoreboard;