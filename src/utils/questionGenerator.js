const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (items) => items[random(0, items.length - 1)];

const ranges = {
  easy: {
    add: [10, 60],
    mult: [2, 10],
    table: [1, 12],
    square: [1, 15],
    cube: [1, 8],
  },
  medium: {
    add: [45, 350],
    mult: [6, 25],
    table: [8, 25],
    square: [11, 40],
    cube: [4, 20],
  },
  hard: {
    add: [125, 999],
    mult: [12, 99],
    table: [15, 100],
    square: [25, 100],
    cube: [10, 100],
  },
};

const arithmetic = (type, difficulty) => {
  const r = ranges[difficulty];
  if (type === 'addition') {
    const a = random(...r.add);
    const b = random(...r.add);
    return { operation: type, expression: `${a} + ${b}`, answer: a + b };
  }
  if (type === 'subtraction') {
    const a = random(...r.add);
    const b = random(...r.add);
    const large = Math.max(a, b);
    const small = Math.min(a, b);
    return { operation: type, expression: `${large} − ${small}`, answer: large - small };
  }
  if (type === 'multiplication') {
    const a = random(...r.mult);
    const b = random(...r.mult);
    return { operation: type, expression: `${a} × ${b}`, answer: a * b };
  }
  const divisor = random(2, difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30);
  const quotient = random(...r.mult);
  return {
    operation: type,
    expression: `${divisor * quotient} ÷ ${divisor}`,
    answer: quotient,
  };
};

export const generateQuestion = (topic, difficulty = 'easy') => {
  const r = ranges[difficulty] || ranges.easy;
  if (topic === 'tables') {
    const a = random(...r.table);
    const b = random(1, 12);
    return { operation: topic, expression: `${a} × ${b}`, answer: a * b };
  }
  if (topic === 'squares') {
    const n = random(...r.square);
    return { operation: topic, expression: `${n}²`, answer: n * n };
  }
  if (topic === 'cubes') {
    const n = random(...r.cube);
    return { operation: topic, expression: `${n}³`, answer: n * n * n };
  }
  return arithmetic(
    topic === 'mixed'
      ? choice(['addition', 'subtraction', 'multiplication', 'division'])
      : topic,
    difficulty
  );
};

export const generateUniqueQuestion = (topic, difficulty, recent = []) => {
  let question = generateQuestion(topic, difficulty);
  for (let i = 0; i < 8 && recent.includes(question.expression); i += 1) {
    question = generateQuestion(topic, difficulty);
  }
  return question;
};

export const topicLabel = (topic) =>
  ({
    tables: 'Tables',
    squares: 'Squares',
    cubes: 'Cubes',
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    mixed: 'Mixed calculations',
  }[topic] || topic);
