import React, { useState } from 'react';
import { 
  Play, 
  Gamepad2, 
  BrainCircuit, 
  FileText, 
  ArrowRight, 
  Flame, 
  Award, 
  Zap, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Layers, 
  TrendingUp,
  Clock,
  Compass,
  Hash,
  Shapes,
  PieChart
} from 'lucide-react';
import { ActiveTab, TopicChapter, UserStats } from '../types';

interface HomeHeroProps {
  topics: TopicChapter[];
  stats: UserStats;
  onNavigate: (tab: ActiveTab, topicId?: string) => void;
  onOpenMindmap: (topicId: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  topics,
  stats,
  onNavigate,
  onOpenMindmap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hash': return <Hash className="w-6 h-6" />;
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Shapes': return <Shapes className="w-6 h-6" />;
      case 'PieChart': return <PieChart className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Main Hero Banner with Blue & Orange Contrast */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl shadow-blue-900/20 p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative geometric shapes in background */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-400/15 blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 -top-20 w-64 h-64 rounded-full bg-blue-400/10 blur-xl pointer-events-none"></div>

        {/* Decorative badge */}
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/60 border border-blue-400/30 text-xs font-semibold text-amber-300 mb-4 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Nền tảng Toán 6 Chương trình GDPT Mới nhất</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-white">Hoàn toàn Miễn phí</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-white mb-4">
            Toán lớp 6 thật dễ hiểu & sinh động cùng{' '}
            <span className="text-amber-400 drop-shadow-xs">YÊU TOÁN 6.vn</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed mb-8 max-w-2xl font-normal">
            Không còn nỗi sợ số nguyên âm hay hình học trừu tượng! Khám phá kho video hoạt hình 
            3-5 phút, sơ đồ tư duy Mindmap, thử thách đấu trường toán học và gia sư AI 
            giải thích từng bước 24/7.
          </p>

          {/* Quick Search in Hero */}
          <div className="relative max-w-xl mb-8">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm nhanh bài học: Dấu ngoặc số nguyên, BCNN, Diện tích hình thoi..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-slate-800 text-sm font-medium shadow-md border-0 focus:outline-hidden focus:ring-3 focus:ring-amber-400 placeholder:text-slate-400"
            />
            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  onNavigate('curriculum');
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
            >
              Tìm kiếm
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-start-learning-btn"
              onClick={() => onNavigate('curriculum', topics[0]?.id)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Bắt đầu học ngay (Miễn phí)</span>
            </button>

            <button
              id="hero-play-games-btn"
              onClick={() => onNavigate('games')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Góc Trò chơi Toán vui</span>
            </button>

            <button
              id="hero-ask-ai-btn"
              onClick={() => onNavigate('ai_tutor')}
              className="px-5 py-3.5 rounded-2xl bg-indigo-600/70 hover:bg-indigo-600 text-white font-bold text-sm sm:text-base border border-indigo-400/40 backdrop-blur-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <BrainCircuit className="w-4 h-4 text-amber-300" />
              <span>Hỏi Thầy Cú AI 24/7</span>
            </button>
          </div>
        </div>

        {/* Right side interactive card on larger screens */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                🦉
              </div>
              <div>
                <p className="text-xs font-bold text-white">Thầy Cú Thông Thái</p>
                <p className="text-[10px] text-amber-300">Gia sư AI 24/7</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-400/30">
              Đang trực
            </span>
          </div>

          <div className="bg-white/15 rounded-xl p-3 mb-3 text-xs text-blue-50 leading-relaxed">
            "Em đang gặp bài toán khó về số nguyên âm hay diện tích hình thoi? Thầy luôn ở đây giải thích từng bước nhé!"
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-blue-100">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Chuỗi học tập:
              </span>
              <span className="font-bold text-white">{stats.streakDays} ngày liên tục</span>
            </div>
            <div className="flex items-center justify-between text-blue-100">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-300" /> Điểm kinh nghiệm:
              </span>
              <span className="font-bold text-amber-300">{stats.xp} XP</span>
            </div>
            <div className="flex items-center justify-between text-blue-100">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" /> Cấp bậc:
              </span>
              <span className="font-bold text-white">Cấp {stats.level} (Học sinh Giỏi)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Strip: Streak, XP and Achievements overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-800">
              {stats.streakDays} Ngày
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Chuỗi học tập liên tục</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
            <Zap className="w-6 h-6 fill-blue-500 text-blue-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-800">
              {stats.xp} XP
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Điểm thưởng tích lũy</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-800">
              {stats.accuracyRate}%
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Tỷ lệ chính xác bài tập</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200/60">
            <Award className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-800">
              Cấp {stats.level}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Huy hiệu Thần đồng Toán</div>
          </div>
        </div>
      </section>

      {/* Lối tắt 4 Chuyên đề Trọng tâm theo Chương trình mới */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Layers className="w-4 h-4" />
              <span>Chương trình Giáo dục Phổ thông mới</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              4 Chuyên đề Trọng tâm Lớp 6
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Bài giảng video trực quan, ví dụ từng bước và sơ đồ tư duy tóm tắt cho từng chuyên đề
            </p>
          </div>

          <button
            onClick={() => onNavigate('curriculum')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
          >
            <span>Xem toàn bộ bài giảng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${topic.color.bg} ${topic.color.primary} flex items-center justify-center font-bold border ${topic.color.border} group-hover:scale-110 transition-transform`}>
                      {getTopicIcon(topic.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                        Chuyên đề 0{index + 1} • {topic.code}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {topic.title}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${topic.color.badge}`}>
                    {topic.lessonsCount} bài học
                  </span>
                </div>

                <p className="text-xs font-medium text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg inline-block mb-3 border border-amber-200/50">
                  {topic.subtitle}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {topic.description}
                </p>

                {/* Video highlight teaser */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    <span className="font-medium truncate max-w-[220px] sm:max-w-xs">
                      {topic.videoLesson.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    {topic.videoLesson.duration}
                  </span>
                </div>
              </div>

              {/* Action buttons inside card */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenMindmap(topic.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sơ đồ Mindmap</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('practice', topic.id)}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors border border-amber-200/60"
                  >
                    Luyện tập ({topic.exercisesCount} câu)
                  </button>

                  <button
                    onClick={() => onNavigate('curriculum', topic.id)}
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Vào học</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Feature Columns Banner: Video, Trắc nghiệm, Game, AI */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Học tập đa giác quan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1 text-white">
            Bộ công cụ học Toán 6 chuẩn hiện đại
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Kết hợp hoàn hảo giữa lý thuyết trực quan, thực hành trắc nghiệm và gamification hứng thú
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('curriculum')}
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center mb-3">
              <Play className="w-5 h-5 fill-blue-300" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Video Trực quan 3-5 phút</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hoạt hình hóa các khái niệm trừu tượng: trục số âm dương, cắt ghép hình phẳng, phân số pizza.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('practice')}
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Trắc nghiệm 3 Cấp độ</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Phân cấp: Nhận biết, Thông hiểu và Vận dụng. Chấm điểm tức thì, lời giải chi tiết và phiếu Canva in ra.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('games')}
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center mb-3">
              <Gamepad2 className="w-5 h-5 text-emerald-300" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Mê cung & Đấu trường 1v1</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vượt mê cung toán giải đố, thi đấu đối kháng tốc độ tính nhẩm, tích lũy XP thăng cấp huy hiệu.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('ai_tutor')}
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/30 text-purple-300 flex items-center justify-center mb-3">
              <BrainCircuit className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Trợ lý Gia sư AI 24/7</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thầy Cú thông thái hướng dẫn phương pháp giải từng bước gợi mở tư duy, không đưa đáp án cụt lủn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
