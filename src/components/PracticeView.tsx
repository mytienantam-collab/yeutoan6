import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  FileDown, 
  Printer, 
  Eye, 
  Filter, 
  BookOpen,
  ChevronRight,
  Flame,
  Zap,
  Clock
} from 'lucide-react';
import { TopicChapter, ExerciseQuestion, DifficultyLevel } from '../types';
import { WORKSHEETS_DATA } from '../data/worksheetsData';

interface PracticeViewProps {
  topics: TopicChapter[];
  initialTopicId?: string;
  onAddXP: (points: number) => void;
  onRecordQuizResult: (topicId: string, correct: number, total: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  topics,
  initialTopicId,
  onAddXP,
  onRecordQuizResult,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || topics[0]?.id || 'so-tu-nhien'
  );
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'quiz' | 'worksheets'>('quiz');

  // Quiz state
  const currentTopic = topics.find(t => t.id === selectedTopicId) || topics[0];
  const allQuestions = currentTopic.questions;
  const filteredQuestions = selectedLevel === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.level === selectedLevel);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Worksheets Modal State
  const [selectedWorksheetId, setSelectedWorksheetId] = useState<string | null>(null);
  const [showSolutions, setShowSolutions] = useState<boolean>(false);

  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || !currentQuestion) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOptionIndex,
    }));

    if (isCorrect) {
      onAddXP(currentQuestion.points);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Finished all questions
      let correctCount = 0;
      let totalXP = 0;

      filteredQuestions.forEach(q => {
        const userChoice = userAnswers[q.id] !== undefined ? userAnswers[q.id] : selectedOptionIndex;
        if (userChoice === q.correctIndex) {
          correctCount++;
          totalXP += q.points;
        }
      });

      setQuizScore({
        correct: correctCount,
        total: filteredQuestions.length,
        xpEarned: totalXP,
      });

      onRecordQuizResult(currentTopic.id, correctCount, filteredQuestions.length);

      if (correctCount / filteredQuestions.length >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizScore(null);
    setShowHint(false);
  };

  const activeWorksheet = WORKSHEETS_DATA.find(w => w.id === selectedWorksheetId);

  const handlePrintWorksheet = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Mode Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Kho Bài tập & Trắc nghiệm Chấm điểm Tự động</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              Luyện thi & Phiếu bài tập Canva
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hệ thống câu hỏi phân hóa 3 cấp độ: Nhận biết, Thông hiểu và Vận dụng kèm lời giải chi tiết
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trắc nghiệm Trực tuyến
            </button>
            <button
              onClick={() => setActiveTab('worksheets')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'worksheets'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phiếu bài tập Canva (Tải/In)
            </button>
          </div>
        </div>

        {/* QUIZ MODE */}
        {activeTab === 'quiz' && (
          <div className="pt-6 space-y-6">
            {/* Topic & Difficulty Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Chuyên đề:
                </span>
                {topics.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      handleResetQuiz();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedTopicId === t.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t.title.split('&')[0]}
                  </button>
                ))}
              </div>

              {/* 3 Difficulty Levels filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => { setSelectedLevel('all'); handleResetQuiz(); }}
                  className={`px-2.5 py-1 rounded-lg ${
                    selectedLevel === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Tất cả ({allQuestions.length})
                </button>
                <button
                  onClick={() => { setSelectedLevel('nhan_biet'); handleResetQuiz(); }}
                  className={`px-2.5 py-1 rounded-lg ${
                    selectedLevel === 'nhan_biet' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-emerald-700'
                  }`}
                >
                  Nhận biết
                </button>
                <button
                  onClick={() => { setSelectedLevel('thong_hieu'); handleResetQuiz(); }}
                  className={`px-2.5 py-1 rounded-lg ${
                    selectedLevel === 'thong_hieu' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-blue-700'
                  }`}
                >
                  Thông hiểu
                </button>
                <button
                  onClick={() => { setSelectedLevel('van_dung'); handleResetQuiz(); }}
                  className={`px-2.5 py-1 rounded-lg ${
                    selectedLevel === 'van_dung' ? 'bg-amber-600 text-white shadow-xs font-bold' : 'text-amber-800'
                  }`}
                >
                  Vận dụng
                </button>
              </div>
            </div>

            {/* Quiz Card or Result Screen */}
            {quizScore ? (
              /* Quiz Finished Summary */
              <div className="bg-gradient-to-br from-blue-50 via-white to-amber-50 rounded-3xl p-8 border border-blue-200 text-center max-w-xl mx-auto space-y-6 shadow-md">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/30">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-black font-heading text-slate-900">
                    Xuất sắc! Hoàn thành bài luyện tập
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Chuyên đề: {currentTopic.title}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Số câu đúng</span>
                    <span className="text-xl font-black text-emerald-600 font-mono">
                      {quizScore.correct}/{quizScore.total}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Độ chính xác</span>
                    <span className="text-xl font-black text-blue-600 font-mono">
                      {Math.round((quizScore.correct / quizScore.total) * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Điểm XP</span>
                    <span className="text-xl font-black text-amber-500 font-mono">
                      +{quizScore.xpEarned} XP
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleResetQuiz}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Làm lại bộ đề</span>
                  </button>
                  <button
                    onClick={() => {
                      const nextTopicIndex = (topics.findIndex(t => t.id === selectedTopicId) + 1) % topics.length;
                      setSelectedTopicId(topics[nextTopicIndex].id);
                      handleResetQuiz();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <span>Luyện chuyên đề tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : filteredQuestions.length > 0 ? (
              /* Active Question Card */
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-6">
                {/* Progress bar and counter */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      Câu hỏi {currentQuestionIndex + 1}/{filteredQuestions.length}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentQuestion.level === 'nhan_biet' ? 'bg-emerald-100 text-emerald-800' :
                      currentQuestion.level === 'thong_hieu' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-900'
                    }`}>
                      {currentQuestion.level === 'nhan_biet' ? 'Nhận biết' :
                       currentQuestion.level === 'thong_hieu' ? 'Thông hiểu' : 'Vận dụng'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                    <Zap className="w-4 h-4 fill-amber-500" />
                    <span>+{currentQuestion.points} XP</span>
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question statement */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    
                    let btnStyle = "bg-white border-slate-200 hover:border-blue-400 text-slate-800";
                    if (isSelected && !isAnswerSubmitted) {
                      btnStyle = "bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-100";
                    }
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-200";
                      } else {
                        btnStyle = "bg-white/60 border-slate-200 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-100 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 text-slate-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Hint toggle */}
                {currentQuestion.hint && !isAnswerSubmitted && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? "Ẩn gợi ý" : "Xem gợi ý Thầy Cú"}</span>
                    </button>
                  </div>
                )}
                {showHint && !isAnswerSubmitted && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    💡 <strong>Gợi ý:</strong> {currentQuestion.hint}
                  </div>
                )}

                {/* Detailed Explanation upon submission */}
                {isAnswerSubmitted && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                    selectedOptionIndex === currentQuestion.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {selectedOptionIndex === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Chính xác! Em nhận được +{currentQuestion.points} XP</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Chưa chính xác rồi. Đáp án đúng là: {String.fromCharCode(65 + currentQuestion.correctIndex)}</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-700 pt-1">
                      <strong>Lời giải chi tiết: </strong>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action Bar: Submit or Next */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      disabled={selectedOptionIndex === null}
                      onClick={handleSubmitAnswer}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      Nộp câu trả lời
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
                    >
                      <span>
                        {currentQuestionIndex < filteredQuestions.length - 1 ? "Câu tiếp theo" : "Xem kết quả bài làm"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Chưa có câu hỏi cho cấp độ này. Hãy chọn "Tất cả" để luyện tập nhé!
              </div>
            )}
          </div>
        )}

        {/* WORKSHEETS MODE (Mẫu thiết kế phiếu Canva) */}
        {activeTab === 'worksheets' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Bộ sưu tập Phiếu Học Tập Thiết Kế Canva
                </h3>
                <p className="text-xs text-slate-500">
                  Mẫu phiếu sinh động cho học sinh in ra luyện chữ đẹp, giải toán tự luận và giáo viên phát trên lớp
                </p>
              </div>
            </div>

            {/* Grid of Worksheets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {WORKSHEETS_DATA.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Canva-style colorful top banner */}
                  <div className={`p-4 bg-gradient-to-r ${ws.previewColor} text-white flex items-center justify-between`}>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
                        {ws.grade} • {ws.targetWeek}
                      </span>
                      <h4 className="text-sm font-black mt-1 line-clamp-1">{ws.title}</h4>
                    </div>
                    <span className="text-[11px] font-bold bg-white text-slate-900 px-2.5 py-1 rounded-lg shrink-0 shadow-xs">
                      {ws.questionCount} bài tập
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ws.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      <span>Độ khó: <strong className="text-slate-800">{ws.difficulty}</strong></span>
                      <span>•</span>
                      <span>Chuyên đề: <strong className="text-slate-800">{ws.chapterTitle}</strong></span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedWorksheetId(ws.id);
                        setShowSolutions(false);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Xem trước phiếu</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedWorksheetId(ws.id);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In / Tải về (PDF)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Canva Worksheet Preview Modal / Printable View */}
      {selectedWorksheetId && activeWorksheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-sm text-slate-900 truncate max-w-md">
                  {activeWorksheet.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSolutions(!showSolutions)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  {showSolutions ? "Ẩn đáp án" : "Hiện đáp án gợi ý"}
                </button>
                <button
                  onClick={handlePrintWorksheet}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In ngay</span>
                </button>
                <button
                  onClick={() => setSelectedWorksheetId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Printable Canva-style paper sheet */}
            <div id="printable-worksheet" className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white print:p-0">
              {/* Canva top header */}
              <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black font-heading tracking-tight text-blue-900 uppercase">
                    YÊU TOÁN 6.vn • PHIẾU HỌC TẬP TỰ LUYỆN
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeWorksheet.grade} — {activeWorksheet.targetWeek} • Chuyên đề: {activeWorksheet.chapterTitle}
                  </p>
                </div>
                <div className="text-right text-xs space-y-1 font-mono">
                  <div>Họ và tên: .......................................</div>
                  <div>Lớp: ................. Ngày: ....................</div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-6">
                {activeWorksheet.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="font-bold text-xs sm:text-sm text-blue-900 uppercase tracking-wide bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-200/60">
                      {section.title}
                    </div>
                    {section.description && (
                      <p className="text-xs text-slate-600 italic px-1">{section.description}</p>
                    )}

                    <div className="space-y-4 pt-1">
                      {section.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="space-y-2">
                          <div className="text-xs sm:text-sm font-semibold flex items-start gap-2">
                            <span className="text-blue-700 font-bold">{task.number}</span>
                            <span>{task.prompt}</span>
                          </div>
                          {/* Dotted lines or blank box for student handwriting */}
                          <div className={`w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 ${task.spaceHeight || 'h-16'} p-2 text-xs text-slate-400 italic font-mono`}>
                            [Ô làm bài của học sinh]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Optional Solution Key display */}
              {showSolutions && (
                <div className="mt-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider">
                    Hướng dẫn giải & Đáp án vắn tắt:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {activeWorksheet.solutionGuide.map((sol, idx) => (
                      <li key={idx}>{sol}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Trang web học Toán trực quan: yeutoan6.vn</span>
                <span>Chúc em tự tin chinh phục điểm 9, 10 môn Toán 6! 🌟</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
