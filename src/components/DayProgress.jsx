import "./DayProgress.css";

function DayProgress({ presentations, dayColor }) {
  return (
    <div className="day-progress">
      {presentations.map((pres, idx) => {
        const completionKey = `${pres.storageKey}-completed`;
        const isCompleted = localStorage.getItem(completionKey) === "true";

        return (
          <div
            key={pres.id}
            className={`progress-bar ${isCompleted ? "completed" : "incomplete"}`}
            style={{ "--day-color": dayColor }}
            title={`${pres.title} - ${isCompleted ? "הושלם" : "לא הושלם"}`}
          />
        );
      })}
    </div>
  );
}

export default DayProgress;
