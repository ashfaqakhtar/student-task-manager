function formatMinutes(minutes) {
  if (!minutes) return "0 min";
  if (minutes >= 60) return `${(minutes / 60).toFixed(minutes % 60 === 0 ? 0 : 1)}h`;
  return `${minutes} min`;
}

export default function AnalyticsPanel({ analytics }) {
  const peakMinutes = Math.max(...analytics.weeklyForecast.map((day) => day.minutes), 1);

  return (
    <section className="panel analytics-panel">
      <div className="section-heading">
        <div>
          <h2>Study intelligence</h2>
          <p className="panel-note">Explainable analytics for workload, risk, and planning quality</p>
        </div>
        <div className={`health-score health-score--${analytics.healthLabel.toLowerCase().replace(/\s+/g, "-")}`}>
          <strong>{analytics.healthScore}</strong>
          <span>{analytics.healthLabel}</span>
        </div>
      </div>
      <p className="analytics-panel__explanation">{analytics.healthExplanation}</p>

      <div className="analytics-grid">
        <article className="analytics-card analytics-card--summary">
          <span className="analytics-card__eyebrow">Project signal</span>
          <h3>Planning health snapshot</h3>
          <ul className="analytics-list">
            {analytics.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <span className="analytics-card__eyebrow">Risk radar</span>
          <div className="analytics-kpis">
            <div>
              <strong>{analytics.overdueCount}</strong>
              <span>Overdue</span>
            </div>
            <div>
              <strong>{analytics.dueSoonCount}</strong>
              <span>Due soon</span>
            </div>
            <div>
              <strong>{analytics.unscheduledCount}</strong>
              <span>Unscheduled</span>
            </div>
            <div>
              <strong>{analytics.highPriorityBacklogCount}</strong>
              <span>High backlog</span>
            </div>
          </div>
        </article>

        <article className="analytics-card">
          <span className="analytics-card__eyebrow">Study pattern</span>
          <div className="analytics-kpis">
            <div>
              <strong>{analytics.completionRate}%</strong>
              <span>Completion</span>
            </div>
            <div>
              <strong>{analytics.focusHoursLogged.toFixed(1)}h</strong>
              <span>Focus logged</span>
            </div>
            <div>
              <strong>{analytics.averageTaskSize}</strong>
              <span>Avg mins</span>
            </div>
          </div>
        </article>
      </div>

      <div className="analytics-grid analytics-grid--secondary">
        <article className="analytics-card">
          <span className="analytics-card__eyebrow">Next 7 days</span>
          <div className="forecast-list">
            {analytics.weeklyForecast.map((day) => (
              <div key={day.dateKey} className="forecast-row">
                <div className="forecast-row__meta">
                  <strong>{day.label}</strong>
                  <span>{day.shortDate}</span>
                </div>
                <div className="forecast-row__bar">
                  <i style={{ width: `${(day.minutes / peakMinutes) * 100}%` }} />
                </div>
                <div className="forecast-row__value">
                  <strong>{formatMinutes(day.minutes)}</strong>
                  <span>{day.taskCount} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-card">
          <span className="analytics-card__eyebrow">Subject load</span>
          <div className="subject-insights">
            {analytics.subjectInsights.map((subject) => (
              <div key={subject.subject} className="subject-insight">
                <div className="subject-insight__meta">
                  <strong>{subject.subject}</strong>
                  <span>
                    {subject.activeCount} active, {subject.completedCount} done
                  </span>
                </div>
                <div className="subject-insight__stats">
                  <span>{formatMinutes(subject.minutesPlanned)}</span>
                  <span>{subject.completionRate}% complete</span>
                  <span>
                    {subject.averageProgress == null
                      ? "No subtasks yet"
                      : `${subject.averageProgress}% subtask progress`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
