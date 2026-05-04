import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { topics, getAllLearnedStats } from "../data/topics";

export function TopicsPage() {
  const [stats, setStats] = useState<{ topicId: string; learned: number; total: number }[]>([]);

  useEffect(() => {
    setStats(getAllLearnedStats());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="font-bold text-gray-900" style={{ fontSize: "1.5rem" }}>Chủ đề</h1>
        <p className="text-gray-500 text-sm mt-1">Chọn chủ đề để bắt đầu học với Flash Card</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, i) => {
          const stat = stats.find((s) => s.topicId === topic.id);
          const learned = stat?.learned ?? 0;
          const total = stat?.total ?? topic.cards.length;
          const pct = total > 0 ? (learned / total) * 100 : 0;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Link to={`/topic/${topic.id}`} className="group block">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{topic.emoji}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                  <p className="text-sm text-gray-400">{topic.nameVi}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{topic.description}</p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{learned}/{total} từ</span>
                      {pct === 100 ? (
                        <span className="text-green-600 font-medium">Hoàn thành ✓</span>
                      ) : learned > 0 ? (
                        <span>{Math.round(pct)}%</span>
                      ) : null}
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
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
  );
}
