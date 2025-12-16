import React, { useState, useCallback } from 'react';
import { GameState, Team, GameLog } from './types';
import SetupScreen from './components/SetupScreen';
import Scoreboard from './components/Scoreboard';
import Keypad from './components/Keypad';
import HistoryDrawer from './components/HistoryDrawer';
import WinnerModal from './components/WinnerModal';
import PrintReport from './components/PrintReport';
import { ScrollText, RefreshCw, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'SETUP',
    teamA: { id: 'A', name: '', roster: [], currentThrowerIndex: 0, score: 0, faults: 0, isEliminated: false },
    teamB: { id: 'B', name: '', roster: [], currentThrowerIndex: 0, score: 0, faults: 0, isEliminated: false },
    currentTurn: 'A',
    round: 1,
    history: [],
    winnerId: null,
    winReason: null,
  });

  const [selectedPoints, setSelectedPoints] = useState<number | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // --- Actions ---

  const handleStartGame = (nameA: string, rosterA: string[], nameB: string, rosterB: string[], startTeam: 'A' | 'B') => {
    setGameState({
      status: 'PLAYING',
      teamA: { id: 'A', name: nameA, roster: rosterA, currentThrowerIndex: 0, score: 0, faults: 0, isEliminated: false },
      teamB: { id: 'B', name: nameB, roster: rosterB, currentThrowerIndex: 0, score: 0, faults: 0, isEliminated: false },
      currentTurn: startTeam,
      round: 1,
      history: [],
      winnerId: null,
      winReason: null
    });
  };

  const handleScoreConfirm = useCallback(() => {
    if (selectedPoints === null || gameState.status !== 'PLAYING') return;

    setGameState((prev) => {
      const currentTeamId = prev.currentTurn;
      const currentTeam = currentTeamId === 'A' ? prev.teamA : prev.teamB;
      const otherTeam = currentTeamId === 'A' ? prev.teamB : prev.teamA;
      
      let newScore = currentTeam.score;
      let newFaults = currentTeam.faults;
      let note = '';
      let isWinner = false;
      let winReason = '';
      let isEliminated = false;

      // Logic
      if (selectedPoints === 0) {
        newFaults += 1;
        note = '失誤 (Miss)';
        if (newFaults >= 3) {
          isEliminated = true;
          isWinner = true;
          winReason = '對手連續三次失誤，自動獲勝';
        }
      } else {
        newFaults = 0;
        newScore += selectedPoints;
        
        if (newScore === 50) {
          isWinner = true;
          winReason = '剛好達到 50 分！';
        } else if (newScore > 50) {
          newScore = 25;
          note = '爆分 (50 → 25)';
        }
      }

      // Create snapshot for undo
      const snapshot = {
        teamAScore: prev.teamA.score,
        teamAFaults: prev.teamA.faults,
        teamAThrowerIndex: prev.teamA.currentThrowerIndex,
        teamBScore: prev.teamB.score,
        teamBFaults: prev.teamB.faults,
        teamBThrowerIndex: prev.teamB.currentThrowerIndex,
        turn: prev.currentTurn
      };

      const log: GameLog = {
        id: Date.now().toString(),
        round: prev.round,
        teamId: currentTeamId,
        teamName: currentTeam.name,
        throwerName: currentTeam.roster[currentTeam.currentThrowerIndex],
        points: selectedPoints,
        scoreAfter: newScore,
        note,
        timestamp: Date.now(),
        snapshot
      };

      // Prepare next state values
      const nextTeamA = currentTeamId === 'A' 
        ? { ...prev.teamA, score: newScore, faults: newFaults, currentThrowerIndex: (prev.teamA.currentThrowerIndex + 1) % prev.teamA.roster.length, isEliminated: isEliminated }
        : prev.teamA;
      
      const nextTeamB = currentTeamId === 'B' 
        ? { ...prev.teamB, score: newScore, faults: newFaults, currentThrowerIndex: (prev.teamB.currentThrowerIndex + 1) % prev.teamB.roster.length, isEliminated: isEliminated }
        : prev.teamB;

      // Determine next turn and round
      let nextTurn = prev.currentTurn === 'A' ? 'B' : 'A';
      
      const firstLog = prev.history.length > 0 ? prev.history[0] : null;
      const initialTurn = firstLog ? firstLog.snapshot.turn : prev.currentTurn; 
      let nextRound = prev.round;
      
      if (nextTurn === initialTurn && prev.history.length > 0) {
          nextRound += 1;
      }

      return {
        ...prev,
        status: isWinner ? 'FINISHED' : 'PLAYING',
        teamA: nextTeamA,
        teamB: nextTeamB,
        currentTurn: nextTurn as 'A' | 'B',
        round: nextRound,
        history: [...prev.history, log],
        winnerId: isWinner ? (isEliminated ? otherTeam.id : currentTeamId) : null,
        winReason: winReason || null
      };
    });

    setSelectedPoints(null);
  }, [selectedPoints, gameState.status]);

  const handleUndo = () => {
    if (gameState.history.length === 0) return;

    setGameState((prev) => {
      const lastLog = prev.history[prev.history.length - 1];
      const snapshot = lastLog.snapshot;

      return {
        ...prev,
        status: 'PLAYING',
        teamA: {
          ...prev.teamA,
          score: snapshot.teamAScore,
          faults: snapshot.teamAFaults,
          currentThrowerIndex: snapshot.teamAThrowerIndex,
          isEliminated: false
        },
        teamB: {
          ...prev.teamB,
          score: snapshot.teamBScore,
          faults: snapshot.teamBFaults,
          currentThrowerIndex: snapshot.teamBThrowerIndex,
          isEliminated: false
        },
        currentTurn: snapshot.turn,
        round: lastLog.round,
        history: prev.history.slice(0, -1),
        winnerId: null,
        winReason: null
      };
    });
    setSelectedPoints(null);
  };

  const handleRestart = () => {
    if (window.confirm("確定要結束並返回主選單嗎？")) {
        setGameState(prev => ({ ...prev, status: 'SETUP' }));
        setIsReportOpen(false);
    }
  };

  const handleShowReport = () => {
    setIsReportOpen(true);
  };

  // --- Render ---

  if (gameState.status === 'SETUP') {
    return <SetupScreen onStart={handleStartGame} />;
  }

  return (
    <div className="h-full flex flex-col bg-slate-100 print:bg-white overflow-hidden">
      {/* Modern Dark Header */}
      <header className="bg-slate-900 text-slate-100 p-4 flex justify-between items-center shadow-md z-30 shrink-0 print:hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 pointer-events-none"></div>
        
        <div className="relative font-black text-xl tracking-tight flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Mölkky Master
            </span>
        </div>

        <div className="relative flex gap-3">
           <button 
             onClick={() => setIsHistoryOpen(true)}
             className="px-4 py-2 bg-white/10 hover:bg-white/15 active:bg-white/5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all backdrop-blur-md border border-white/10 text-slate-200"
           >
             <ScrollText size={16} /> 
             <span className="hidden sm:inline">記錄</span>
           </button>
           <button 
             onClick={handleRestart}
             className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all backdrop-blur-md border border-red-500/30 text-red-200"
           >
             <RefreshCw size={16} />
             <span className="hidden sm:inline">重置</span>
           </button>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative print:hidden">
        {/* Scoreboard Container */}
        <div className="flex-1 overflow-y-auto bg-slate-100 relative">
             <Scoreboard 
               teamA={gameState.teamA} 
               teamB={gameState.teamB} 
               currentTurn={gameState.currentTurn} 
             />
        </div>
        
        {/* Floating Keypad Section */}
        <div className="shrink-0 z-20 relative bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1"></div>
          {/* Status Indicator inside Keypad area */}
          <div className="text-center py-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
             Round {gameState.round}
          </div>
          
          <Keypad 
            onSelect={setSelectedPoints}
            onConfirm={handleScoreConfirm}
            onUndo={handleUndo}
            selectedPoints={selectedPoints}
            canUndo={gameState.history.length > 0}
          />
        </div>

        {/* Modals & Drawers */}
        <HistoryDrawer 
            isOpen={isHistoryOpen} 
            onClose={() => setIsHistoryOpen(false)} 
            logs={gameState.history} 
        />
        
        {gameState.status === 'FINISHED' && gameState.winnerId && !isReportOpen && (
            <WinnerModal 
              winner={gameState.winnerId === 'A' ? gameState.teamA : gameState.teamB}
              reason={gameState.winReason || '比賽結束'}
              onRestart={handleRestart}
              onPrint={handleShowReport}
            />
        )}
      </div>

      {/* Print View (Modal/Overlay) */}
      <PrintReport 
          gameState={gameState} 
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};

export default App;