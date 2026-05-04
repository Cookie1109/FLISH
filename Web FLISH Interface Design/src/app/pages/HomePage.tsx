import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, BookOpen } from "lucide-react";
import { topics, getAllLearnedStats } from "../data/topics";

export function HomePage() {
  const [stats, setStats] = useState<{ topicId: string; learned: number; total: number }[]>([]);

  useEffect(() => {
    setStats(getAllLearnedStats());
  }, []);

  const totalLearned = stats.reduce((a, b) => a + b.learned, 0);
  const totalWords = stats.reduce((a, b) => a + b.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-3"
      >
        <h1 className="text-gray-900" style={{ fontSize: "1.85rem", fontWeight: 700, lineHeight: 1.2 }}>
          Học từ vựng tiếng Anh
        </h1>
        <p className="text-gray-500 max-w-lg">
          Học theo chủ đề với Flash Card. Lật thẻ để xem nghĩa, đánh dấu từ đã thuộc và theo dõi tiến trình của bạn.
        </p>

        {totalWords > 0 && (
          <div className="flex items-center gap-6 pt-2">
            <div>
              <span className="text-2xl font-bold text-gray-900">{totalLearned}</span>
              <span className="text-gray-400 text-sm ml-1.5">/ {totalWords} từ đã học</span>
            </div>
            <div className="flex-1 max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: totalWords > 0 ? `${(totalLearned / totalWords) * 100}%` : "0%" }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Topic grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-700" style={{ fontSize: "0.95rem" }}>
            Tất cả chủ đề ({topics.length})
          </h2>
          <Link to="/topics" className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, i) => {
            const topicStat = stats.find((s) => s.topicId === topic.id);
            const learned = topicStat?.learned ?? 0;
            const total = topicStat?.total ?? topic.cards.length;
            const pct = total > 0 ? (learned / total) * 100 : 0;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link to={`/topic/${topic.id}`} className="group block">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{topic.emoji}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors mt-0.5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{topic.nameVi}</p>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{learned}/{total} từ</span>
                        {learned === total && total > 0 ? (
                          <span className="text-green-600 font-medium">Hoàn thành ✓</span>
                        ) : learned > 0 ? (
                          <span>{Math.round(pct)}%</span>
                        ) : (
                          <span>Chưa bắt đầu</span>
                        )}
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: pct === 100 ? "#16A34A" : topic.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-gray-100 pt-10">
        <h2 className="font-semibold text-gray-700 mb-5" style={{ fontSize: "0.95rem" }}>
          Cách sử dụng
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Chọn chủ đề", desc: "Chọn chủ đề bạn muốn học hoặc cần dùng ngay." },
            { step: "2", title: "Lật thẻ", desc: "Nhấn thẻ để xem nghĩa, phát âm và câu ví dụ." },
            { step: "3", title: "Đánh dấu tiến trình", desc: "Chọn \"Đã thuộc\" hoặc \"Chưa thuộc\" để theo dõi." },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
