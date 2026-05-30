import { Request, Response } from 'express';
import * as ticketService from '../services/ticket.service';
import { log } from '../utils/logger';

// GET /api/tickets
// Header: none required (public)
// Response 200:
// {
//   "tickets":    [ { "id": 3, "show_name": "Node.js Conference", ... }, ... ],
//   "dbCount":    18,   ← real DB count, same across ALL pm2 instances
//   "cacheCount": 17,   ← in-memory count, unique per PM2 process (pid)
//   "pid":        1001  ← which process handled this request
// }
export async function getAvailableTickets(_req: Request, res: Response): Promise<void> {
  try {
    const data = await ticketService.getAvailableTickets();

    log('info', 'tickets.list', { dbCount: data.dbCount, cacheCount: data.cacheCount });

    res.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tickets';

    log('error', 'tickets.list.error', { reason: message });

    res.status(500).json({ error: message });
  }
}

// POST /api/tickets/buy/:id
// Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// Params: id = ticket id (number)
// Response 200:
// {
//   "message": "Ticket purchased successfully",
//   "ticket": { "id": 3, "show_name": "Node.js Conference", "paid_amount": "100.00", ... },
//   "remainingInDb":    18,   ← real count from DB, same across ALL pm2 instances
//   "remainingInCache": 17,   ← in-memory count, unique per PM2 process (pid)
//   "pid": 1001               ← which process handled this request
// }
export async function buyTicket(req: Request, res: Response): Promise<void> {
  try {
    const ticketId = parseInt(req.params.id);

    if (isNaN(ticketId)) {
      log('warn', 'tickets.buy.invalid', { ticketId: req.params.id, userId: req.user?.id });
      res.status(400).json({ error: 'Invalid ticket id' });
      return;
    }

    const userId = req.user!.id;
    const { ticket, remainingInDb, remainingInCache, pid } =
      await ticketService.buyTicket(ticketId, userId);

    log('info', 'tickets.buy.success', {
      userId,
      ticketId,
      showName: ticket.show_name,
      remainingInDb,
    });

    res.json({
      message: 'Ticket purchased successfully',
      ticket,
      remainingInDb,
      remainingInCache,
      pid,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Purchase failed';
    const status  = message === 'Ticket not available' ? 409 : 500;

    log(status === 409 ? 'warn' : 'error', 'tickets.buy.failed', {
      userId: req.user?.id,
      ticketId: req.params.id,
      reason: message,
    });

    res.status(status).json({ error: message });
  }
}

// GET /api/tickets/my
// Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// Response 200:
// [
//   {
//     "id": 3,
//     "ticket_number": "a1b2c3...",
//     "show_name": "Node.js Conference",
//     "show_date": "2026-10-01T20:00:00.000Z",
//     "paid_amount": "100.00",
//     "purchased_at": "2026-05-30T12:00:00.000Z"
//   }, ...
// ]
export async function getMyTickets(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const tickets = await ticketService.getMyTickets(userId);

    log('info', 'tickets.my.fetched', { userId, count: tickets.length });

    res.json(tickets);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch your tickets';

    log('error', 'tickets.my.error', { userId: req.user?.id, reason: message });

    res.status(500).json({ error: message });
  }
}
