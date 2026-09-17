import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Lightbulb, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Sliders, 
  Compass, 
  Hash, 
  Shapes, 
  PieChart,
  HelpCircle
} from 'lucide-react';
import { TopicChapter, ActiveTab } from '../types';

interface CurriculumViewProps {
  topics: TopicChapter[];
  initialTopicId?: string;
  onNavigatePractice: (topicId: string) => void;
  onOpenAITutorWithTopic: (topicTitle: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  topics,
  initialTopicId,
  onNavigatePractice,
  onOpenAITutorWithTopic,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || topics[0]?.id || 'so-tu-nhien'
  );
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'mindmap' | 'examples'>('video');

  // Interactive visual state for the visual explainer
  const [numberLinePos, setNumberLinePos] = useState<number>(-2);
  const [numberLineStep, setNumberLineStep] = useState<number>(5);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);

  // Interactive geometry state
  const [parallelogramCut, setParallelogramCut] = useState(false);
  const [baseWidth, setBaseWidth] = useState(8);
  const [heightVal, setHeightVal] = useState(5);

  // Interactive fraction state
  const [fractionSlices, setFractionSlices] = useState(4);
  const [selectedSlices, setSelectedSlices] = useState(2);

  const currentTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  const handleStepNumberLine = (delta: number) => {
    setNumberLinePos(prev => Math.max(-10, Math.min(10, prev + delta)));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Chapter Selection Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {topics.map((t) => {
            const isSelected = t.id === selectedTopicId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`text-left p-3.5 rounded-xl transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : `${t.color.bg} ${t.color.primary}`
                  }`}
                >
                  <span className="text-xs font-black">{t.code.replace('CH-', '')}</span>
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase font-bold tracking-wider truncate ${
                    isSelected ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {t.subtitle}
                  </p>
                  <h4 className="text-xs sm:text-sm font-bold truncate">
                    {t.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Header & Sub-Navigation */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${currentTopic.color.badge}`}>
                {currentTopic.code}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Chương trình Giáo dục Phổ thông 2018
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              {currentTopic.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {currentTopic.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAITutorWithTopic(currentTopic.title)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Hỏi Thầy Cú AI bài này</span>
            </button>
            <button
              onClick={() => onNavigatePractice(currentTopic.id)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Làm bài tập ({currentTopic.questions.length} câu)</span>
            </button>
          </div>
        </div>

        {/* Feature 3 Tabs: Video Trực Quan, Sơ Đồ Tư Duy, Ví Dụ Mẫu */}
        <div className="flex border-b border-slate-200 mt-6 gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('video')}
            className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'video'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Video Hoạt hình Trực quan (3-5 phút)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mindmap')}
            className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'mindmap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Sơ đồ tư duy (Mindmap Tóm tắt)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('examples')}
            className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'examples'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ví dụ mẫu (Từng bước giải)</span>
          </button>
        </div>

        {/* TAB 1: Animated Interactive Video Visualizer */}
        {activeSubTab === 'video' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              {/* Video Player Header */}
              <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-slate-300 ml-2">
                    Mô phỏng Trực quan • {currentTopic.videoLesson.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-medium border border-blue-500/30">
                    {currentTopic.videoLesson.duration}
                  </span>
                </div>
              </div>

              {/* Dynamic Interactive Stage based on topic */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center min-h-[360px]">
                {/* Visualizer Type 1: Number line & negative numbers */}
                {currentTopic.id === 'so-nguyen' && (
                  <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Phòng thí nghiệm Trục số & Phép tính Z
                      </span>
                      <p className="text-sm text-slate-300">
                        Di chuyển phi hành gia trên trục số: sang phải là CỘNG (+), sang trái là TRỪ (-)
                      </p>
                    </div>

                    {/* The Number Line Canvas */}
                    <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 relative">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                        <span>-10 (Lặn biển sâu)</span>
                        <span className="text-amber-300 font-bold">0 (Mặt đất)</span>
                        <span>+10 (Trên cao)</span>
                      </div>

                      {/* Number axis line */}
                      <div className="relative h-12 flex items-center my-4">
                        <div className="absolute left-0 right-0 h-1.5 bg-slate-600 rounded-full"></div>
                        
                        {/* Center zero indicator */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-amber-400"></div>

                        {/* Interactive marker */}
                        <div 
                          className="absolute -top-3 -translate-x-1/2 transition-all duration-300 flex flex-col items-center cursor-pointer"
                          style={{ left: `${((numberLinePos + 10) / 20) * 100}%` }}
                        >
                          <div className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                            {numberLinePos > 0 ? `+${numberLinePos}` : numberLinePos}
                          </div>
                          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg mt-1 animate-bounce"></div>
                          <span className="text-[10px] text-blue-200 mt-1 font-bold">🚀 Điểm đến</span>
                        </div>
                      </div>

                      {/* Tick marks */}
                      <div className="grid grid-cols-11 text-center text-[11px] font-mono text-slate-400">
                        {[-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10].map(val => (
                          <span key={val} className={val === 0 ? 'text-amber-300 font-bold' : ''}>
                            {val}
                          </span>
                        ))}
                      </div>

                      {/* Live Equation display */}
                      <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 block mb-1">Phương trình trực quan:</span>
                        <div className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                          {numberLinePos} + ({numberLineStep}) = {numberLinePos + numberLineStep}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          {numberLinePos < 0 && numberLineStep > 0
                            ? `Bắt đầu ở số âm ${numberLinePos}, tiến sang phải ${numberLineStep} bước thì chạm vị trí ${numberLinePos + numberLineStep}!`
                            : `Quy tắc: Muốn cộng số dương ta tiến sang phải, muốn trừ ta lùi sang trái.`}
                        </p>
                      </div>

                      {/* Interactive Controls */}
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                        <button
                          onClick={() => handleStepNumberLine(-3)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors"
                        >
                          ⬅️ Lùi -3 bước
                        </button>
                        <button
                          onClick={() => handleStepNumberLine(-1)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors"
                        >
                          ⬅️ Lùi -1 bước
                        </button>
                        <button
                          onClick={() => setNumberLinePos(0)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 text-xs font-bold transition-colors"
                        >
                          Về vị trí 0
                        </button>
                        <button
                          onClick={() => handleStepNumberLine(1)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                        >
                          Tiến +1 bước ➡️
                        </button>
                        <button
                          onClick={() => handleStepNumberLine(3)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                        >
                          Tiến +3 bước ➡️
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualizer Type 2: Shape Geometry Transformer */}
                {currentTopic.id === 'hinh-hoc-truc-quan' && (
                  <div className="w-full max-w-2xl space-y-6 text-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Cắt Ghép Biến Đổi Hình Học: Vì sao S(Hình bình hành) = a · h?
                    </span>
                    
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                      {/* SVG Canvas showing cut & transform */}
                      <div className="h-44 flex items-center justify-center">
                        <svg className="w-80 h-36 overflow-visible" viewBox="0 0 320 140">
                          {/* Main parallelogram or transformed rectangle */}
                          {parallelogramCut ? (
                            <g className="transition-all duration-500">
                              <rect x="40" y="20" width="220" height="90" fill="#0284c7" fillOpacity="0.7" stroke="#38bdf8" strokeWidth="2" rx="4" />
                              <text x="150" y="70" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">
                                Đã ghép thành Hình Chữ Nhật! (S = a · h)
                              </text>
                            </g>
                          ) : (
                            <g className="transition-all duration-500">
                              {/* Parallelogram body */}
                              <polygon points="60,20 260,20 220,110 20,110" fill="#059669" fillOpacity="0.7" stroke="#34d399" strokeWidth="2" />
                              {/* Cut line */}
                              <line x1="60" y1="20" x2="60" y2="110" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4" />
                              <text x="140" y="70" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">
                                Hình Bình Hành (đáy a, cao h)
                              </text>
                              {/* Triangle piece to cut */}
                              <polygon points="60,20 60,110 20,110" fill="#f59e0b" fillOpacity="0.6" stroke="#fbbf24" strokeWidth="1" />
                            </g>
                          )}
                        </svg>
                      </div>

                      <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                          onClick={() => setParallelogramCut(!parallelogramCut)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{parallelogramCut ? "Xem lại Hình bình hành ban đầu" : "Cắt tam giác & Ghép thành Hình chữ nhật!"}</span>
                        </button>
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 text-xs text-slate-300 font-mono">
                        Công thức: Diện tích = Đáy ({baseWidth} m) × Chiều cao ({heightVal} m) ={' '}
                        <span className="text-amber-400 font-bold">{baseWidth * heightVal} m²</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualizer Type 3: Fraction Pizza Slices */}
                {currentTopic.id === 'phan-so-thong-ke' && (
                  <div className="w-full max-w-2xl space-y-4 text-center">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Trực quan Phân số qua Bánh Pizza & So sánh Phân số bằng nhau
                    </span>

                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col items-center">
                      {/* SVG Pizza Pie */}
                      <div className="relative w-48 h-48 my-2">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="#334155" stroke="#475569" strokeWidth="2" />
                          {/* Slices representation */}
                          {Array.from({ length: fractionSlices }).map((_, i) => {
                            const angle = (360 / fractionSlices) * i;
                            const isSelected = i < selectedSlices;
                            const strokeDash = (2 * Math.PI * 40) / fractionSlices;
                            return (
                              <circle
                                key={i}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={isSelected ? '#6366f1' : '#1e293b'}
                                strokeWidth="18"
                                strokeDasharray={`${strokeDash - 2} ${2 * Math.PI * 40 - strokeDash + 2}`}
                                strokeDashoffset={-((2 * Math.PI * 40) / fractionSlices) * i}
                                className="transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedSlices(i + 1)}
                              />
                            );
                          })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                          <span className="text-xl font-black text-amber-300 font-mono">
                            {selectedSlices}/{fractionSlices}
                          </span>
                          <span className="text-[10px] text-slate-300">
                            = {((selectedSlices / fractionSlices) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 text-xs">
                        <button
                          onClick={() => { setFractionSlices(4); setSelectedSlices(2); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium"
                        >
                          Chia 4 phần (2/4 = 1/2)
                        </button>
                        <button
                          onClick={() => { setFractionSlices(8); setSelectedSlices(4); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium"
                        >
                          Chia 8 phần (4/8 = 1/2)
                        </button>
                        <button
                          onClick={() => { setFractionSlices(6); setSelectedSlices(3); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium"
                        >
                          Chia 6 phần (3/6 = 1/2)
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 mt-4">
                        💡 Quan sát: 1/2 = 2/4 = 3/6 = 4/8. Khi nhân cả tử và mẫu với cùng một số khác 0, giá trị phân số không đổi!
                      </p>
                    </div>
                  </div>
                )}

                {/* Visualizer Type 4: Exponents & Prime Tree (Số tự nhiên) */}
                {currentTopic.id === 'so-tu-nhien' && (
                  <div className="w-full max-w-2xl space-y-4 text-center">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Cây Phân tích Thừa số Nguyên tố & Lũy thừa
                    </span>

                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                      <div className="text-sm font-semibold text-white mb-4">
                        Phân tích số 60 ra thừa số nguyên tố:
                      </div>

                      {/* Prime Tree Diagram */}
                      <div className="flex flex-col items-center gap-3 font-mono text-xs">
                        <div className="w-14 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg text-sm">
                          60
                        </div>
                        <div className="text-slate-400 text-sm">╱ ╲</div>
                        <div className="flex items-center gap-12">
                          <div className="w-10 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                            2
                          </div>
                          <div className="w-10 h-8 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center">
                            30
                          </div>
                        </div>
                        <div className="ml-16 text-slate-400 text-sm">╱ ╲</div>
                        <div className="flex items-center gap-8 ml-16">
                          <div className="w-10 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                            2
                          </div>
                          <div className="w-10 h-8 rounded-lg bg-blue-800 text-white font-bold flex items-center justify-center">
                            15
                          </div>
                        </div>
                        <div className="ml-28 text-slate-400 text-sm">╱ ╲</div>
                        <div className="flex items-center gap-6 ml-28">
                          <div className="w-10 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                            3
                          </div>
                          <div className="w-10 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                            5
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-700">
                        <span className="text-xs text-slate-400 block mb-1">Kết quả viết dưới dạng tích các lũy thừa:</span>
                        <div className="text-xl font-black text-amber-300 font-mono">
                          60 = 2² · 3 · 5
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Key takeaways */}
              <div className="p-6 bg-slate-850 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Điểm kiến thức cốt lõi rút ra:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentTopic.videoLesson.animationDetails.keyPoints.map((point, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-[10px] mb-1.5">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive Mindmap */}
        {activeSubTab === 'mindmap' && (
          <div className="pt-6 space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Sơ đồ tư duy thông minh
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {currentTopic.mindmap.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {currentTopic.mindmap.summary}
                  </p>
                </div>

                <div className="bg-amber-100/70 border border-amber-200 px-3.5 py-2 rounded-xl text-xs text-amber-900 font-medium">
                  {currentTopic.mindmap.tips}
                </div>
              </div>

              {/* Mindmap Branch Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTopic.mindmap.children?.map((branch, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800">
                        {branch.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-8">
                      {branch.details}
                    </p>

                    {branch.example && (
                      <div className="ml-8 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-mono text-indigo-900">
                        <span className="font-bold text-indigo-600">Ví dụ: </span>
                        {branch.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Formula Quick-Cheat Box */}
              <div className="mt-6 p-4 rounded-2xl bg-indigo-900 text-white space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Công thức trọng tâm cần thuộc lòng:
                </span>
                <div className="flex flex-wrap gap-3 pt-1">
                  {currentTopic.mindmap.formulas.map((formula, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white/10 font-mono text-xs font-bold text-white border border-white/15"
                    >
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Worked Examples Step-by-Step */}
        {activeSubTab === 'examples' && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                Ví dụ mẫu: Phân tích & Hướng dẫn giải từ cơ bản đến nâng cao
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {currentTopic.workedExamples.length} bài toán điển hình
              </span>
            </div>

            <div className="space-y-6">
              {currentTopic.workedExamples.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
                >
                  <div className="p-5 bg-slate-50 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-xs">
                        {ex.difficulty}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-800">
                        {ex.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Problem prompt */}
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 text-slate-800 text-xs sm:text-sm leading-relaxed">
                      <span className="font-bold text-blue-900 block mb-1">Đề bài:</span>
                      {ex.problem}
                    </div>

                    {/* Method */}
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-800">Phương pháp giải: </span>
                      {ex.method}
                    </div>

                    {/* Steps breakdown */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Các bước giải chi tiết:
                      </span>
                      {ex.steps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {step.stepNumber}
                          </div>
                          <div className="space-y-1 text-xs">
                            <h5 className="font-bold text-slate-900">{step.title}</h5>
                            <p className="text-slate-600">{step.description}</p>
                            <p className="font-mono font-bold text-blue-800 pt-0.5">{step.result}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pitfall and Pro-tip boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-900 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5">Bẫy sai lầm hay gặp:</span>
                          <p className="text-rose-800 leading-relaxed">{ex.pitfall}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5">Mẹo giải nhanh & bí kíp:</span>
                          <p className="text-amber-800 leading-relaxed">{ex.proTip}</p>
                        </div>
                      </div>
                    </div>
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
