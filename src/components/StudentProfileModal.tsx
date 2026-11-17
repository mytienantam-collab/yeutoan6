import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  X, 
  Check, 
  Users, 
  Award, 
  Flame, 
  ArrowRight,
  UserPlus,
  Clock
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudent: StudentProfile | null;
  savedStudents: StudentProfile[];
  onSelectStudent: (studentId: string) => void;
  onCreateStudent: (fullName: string, className: string, avatar: string) => void;
}

const AVATAR_OPTIONS = [
  { emoji: '🦉', label: 'Cú Thông Thái' },
  { emoji: '🚀', label: 'Phi Hành Gia' },
  { emoji: '🐰', label: 'Thỏ Siêu Tốc' },
  { emoji: '🦁', label: 'Sư Tử Dũng Mãnh' },
  { emoji: '🦊', label: 'Cáo Nhanh Trí' },
  { emoji: '🐱', label: 'Mèo Chăm Chỉ' },
  { emoji: '🐬', label: 'Cá Heo Vui Vẻ' },
  { emoji: '🦄', label: 'Kỳ Lân Toán Học' },
];

const POPULAR_CLASSES = ['6A1', '6A2', '6A3', '6A4', '6B', '6C', '6D', '6E'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  activeStudent,
  savedStudents,
  onSelectStudent,
  onCreateStudent,
}) => {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('6A1');
  const [selectedAvatar, setSelectedAvatar] = useState('🦉');
  const [showNewForm, setShowNewForm] = useState(savedStudents.length === 0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của em nhé!');
      return;
    }
    if (!className.trim()) {
      setErrorMsg('Vui lòng nhập tên lớp của em (ví dụ: 6A1, 6B)!');
      return;
    }

    setErrorMsg('');
    onCreateStudent(fullName.trim(), className.trim(), selectedAvatar);
    setFullName('');
    onClose();
  };

  const handleChooseExisting = (id: string) => {
    onSelectStudent(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200/80 my-8">
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white relative">
          {activeStudent && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-md shadow-amber-500/20">
              {activeStudent ? activeStudent.avatar : '🦉'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1 text-amber-300">
                Chào mừng em đến với YÊU TOÁN 6.vn
              </span>
              <h3 className="text-xl font-black font-heading tracking-tight">
                {activeStudent ? 'Hồ Sơ Học Sinh Lớp 6' : 'Nhập Tên & Lớp Để Bắt Đầu'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-2 leading-relaxed">
            Họ tên và lớp sẽ hiển thị ở góc phải trên cùng và kết quả mỗi bài luyện tập, bài thi sẽ được lưu tự động vào bảng điểm cá nhân của em.
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* If there are existing saved students on this device */}
          {savedStudents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Học sinh đã lưu trên máy ({savedStudents.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewForm(!showNewForm)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {showNewForm ? 'Thu gọn tạo mới' : '+ Tạo học sinh mới'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {savedStudents.map((st) => {
                  const isActive = activeStudent?.id === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => handleChooseExisting(st.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-100 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                          {st.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {st.fullName}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              Lớp {st.className}
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Đang chọn
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2.5 mt-0.5">
                            <span className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Award className="w-3 h-3 inline" /> {st.stats.xp} XP (Cấp {st.stats.level})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-rose-500 inline fill-rose-500" /> Chuỗi {st.stats.streakDays} ngày
                            </span>
                            <span>•</span>
                            <span>Đúng {st.stats.accuracyRate}%</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors shrink-0 shadow-2xs"
                      >
                        {isActive ? 'Đang học' : 'Chọn học'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New Student Registration Form */}
          {(showNewForm || savedStudents.length === 0) && (
            <form onSubmit={handleSubmit} className="space-y-5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h4 className="font-bold text-sm text-slate-900">
                  {savedStudents.length === 0 ? 'Thông tin học sinh mới' : 'Đăng ký thêm học sinh mới'}
                </h4>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Minh Khang, Trần Mai Anh..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    autoFocus={savedStudents.length === 0}
                  />
                </div>
              </div>

              {/* Class Name Input & Quick Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Lớp <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Chọn nhanh hoặc gõ trực tiếp</span>
                </div>

                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: 6A1, 6A2, 6B..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all font-medium uppercase"
                  />
                </div>

                {/* Quick Class Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_CLASSES.map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => setClassName(cls)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        className.toUpperCase() === cls
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Chọn linh vật đồng hành cùng em:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = selectedAvatar === av.emoji;
                    return (
                      <button
                        type="button"
                        key={av.emoji}
                        onClick={() => setSelectedAvatar(av.emoji)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span className="text-2xl">{av.emoji}</span>
                        <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                          {av.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>Bắt đầu học ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
