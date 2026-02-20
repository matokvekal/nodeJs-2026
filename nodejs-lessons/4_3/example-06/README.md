# Graceful Shutdown

Day 4, Lesson 3 - Example 6

## Run

```bash
node index.js
```

## Test

1. Start the server
2. Make some requests in another terminal:
   ```bash
   curl http://localhost:3000
   ```
3. Press `Ctrl+C` to trigger shutdown
4. Watch connections close gracefully

## Features

- Graceful HTTP server shutdown
- Connection tracking
- Signal handling (SIGTERM, SIGINT)
- Timeout for forced shutdown
- Resource cleanup
- Uncaught error handling
