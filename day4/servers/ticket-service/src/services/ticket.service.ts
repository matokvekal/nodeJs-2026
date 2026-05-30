import { pool } from '../db/postgres';
import { getCacheCount, decrementCache } from '../cache/ticket.cache';

// GET /api/tickets — returns tickets + live counts for the PM2 demo
export async function getAvailableTickets() {
  const result = await pool.query(
    `SELECT id, ticket_number, show_name, show_date,
            original_price, discount_percent, paid_amount
     FROM tickets
     WHERE user_id IS NULL
     ORDER BY show_date ASC`
  );
  return {
    tickets:    result.rows,
    dbCount:    result.rows.length, // accurate for ALL pm2 instances (real DB)
    cacheCount: getCacheCount(),    // this process only — differs between pm2 pids
    pid:        process.pid,
  };
}

// POST /api/tickets/buy/:id — assigns the ticket to the user
// AND user_id IS NULL prevents two users from buying the same ticket at the same time
export async function buyTicket(ticketId: number, userId: number) {
  const result = await pool.query(
    `UPDATE tickets
     SET
       user_id      = $1,
       purchased_at = NOW(),
       is_paid      = true,
       paid_at      = NOW()
     WHERE id = $2
       AND user_id IS NULL
     RETURNING id, ticket_number, show_name, show_date, paid_amount`,
    [userId, ticketId]
  );

  // If no row was updated the ticket was already taken
  if (result.rowCount === 0) {
    throw new Error('Ticket not available');
  }

  // Count remaining tickets from DB — always accurate across ALL pm2 instances
  const countResult = await pool.query(
    'SELECT COUNT(*) FROM tickets WHERE user_id IS NULL'
  );
  const remainingInDb = parseInt(countResult.rows[0].count);

  // Decrement this process's in-memory cache — unique per PM2 pid
  decrementCache();
  const remainingInCache = getCacheCount();

  return {
    ticket: result.rows[0],
    remainingInDb,      // real DB count — same for all processes
    remainingInCache,   // in-memory count — each PM2 process has its own value
    pid: process.pid,   // shows WHICH process handled this request
  };
}

// GET /api/tickets/my — returns all tickets belonging to the logged-in user
export async function getMyTickets(userId: number) {
  const result = await pool.query(
    `SELECT id, ticket_number, show_name, show_date,
            original_price, discount_percent, paid_amount,
            purchased_at, paid_at
     FROM tickets
     WHERE user_id = $1
     ORDER BY purchased_at DESC`,
    [userId]
  );
  return result.rows;
}
