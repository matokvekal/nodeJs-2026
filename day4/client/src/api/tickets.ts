const TICKETS_URL = import.meta.env.VITE_TICKETS_URL ?? 'http://localhost:3002';

export interface Ticket {
  id: number;
  ticket_number: string;
  show_name: string;
  show_date: string;
  original_price: string;
  discount_percent: string;
  paid_amount: string;
  purchased_at?: string;
  paid_at?: string;
}

export interface BuyResult {
  message: string;
  ticket: Ticket;
  remainingInDb: number;
  remainingInCache: number;
  pid: number;
}

export interface TicketsResponse {
  tickets:    Ticket[];
  dbCount:    number;   // DB count — accurate across all PM2 instances
  cacheCount: number;   // in-memory count — unique per PM2 process
  pid:        number;   // which PM2 process responded
}

export async function getAvailableTickets(): Promise<TicketsResponse> {
  const res = await fetch(`${TICKETS_URL}/api/tickets`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Failed to fetch tickets');
  return data;
}

export async function buyTicket(token: string, ticketId: number): Promise<BuyResult> {
  const res = await fetch(`${TICKETS_URL}/api/tickets/buy/${ticketId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Purchase failed');
  return data;
}

export async function getMyTickets(token: string): Promise<Ticket[]> {
  const res = await fetch(`${TICKETS_URL}/api/tickets/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Failed to fetch your tickets');
  return data;
}
