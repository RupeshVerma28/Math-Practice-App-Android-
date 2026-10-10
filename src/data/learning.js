export const mentalMath = [
  { title: 'Add by making ten', icon: '➕', rule: 'Split one addend so the other reaches a friendly multiple of 10.', example: '38 + 27 = 38 + 2 + 25 = 65', quiz: { expression: '46 + 19', answer: 65 } },
  { title: 'Subtract by counting up', icon: '➖', rule: 'For close numbers, count forward from the smaller number to the larger number.', example: '84 − 57: 57 → 60 (+3), 60 → 84 (+24), so 27.', quiz: { expression: '93 − 68', answer: 25 } },
  { title: 'Multiply near ten', icon: '✖', rule: 'Multiply by 10, then adjust once for each missing unit.', example: '9 × 34 = (10 × 34) − 34 = 306', quiz: { expression: '9 × 47', answer: 423 } },
  { title: 'Divide in chunks', icon: '➗', rule: 'Break the dividend into parts that divide easily.', example: '156 ÷ 12 = 120 ÷ 12 + 36 ÷ 12 = 13', quiz: { expression: '144 ÷ 12', answer: 12 } },
  { title: 'Square numbers ending in 5', icon: '²', rule: 'For n5², multiply n by n + 1 and put 25 at the end.', example: '35²: 3 × 4 = 12, so 1225.', quiz: { expression: '45²', answer: 2025 } },
];
export const squareTip = 'Every odd square differs from the previous square by the next odd number: 4² = 16, then +9 gives 5² = 25.';
export const cubeTip = 'Cubes grow quickly: n³ is n × n × n. Notice 1³ + 2³ + … + n³ equals (1 + 2 + … + n)².';
