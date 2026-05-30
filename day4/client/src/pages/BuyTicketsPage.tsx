import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvailableTickets, buyTicket, type Ticket, type BuyResult } from '../api/tickets';
import CongratModal from '../components/CongratModal';

interface EventGroup {
  show_name: string;
  show_date: string;
  paid_amount: string;
  count: number;
  firstId: number;
}

function groupByEvent(tickets: Ticket[]): EventGroup[] {
  const map: Record<string, EventGroup> = {};
  for (const t of tickets) {
    if (!map[t.show_name]) {
      map[t.show_name] = {
        show_name:   t.show_name,
        show_date:   t.show_date,
        paid_amount: t.paid_amount,
        count:       0,
        firstId:     t.id,
      };
    }
    map[t.show_name].count++;
  }
  return Object.values(map).sort((a, b) =>
    new Date(a.show_date).getTime() - new Date(b.show_date).getTime()
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function eventEmoji(name: string) {
  const n = name.toLowerCase();
  if (n.includes('react'))                       return '⚛️';
  if (n.includes('ai'))                          return '🤖';
  if (n.includes('node') || n.includes('full'))  return '💻';
  if (n.includes('workshop'))                    return '🛠️';
  return '🎪';
}

export default function BuyTicketsPage() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [events,     setEvents]     = useState<EventGroup[]>([]);
  const [dbCount,    setDbCount]    = useState(0);
  const [cacheCount, setCacheCount] = useState(0);
  const [pid,        setPid]        = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [buying,     setBuying]     = useState<string | null>(null);
  const [buyResult,  setBuyResult]  = useState<BuyResult | null>(null);

  const loadData = async () => {
    const data = await getAvailableTickets();
    setEvents(groupByEvent(data.tickets));
    setDbCount(data.dbCount);
    setCacheCount(data.cacheCount);
    setPid(data.pid);
  };

  useEffect(() => {
    loadData()
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = async (event: EventGroup) => {
    if (!token) return;
    setError('');
    setBuying(event.show_name);
    try {
      const result = await buyTicket(token, event.firstId);
      setBuyResult(result);
      // Refresh counts and events after purchase
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <button className="btn-icon" onClick={() => navigate('/')}>←</button>
        <div>
          <h1 className="header-title">Browse Events</h1>
          <p className="header-sub">Pick your next experience</p>
        </div>
        <div style={{ width: 40 }} />
      </header>

      <main className="main">
        {loading && (
          <div className="spinner-center">
            <div className="spinner" />
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {/* PM2 demo: shows DB count vs cache count vs which process responded */}
        {!loading && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-num">{dbCount}</span>
              <span className="stat-label">DB Total</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">{cacheCount}</span>
              <span className="stat-label">Cache Total</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">#{pid}</span>
              <span className="stat-label">Process</span>
            </div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">😢</div>
            <h2>No events available</h2>
            <p>All tickets have been sold out. Check back later!</p>
          </div>
        )}

        {events.map(event => (
          <div key={event.show_name} className="event-card">
            <div className="event-emoji">{eventEmoji(event.show_name)}</div>
            <div className="event-info">
              <h3 className="event-name">{event.show_name}</h3>
              <p className="event-date">📅 {formatDate(event.show_date)}</p>
              <div className="event-footer">
                <div className="event-pricing">
                  <span className="event-price">${event.paid_amount}</span>
                  <span className={`event-count ${event.count <= 2 ? 'event-count-low' : ''}`}>
                    {event.count} left
                  </span>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleBuy(event)}
                  disabled={buying === event.show_name}
                >
                  {buying === event.show_name ? <span className="spinner-sm" /> : 'Buy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {buyResult && (
        <CongratModal
          result={buyResult}
          onClose={() => {
            setBuyResult(null);
            navigate('/');
          }}
        />
      )}
    </div>
  );
}
