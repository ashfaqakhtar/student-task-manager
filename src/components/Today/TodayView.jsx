import RecommendedTasks from "./RecommendedTasks";
import TodayListSection from "./TodayListSection";
import TodaySummary from "./TodaySummary";

export default function TodayView({ data, colors, onFocus }) {
  return (
    <div className="view-stack">
      <TodaySummary
        dueTodayCount={data.dueToday.length}
        plannedCount={data.plannedToday.length}
        totalPlannedMinutes={data.totalPlannedMinutes}
        totalRecommendedMinutes={data.totalRecommendedMinutes}
        inProgressCount={data.inProgress.length}
      />
      <RecommendedTasks tasks={data.recommended} colors={colors} onFocus={onFocus} />
      <div className="today-grid">
        <TodayListSection
          title="Planned for today"
          note={`${data.totalPlannedMinutes} min scheduled`}
          tasks={data.plannedToday}
          colors={colors}
          onFocus={onFocus}
          emptyText="Nothing is scheduled for today yet."
        />
        <TodayListSection
          title="Quick wins"
          note="Low-friction tasks you can clear fast"
          tasks={data.quickWins}
          colors={colors}
          onFocus={onFocus}
          emptyText="No quick wins right now."
        />
      </div>
      <div className="today-grid">
        <TodayListSection
          title="Due today"
          note="Keep these from slipping"
          tasks={data.dueToday}
          colors={colors}
          onFocus={onFocus}
          emptyText="Nothing is due today."
        />
        <TodayListSection
          title="Already in progress"
          note="Finish active work before starting too much new work"
          tasks={data.inProgress}
          colors={colors}
          onFocus={onFocus}
          emptyText="No active work at the moment."
        />
      </div>
    </div>
  );
}
