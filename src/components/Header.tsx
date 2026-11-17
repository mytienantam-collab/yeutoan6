import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  Zap, 
  Award, 
  Menu, 
  X, 
  GraduationCap, 
  Gamepad2, 
  BrainCircuit, 
  FileText, 
  Users, 
  Home,
  Volume2,
  VolumeX,
  Search,
  User,
  ChevronDown,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { ActiveTab, UserStats, StudentProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onSearchSelect?: (topicId: string) => void;
  activeStudent: StudentProfile | null;
  onOpenStudentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  soundEnabled,
  setSoundEnabled,
  onSearchSelect,
  activeStudent,
  onOpenStudentModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = [
    { label: 'Quy tắc dấu ngoặc số nguyên', topicId: 'so-nguyen' },
    { label: 'Bội chung nhỏ nhất (BCNN) & ƯCLN', topicId: 'so-tu-nhien' },
    { label: 'Diện tích hình thoi & hình bình hành', topicId: 'hinh-hoc-truc-quan' },
    { label: 'Cộng trừ phân số khác mẫu', topicId: 'phan-so-thong-ke' },
  ].filter(s => s.label.toLowerCase().includes(quickSearchQuery.toLowerCase()));

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-announcement for Grade 6 students */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-blue-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Mới 2026
            </span>
            <span className="hidden sm:inline">
              Chương trình chuẩn Toán 6 GDPT: Bài giảng video trực quan, Game toán & Gia sư AI 24/7!
            </span>
            <span className="sm:hidden font-medium">Toán 6 Trực quan & Gamification</span>
          </div>
          <div className="flex items-center gap-4 text-blue-100 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              Chuỗi {stats.streakDays} ngày
            </span>
            <span className="hidden md:inline text-blue-200">•</span>
            <span className="hidden md:flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              {stats.xp} XP (Cấp {stats.level})
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tighter font-heading text-amber-300">6</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-blue-900 font-heading">
                  YÊU TOÁN <span className="text-amber-500">6</span>
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300/60">
                  .vn
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Học trực quan • Vui tương tác
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block relative flex-1 max-w-xs xl:max-w-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="header-quick-search-input"
                type="text"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Tìm bài học: Số nguyên, Hình thoi, BCNN..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
            </div>
            {searchFocused && quickSearchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                  Bài học gợi ý:
                </p>
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => {
                        if (onSearchSelect) onSearchSelect(item.topicId);
                        setActiveTab('curriculum');
                        setQuickSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-blue-500 font-medium">Học ngay &rarr;</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-slate-500">
                    Không tìm thấy bài học phù hợp. Thử từ khóa khác nhé!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-tab-home"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'home'
                  ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/70'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/70'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>

            <button
              id="nav-tab-curriculum"
              onClick={() => handleNavClick('curriculum')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/70'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Chương trình học</span>
            </button>

            <button
              id="nav-tab-games"
              onClick={() => handleNavClick('games')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'games'
                  ? 'bg-amber-50 text-amber-700 shadow-xs border border-amber-200/80 font-bold'
                  : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50/50'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Góc trò chơi</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </button>

            <button
              id="nav-tab-practice"
              onClick={() => handleNavClick('practice')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'practice'
                  ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/70'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/70'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Luyện thi & Bài tập</span>
            </button>

            <button
              id="nav-tab-ai-tutor"
              onClick={() => handleNavClick('ai_tutor')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'ai_tutor'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200 font-bold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hỏi đáp AI</span>
              <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold">24/7</span>
            </button>

            <button
              id="nav-tab-parent"
              onClick={() => handleNavClick('parent_dashboard')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'parent_dashboard'
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Góc Phụ huynh</span>
            </button>
          </nav>

          {/* Right Action Tools: Sound, Streak and Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Student Pill & Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                id="header-user-badge"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 cursor-pointer hover:border-blue-400 hover:shadow-xs transition-all select-none"
                title="Bấm để xem thông tin học sinh hoặc đổi tài khoản"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  {activeStudent ? activeStudent.avatar : '🦉'}
                </div>
                <div className="text-left max-w-[120px] sm:max-w-[160px]">
                  <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                    {activeStudent ? activeStudent.fullName : 'Học sinh Lớp 6'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-blue-700 font-semibold leading-tight">
                    <span className="bg-blue-100/90 px-1 rounded text-blue-800">
                      Lớp {activeStudent ? activeStudent.className : '6A'}
                    </span>
                    <span className="text-amber-600 font-mono hidden sm:inline">
                      • {stats.xp} XP
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Student Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-2xs">
                      {activeStudent ? activeStudent.avatar : '🦉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {activeStudent ? activeStudent.fullName : 'Học sinh'}
                      </h4>
                      <p className="text-xs text-blue-700 font-bold">
                        Lớp {activeStudent ? activeStudent.className : '6A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-50 rounded-xl text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Tổng điểm</span>
                      <span className="font-black text-amber-600 font-mono text-sm">{stats.xp} XP</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Chuỗi học tập</span>
                      <span className="font-black text-rose-500 font-mono text-sm">{stats.streakDays} ngày 🔥</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenStudentModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-100 flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đổi học sinh / Đăng nhập bạn khác</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('parent_dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Xem Bảng tổng hợp kết quả</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {/* Mobile Student Profile Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{activeStudent ? activeStudent.avatar : '🦉'}</span>
              <div>
                <span className="text-xs font-black text-slate-900 block truncate">
                  {activeStudent ? activeStudent.fullName : 'Học sinh Lớp 6'}
                </span>
                <span className="text-[11px] font-bold text-blue-700">
                  Lớp {activeStudent ? activeStudent.className : '6A'} • {stats.xp} XP
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStudentModal();
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[11px] font-bold text-blue-700 shadow-2xs"
            >
              Đổi
            </button>
          </div>

          <div className="mb-2">
            <input
              type="text"
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài học Toán 6..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 border border-slate-200 focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            <Home className="w-4 h-4" /> Trang chủ
          </button>
          <button
            onClick={() => handleNavClick('curriculum')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'curriculum' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Chương trình học (Lý thuyết & Video)
          </button>
          <button
            onClick={() => handleNavClick('games')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'games' ? 'bg-amber-50 text-amber-700' : 'text-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-500" /> Góc trò chơi (Mê cung & Đấu trường)
          </button>
          <button
            onClick={() => handleNavClick('practice')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'practice' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" /> Luyện thi & Phiếu bài tập Canva
          </button>
          <button
            onClick={() => handleNavClick('ai_tutor')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'ai_tutor' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-indigo-600" /> Hỏi đáp AI 24/7 (Thầy Cú)
          </button>
          <button
            onClick={() => handleNavClick('parent_dashboard')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'parent_dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Góc Phụ huynh & Giáo viên
          </button>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Chuỗi: {stats.streakDays} ngày 🔥</span>
            <span>Tổng điểm: {stats.xp} XP ⚡</span>
          </div>
        </div>
      )}
    </header>
  );
};
