export const tableFacts = (n) => Array.from({ length: 12 }, (_, index) => ({ multiplier: index + 1, result: n * (index + 1) }));
export const square = (n) => n * n;
export const cube = (n) => n * n * n;
export const formatSeconds = (total) => `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
export const sessionStats = (answers, elapsedSeconds) => { const total = answers.length; const correct = answers.filter((item) => item.correct).length; return { total, correct, incorrect: total - correct, accuracy: total ? Math.round((correct / total) * 100) : 0, averageSeconds: total ? Math.round(elapsedSeconds / total) : 0 }; };
