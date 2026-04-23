import Button from "../UI/Button";

const ACTIONS = [
  {
    id: "syllabus",
    title: "Add syllabus",
    description: "Create a regular or exam-focused syllabus plan with topic tracking.",
    cta: "New syllabus",
  },
  {
    id: "class-routine",
    title: "Add class routine",
    description: "Capture your weekly class flow, timings, and recurring study structure.",
    cta: "New class routine",
  },
  {
    id: "exam-routine",
    title: "Add exam routine",
    description: "Plan a revision-first exam routine with deadlines, checklists, and scope.",
    cta: "New exam routine",
  },
];

export default function PlannerQuickActions({ onCreate }) {
  return (
    <section className="panel planner-actions">
      <div className="section-heading">
        <div>
          <h2>Academic planner</h2>
          <p className="panel-note">Add your syllabus and routines directly from the overview page</p>
        </div>
      </div>
      <div className="planner-actions__grid">
        {ACTIONS.map((action) => (
          <article key={action.id} className="planner-action-card">
            <span className="planner-action-card__eyebrow">{action.title}</span>
            <strong>{action.cta}</strong>
            <p>{action.description}</p>
            <Button variant="secondary" onClick={() => onCreate(action.id)}>
              {action.cta}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
