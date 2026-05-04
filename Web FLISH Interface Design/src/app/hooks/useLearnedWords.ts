import { useState } from "react";

export function useLearnedWords(topicId: string) {
  const key = `flish-learned-${topicId}`;

  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const markLearned = (id: string) => {
    setLearnedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  };

  const markUnlearned = (id: string) => {
    setLearnedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  };

  const resetAll = (allIds: string[]) => {
    const empty = new Set<string>();
    localStorage.removeItem(key);
    setLearnedIds(empty);
  };

  return { learnedIds, markLearned, markUnlearned, resetAll };
}
