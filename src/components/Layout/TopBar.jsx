import Button from "../UI/Button";

export default function TopBar({ view, onNewTask }) {
  const titles = {
    today: ["Today", "See what deserves attention now, not just what exists in the system."],
    overview: ["Overview", "Keep coursework, deadlines, and focus sessions in one quiet place."],
    board: ["Board", "Move work from backlog to done with a clear weekly flow."],
    calendar: ["Calendar", "See your month as study load, not just dates."],
  };

  return (
    <header className="topbar">
      <div>
        <h1>{titles[view][0]}</h1>
        <p>{titles[view][1]}</p>
      </div>
      <Button onClick={onNewTask}>New task</Button>
    </header>
  );
}
