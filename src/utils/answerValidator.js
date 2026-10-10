export const parseAnswer = (value) => { const clean = String(value ?? '').trim(); if (!/^-?\d+$/.test(clean)) return null; const number = Number(clean); return Number.isSafeInteger(number) ? number : null; };
export const isCorrectAnswer = (value, expected) => parseAnswer(value) === expected;
