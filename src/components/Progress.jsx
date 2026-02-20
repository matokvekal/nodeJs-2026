import "./Progress.css";

function Progress({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default Progress;
