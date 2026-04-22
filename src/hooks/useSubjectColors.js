import { useCallback } from "react";
import { useTaskStore } from "../store/taskStore";
import { SUBJECT_COLORS } from "../utils/subjectColors";

export function useSubjectColors() {
  const subjectColorMap = useTaskStore((state) => state.subjectColorMap);
  const ensureSubjectColor = useTaskStore((state) => state.ensureSubjectColor);

  const getSubjectColor = useCallback(
    (subject) => subjectColorMap[subject] || SUBJECT_COLORS[0],
    [subjectColorMap],
  );

  return {
    subjectColorMap,
    ensureSubjectColor,
    getSubjectColor,
  };
}
