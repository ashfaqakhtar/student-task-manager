import { format, parseISO } from "date-fns";

export default function SessionLog({ sessions }) {
  return (
    <div className="session-log">
      {sessions.map((session) => (
        <div key={session.startedAt} className="session-log__item">
          <span>{format(parseISO(session.endedAt), "MMM d, h:mm a")}</span>
          <strong>{session.durationMinutes} min</strong>
        </div>
      ))}
    </div>
  );
}
