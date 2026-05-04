import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, RotateCcw, Check, RefreshCw } from "lucide-react";
import type { FlashCard as FlashCardType } from "../data/topics";

interface FlashCardProps {
  card: FlashCardType;
  currentIndex: number;
  totalCards: number;
  accentColor: string;
  onKnow: () => void;
  onAgain: () => void;
}

export function FlashCard({ card, currentIndex, totalCards, accentColor, onKnow, onAgain }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleKnow = () => {
    setIsFlipped(false);
    setTimeout(() => onKnow(), 100);
  };

  const handleAgain = () => {
    setIsFlipped(false);
    setTimeout(() => onAgain(), 100);
  };

  return (
    <div className="w-full max-w-lg mx-auto select-none">
      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d", position: "relative", minHeight: "400px" }}
        >
          {/* ── FRONT ── */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden bg-gray-100">
              <img src={card.image} alt={card.word} className="w-full h-full object-cover" />
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{card.partOfSpeech}</p>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{card.word}</h2>
                  <p className="mt-1 text-gray-400 text-base font-mono">{card.pronunciation}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(card.word); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors shrink-0 mt-1"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <RotateCcw className="w-3.5 h-3.5" />
                Nhấn để xem nghĩa
              </div>
            </div>
          </div>

          {/* ── BACK ── */}
          <div
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="h-full flex flex-col" style={{ minHeight: "400px" }}>
              {/* Top */}
              <div className="flex-1 p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{card.partOfSpeech}</p>
                    <h2 className="text-2xl font-bold text-gray-900">{card.word}</h2>
                    <p className="text-gray-400 text-sm font-mono">{card.pronunciation}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(card.word); }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Meaning */}
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ backgroundColor: accentColor + "10", borderLeft: `3px solid ${accentColor}` }}
                >
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Nghĩa tiếng Việt</p>
                  <p className="text-xl font-bold" style={{ color: accentColor }}>{card.meaning}</p>
                </div>

                {/* Example */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Câu ví dụ</p>
                    <p className="text-sm text-gray-700 leading-relaxed italic">"{card.example}"</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Dịch nghĩa</p>
                    <p className="text-sm text-gray-500 leading-relaxed">"{card.translation}"</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(card.example); }}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe câu ví dụ
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="grid grid-cols-2 border-t border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleAgain}
                  className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  <RefreshCw className="w-4 h-4" />
                  Chưa thuộc
                </button>
                <button
                  onClick={handleKnow}
                  className="flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors hover:opacity-90"
                  style={{ color: accentColor }}
                >
                  <Check className="w-4 h-4" />
                  Đã thuộc
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
