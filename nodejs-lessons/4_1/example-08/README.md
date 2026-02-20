# WebSocket with Redis (Horizontal Scaling)

Day 4, Lesson 1 - Example 8

## Prerequisites

Install and run Redis:

```bash
# Docker
docker run -d -p 6379:6379 redis

# Or install locally
brew install redis  # macOS
redis-server
```

## Install

```bash
npm install
```

## Run

```bash
REDIS_URL=redis://localhost:6379 node index.js
```

## Test Multiple Instances

```bash
# Terminal 1
PORT=8080 node index.js

# Terminal 2
PORT=8081 node index.js

# Connect to different instances - messages sync via Redis
```
