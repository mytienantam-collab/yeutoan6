export type ActiveTab = 
  | 'home' 
  | 'curriculum' 
  | 'games' 
  | 'practice' 
  | 'ai_tutor' 
  | 'parent_dashboard';

export type DifficultyLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export interface ExerciseQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  level: DifficultyLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  points: number;
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  conceptSummary: string;
  videoType: 'number_line' | 'fraction_visualizer' | 'shape_geometry' | 'statistics_charts';
  animationDetails: {
    badge: string;
    description: string;
    keyPoints: string[];
    interactivePrompt: string;
  };
}

export interface MindmapNode {
  id: string;
  title: string;
  summary: string;
  formulas: string[];
  tips: string;
  children?: {
    title: string;
    details: string;
    example?: string;
  }[];
}

export interface WorkedExample {
  id: string;
  title: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao' | 'Vận dụng';
  problem: string;
  method: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    result: string;
  }[];
  pitfall: string;
  proTip: string;
}

export interface TopicChapter {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  iconName: string;
  color: {
    primary: string;
    bg: string;
    border: string;
    badge: string;
  };
  description: string;
  lessonsCount: number;
  exercisesCount: number;
  videoLesson: VideoLesson;
  mindmap: MindmapNode;
  workedExamples: WorkedExample[];
  questions: ExerciseQuestion[];
}

export interface WorksheetItem {
  id: string;
  title: string;
  chapterCode: string;
  chapterTitle: string;
  targetWeek: string;
  grade: string;
  difficulty: string;
  summary: string;
  questionCount: number;
  previewColor: string;
  sections: {
    title: string;
    description?: string;
    tasks: {
      number: string;
      prompt: string;
      spaceHeight?: string;
    }[];
  }[];
  solutionGuide: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface UserStats {
  xp: number;
  streakDays: number;
  level: number;
  completedLessons: string[];
  completedQuizzesCount: number;
  totalTimeMinutes: number;
  accuracyRate: number;
  arenaHighScore: number;
  mazeCompletedCount: number;
  topicProgress: Record<string, {
    completed: number;
    total: number;
    accuracy: number;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topic?: string;
  isAudioPlaying?: boolean;
}
