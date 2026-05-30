import type { BuyResult } from '../api/tickets';

interface Props {
  result: BuyResult;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function CongratModal({ result, onClose }: Props) {
  const { ticket, remainingInDb, remainingInCache, pid } = result;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-check">✓</div>
        <h2 className="modal-title">Ticket Confirmed! 🎉</h2>
        <p className="modal-subtitle">{ticket.show_name}</p>

        <div className="modal-detail">
          <span>📅</span>
          <span>{formatDate(ticket.show_date)}</span>
        </div>
        <div className="modal-detail">
          <span>💰</span>
          <span>${ticket.paid_amount}</span>
        </div>
        <div className="modal-detail">
          <span>🎫</span>
          <span className="ticket-number">
            {ticket.ticket_number.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* PM2 demo stats — shows DB vs cache count per process */}
        <div className="modal-stats">
          <div className="stat">
            <span className="stat-num">{remainingInDb}</span>
            <span className="stat-label">DB Left</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">{remainingInCache}</span>
            <span className="stat-label">Cache Left</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">#{pid}</span>
            <span className="stat-label">Process</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose}>
          View My Tickets →
        </button>
      </div>
    </div>
  );
}
