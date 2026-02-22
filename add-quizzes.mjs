import { readFileSync, writeFileSync } from "fs";

const presentations = [
  {
    file: "src/slides/day1/presentation4.js",
    quiz: "quiz_1_4",
    title: "HTTP & Webhooks"
  },
  {
    file: "src/slides/day2/presentation1.js",
    quiz: "quiz_2_1",
    title: "Modules & NPM Architecture"
  },
  {
    file: "src/slides/day2/presentation2.js",
    quiz: "quiz_2_2",
    title: "Express 5 Deep Dive"
  },
  {
    file: "src/slides/day2/presentation3.js",
    quiz: "quiz_2_3",
    title: "REST API Design"
  },
  {
    file: "src/slides/day2/presentation4.js",
    quiz: "quiz_2_4",
    title: "Practical Workshop"
  },
  {
    file: "src/slides/day3/presentation1.js",
    quiz: "quiz_3_1",
    title: "MongoDB & Mongoose"
  },
  {
    file: "src/slides/day3/presentation2.js",
    quiz: "quiz_3_2",
    title: "SQL & Sequelize"
  },
  {
    file: "src/slides/day3/presentation3.js",
    quiz: "quiz_3_3",
    title: "Authentication & Authorization"
  },
  {
    file: "src/slides/day3/presentation4.js",
    quiz: "quiz_3_4",
    title: "Security Deep Dive"
  },
  {
    file: "src/slides/day4/presentation1.js",
    quiz: "quiz_4_1",
    title: "WebSocket"
  },
  {
    file: "src/slides/day4/presentation2.js",
    quiz: "quiz_4_2",
    title: "Crypto in Node.js"
  },
  {
    file: "src/slides/day4/presentation3.js",
    quiz: "quiz_4_3",
    title: "Advanced Node.js"
  },
  {
    file: "src/slides/day4/presentation4.js",
    quiz: "quiz_4_4",
    title: "Testing & Code Quality"
  }
];

presentations.forEach((p) => {
  try {
    let content = readFileSync(p.file, "utf-8");

    // Skip if quiz already added
    if (content.includes('type: "quiz"')) {
      console.log(`✓ ${p.file} already has quiz`);
      return;
    }

    // Add quiz slide before closing ];
    const quizSlide = `,
  {
    id: 100,
    type: "quiz",
    lessonTitle: "${p.title}",
    questions: ${p.quiz}
  }
];`;

    content = content.replace(/\];$/, quizSlide);

    writeFileSync(p.file, content, "utf-8");
    console.log(`✅ Added quiz to ${p.file}`);
  } catch (error) {
    console.error(`❌ Error processing ${p.file}:`, error.message);
  }
});

console.log("\n✅ Done! All quizzes added.");
