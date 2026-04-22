import Button from "../UI/Button";
import ProgressRing from "../UI/ProgressRing";

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function PomodoroTimer({ timer, onComplete }) {
  const progress = 1 - timer.secondsLeft / timer.totalSeconds;

  return (
    <section className="focus-timer">
      <ProgressRing value={progress} label={formatTime(timer.secondsLeft)} />
      <div className="focus-timer__meta">
        <span>{timer.mode === "work" ? "Focus block" : "Short break"}</span>
      </div>
      <div className="focus-timer__actions">
        <Button onClick={timer.isRunning ? timer.pause : timer.start}>
          {timer.isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="secondary" onClick={timer.reset}>Reset</Button>
        <Button variant="ghost" onClick={onComplete}>Mark complete</Button>
      </div>
    </section>
  );
}
