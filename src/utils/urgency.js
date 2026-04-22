import {
  differenceInCalendarDays,
  endOfDay,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  parseISO,
} from "date-fns";

export function getUrgency(deadline) {
  if (!deadline) return null;

  const date = parseISO(deadline);
  if (Number.isNaN(date.getTime())) return null;
  if (isBefore(endOfDay(date), new Date()) && !isToday(date)) return "overdue";
  if (isToday(date)) return "today";
  if (isTomorrow(date)) return "tomorrow";

  const diff = differenceInCalendarDays(date, new Date());
  if (diff <= 3) return "soon";
  if (isAfter(date, new Date())) return "upcoming";
  return null;
}

export const urgencyOrder = {
  overdue: 0,
  today: 1,
  tomorrow: 2,
  soon: 3,
  upcoming: 4,
  none: 5,
};

export const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};
