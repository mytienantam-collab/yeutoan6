import React, { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  CheckCircle2, 
  BookOpen,
  MessageSquareQuote
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AITutorViewProps {
  initialTopicContext?: string;
  onAddXP: (points: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialTopicContext,
  onAddXP,
  onUnlockBadge,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      role: 'assistant',
      content: `Chào em! Thầy là **Thầy Cú Thông Thái 🦉** - Gia sư Toán học AI 24/7 của em trên YÊU TOÁN 6.vn.\n\nEm đang gặp bài toán nào chưa hiểu cách làm? Dù là **phép tính số nguyên**, **tìm BCNN/ƯCLN**, **công thức diện tích hình phẳng** hay **bài toán chia quà thực tế**, em cứ gửi đề bài vào đây, thầy sẽ hướng dẫn em từng bước giải chi tiết nhé! ✨`,
      timestamp: 'Vừa xong',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    {
      label: 'Cách cộng 2 số nguyên khác dấu?',
      prompt: 'Thầy Cú ơi, hướng dẫn em cách cộng 2 số nguyên khác dấu với ví dụ trực quan dễ hiểu nhé!',
    },
    {
      label: 'Vì sao âm nhân âm lại bằng dương?',
      prompt: 'Thầy giải thích giúp em vì sao (-2) nhân (-3) lại bằng +6 theo cách trực quan thực tế ạ?',
    },
    {
      label: 'Mẹo tìm BCNN và ƯCLN siêu nhanh',
      prompt: 'Thầy cho em mẹo phân biệt và tìm nhanh BCNN với ƯCLN bằng thừa số nguyên tố với ạ!',
    },
    {
      label: 'Cách tính diện tích hình thoi',
      prompt: 'Công thức tính diện tích hình thoi là gì và vì sao lại có công thức đó ạ?',
    },
    {
      label: 'Tìm x: 2x - 5 = -13',
      prompt: 'Hướng dẫn em từng bước giải bài toán tìm x: 2x - 5 = -13 với ạ!',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          topic: initialTopicContext,
          history: messages.slice(-4).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Thầy đã hiểu câu hỏi. Em hãy thử xem lại đề bài hoặc gửi phương trình cụ thể nhé!";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      onAddXP(10);
      onUnlockBadge('badge-07');
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Chào em! Để làm bài này, em hãy nhớ 3 bước:\n1. Xác định điều kiện bài toán.\n2. Tách phép tính ưu tiên (ngoặc tròn -> vuông -> nhọn; lũy thừa -> nhân chia -> cộng trừ).\n3. Kiểm tra lại dấu của kết quả. Em gửi phương trình cụ thể để thầy phân tích nhé!`,
        timestamp: 'Vừa xong',
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-xs font-bold text-amber-300 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gia sư Thông minh Theo Chuẩn Eduten Quốc Tế</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Trợ Lý AI Thầy Cú Thông Thái 24/7
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Giải thích mọi thắc mắc Toán 6 với phương pháp sư phạm gợi mở, phân tích từng bước, không chỉ đưa mỗi đáp án cụt lủn.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-md">
            🦉
          </div>
          <div className="text-xs">
            <span className="font-bold text-white block">Thầy Cú AI</span>
            <span className="text-emerald-300 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Sẵn sàng giải đáp 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[640px]">
        {/* Chat Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base shrink-0 shadow-sm">
                    🦉
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isBot
                      ? 'bg-white border border-slate-200/80 text-slate-800'
                      : 'bg-blue-600 text-white rounded-tr-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
                    <span className={`font-bold text-[11px] ${isBot ? 'text-indigo-900' : 'text-blue-100'}`}>
                      {isBot ? 'Thầy Cú Thông Thái' : 'Em'}
                    </span>
                    <div className="flex items-center gap-2">
                      {isBot && (
                        <button
                          onClick={() => handleSpeakText(msg.content)}
                          title="Đọc lời giải bằng giọng nói"
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className={`text-[10px] ${isBot ? 'text-slate-400' : 'text-blue-200'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    6A
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base shrink-0 animate-pulse">
                🦉
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-200"></span>
                <span className="font-medium text-slate-600 ml-1">Thầy Cú đang phân tích phương pháp giải...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Hỏi nhanh:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 border border-slate-200 text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập bài toán cần hỏi: (-15) + 38 = ? hoặc 'Cách tính chu vi hình thoi'..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
