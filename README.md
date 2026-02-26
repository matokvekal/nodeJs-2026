# Node.js Course Presentations 2026

An interactive presentation system for Node.js course materials, built with React and Vite.

## Overview

This project is a comprehensive Node.js educational platform that includes:

- Interactive presentations with syntax highlighting
- Course materials covering 4 weeks of Node.js training
- Topics including: async patterns, file systems, Express.js, databases, authentication, WebSocket, cryptography, and testing
- Hebrew language support (RTL interface)
- Hands-on exercises and code examples

## Prerequisites

Before running this project, make sure you have installed:

- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js)

## Installation

1. Clone or download this repository

2. Navigate to the project directory:

   ```bash
   cd sela-node-26--final
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another port if 5173 is busy).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── src/                    # React source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── slides/            # Presentation slides
│   └── data/              # Course data
├── nodejs-lessons/        # Organized lesson materials (Day 1-4)
├── new-presentation/      # Modern presentation content
├── lecturer/              # Lecturer notes and materials
├── class_work/            # Student exercises and examples
└── public/                # Static assets
```

## Course Content

The course covers 4 weeks (16 sessions) of Node.js topics:

**Week 1:** Modern Node.js Runtime, Async Patterns, File System & Streams, HTTP & Webhooks  
**Week 2:** Modules & NPM, Express.js 5, REST API Design, Practical Workshop  
**Week 3:** MongoDB & Mongoose, SQL & Sequelize, Authentication & Authorization, Security Deep Dive  
**Week 4:** WebSocket, Cryptography, Advanced Node.js, Testing & Code Quality

## Technologies Used

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **React Syntax Highlighter** - Code syntax highlighting
- **Assistant & Fira Code fonts** - Hebrew and code typography

## Developer

Created by Gilad Dolev

## License

Educational project for Node.js course training.
