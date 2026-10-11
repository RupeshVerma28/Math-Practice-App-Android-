import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { generateUniqueQuestion } from '../utils/questionGenerator';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [session, setSession] = useState(null);

  const beginSession = useCallback((config) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSession({
      ...config,
      id,
      question: generateUniqueQuestion(config.topic, config.difficulty),
      answers: [],
      startedAt: Date.now(),
      streak: 0,
      elapsedSeconds: 0,
    });
  }, []);

  const submitAnswer = useCallback((answer, sessionId) => {
    if (!session) return null;
    if (sessionId && session.id !== sessionId) return null;

    const correct = answer === session.question.answer;
    const answers = [...session.answers, { ...session.question, answer, correct }];
    const completed = session.count !== 'unlimited' && answers.length >= Number(session.count);
    const nextQuestion = completed
      ? session.question
      : generateUniqueQuestion(
          session.topic,
          session.difficulty,
          answers.slice(-6).map((item) => item.expression)
        );

    setSession((curr) => {
      if (!curr || (sessionId && curr.id !== sessionId)) return curr;
      return {
        ...curr,
        answers,
        question: nextQuestion,
        streak: correct ? curr.streak + 1 : 0,
      };
    });

    return {
      correct,
      question: session.question,
      completed,
      newStreak: correct ? session.streak + 1 : 0,
    };
  }, [session]);

  const updateElapsed = useCallback((elapsedSeconds, sessionId) => {
    setSession((current) => {
      if (!current || (sessionId && current.id !== sessionId)) return current;
      return { ...current, elapsedSeconds };
    });
  }, []);

  const clearSession = useCallback(() => setSession(null), []);

  const value = useMemo(
    () => ({
      soundEnabled,
      setSoundEnabled,
      session,
      beginSession,
      submitAnswer,
      updateElapsed,
      clearSession,
    }),
    [soundEnabled, session, beginSession, submitAnswer, updateElapsed, clearSession]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
