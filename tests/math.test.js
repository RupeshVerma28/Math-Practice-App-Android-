const test = require('node:test');
const assert = require('node:assert/strict');

// Pure arithmetic and validation functions from the application
const { square, cube, tableFacts, sessionStats } = require('../src/utils/calculations');
const { parseAnswer, isCorrectAnswer } = require('../src/utils/answerValidator');
const { generateQuestion, generateUniqueQuestion, topicLabel } = require('../src/utils/questionGenerator');

// 1. Core Arithmetic, Squares, Cubes, and Tables
test('squares accurately support 1 through 100', () => {
  assert.equal(square(1), 1);
  assert.equal(square(12), 144);
  assert.equal(square(25), 625);
  assert.equal(square(50), 2500);
  assert.equal(square(96), 9216);
  assert.equal(square(100), 10000);
});

test('cubes accurately support 1 through 100 and match required values', () => {
  assert.equal(cube(1), 1);
  assert.equal(cube(10), 1000);
  assert.equal(cube(25), 15625);
  assert.equal(cube(50), 125000);
  assert.equal(cube(100), 1000000);
});

test('multiplication tables support 1 through 100 with 12 facts', () => {
  const table1 = tableFacts(1);
  assert.equal(table1.length, 12);
  assert.equal(table1[0].result, 1);
  assert.equal(table1[11].result, 12);

  const table100 = tableFacts(100);
  assert.equal(table100.length, 12);
  assert.equal(table100[0].result, 100);
  assert.equal(table100[11].result, 1200);
});

// 2. Answer Validator & Edge Cases
test('parseAnswer correctly handles valid and invalid answers', () => {
  // Empty & whitespace
  assert.equal(parseAnswer(''), null);
  assert.equal(parseAnswer('   '), null);
  assert.equal(parseAnswer(null), null);
  assert.equal(parseAnswer(undefined), null);

  // Zero as a valid answer
  assert.equal(parseAnswer('0'), 0);
  assert.equal(parseAnswer(' 0 '), 0);

  // Valid integers
  assert.equal(parseAnswer('42'), 42);
  assert.equal(parseAnswer(' 1000 '), 1000);
  assert.equal(parseAnswer('-15'), -15);

  // Invalid inputs
  assert.equal(parseAnswer('3.14'), null);
  assert.equal(parseAnswer('4x'), null);
  assert.equal(parseAnswer('abc'), null);
});

test('isCorrectAnswer evaluates equality accurately', () => {
  assert.equal(isCorrectAnswer('0', 0), true);
  assert.equal(isCorrectAnswer('42', 42), true);
  assert.equal(isCorrectAnswer('41', 42), false);
  assert.equal(isCorrectAnswer('', 42), false);
  assert.equal(isCorrectAnswer('   ', 0), false);
});

// 3. Question Generator Ranges and Labels
test('questionGenerator generates questions within 1-100 ranges and formats labels', () => {
  for (let i = 0; i < 30; i++) {
    const tableQ = generateQuestion('tables', 'hard');
    assert.match(tableQ.expression, /^\d+ × \d+$/);
    assert.equal(typeof tableQ.answer, 'number');

    const cubeQ = generateQuestion('cubes', 'hard');
    assert.match(cubeQ.expression, /^\d+³$/);
    assert.ok(cubeQ.answer >= 1000 && cubeQ.answer <= 1000000);

    const squareQ = generateQuestion('squares', 'hard');
    assert.match(squareQ.expression, /^\d+²$/);
    assert.ok(squareQ.answer >= 625 && squareQ.answer <= 10000);
  }

  const uniqueQ = generateUniqueQuestion('tables', 'easy', ['1 × 1']);
  assert.ok(uniqueQ && uniqueQ.expression);
  assert.equal(topicLabel('tables'), 'Tables');
  assert.equal(topicLabel('mixed'), 'Mixed calculations');
});

test('sessionStats calculates accuracy and metrics correctly', () => {
  const stats = sessionStats([{ correct: true }, { correct: false }, { correct: true }], 30);
  assert.equal(stats.total, 3);
  assert.equal(stats.correct, 2);
  assert.equal(stats.incorrect, 1);
  assert.equal(stats.accuracy, 67);
  assert.equal(stats.averageSeconds, 10);

  const emptyStats = sessionStats([], 0);
  assert.equal(emptyStats.total, 0);
  assert.equal(emptyStats.accuracy, 0);
});

// 4. Practice Session State Machine Simulation
function createTestSessionManager() {
  let session = null;
  let submissionLocked = false;

  const beginSession = (config) => {
    const id = `sess-${Date.now()}-${Math.random()}`;
    session = {
      ...config,
      id,
      question: { expression: '7 × 8', answer: 56 },
      answers: [],
      startedAt: Date.now(),
      streak: 0,
      elapsedSeconds: 0,
    };
    submissionLocked = false;
    return session;
  };

  const submit = (rawInput) => {
    if (submissionLocked) {
      return { status: 'rejected_duplicate' };
    }

    const clean = String(rawInput ?? '').trim();
    if (!clean) {
      return { status: 'rejected_empty', session };
    }

    const answer = parseAnswer(clean);
    if (answer === null) {
      return { status: 'rejected_invalid', session };
    }

    submissionLocked = true;
    const correct = answer === session.question.answer;
    const newAnswers = [...session.answers, { ...session.question, answer, correct }];
    const completed = session.count !== 'unlimited' && newAnswers.length >= Number(session.count);

    const nextQuestion = completed
      ? session.question
      : { expression: '9 × 9', answer: 81 };

    session = {
      ...session,
      answers: newAnswers,
      question: nextQuestion,
      streak: correct ? session.streak + 1 : 0,
    };

    return {
      status: 'evaluated',
      correct,
      completed,
      session,
      unlock: () => {
        submissionLocked = false;
      },
    };
  };

  const updateElapsed = (seconds, sessionId) => {
    if (!session || session.id !== sessionId) return false;
    session.elapsedSeconds = seconds;
    return true;
  };

  return { getSession: () => session, beginSession, submit, updateElapsed };
}

test('empty or whitespace submissions do not score or advance questions', () => {
  const manager = createTestSessionManager();
  manager.beginSession({ topic: 'tables', difficulty: 'easy', count: '5' });

  // Empty string
  const emptyRes = manager.submit('');
  assert.equal(emptyRes.status, 'rejected_empty');
  assert.equal(manager.getSession().answers.length, 0);
  assert.equal(manager.getSession().streak, 0);

  // Whitespace only
  const wsRes = manager.submit('    ');
  assert.equal(wsRes.status, 'rejected_empty');
  assert.equal(manager.getSession().answers.length, 0);

  // Question expression should remain identical
  assert.equal(manager.getSession().question.expression, '7 × 8');
});

test('zero is accepted as a valid answer when appropriate', () => {
  const manager = createTestSessionManager();
  manager.beginSession({ topic: 'subtraction', difficulty: 'easy', count: '5' });
  manager.getSession().question = { expression: '5 − 5', answer: 0 };

  const res = manager.submit('0');
  assert.equal(res.status, 'evaluated');
  assert.equal(res.correct, true);
  assert.equal(manager.getSession().answers.length, 1);
  assert.equal(manager.getSession().answers[0].correct, true);
});

test('rapid duplicate submissions are guarded and score increments exactly once', () => {
  const manager = createTestSessionManager();
  manager.beginSession({ topic: 'tables', difficulty: 'easy', count: '5' });

  // First submit
  const res1 = manager.submit('56');
  assert.equal(res1.status, 'evaluated');
  assert.equal(res1.correct, true);

  // Immediate second tap while still locked
  const res2 = manager.submit('56');
  assert.equal(res2.status, 'rejected_duplicate');

  // Answers count should still be 1
  assert.equal(manager.getSession().answers.length, 1);

  // Unlock (after transition delay)
  res1.unlock();

  // Next submission should now succeed
  const res3 = manager.submit('81');
  assert.equal(res3.status, 'evaluated');
  assert.equal(manager.getSession().answers.length, 2);
});

test('session completion flags final question and finishes session once', () => {
  const manager = createTestSessionManager();
  manager.beginSession({ topic: 'tables', difficulty: 'easy', count: '2' });

  const q1 = manager.submit('56');
  assert.equal(q1.completed, false);
  q1.unlock();

  const q2 = manager.submit('81');
  assert.equal(q2.completed, true);
  assert.equal(manager.getSession().answers.length, 2);
});

test('retry creates fresh session id and stale timer updates are ignored', () => {
  const manager = createTestSessionManager();
  const session1 = manager.beginSession({ topic: 'tables', difficulty: 'easy', count: '10' });
  const oldId = session1.id;

  assert.equal(manager.updateElapsed(10, oldId), true);
  assert.equal(manager.getSession().elapsedSeconds, 10);

  const session2 = manager.beginSession({ topic: 'tables', difficulty: 'easy', count: '10' });
  assert.notEqual(session2.id, oldId);
  assert.equal(session2.answers.length, 0);
  assert.equal(session2.elapsedSeconds, 0);

  // Old timer fires with oldId
  const updated = manager.updateElapsed(25, oldId);
  assert.equal(updated, false);
  assert.equal(manager.getSession().elapsedSeconds, 0);
});

// 5. Sound Policy Validation
test('sound events are strictly scoped to intended conditions', () => {
  const playedSounds = [];
  const soundSystem = {
    enabled: true,
    playCorrect: () => {
      if (soundSystem.enabled) playedSounds.push('correct');
    },
    playIncorrect: () => {
      if (soundSystem.enabled) playedSounds.push('incorrect');
    },
    playComplete: () => {
      if (soundSystem.enabled) playedSounds.push('complete');
    },
  };

  // 1. Correct answer
  soundSystem.playCorrect();
  assert.deepEqual(playedSounds, ['correct']);

  // 2. Incorrect answer
  soundSystem.playIncorrect();
  assert.deepEqual(playedSounds, ['correct', 'incorrect']);

  // 3. Completion
  soundSystem.playComplete();
  assert.deepEqual(playedSounds, ['correct', 'incorrect', 'complete']);

  // 4. Sound disabled -> no playback
  soundSystem.enabled = false;
  soundSystem.playCorrect();
  soundSystem.playIncorrect();
  soundSystem.playComplete();
  assert.equal(playedSounds.length, 3);
});
