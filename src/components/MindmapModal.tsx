import React from 'react';
import { X, BrainCircuit, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { TopicChapter } from '../types';

interface MindmapModalProps {
  topic: TopicChapter | null;
  onClose: () => void;
  onOpenTopic: (topicId: string) => void;
}

export const MindmapModal: React.FC<MindmapModalProps> = ({
  topic,
  onClose,
  onOpenTopic,
}) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${topic.color.bg} ${topic.color.primary} flex items-center justify-center font-bold text-xs`}>
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {topic.mindmap.title}
              </h3>
              <p className="text-[11px] text-slate-500">
                Tóm tắt công thức & kiến thức trọng tâm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tip Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Bí kíp ghi nhớ:</span>
              <p>{topic.mindmap.tips}</p>
            </div>
          </div>

          {/* Formulas */}
          <div className="p-4 rounded-2xl bg-blue-900 text-white space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Công thức cần nhớ:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {topic.mindmap.formulas.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Branches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Các nhánh kiến thức chi tiết:
            </h4>
            {topic.mindmap.children?.map((branch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                    {branch.title}
                  </h5>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  {branch.details}
                </p>
                {branch.example && (
                  <div className="ml-7 p-2 rounded-lg bg-white border border-slate-200/70 text-xs font-mono text-blue-900">
                    <span className="font-bold text-blue-600">VD: </span>
                    {branch.example}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                onOpenTopic(topic.id);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>Vào học chuyên đề này</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
