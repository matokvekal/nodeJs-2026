// ─────────────────────────────────────────────────────────────────────────────
//  JEST + SUPERTEST — Ticket Service Integration Tests
//
//  What is a test?
//    A function that calls your code and checks the result is what you expect.
//    If the result is wrong → the test FAILS → you know something broke.
//
//  Why supertest?
//    It lets you make real HTTP requests to your Express app
//    WITHOUT starting a server on a port. Perfect for testing APIs.
//
//  Run:  npm test
//  Output:
//    PASS tests/tickets.test.ts
//      ✓ GET /health → 200 ok
//      ✓ GET /api/tickets → 200 with tickets array
//      ...
// ─────────────────────────────────────────────────────────────────────────────

import request from 'supertest'; // makes HTTP requests to our app in memory
import app from '../src/app';    // imports our Express app (no listen — NODE_ENV=test guards it)

// describe() = a group of related tests
// think of it as a folder name for your tests
describe('Tickets API', () => {


  // ═══════════════════════════════════════════════════════════════
  //  PUBLIC ENDPOINTS — no login required
  // ═══════════════════════════════════════════════════════════════

  // it() = one test
  // first argument = name shown in the terminal output
  it('GET /health → should return 200 and status ok', async () => {

    // Step 1: make the request
    const res = await request(app).get('/health');

    // Step 2: expect (check) the result
    // expect(value).toBe(expected)  — fails the test if they don't match
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');

    // TO BREAK THIS TEST ON PURPOSE:
    //   in app.ts change: res.json({ status: 'ok' })
    //   to:               res.status(500).json({ status: 'error' })
    //   run npm test → FAIL  Expected: 200  Received: 500
    //   revert → run npm test → PASS
  });


  it('GET /api/tickets → should return 200 with tickets array', async () => {

    const res = await request(app).get('/api/tickets');

    // Check status code
    expect(res.status).toBe(200);

    // Check response shape
    // our API returns: { tickets: [...], dbCount: 18, cacheCount: 17, pid: 1001 }
    expect(Array.isArray(res.body.tickets)).toBe(true);  // tickets must be an array
    expect(typeof res.body.dbCount).toBe('number');      // dbCount must be a number
  });


  it('GET /api/tickets → each ticket must have the required fields', async () => {

    const res = await request(app).get('/api/tickets');
    const tickets = res.body.tickets;

    // Only check if there are tickets in the DB
    // (if DB is empty the shape test is skipped — not a failure)
    if (tickets.length > 0) {
      const first = tickets[0];

      // toHaveProperty checks that the key EXISTS on the object
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('show_name');
      expect(first).toHaveProperty('show_date');
      expect(first).toHaveProperty('paid_amount');
    }
  });


  // ═══════════════════════════════════════════════════════════════
  //  PROTECTED ENDPOINTS — require Authorization: Bearer <token>
  //  Without a token → authMiddleware returns 401 Unauthorized
  // ═══════════════════════════════════════════════════════════════

  it('GET /api/tickets/my → should return 401 when no token is sent', async () => {

    // No .set('Authorization', ...) → server should reject
    const res = await request(app).get('/api/tickets/my');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error'); // response must explain why
  });


  it('POST /api/tickets/buy/1 → should return 401 when no token is sent', async () => {

    const res = await request(app).post('/api/tickets/buy/1');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });


  it('POST /api/tickets/buy/1 → should return 401 even with a fake token', async () => {

    // A made-up token that is NOT signed with our JWT_SECRET
    const res = await request(app)
      .post('/api/tickets/buy/1')
      .set('Authorization', 'Bearer this.is.fake');

    // jwt.verify() throws → authMiddleware returns 401
    expect(res.status).toBe(401);
  });


  // ═══════════════════════════════════════════════════════════════
  //  404 — route does not exist
  // ═══════════════════════════════════════════════════════════════

  it('GET /api/tickets/unknown → should return 404', async () => {

    const res = await request(app).get('/api/tickets/unknown-route');

    // Express returns 404 for routes that are not defined
    expect(res.status).toBe(404);
  });

});
