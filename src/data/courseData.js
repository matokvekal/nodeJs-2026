// Day 1
import { slides as slides_1_1 } from "../slides/day1/presentation1";
import { slides as slides_1_2 } from "../slides/day1/presentation2";
import { slides as slides_1_3 } from "../slides/day1/presentation3";
import { slides as slides_1_4 } from "../slides/day1/presentation4";

// Day 2
import { slides as slides_2_1 } from "../slides/day2/presentation1";
import { slides as slides_2_2 } from "../slides/day2/presentation2";
import { slides as slides_2_3 } from "../slides/day2/presentation3";
import { slides as slides_2_4 } from "../slides/day2/presentation4";

// Day 3
import { slides as slides_3_1 } from "../slides/day3/presentation1";
import { slides as slides_3_2 } from "../slides/day3/presentation2";
import { slides as slides_3_3 } from "../slides/day3/presentation3";
import { slides as slides_3_4 } from "../slides/day3/presentation4";

// Day 4
import { slides as slides_4_1 } from "../slides/day4/presentation1";
import { slides as slides_4_2 } from "../slides/day4/presentation2";
import { slides as slides_4_3 } from "../slides/day4/presentation3";
import { slides as slides_4_4 } from "../slides/day4/presentation4";

const BASE = "https://github.com/matokvekal/nodeJs/tree/main/nodejs-lessons";

export const courseData = {
  day1: {
    title: "יום 1",
    subtitle: "Node.js Runtime & Async",
    description: "V8, libuv, Event Loop, Async Patterns, File System, HTTP",
    color: "#61dafb",
    githubLink: `${BASE}/day1_lesson1`,
    presentations: [
      {
        id: "1_1",
        title: "Modern Node.js Runtime",
        subtitle: "V8, libuv, Event Loop, process",
        slides: slides_1_1,
        storageKey: "presentation-01-current-slide",
        available: true,
        githubLink: `${BASE}/day1_lesson1`
      },
      {
        id: "1_2",
        title: "Async Patterns",
        subtitle: "Callbacks, Promises, async/await",
        slides: slides_1_2,
        storageKey: "presentation-02-current-slide",
        available: true,
        githubLink: `${BASE}/day1_lesson2`
      },
      {
        id: "1_3",
        title: "File System & Streams",
        subtitle: "fs, ReadStream, WriteStream, Pipe",
        slides: slides_1_3,
        storageKey: "presentation-03-current-slide",
        available: true,
        githubLink: `${BASE}/day1_lesson3`
      },
      {
        id: "1_4",
        title: "HTTP & Webhooks",
        subtitle: "HTTP protocol, request handling",
        slides: slides_1_4,
        storageKey: "presentation-04-current-slide",
        available: true,
        githubLink: `${BASE}/day1_lesson4`
      }
    ]
  },
  day2: {
    title: "יום 2",
    subtitle: "Express & REST APIs",
    description: "Modules, NPM, Express 5, REST API Design",
    color: "#a8dadc",
    githubLink: `${BASE}/day2_lesson1`,
    presentations: [
      {
        id: "2_1",
        title: "Modules & NPM Architecture",
        subtitle: "CommonJS, ESM, npm",
        slides: slides_2_1,
        storageKey: "presentation-05-current-slide",
        available: true,
        githubLink: `${BASE}/day2_lesson1`
      },
      {
        id: "2_2",
        title: "Express 5 Deep Dive",
        subtitle: "Routing, Middleware, Error handling",
        slides: slides_2_2,
        storageKey: "presentation-06-current-slide",
        available: true,
        githubLink: `${BASE}/day2_lesson2`
      },
      {
        id: "2_3",
        title: "REST API Design",
        subtitle: "RESTful principles, best practices",
        slides: slides_2_3,
        storageKey: "presentation-07-current-slide",
        available: true,
        githubLink: `${BASE}/day2_lesson3`
      },
      {
        id: "2_4",
        title: "Practical Workshop",
        subtitle: "Build a full API from scratch",
        slides: slides_2_4,
        storageKey: "presentation-08-current-slide",
        available: true,
        githubLink: `${BASE}/day2_lesson4`
      }
    ]
  },
  day3: {
    title: "יום 3",
    subtitle: "Databases & Security",
    description: "MongoDB, SQL, Auth, Security",
    color: "#9b59b6",
    githubLink: `${BASE}/day3_lesson1`,
    presentations: [
      {
        id: "3_1",
        title: "MongoDB & Mongoose",
        subtitle: "NoSQL, schemas, queries",
        slides: slides_3_1,
        storageKey: "presentation-09-current-slide",
        available: true,
        githubLink: `${BASE}/day3_lesson1`
      },
      {
        id: "3_2",
        title: "SQL & Sequelize",
        subtitle: "Relational DB, ORM",
        slides: slides_3_2,
        storageKey: "presentation-10-current-slide",
        available: true,
        githubLink: `${BASE}/day3_lesson2`
      },
      {
        id: "3_3",
        title: "Authentication & Authorization",
        subtitle: "JWT, sessions, OAuth",
        slides: slides_3_3,
        storageKey: "presentation-11-current-slide",
        available: true,
        githubLink: `${BASE}/day3_lesson3`
      },
      {
        id: "3_4",
        title: "Security Deep Dive",
        subtitle: "OWASP, XSS, SQL Injection",
        slides: slides_3_4,
        storageKey: "presentation-12-current-slide",
        available: true,
        githubLink: `${BASE}/day3_lesson4`
      }
    ]
  },
  day4: {
    title: "יום 4",
    subtitle: "Advanced Node.js",
    description: "WebSockets, Crypto, Testing, Performance",
    color: "#f39c12",
    githubLink: `${BASE}/day4_lesson1`,
    presentations: [
      {
        id: "4_1",
        title: "WebSocket & Real-time",
        subtitle: "Socket.io, live communication",
        slides: slides_4_1,
        storageKey: "presentation-13-current-slide",
        available: true,
        githubLink: `${BASE}/day4_lesson1`
      },
      {
        id: "4_2",
        title: "Crypto in Node.js",
        subtitle: "Encryption, hashing, signing",
        slides: slides_4_2,
        storageKey: "presentation-14-current-slide",
        available: true,
        githubLink: `${BASE}/day4_lesson2`
      },
      {
        id: "4_3",
        title: "Advanced Node.js",
        subtitle: "Clusters, workers, performance",
        slides: slides_4_3,
        storageKey: "presentation-15-current-slide",
        available: true,
        githubLink: `${BASE}/day4_lesson3`
      },
      {
        id: "4_4",
        title: "Testing & Code Quality",
        subtitle: "node:test, Jest, best practices",
        slides: slides_4_4,
        storageKey: "presentation-16-current-slide",
        available: true,
        githubLink: `${BASE}/day4_lesson4`
      }
    ]
  }
};
