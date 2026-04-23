import AnalyticsPanel from "./AnalyticsPanel";
import DeadlineCard from "./DeadlineCard";
import PlannerQuickActions from "./PlannerQuickActions";
import StatsBar from "./StatsBar";
import TaskList from "./TaskList";

export default function OverviewView(props) {
  const { upcomingTasks, colors, filteredTasks } = props;

  return (
    <div className="view-stack">
      <StatsBar
        stats={{
          dueTodayCount: props.dueTodayCount,
          estimatedHoursThisWeek: props.estimatedHoursThisWeek,
          completionRate: props.completionRate,
          streak: props.streak,
        }}
      />
      <section className="panel">
        <div className="section-heading">
          <h2>Deadline timeline</h2>
          <span className="panel-note">{props.studyHoursThisWeek.toFixed(1)}h logged this week</span>
        </div>
        <div className="deadline-strip">
          {upcomingTasks.slice(0, 12).map((task) => (
            <DeadlineCard key={task.id} task={task} color={colors[task.subject]} />
          ))}
        </div>
      </section>
      <PlannerQuickActions onCreate={props.onCreatePlannerItem} />
      <AnalyticsPanel analytics={props.analytics} />
      <TaskList {...props} tasks={filteredTasks} />
    </div>
  );
}
