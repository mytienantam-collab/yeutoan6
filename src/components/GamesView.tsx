import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  Trophy, 
  Zap, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Key, 
  Timer, 
  Award, 
  Sparkles,
  Users,
  Swords,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../types';

interface GamesViewProps {
  badges: Badge[];
  streakDays: number;
  xp: number;
  onAddXP: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

// Math Maze Cell definition
interface MazeCell {
  row: number;
  col: number;
  type: 'empty' | 'wall' | 'gate' | 'start' | 'goal' | 'gem';
  gateQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  isUnlocked?: boolean;
  collected?: boolean;
}

export const GamesView: React.FC<GamesViewProps> = ({
  badges,
  streakDays,
  xp,
  onAddXP,
  onUnlockBadge,
}) => {
  const [activeGameTab, setActiveGameTab] = useState<'maze' | 'arena' | 'badges'>('maze');

  // ================= MAZE GAME STATE =================
  const MAZE_SIZE = 5;
  const [playerPos, setPlayerPos] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [keysCollected, setKeysCollected] = useState<number>(0);
  const [activeGateRiddle, setActiveGateRiddle] = useState<{
    targetRow: number;
    targetCol: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  } | null>(null);
  const [mazeRiddleFeedback, setMazeRiddleFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [mazeWon, setMazeWon] = useState<boolean>(false);
  const [unlockedGates, setUnlockedGates] = useState<Record<string, boolean>>({});

  // Maze layout configuration
  const initialMazeLayout: MazeCell[][] = [
    // Row 0
    [
      { row: 0, col: 0, type: 'start' },
      { row: 0, col: 1, type: 'empty' },
      { 
        row: 0, 
        col: 2, 
        type: 'gate',
        gateQuestion: {
          question: 'Mở cổng phép tính: (-8) + 15 bằng bao nhiêu?',
          options: ['7', '-7', '23', '-23'],
          correctIndex: 0,
          explanation: 'Vì 15 - 8 = 7 và 15 mang dấu dương => kết quả là +7.',
        }
      },
      { row: 0, col: 3, type: 'empty' },
      { row: 0, col: 4, type: 'gem' },
    ],
    // Row 1
    [
      { row: 1, col: 0, type: 'wall' },
      { row: 1, col: 1, type: 'empty' },
      { row: 1, col: 2, type: 'wall' },
      { row: 1, col: 3, type: 'empty' },
      { row: 1, col: 4, type: 'empty' },
    ],
    // Row 2
    [
      { row: 2, col: 0, type: 'gem' },
      { row: 2, col: 1, type: 'empty' },
      { 
        row: 2, 
        col: 2, 
        type: 'gate',
        gateQuestion: {
          question: 'Mở cổng hình học: Hình thoi có 2 đường chéo 10 cm và 8 cm. Diện tích là:',
          options: ['80 cm²', '40 cm²', '18 cm²', '36 cm²'],
          correctIndex: 1,
          explanation: 'S = 1/2 · 10 · 8 = 40 cm².',
        }
      },
      { row: 2, col: 3, type: 'wall' },
      { row: 2, col: 4, type: 'empty' },
    ],
    // Row 3
    [
      { row: 3, col: 0, type: 'empty' },
      { row: 3, col: 1, type: 'wall' },
      { row: 3, col: 2, type: 'empty' },
      { row: 3, col: 3, type: 'empty' },
      { 
        row: 3, 
        col: 4, 
        type: 'gate',
        gateQuestion: {
          question: 'Mở cổng BCNN: BCNN của 6 và 9 bằng bao nhiêu?',
          options: ['54', '18', '3', '27'],
          correctIndex: 1,
          explanation: '6 = 2 · 3; 9 = 3². BCNN(6, 9) = 2 · 3² = 18.',
        }
      },
    ],
    // Row 4
    [
      { row: 4, col: 0, type: 'empty' },
      { row: 4, col: 1, type: 'empty' },
      { row: 4, col: 2, type: 'gem' },
      { row: 4, col: 3, type: 'empty' },
      { row: 4, col: 4, type: 'goal' },
    ],
  ];

  const handleMove = (dRow: number, dCol: number) => {
    if (mazeWon || activeGateRiddle) return;

    const newRow = playerPos.row + dRow;
    const newCol = playerPos.col + dCol;

    if (newRow < 0 || newRow >= MAZE_SIZE || newCol < 0 || newCol >= MAZE_SIZE) return;

    const targetCell = initialMazeLayout[newRow][newCol];
    const gateKey = `${newRow}-${newCol}`;

    if (targetCell.type === 'wall') return;

    if (targetCell.type === 'gate' && !unlockedGates[gateKey] && targetCell.gateQuestion) {
      // Trigger gate riddle
      setActiveGateRiddle({
        targetRow: newRow,
        targetCol: newCol,
        ...targetCell.gateQuestion,
      });
      setMazeRiddleFeedback(null);
      return;
    }

    // Move player
    setPlayerPos({ row: newRow, col: newCol });

    if (targetCell.type === 'gem') {
      setKeysCollected(prev => prev + 1);
      onAddXP(15);
    }

    if (targetCell.type === 'goal') {
      setMazeWon(true);
      onAddXP(50);
      onUnlockBadge('badge-04');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSolveGateRiddle = (optionIdx: number) => {
    if (!activeGateRiddle) return;

    if (optionIdx === activeGateRiddle.correctIndex) {
      const gateKey = `${activeGateRiddle.targetRow}-${activeGateRiddle.targetCol}`;
      setUnlockedGates(prev => ({ ...prev, [gateKey]: true }));
      setKeysCollected(prev => prev + 1);
      onAddXP(25);

      setMazeRiddleFeedback({
        isCorrect: true,
        text: `Tuyệt vời! ${activeGateRiddle.explanation} Cánh cổng vàng đã mở! (+25 XP)`,
      });

      setTimeout(() => {
        setPlayerPos({ row: activeGateRiddle.targetRow, col: activeGateRiddle.targetCol });
        setActiveGateRiddle(null);
        setMazeRiddleFeedback(null);
      }, 1200);
    } else {
      setMazeRiddleFeedback({
        isCorrect: false,
        text: 'Chưa chính xác! Thử tính nhẩm cẩn thận lại nhé em.',
      });
    }
  };

  const resetMaze = () => {
    setPlayerPos({ row: 0, col: 0 });
    setKeysCollected(0);
    setMazeWon(false);
    setUnlockedGates({});
    setActiveGateRiddle(null);
  };

  // ================= ARENA 1v1 SPEED BATTLE STATE =================
  const [arenaActive, setArenaActive] = useState(false);
  const [arenaTimeLeft, setArenaTimeLeft] = useState(45);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [arenaQuestionIdx, setArenaQuestionIdx] = useState(0);

  const ARENA_QUESTIONS = [
    { q: '(-6) + (-9) = ?', options: ['-15', '15', '-3', '3'], ans: 0 },
    { q: '3² + 2³ = ?', options: ['13', '17', '12', '25'], ans: 1 },
    { q: '25% của 80 bằng:', options: ['20', '25', '40', '15'], ans: 0 },
    { q: '(-4) · (-7) = ?', options: ['-28', '28', '-11', '11'], ans: 1 },
    { q: 'Chu vi hình vuông cạnh 9 cm là:', options: ['81 cm', '36 cm', '18 cm', '27 cm'], ans: 1 },
    { q: 'Phân số 15/20 rút gọn tối giản là:', options: ['3/4', '5/6', '2/3', '1/2'], ans: 0 },
    { q: 'ƯCLN(12, 18) là:', options: ['36', '6', '3', '2'], ans: 1 },
    { q: 'Số nguyên nào liền trước số -5?', options: ['-4', '-6', '4', '6'], ans: 1 },
    { q: 'Diện tích hình chữ nhật dài 12m, rộng 5m:', options: ['60 m²', '34 m²', '17 m²', '120 m²'], ans: 0 },
    { q: '(-18) : 3 = ?', options: ['6', '-6', '-15', '15'], ans: 1 },
  ];

  // Arena Timer loop
  useEffect(() => {
    let timer: any = null;
    if (arenaActive && arenaTimeLeft > 0) {
      timer = setInterval(() => {
        setArenaTimeLeft(prev => {
          if (prev <= 1) {
            setArenaActive(false);
            if (playerScore > botScore) {
              onAddXP(60);
              onUnlockBadge('badge-05');
              confetti({ particleCount: 70, spread: 60 });
            }
            return 0;
          }
          return prev - 1;
        });

        // Bot randomly scores
        if (Math.random() > 0.45) {
          setBotScore(b => b + 10);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [arenaActive, arenaTimeLeft, playerScore, botScore]);

  const startArenaBattle = () => {
    setArenaActive(true);
    setArenaTimeLeft(45);
    setPlayerScore(0);
    setBotScore(0);
    setComboCount(0);
    setArenaQuestionIdx(0);
  };

  const handleArenaAnswer = (choiceIdx: number) => {
    const currentQ = ARENA_QUESTIONS[arenaQuestionIdx % ARENA_QUESTIONS.length];
    if (choiceIdx === currentQ.ans) {
      const newCombo = comboCount + 1;
      setComboCount(newCombo);
      const points = 10 * (newCombo >= 3 ? 2 : 1);
      setPlayerScore(p => p + points);
    } else {
      setComboCount(0);
    }
    setArenaQuestionIdx(i => i + 1);
  };

  // Keyboard navigation for Maze
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGameTab !== 'maze') return;
      if (e.key === 'ArrowUp' || e.key === 'w') handleMove(-1, 0);
      if (e.key === 'ArrowDown' || e.key === 's') handleMove(1, 0);
      if (e.key === 'ArrowLeft' || e.key === 'a') handleMove(0, -1);
      if (e.key === 'ArrowRight' || e.key === 'd') handleMove(0, 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, activeGateRiddle, mazeWon, unlockedGates, activeGameTab]);

  return (
    <div className="space-y-8 pb-12">
      {/* Gamification Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-2">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Đấu trường Gamification Toán học Quốc tế</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              Góc Trò Chơi Toán Học Sinh Động
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Vừa chơi vừa nhớ sâu kiến thức: Giải toán vượt mê cung và thi đấu tốc độ trong Đấu trường 1v1
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveGameTab('maze')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeGameTab === 'maze'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mê Cung Toán Học 🗝️
            </button>
            <button
              onClick={() => setActiveGameTab('arena')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeGameTab === 'arena'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đấu Trường 1v1 ⚡
            </button>
            <button
              onClick={() => setActiveGameTab('badges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeGameTab === 'badges'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Huy Hiệu & Streak 🏆
            </button>
          </div>
        </div>

        {/* TAB 1: MATH MAZE RUNNER */}
        {activeGameTab === 'maze' && (
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Maze Canvas */}
            <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Key className="w-4 h-4" /> Thu thập: {keysCollected} chìa khóa
                  </span>
                </div>
                <div className="text-slate-400">
                  Dùng phím mũi tên ⬆️⬇️⬅️➡️ hoặc nút điều khiển
                </div>
              </div>

              {/* 5x5 Grid */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 max-w-md w-full aspect-square">
                {initialMazeLayout.map((rowArr, r) =>
                  rowArr.map((cell, c) => {
                    const isPlayerHere = playerPos.row === r && playerPos.col === c;
                    const gateKey = `${r}-${c}`;
                    const isGateUnlocked = unlockedGates[gateKey];

                    let cellBg = "bg-slate-850 border-slate-800";
                    let iconContent = null;

                    if (cell.type === 'wall') {
                      cellBg = "bg-slate-800 border-slate-700/50 shadow-inner";
                      iconContent = <span className="text-slate-600 text-xs font-mono">🧱</span>;
                    } else if (cell.type === 'start') {
                      cellBg = "bg-blue-950 border-blue-800";
                      iconContent = <span className="text-[10px] text-blue-400 font-bold">BẮT ĐẦU</span>;
                    } else if (cell.type === 'goal') {
                      cellBg = "bg-amber-950 border-amber-700";
                      iconContent = <span className="text-2xl animate-bounce">🏆</span>;
                    } else if (cell.type === 'gem') {
                      cellBg = "bg-purple-950/60 border-purple-800";
                      iconContent = <span className="text-lg animate-pulse">💎</span>;
                    } else if (cell.type === 'gate') {
                      cellBg = isGateUnlocked ? "bg-emerald-950 border-emerald-700" : "bg-amber-950 border-amber-600";
                      iconContent = <span className="text-base">{isGateUnlocked ? "🔓" : "🔒"}</span>;
                    }

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`relative rounded-xl border flex items-center justify-center transition-all duration-200 ${cellBg} ${
                          isPlayerHere ? 'ring-3 ring-amber-400 ring-offset-2 ring-offset-slate-900 z-10' : ''
                        }`}
                      >
                        {isPlayerHere ? (
                          <div className="flex flex-col items-center">
                            <span className="text-2xl animate-bounce">🧙‍♂️</span>
                            <span className="text-[8px] text-amber-300 font-bold leading-none">Em</span>
                          </div>
                        ) : (
                          iconContent
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Mobile / Screen directional pad */}
              <div className="mt-6 flex flex-col items-center gap-1">
                <button
                  onClick={() => handleMove(-1, 0)}
                  className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center font-bold text-lg shadow-md border border-slate-700"
                >
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMove(0, -1)}
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center font-bold text-lg shadow-md border border-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleMove(1, 0)}
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center font-bold text-lg shadow-md border border-slate-700"
                  >
                    <ArrowDown className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleMove(0, 1)}
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center font-bold text-lg shadow-md border border-slate-700"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Riddle Card or Win State */}
            <div className="space-y-4">
              {mazeWon ? (
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-slate-950 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto text-3xl shadow-lg">
                    🏆
                  </div>
                  <h3 className="text-xl font-black font-heading">
                    CHÚC MỪNG CHIẾN THẮNG!
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed">
                    Em đã giải quyết toàn bộ câu đố toán học, vượt qua cánh cổng mê cung và giành cúp vinh quang!
                  </p>
                  <div className="bg-white/30 rounded-2xl p-3 text-xs font-bold font-mono">
                    +50 XP & Mở khóa Huy hiệu "Bậc thầy Mê Cung"
                  </div>
                  <button
                    onClick={resetMaze}
                    className="w-full py-3 rounded-xl bg-slate-950 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Chơi lại vòng mới</span>
                  </button>
                </div>
              ) : activeGateRiddle ? (
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-lg space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span>Cánh cổng bí ẩn đang chặn đường!</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {activeGateRiddle.question}
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {activeGateRiddle.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSolveGateRiddle(i)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-400 border border-slate-200 text-xs font-semibold text-slate-800 transition-all text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {mazeRiddleFeedback && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${
                      mazeRiddleFeedback.isCorrect
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}>
                      {mazeRiddleFeedback.text}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Nhiệm vụ Thám Hiểm</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                      <span>Di chuyển nhân vật 🧙‍♂️ từ ô Xuất Phát (góc trên trái) tới Cúp Vàng (góc dưới phải).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                      <span>Gặp cánh cổng 🔒, giải câu đố toán để mở khóa (+25 XP).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                      <span>Thu thập các viên ngọc tím 💎 trên đường để nhận thêm điểm thưởng!</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 1v1 SPEED MATH ARENA */}
        {activeGameTab === 'arena' && (
          <div className="pt-6 space-y-6">
            {!arenaActive && arenaTimeLeft === 45 ? (
              /* Pre-game lobby */
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center max-w-2xl mx-auto space-y-6 shadow-2xl border border-blue-800">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-500/20">
                  ⚔️
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading">
                    Đấu Trường Toán Học Tốc Độ 1v1
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-md mx-auto">
                    Thi đấu đối kháng cùng đối thủ "Thỏ Siêu Tốc". Bấm nhanh câu trả lời đúng trong 45 giây để tích chuỗi Combo x2 điểm!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs text-blue-100 font-medium">
                  <span>⏱️ Thời gian: 45 giây</span>
                  <span>🔥 Combo: x2 điểm</span>
                  <span>🏆 Thưởng: +60 XP</span>
                </div>

                <button
                  onClick={startArenaBattle}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-400/25 hover:scale-105 active:scale-95 transition-all"
                >
                  Vào Trận Ngay! 🚀
                </button>
              </div>
            ) : arenaTimeLeft === 0 ? (
              /* Arena GameOver Screen */
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-white text-center max-w-xl mx-auto space-y-6 shadow-2xl">
                <div className="text-4xl">
                  {playerScore > botScore ? '🎉' : playerScore === botScore ? '🤝' : '💪'}
                </div>
                <h3 className="text-2xl font-black font-heading">
                  {playerScore > botScore ? 'BẠN ĐÃ CHIẾN THẮNG!' : playerScore === botScore ? 'HÒA ĐIỂM KỊCH TÍNH!' : 'CỐ GẮNG VÒNG SAU NHÉ!'}
                </h3>
                
                <div className="flex items-center justify-center gap-8 py-4">
                  <div className="text-center">
                    <span className="text-xs text-blue-300 block font-semibold">Điểm của Em</span>
                    <span className="text-3xl font-black text-amber-400 font-mono">{playerScore}</span>
                  </div>
                  <span className="text-xl font-bold text-slate-500">VS</span>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block font-semibold">Thỏ Siêu Tốc</span>
                    <span className="text-3xl font-black text-slate-300 font-mono">{botScore}</span>
                  </div>
                </div>

                <button
                  onClick={startArenaBattle}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-all shadow-md"
                >
                  Tái đấu trận mới 🔄
                </button>
              </div>
            ) : (
              /* Active Arena Battle Screen */
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 max-w-2xl mx-auto">
                {/* Battle HUD */}
                <div className="flex items-center justify-between gap-4">
                  {/* Player side */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      Em
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-300">Điểm: {playerScore}</div>
                      {comboCount >= 2 && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded animate-pulse">
                          COMBO x{comboCount}🔥
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-sm">
                    <Timer className="w-4 h-4" />
                    <span>{arenaTimeLeft}s</span>
                  </div>

                  {/* Bot rival side */}
                  <div className="flex items-center gap-2.5 text-right">
                    <div>
                      <div className="text-xs font-bold text-slate-300">Thỏ Siêu Tốc</div>
                      <div className="text-xs text-slate-400 font-mono">{botScore} điểm</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      🐰
                    </div>
                  </div>
                </div>

                {/* Score balance bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${(playerScore / Math.max(1, playerScore + botScore)) * 100 || 50}%`,
                    }}
                  ></div>
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{
                      width: `${(botScore / Math.max(1, playerScore + botScore)) * 100 || 50}%`,
                    }}
                  ></div>
                </div>

                {/* Battle Question */}
                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 text-center space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Câu hỏi tính nhanh #{arenaQuestionIdx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-mono text-white">
                    {ARENA_QUESTIONS[arenaQuestionIdx % ARENA_QUESTIONS.length].q}
                  </h3>
                </div>

                {/* 4 Fast Answers Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {ARENA_QUESTIONS[arenaQuestionIdx % ARENA_QUESTIONS.length].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleArenaAnswer(idx)}
                      className="p-4 rounded-xl bg-slate-800 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm sm:text-base font-mono border border-slate-700 hover:border-blue-400 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BADGES & STREAKS (Huy hiệu & Chuỗi ngày học) */}
        {activeGameTab === 'badges' && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Bộ sưu tập Huy hiệu & Chuỗi ngày học tập (Streak)
                </h3>
                <p className="text-xs text-slate-500">
                  Hoàn thành nhiệm vụ mỗi ngày để thắp sáng chuỗi lửa và nhận huy hiệu danh giá
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-600 font-extrabold text-sm bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{streakDays} ngày liên tiếp</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-white border-amber-300/80 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-xs ${
                        badge.unlocked
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-slate-200 text-slate-400'
                      }`}>
                        {badge.unlocked ? '🏅' : '🔒'}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        badge.unlocked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {badge.unlocked ? 'Đã đạt' : 'Chưa mở'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                    Yêu cầu: {badge.requirement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
