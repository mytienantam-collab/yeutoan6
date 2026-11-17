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
  BarChart3,
  Search,
  Filter,
  UserPlus,
  Eye,
  Trash2,
  Check,
  Printer,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { TopicChapter, UserStats, StudentProfile, StudentQuizRecord } from '../types';

interface ParentDashboardProps {
  stats: UserStats;
  topics: TopicChapter[];
  onNavigateToTopic: (topicId: string) => void;
  savedStudents: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenStudentModal: () => void;
}

export const ParentDashboardView: React.FC<ParentDashboardProps> = ({
  stats,
  topics,
  onNavigateToTopic,
  savedStudents,
  activeStudentId,
  onSelectStudent,
  onDeleteStudent,
  onOpenStudentModal,
}) => {
  const [activeRole, setActiveRole] = useState<'parent' | 'teacher'>('parent');
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Search & Filter for Students Table
  const [searchStudentTerm, setSearchStudentTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [viewingStudentDetail, setViewingStudentDetail] = useState<StudentProfile | null>(null);

  // Available classes in saved students
  const availableClasses = Array.from(
    new Set(savedStudents.map((s) => s.className.toUpperCase()))
  ).filter(Boolean);

  const filteredStudents = savedStudents.filter((st) => {
    const matchesSearch = st.fullName.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
                          st.className.toLowerCase().includes(searchStudentTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || st.className.toUpperCase() === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const activeStudentObj = savedStudents.find(s => s.id === activeStudentId) || savedStudents[0];

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
          studentName: activeStudentObj ? activeStudentObj.fullName : 'Học sinh',
          className: activeStudentObj ? activeStudentObj.className : '6A',
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
  }, [activeStudentId]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (savedStudents.length === 0) return;
    const header = [
      'STT',
      'Họ và tên',
      'Lớp',
      'Điểm XP',
      'Cấp độ',
      'Chuỗi ngày (Streak)',
      'Độ chính xác (%)',
      'Số bài trắc nghiệm đã làm',
      'Xếp loại',
      'Lần học gần nhất'
    ];

    const rows = savedStudents.map((st, idx) => {
      let rank = 'Khá';
      if (st.stats.accuracyRate >= 90) rank = 'Xuất sắc';
      else if (st.stats.accuracyRate >= 80) rank = 'Giỏi';
      else if (st.stats.accuracyRate < 65) rank = 'Cần cố gắng';

      return [
        idx + 1,
        `"${st.fullName}"`,
        `"${st.className}"`,
        st.stats.xp,
        st.stats.level,
        st.stats.streakDays,
        `${st.stats.accuracyRate}%`,
        st.quizHistory ? st.quizHistory.length : st.stats.completedQuizzesCount,
        `"${rank}"`,
        `"${st.lastActiveAt || st.createdAt || ''}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Tong_Hop_Ket_Qua_Toan_6_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadge = (accuracy: number) => {
    if (accuracy >= 90) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Xuất sắc</span>;
    }
    if (accuracy >= 80) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">Giỏi</span>;
    }
    if (accuracy >= 65) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Khá</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Cần cố gắng</span>;
  };

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
              Đang theo dõi học sinh: <strong className="text-blue-900">{activeStudentObj?.fullName || 'Học sinh'}</strong> (Lớp <strong className="text-blue-900">{activeStudentObj?.className || '6A'}</strong>) • Tự động lưu bảng tổng hợp điểm trên thiết bị
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
              {stats.completedQuizzesCount} <span className="text-sm font-sans font-normal text-slate-500">bài</span>
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
              Mức độ: {stats.accuracyRate >= 80 ? 'Học sinh Khá Giỏi' : 'Đang tiến bộ'}
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

        {/* ========================================================================= */}
        {/* BẢNG TỔNG HỢP KẾT QUẢ TỪNG HỌC SINH (LƯU TRỮ TRONG LOCALSTORAGE) */}
        {/* ========================================================================= */}
        <div id="roster-table-section" className="mt-10 pt-8 border-t border-slate-200 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900">
                  Bảng Tổng Hợp Kết Quả Học Sinh (Lưu Trữ Tự Động)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Lưu trên thiết bị (LocalStorage): Điểm thi, chuỗi Streak và lịch sử làm bài trắc nghiệm của từng học sinh
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenStudentModal}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Thêm học sinh</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Tải bảng điểm Excel/CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Xuất Excel (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Bảng Điểm</span>
              </button>
            </div>
          </div>

          {/* Search and Class Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchStudentTerm}
                onChange={(e) => setSearchStudentTerm(e.target.value)}
                placeholder="Tìm kiếm họ tên học sinh..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
              <span className="text-[11px] text-slate-400 shrink-0 uppercase tracking-wider">Lớp:</span>
              <button
                onClick={() => setSelectedClassFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedClassFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Tất cả ({savedStudents.length})
              </button>
              {availableClasses.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedClassFilter === cls
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">STT</th>
                  <th className="py-3 px-4">Họ và tên học sinh</th>
                  <th className="py-3 px-3">Lớp</th>
                  <th className="py-3 px-3 text-center">Cấp độ & XP</th>
                  <th className="py-3 px-3 text-center">Chuỗi Streak</th>
                  <th className="py-3 px-3 text-center">Độ chính xác</th>
                  <th className="py-3 px-3 text-center">Số bài Quiz</th>
                  <th className="py-3 px-3 text-center">Xếp loại</th>
                  <th className="py-3 px-3">Lần học gần nhất</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st, idx) => {
                    const isSelected = st.id === activeStudentId;
                    const quizCount = st.quizHistory ? st.quizHistory.length : st.stats.completedQuizzesCount;

                    return (
                      <tr 
                        key={st.id} 
                        className={`hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-blue-50/50 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center text-slate-400 font-mono font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              {st.avatar}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {st.fullName}
                              </span>
                              {isSelected && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                                  <Check className="w-2.5 h-2.5" /> Đang học trên máy
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 font-bold text-blue-800 text-[11px]">
                            {st.className}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          <span className="font-black text-amber-600 block">{st.stats.xp} XP</span>
                          <span className="text-[10px] text-slate-400">Cấp {st.stats.level}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-rose-600 font-mono">
                            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            {st.stats.streakDays} ngày
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {st.stats.accuracyRate}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                          {quizCount} bài
                        </td>
                        <td className="py-3 px-3 text-center">
                          {getRankBadge(st.stats.accuracyRate)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {st.lastActiveAt || st.createdAt || 'Hôm nay'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {!isSelected ? (
                              <button
                                onClick={() => onSelectStudent(st.id)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
                                title="Chuyển sang học sinh này"
                              >
                                Chọn học
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                                Hiện tại
                              </span>
                            )}

                            <button
                              onClick={() => setViewingStudentDetail(st)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Xem chi tiết lịch sử làm bài"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {savedStudents.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn xóa hồ sơ của học sinh "${st.fullName}" khỏi máy này?`)) {
                                    onDeleteStudent(st.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                                title="Xóa học sinh này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Không tìm thấy học sinh nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  Phân tích tự động lịch sử làm bài và năng lực của: {activeStudentObj?.fullName || 'học sinh'} (Lớp {activeStudentObj?.className || '6A'})
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

      {/* MODAL XEM CHI TIẾT LỊCH SỬ BÀI THI CỦA HỌC SINH */}
      {viewingStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-3xl w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  {viewingStudentDetail.avatar}
                </span>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {viewingStudentDetail.fullName} • Lớp {viewingStudentDetail.className}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lịch sử làm bài trắc nghiệm & điểm thi chi tiết
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingStudentDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick stats banner */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Tổng điểm tích lũy</span>
                  <span className="text-xl font-black text-amber-600 font-mono">
                    {viewingStudentDetail.stats.xp} XP
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Tỷ lệ chính xác TB</span>
                  <span className="text-xl font-black text-blue-600 font-mono">
                    {viewingStudentDetail.stats.accuracyRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Chuỗi chăm chỉ</span>
                  <span className="text-xl font-black text-rose-500 font-mono">
                    {viewingStudentDetail.stats.streakDays} ngày 🔥
                  </span>
                </div>
              </div>

              {/* Quiz list */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Các bài trắc nghiệm đã hoàn thành:
                </h4>

                {viewingStudentDetail.quizHistory && viewingStudentDetail.quizHistory.length > 0 ? (
                  <div className="space-y-2.5">
                    {viewingStudentDetail.quizHistory.map((qRec, qIdx) => (
                      <div
                        key={qRec.id || qIdx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {qRec.topicTitle}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              qRec.accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' :
                              qRec.accuracy >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {qRec.accuracy}%
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            Thời gian: {qRec.date}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-black font-mono text-emerald-600">
                            {qRec.correct}/{qRec.total} câu
                          </div>
                          <div className="text-xs font-bold font-mono text-amber-500">
                            +{qRec.xpEarned} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                    <p>Học sinh này chưa có lịch sử làm bài trắc nghiệm chi tiết.</p>
                    <p className="text-[11px] text-blue-600 font-semibold">
                      Hãy chuyển sang học sinh này và làm bài tại tab "Luyện thi & Bài tập" để lưu kết quả nhé!
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingStudentDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
