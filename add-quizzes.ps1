$presentations = @(
    @{file="src/slides/day1/presentation4.js"; quiz="quiz_1_4"; title="HTTP & Webhooks"},
    @{file="src/slides/day2/presentation1.js"; quiz="quiz_2_1"; title="Modules & NPM Architecture"},
    @{file="src/slides/day2/presentation2.js"; quiz="quiz_2_2"; title="Express 5 Deep Dive"},
    @{file="src/slides/day2/presentation3.js"; quiz="quiz_2_3"; title="REST API Design"},
    @{file="src/slides/day2/presentation4.js"; quiz="quiz_2_4"; title="Practical Workshop"},
    @{file="src/slides/day3/presentation1.js"; quiz="quiz_3_1"; title="MongoDB & Mongoose"},
    @{file="src/slides/day3/presentation2.js"; quiz="quiz_3_2"; title="SQL & Sequelize"},
    @{file="src/slides/day3/presentation3.js"; quiz="quiz_3_3"; title="Authentication & Authorization"},
    @{file="src/slides/day3/presentation4.js"; quiz="quiz_3_4"; title="Security Deep Dive"},
    @{file="src/slides/day4/presentation1.js"; quiz="quiz_4_1"; title="WebSocket"},
    @{file="src/slides/day4/presentation2.js"; quiz="quiz_4_2"; title="Crypto in Node.js"},
    @{file="src/slides/day4/presentation3.js"; quiz="quiz_4_3"; title="Advanced Node.js"},
    @{file="src/slides/day4/presentation4.js"; quiz="quiz_4_4"; title="Testing & Code Quality"}
)

foreach ($p in $presentations) {
    $file = $p.file
    $content = Get-Content $file -Raw
    
    # Skip if quiz already added
    if ($content -match 'type: "quiz"') {
        Write-Host "✓ $file already has quiz" -ForegroundColor Green
        continue
    }
    
    # Add quiz before closing ];
    $quizSlide = @"
,
  {
    id: 100,
    type: "quiz",
    lessonTitle: "$($p.title)",
    questions: $($p.quiz)
  }
"@
    
    $content = $content -replace '\];$', "$quizSlide`n];"
    
    Set-Content -Path $file -Value $content -NoNewline
    Write-Host "✓ Added quiz to $file" -ForegroundColor Cyan
}

Write-Host "`n Done! All quizzes added." -ForegroundColor Green
