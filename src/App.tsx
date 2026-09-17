import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { CurriculumView } from './components/CurriculumView';
import { PracticeView } from './components/PracticeView';
import { GamesView } from './components/GamesView';
import { AITutorView } from './components/AITutorView';
import { ParentDashboardView } from './components/ParentDashboardView';
import { MindmapModal } from './components/MindmapModal';
import { ActiveTab, UserStats, Badge, TopicChapter } from './types';
import { TOPIC_CHAPTERS } from './data/curriculumData';
import { BADGES_DATA } from './data/badgesData';
import { 
  Heart, 
  GraduationCap, 
  ShieldCheck, 
  Phone, 
  Mail, 
  BookOpen,
  Sparkles,
  Flame,
  Zap,
  Award
} from 'lucide-react';

// Simple Web Audio API sound generator for educational feedback
function playSound(type: 'success' | 'click' | 'levelup') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'levelup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

const LOCAL_STORAGE_KEY_STATS = 'yeutoan6_stats_v1';
const LOCAL_STORAGE_KEY_BADGES = 'yeutoan6_badges_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('so-tu-nhien');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mindmapTopic, setMindmapTopic] = useState<TopicChapter | null>(null);

  // User Stats state with LocalStorage persistence
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      xp: 340,
      streakDays: 7,
      level: 3,
      completedLessons: ['CH-01-L1', 'CH-01-L2', 'CH-02-L1'],
      completedQuizzesCount: 14,
      totalTimeMinutes: 185,
      accuracyRate: 88,
      arenaHighScore: 190,
      mazeCompletedCount: 2,
      topicProgress: {
        'so-tu-nhien': { completed: 8, total: 8, accuracy: 92 },
        'so-nguyen': { completed: 6, total: 7, accuracy: 84 },
        'hinh-hoc-truc-quan': { completed: 4, total: 6, accuracy: 75 },
        'phan-so-thong-ke': { completed: 3, total: 7, accuracy: 68 },
      },
    };
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BADGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return BADGES_DATA;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BADGES, JSON.stringify(badges));
  }, [badges]);

  // XP addition handler
  const handleAddXP = (amount: number) => {
    if (soundEnabled) playSound('success');
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      if (newLevel > prev.level && soundEnabled) {
        playSound('levelup');
      }
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  // Badge unlock handler
  const handleUnlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, unlocked: true, unlockedAt: 'Vừa đạt được' } : b))
    );
  };

  // Record quiz result
  const handleRecordQuizResult = (topicId: string, correct: number, total: number) => {
    setStats(prev => {
      const existing = prev.topicProgress[topicId] || { completed: 0, total, accuracy: 80 };
      const newAcc = Math.round(((existing.accuracy + Math.round((correct / total) * 100)) / 2));
      return {
        ...prev,
        completedQuizzesCount: prev.completedQuizzesCount + 1,
        totalTimeMinutes: prev.totalTimeMinutes + 12,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            ...existing,
            accuracy: newAcc,
            completed: Math.min(existing.total, existing.completed + 1),
          },
        },
      };
    });
  };

  const handleNavigate = (tab: ActiveTab, topicId?: string) => {
    if (soundEnabled) playSound('click');
    if (topicId) setSelectedTopicId(topicId);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMindmap = (topicId: string) => {
    const t = TOPIC_CHAPTERS.find(item => item.id === topicId) || TOPIC_CHAPTERS[0];
    setMindmapTopic(t);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-amber-300 selection:text-amber-950 font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (soundEnabled) playSound('click');
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        stats={stats}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onSearchSelect={(topicId) => {
          setSelectedTopicId(topicId);
          setActiveTab('curriculum');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeHero
            topics={TOPIC_CHAPTERS}
            stats={stats}
            onNavigate={handleNavigate}
            onOpenMindmap={handleOpenMindmap}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            topics={TOPIC_CHAPTERS}
            initialTopicId={selectedTopicId}
            onNavigatePractice={(topicId) => handleNavigate('practice', topicId)}
            onOpenAITutorWithTopic={(topicTitle) => {
              setSelectedTopicId(topicTitle);
              setActiveTab('ai_tutor');
            }}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            topics={TOPIC_CHAPTERS}
            initialTopicId={selectedTopicId}
            onAddXP={handleAddXP}
            onRecordQuizResult={handleRecordQuizResult}
          />
        )}

        {activeTab === 'games' && (
          <GamesView
            badges={badges}
            streakDays={stats.streakDays}
            xp={stats.xp}
            onAddXP={handleAddXP}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'ai_tutor' && (
          <AITutorView
            initialTopicContext={TOPIC_CHAPTERS.find(t => t.id === selectedTopicId)?.title}
            onAddXP={handleAddXP}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'parent_dashboard' && (
          <ParentDashboardView
            stats={stats}
            topics={TOPIC_CHAPTERS}
            onNavigateToTopic={(topicId) => handleNavigate('curriculum', topicId)}
          />
        )}
      </main>

      {/* Mindmap Modal */}
      {mindmapTopic && (
        <MindmapModal
          topic={mindmapTopic}
          onClose={() => setMindmapTopic(null)}
          onOpenTopic={(topicId) => {
            setSelectedTopicId(topicId);
            setActiveTab('curriculum');
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-heading font-black text-amber-300 text-base">
                  6
                </div>
                <span className="font-heading font-black text-lg text-white">
                  YÊU TOÁN <span className="text-amber-400">6</span>.vn
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nền tảng trực tuyến hỗ trợ học sinh lớp 6 nắm chắc bản chất toán học thông qua hình ảnh trực quan, sơ đồ tư duy, bài tập tương tác và trợ lý AI 24/7.
              </p>
              <div className="flex items-center gap-3 pt-1 text-slate-300">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> Vui học mỗi ngày
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-blue-400">
                  <Zap className="w-3.5 h-3.5 fill-blue-400" /> Tích lũy XP
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Chuyên đề trọng tâm
              </h4>
              <ul className="space-y-2">
                {TOPIC_CHAPTERS.map(t => (
                  <li key={t.id}>
                    <button
                      onClick={() => handleNavigate('curriculum', t.id)}
                      className="hover:text-amber-300 transition-colors text-left"
                    >
                      {t.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Công cụ hỗ trợ
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('curriculum')} className="hover:text-amber-300">
                    Video Hoạt hình Trực quan (3-5 phút)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('practice')} className="hover:text-amber-300">
                    Phiếu bài tập Canva (Tải/In PDF)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('games')} className="hover:text-amber-300">
                    Mê cung Toán học & Đấu trường 1v1
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('ai_tutor')} className="hover:text-amber-300">
                    Thầy Cú Thông Thái (Gia sư AI 24/7)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('parent_dashboard')} className="hover:text-amber-300">
                    Báo cáo học tập Phụ huynh & Giáo viên
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Thông tin & Đồng hành
              </h4>
              <p className="text-xs text-slate-400">
                Chương trình bám sát Bộ Giáo dục và Đào tạo (Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo).
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hotline: 1900 6868 (Miễn cước)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Email: hotro@yeutoan6.vn</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <div>
              © 2026 YÊU TOÁN 6.vn • Nền tảng học Toán trực quan và Gamification dành cho học sinh THCS.
            </div>
            <div className="flex items-center gap-4">
              <span>Điều khoản sử dụng</span>
              <span>Chính sách bảo mật</span>
              <span>Dành cho trường học</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
