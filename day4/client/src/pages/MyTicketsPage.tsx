import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTickets, type Ticket } from '../api/tickets';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function MyTicketsPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!token) return;
    getMyTickets(token)
      .then(setTickets)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1 className="header-title">My Tickets</h1>
          <p className="header-sub">Hey, {user?.username} 👋</p>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout">
          ⎋
        </button>
      </header>

      <main className="main">
        {loading && (
          <div className="spinner-center">
            <div className="spinner" />
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {!loading && tickets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <h2>No tickets yet</h2>
            <p>Find an event you love and grab your seat!</p>
            <button className="btn btn-primary" onClick={() => navigate('/buy')}>
              Browse Events
            </button>
          </div>
        )}

        {tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <span className="ticket-event">{ticket.show_name}</span>
              <span className="ticket-badge">✓ Paid</span>
            </div>
            <div className="ticket-body">
              <div className="ticket-row">
                <span className="ticket-label">📅 Date</span>
                <span className="ticket-value">{formatDate(ticket.show_date)}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">💰 Paid</span>
                <span className="ticket-value">${ticket.paid_amount}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">🎫 #</span>
                <span className="ticket-number">
                  {ticket.ticket_number.slice(0, 8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {!loading && tickets.length > 0 && (
          <button className="btn btn-outline" onClick={() => navigate('/buy')}>
            + Buy More Tickets
          </button>
        )}
      </main>
    </div>
  );
}
