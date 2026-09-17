import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  Calendar, 
  Download, 
  FileCheck,
  ShieldCheck,
  Zap,
  Flame,
  PieChart,
  BarChart3
} from 'lucide-react';
import { TopicChapter, UserStats } from '../types';

interface ParentDashboardProps {
  stats: UserStats;
  topics: TopicChapter[];
  onNavigateToTopic: (topicId: string) => void;
}

export const ParentDashboardView: React.FC<ParentDashboardProps> = ({
  stats,
  topics,
  onNavigateToTopic,
}) => {
  const [activeRole, setActiveRole] = useState<'parent' | 'teacher'>('parent');
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Topic progress records
  const topicProgressList = [
    {
      id: 'so-tu-nhien',
      name: 'Số tự nhiên & Lũy thừa',
      completed: 8,
      total: 8,
      accuracy: 92,
      status: 'Xuất sắc',
      color: 'bg-blue-600',
    },
    {
      id: 'so-nguyen',
      name: 'Số nguyên & Phép tính Z',
      completed: 6,
      total: 7,
      accuracy: 84,
      status: 'Tốt',
      color: 'bg-amber-500',
    },
    {
      id: 'hinh-hoc-truc-quan',
      name: 'Hình học trực quan & Đối xứng',
      completed: 4,
      total: 6,
      accuracy: 75,
      status: 'Cần ôn thêm',
      color: 'bg-emerald-600',
    },
    {
      id: 'phan-so-thong-ke',
      name: 'Phân số & Xác suất thực nghiệm',
      completed: 3,
      total: 7,
      accuracy: 68,
      status: 'Đang học',
      color: 'bg-indigo-600',
    },
  ];

  const fetchAIAdvice = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch('/api/ai-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            timeHours: (stats.totalTimeMinutes / 60).toFixed(1),
            accuracy: stats.accuracyRate,
            streakDays: stats.streakDays,
            xp: stats.xp,
          },
          weakTopics: ['Hình học: Công thức diện tích hình thoi & hình thang', 'Quy tắc dấu ngoặc khi trừ số nguyên'],
        }),
      });
      const data = await response.json();
      setAiRecommendation(data.recommendation);
    } catch (e) {
      setAiRecommendation(`Lời khuyên từ Thầy Cú AI:
1. 💡 Khen ngợi: Con nắm rất chắc phần Số tự nhiên và các dấu hiệu chia hết (tỷ lệ đúng 92%).
2. 🎯 Trọng tâm ôn tập tuần này: Con hay nhầm lẫn đổi dấu khi phá ngoặc có dấu trừ đằng trước. Ba mẹ hãy cho con xem lại video hoạt hình Trục số (3 phút) và làm 5 câu trắc nghiệm mức Thông hiểu.
3. ⏱️ Thời gian học lý tưởng: 25 phút mỗi ngày, tránh để dồn bài vào cuối tuần để giữ vững chuỗi ngọn lửa Streak.`);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchAIAdvice();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Parent / Teacher Role Toggle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cổng Thông Tin Giám Sát & Đồng Hành Học Tập</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              Bảng Tiến Độ Phụ Huynh & Giáo Viên
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Theo dõi chi tiết thời gian học, mức độ hiểu bài và nhận chẩn đoán lộ trình cá nhân hóa từ AI
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveRole('parent')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'parent'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Góc Phụ Huynh 👨‍👩‍👦
            </button>
            <button
              onClick={() => setActiveRole('teacher')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'teacher'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chế Độ Giáo Viên 👩‍🏫
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Tổng thời gian học</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black font-heading text-slate-900 font-mono">
              {(stats.totalTimeMinutes / 60).toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">giờ</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              +45 phút so với tuần trước
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Bài tập hoàn thành</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-heading text-slate-900 font-mono">
              21/28 <span className="text-sm font-sans font-normal text-slate-500">bài</span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              Đạt 75% tiến độ học kỳ
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Tỷ lệ chính xác</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black font-heading text-slate-900 font-mono">
              {stats.accuracyRate}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Mức độ: Học sinh Khá Giỏi
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Chuỗi chăm chỉ</span>
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
            <div className="text-2xl font-black font-heading text-slate-900 font-mono">
              {stats.streakDays} <span className="text-sm font-sans font-normal text-slate-500">ngày</span>
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              Không bỏ lỡ buổi học nào
            </div>
          </div>
        </div>

        {/* AI Personalized Recommendation Box */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                🦉
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Chẩn Đoán Năng Lực & Gợi Ý Lộ Trình Cá Nhân Hóa (AI Eduten)
                </h4>
                <p className="text-[10px] text-indigo-300">
                  Dựa trên phân tích tự động lịch sử làm bài và thời gian giải toán của con
                </p>
              </div>
            </div>

            <button
              onClick={fetchAIAdvice}
              disabled={loadingAI}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 transition-colors"
            >
              {loadingAI ? "Đang phân tích..." : "Cập nhật chẩn đoán 🔄"}
            </button>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs sm:text-sm leading-relaxed text-blue-50 whitespace-pre-line border border-white/10 font-sans">
            {aiRecommendation || "Đang tải lời khuyên thông minh từ gia sư AI..."}
          </div>
        </div>

        {/* Progress Breakdown by 4 Chapters */}
        <div className="mt-8 space-y-4">
          <h4 className="text-base font-black text-slate-900">
            Tiến độ Chi tiết 4 Chuyên đề Trọng tâm
          </h4>

          <div className="space-y-3">
            {topicProgressList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      {item.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.accuracy >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      item.accuracy >= 75 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Đã học {item.completed}/{item.total} bài học
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Độ chính xác</span>
                    <span className="font-bold text-slate-800">{item.accuracy}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action shortcut */}
                <div className="shrink-0 flex justify-end">
                  <button
                    onClick={() => onNavigateToTopic(item.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-600 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <span>Cùng con ôn tập</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Specific Tools */}
        {activeRole === 'teacher' && (
          <div className="mt-8 p-6 rounded-2xl bg-blue-50 border border-blue-200 space-y-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Công cụ Dành Riêng cho Thầy Cô Giáo</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Thầy cô có thể tải trọn bộ đề thi học kỳ, phiếu bài tập Canva đã căn chỉnh sẵn lề A4, hoặc xuất báo cáo phổ điểm của cả lớp 6.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Xuất Báo Cáo Học Tập (PDF)</span>
              </button>
              <button
                onClick={() => alert("Đã chuẩn bị ngân hàng 100 câu hỏi trắc nghiệm Toán 6 bám sát ma trận đề thi GDPT!")}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs border border-blue-300 transition-colors"
              >
                Tải Ngân Hàng Đề Thi 100 Câu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
