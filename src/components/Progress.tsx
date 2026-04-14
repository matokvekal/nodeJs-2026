import "./Progress.css";

interface ProgressProps {
  current: number;
  total: number;
}

function Progress({ current, total }: ProgressProps): JSX.Element {
  const percentage: number = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default Progress;
