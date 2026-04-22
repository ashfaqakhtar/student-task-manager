export const SUBJECT_COLORS = [
  "#7c6af7",
  "#2ea87e",
  "#d4a017",
  "#e05c73",
  "#3b82f6",
  "#e07a2e",
  "#9b59b6",
];

export function getNextSubjectColor(subjectColorMap = {}) {
  const usedCount = Object.keys(subjectColorMap).length;
  return SUBJECT_COLORS[usedCount % SUBJECT_COLORS.length];
}
