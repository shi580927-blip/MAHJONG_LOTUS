export const CHAPTER_1 = {
  id: 1,
  title: 'Сад Безмятежности',
  firstLevel: 1,
  lastLevel: 20,
  milestones: [5, 10, 15, 20],
};

export function nodeState(level, currentLevel) {
  if (level < currentLevel) return 'completed';
  if (level === currentLevel) return 'current';
  if (level === 20) return 'chapter_end';
  if ([5, 10, 15].includes(level)) return level > currentLevel ? 'locked' : 'milestone';
  if (level === currentLevel + 1) return 'available';
  return 'locked';
}
