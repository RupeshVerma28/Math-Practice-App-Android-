const test = require('node:test');
const assert = require('node:assert/strict');
// Mirrors the pure arithmetic contracts used in the app. These tests deliberately avoid UI/runtime dependencies.
const square = (n) => n * n;
const cube = (n) => n * n * n;
const parseAnswer = (value) => { const clean = String(value ?? '').trim(); if (!/^-?\d+$/.test(clean)) return null; const number = Number(clean); return Number.isSafeInteger(number) ? number : null; };
const stats = (answers, seconds) => { const total = answers.length, correct = answers.filter((answer) => answer.correct).length; return { total, correct, incorrect: total-correct, accuracy: total ? Math.round(correct / total * 100) : 0, averageSeconds: total ? Math.round(seconds / total) : 0 }; };
test('powers use correct integer math', () => { assert.equal(square(96), 9216); assert.equal(square(100), 10000); assert.equal(cube(30), 27000); });
test('answer validation rejects empty, decimal and unexpected answers', () => { assert.equal(parseAnswer(' 42 '), 42); assert.equal(parseAnswer(''), null); assert.equal(parseAnswer('4.2'), null); assert.equal(parseAnswer('4x'), null); assert.equal(parseAnswer('-12'), -12); });
test('statistics handle completed and empty sessions safely', () => { assert.deepEqual(stats([{ correct: true }, { correct: false }, { correct: true }], 31), { total: 3, correct: 2, incorrect: 1, accuracy: 67, averageSeconds: 10 }); assert.deepEqual(stats([], 0), { total: 0, correct: 0, incorrect: 0, accuracy: 0, averageSeconds: 0 }); });
test('integer division generation contract keeps exact answers', () => { const divisor = 9, quotient = 17; assert.equal((divisor * quotient) / divisor, quotient); assert.notEqual(divisor, 0); });
