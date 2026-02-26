import "./DayProgress.css";
import type { Presentation } from "../types";

interface DayProgressProps {
  presentations: Presentation[];
  dayColor: string;
}

function DayProgress({
  presentations,
  dayColor
}: DayProgressProps): JSX.Element {
  return (
    <div className="day-progress">
      {presentations.map((pres, idx) => {
        const completionKey: string = `${pres.storageKey}-completed`;
        const isCompleted: boolean =
          localStorage.getItem(completionKey) === "true";

        return (
          <div
            key={pres.id}
            className={`progress-bar ${isCompleted ? "completed" : "incomplete"}`}
            style={{ "--day-color": dayColor } as React.CSSProperties}
            title={`${pres.title} - ${isCompleted ? "הושלם" : "לא הושלם"}`}
          />
        );
      })}
    </div>
  );
}

export default DayProgress;
