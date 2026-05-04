import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, RotateCcw, List, CreditCard, Volume2,
  Check, RefreshCw, Trophy, ChevronDown, ChevronUp
} from "lucide-react";
import { getTopicById } from "../data/topics";
import { FlashCard } from "../components/FlashCard";
import { useLearnedWords } from "../hooks/useLearnedWords";
import type { FlashCard as FlashCardType } from "../data/topics";

type Tab = "learn" | "all" | "learned" | "unlearned";

export function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const topic = getTopicById(id ?? "");
  const { learnedIds, markLearned, markUnlearned, resetAll } = useLearnedWords(id ?? "");

  // Queue of unlearned card IDs for the current session
  const [queue, setQueue] = useState<string[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [tab, setTab] = useState<Tab>("learn");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<"all" | "learned" | "unlearned">("all");

  // Build initial queue from unlearned cards
  useEffect(() => {
    if (!topic) return;
    const unlearned = topic.cards.filter((c) => !learnedIds.has(c.id)).map((c) => c.id);
    if (unlearned.length === 0) {
      setSessionDone(true);
    } else {
      setQueue(unlearned);
      setQueueIndex(0);
      setSessionDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.id]);

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500">Không tìm thấy chủ đề.</p>
        <Link to="/" className="text-sm text-blue-600 hover:underline">← Về trang chủ</Link>
      </div>
    );
  }

  const currentCardId = queue[queueIndex];
  const currentCard = topic.cards.find((c) => c.id === currentCardId);

  const handleKnow = () => {
    markLearned(currentCardId);
    const newQueue = queue.filter((_, i) => i !== queueIndex);
    if (newQueue.length === 0) {
      setSessionDone(true);
    } else {
      setQueue(newQueue);
      setQueueIndex((prev) => (prev >= newQueue.length ? 0 : prev));
    }
  };

  const handleAgain = () => {
    // Move current card to end of queue
    const newQueue = [...queue.filter((_, i) => i !== queueIndex), currentCardId];
    setQueue(newQueue);
    setQueueIndex((prev) => (prev >= newQueue.length - 1 ? 0 : prev));
  };

  const handleRestart = () => {
    const allIds = topic.cards.map((c) => c.id);
    resetAll(allIds);
    const freshQueue = topic.cards.map((c) => c.id);
    setQueue(freshQueue);
    setQueueIndex(0);
    setSessionDone(false);
  };

  const handleReviewLearned = () => {
    const learnedCards = topic.cards.filter((c) => learnedIds.has(c.id)).map((c) => c.id);
    setQueue(learnedCards);
    setQueueIndex(0);
    setSessionDone(false);
  };

  const handleContinueUnlearned = () => {
    const unlearned = topic.cards.filter((c) => !learnedIds.has(c.id)).map((c) => c.id);
    if (unlearned.length > 0) {
      setQueue(unlearned);
      setQueueIndex(0);
      setSessionDone(false);
    }
  };

  const learnedCount = learnedIds.size;
  const totalCount = topic.cards.length;
  const unlearnedCount = totalCount - learnedCount;
  const pct = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  const listCards: FlashCardType[] = (() => {
    if (listFilter === "learned") return topic.cards.filter((c) => learnedIds.has(c.id));
    if (listFilter === "unlearned") return topic.cards.filter((c) => !learnedIds.has(c.id));
    return topic.cards;
  })();

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span>{topic.emoji}</span>
            <h1 className="font-bold text-gray-900">{topic.name}</h1>
            <span className="text-gray-400 text-sm hidden sm:inline">· {topic.nameVi}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{topic.cards.length} từ vựng</p>
        </div>
      </div>

      {/* Progress summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">{learnedCount}/{totalCount} từ đã thuộc</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: pct === 100 ? "#DCFCE7" : "#F3F4F6",
                color: pct === 100 ? "#16A34A" : "#6B7280",
              }}
            >
              {pct === 100 ? "Hoàn thành ✓" : `${pct}%`}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: pct === 100 ? "#16A34A" : topic.color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: topic.color }} />
              {learnedCount} đã thuộc
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
              {unlearnedCount} chưa thuộc
            </span>
          </div>
        </div>
        {learnedCount > 0 && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-400 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại tất cả
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0">
        {[
          { id: "learn" as Tab, label: "Học", icon: CreditCard },
          { id: "all" as Tab, label: `Tất cả (${totalCount})`, icon: List },
          { id: "learned" as Tab, label: `Đã thuộc (${learnedCount})`, icon: Check },
          { id: "unlearned" as Tab, label: `Chưa thuộc (${unlearnedCount})`, icon: RefreshCw },
        ].map(({ id: tId, label, icon: Icon }) => (
          <button
            key={tId}
            onClick={() => setTab(tId)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
              tab === tId
                ? "border-gray-900 text-gray-900 font-medium"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Tab: LEARN */}
      {tab === "learn" && (
        <AnimatePresence mode="wait">
          {sessionDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-sm mx-auto space-y-4"
            >
              <Trophy className="w-10 h-10 mx-auto text-amber-400" />
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  {learnedCount === totalCount ? "Hoàn thành!" : "Xong lượt này!"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {learnedCount === totalCount
                    ? `Bạn đã thuộc tất cả ${totalCount} từ trong chủ đề này.`
                    : `Đã thuộc ${learnedCount}/${totalCount} từ. Còn ${unlearnedCount} từ chưa thuộc.`}
                </p>
              </div>
              <div className="space-y-2 pt-2">
                {unlearnedCount > 0 && (
                  <button
                    onClick={handleContinueUnlearned}
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: topic.color }}
                  >
                    Tiếp tục học {unlearnedCount} từ còn lại
                  </button>
                )}
                {learnedCount > 0 && (
                  <button
                    onClick={handleReviewLearned}
                    className="w-full py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Ôn lại {learnedCount} từ đã thuộc
                  </button>
                )}
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Đặt lại và học lại từ đầu
                </button>
              </div>
            </motion.div>
          ) : currentCard ? (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center text-sm text-gray-400 mb-4">
                Còn <strong className="text-gray-700">{queue.length}</strong> từ trong lượt này
              </div>
              <FlashCard
                card={currentCard}
                currentIndex={queueIndex}
                totalCards={queue.length}
                accentColor={topic.color}
                onKnow={handleKnow}
                onAgain={handleAgain}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}

      {/* Tab: LIST (all / learned / unlearned) */}
      {(tab === "all" || tab === "learned" || tab === "unlearned") && (
        <div className="space-y-3">
          {/* Sub-filter only for "all" tab */}
          {tab === "all" && (
            <div className="flex gap-2">
              {(["all", "learned", "unlearned"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setListFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    listFilter === f
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f === "all" ? "Tất cả" : f === "learned" ? "Đã thuộc" : "Chưa thuộc"}
                </button>
              ))}
            </div>
          )}

          {/* Quick action if on "learned" tab */}
          {tab === "learned" && learnedCount > 0 && (
            <button
              onClick={handleReviewLearned}
              className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: topic.color }}
            >
              <CreditCard className="w-4 h-4" />
              Ôn lại {learnedCount} từ bằng Flash Card
            </button>
          )}

          {/* Quick action if on "unlearned" tab */}
          {tab === "unlearned" && unlearnedCount > 0 && (
            <button
              onClick={() => { handleContinueUnlearned(); setTab("learn"); }}
              className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: topic.color }}
            >
              <CreditCard className="w-4 h-4" />
              Học {unlearnedCount} từ chưa thuộc
            </button>
          )}

          {/* Word list */}
          {(() => {
            const cards =
              tab === "learned"
                ? topic.cards.filter((c) => learnedIds.has(c.id))
                : tab === "unlearned"
                ? topic.cards.filter((c) => !learnedIds.has(c.id))
                : listCards;

            if (cards.length === 0) {
              return (
                <div className="text-center py-12 text-gray-400 text-sm">
                  {tab === "learned"
                    ? "Bạn chưa thuộc từ nào. Hãy bắt đầu học!"
                    : "Tuyệt vời! Bạn đã thuộc hết các từ trong chủ đề này."}
                </div>
              );
            }

            return (
              <div className="space-y-1.5">
                {cards.map((card, idx) => {
                  const isLearned = learnedIds.has(card.id);
                  const isExpanded = expandedId === card.id;
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >
                      {/* Row */}
                      <div
                        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : card.id)}
                      >
                        {/* Number */}
                        <span className="text-xs text-gray-300 w-5 shrink-0 text-right">{idx + 1}</span>

                        {/* Thumbnail */}
                        <img
                          src={card.image}
                          alt={card.word}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />

                        {/* Word info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{card.word}</span>
                            <span className="text-gray-400 text-xs font-mono">{card.pronunciation}</span>
                          </div>
                          <p
                            className="text-xs mt-0.5 font-medium"
                            style={{ color: topic.color }}
                          >
                            {card.meaning}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isLearned ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                              Đã thuộc
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              Chưa thuộc
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                          )}
                        </div>
                      </div>

                      {/* Expanded */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-gray-100 space-y-3 ml-9">
                              <div className="space-y-2 pt-3">
                                <div>
                                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Câu ví dụ</p>
                                  <p className="text-sm text-gray-700 italic">"{card.example}"</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Dịch nghĩa</p>
                                  <p className="text-sm text-gray-500">"{card.translation}"</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => { e.stopPropagation(); speak(card.word); }}
                                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  Phát âm
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    isLearned ? markUnlearned(card.id) : markLearned(card.id);
                                  }}
                                  className={`flex items-center gap-1.5 text-xs border rounded-lg px-2.5 py-1.5 transition-colors ${
                                    isLearned
                                      ? "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
                                      : "text-white border-transparent"
                                  }`}
                                  style={isLearned ? {} : { backgroundColor: topic.color }}
                                >
                                  {isLearned ? (
                                    <><RefreshCw className="w-3.5 h-3.5" /> Đánh dấu chưa thuộc</>
                                  ) : (
                                    <><Check className="w-3.5 h-3.5" /> Đánh dấu đã thuộc</>
                                  )}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
