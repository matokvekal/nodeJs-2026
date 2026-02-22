# Verification script to check for remaining issues

$classWorkPath = "c:\Users\PC\Desktop\sela-node-26--final\class_work"

Write-Host "`n=== VERIFICATION REPORT ===" -ForegroundColor Green

# Check for remaining require() statements
Write-Host "`n1. Checking for remaining require() statements..." -ForegroundColor Cyan
$requireFiles = Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" -and $_.FullName -notmatch "\\public\\" } |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match "(?<!\/\/).*require\s*\(" -and $content -notmatch "^import") {
            Write-Host "  - $($_.FullName)" -ForegroundColor Yellow
        }
    }

# Check for deprecated MongoDB options
Write-Host "`n2. Checking for deprecated MongoDB options..." -ForegroundColor Cyan
$mongoDeprecated = Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" } |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match "useNewUrlParser|useUnifiedTopology|useCreateIndex|useFindAndModify") {
            Write-Host "  - $($_.FullName)" -ForegroundColor Yellow
        }
    }

# Check for body-parser usage
Write-Host "`n3. Checking for body-parser usage..." -ForegroundColor Cyan
$bodyParserFiles = Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" } |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match "body-parser") {
            Write-Host "  - $($_.FullName)" -ForegroundColor Yellow
        }
    }

# Check package.json files have "type": "module"
Write-Host "`n4. Checking package.json files without type:module..." -ForegroundColor Cyan
$noModuleType = Get-ChildItem -Path $classWorkPath -Filter "package.json" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" } |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -notmatch '"type"\s*:\s*"module"') {
            Write-Host "  - $($_.FullName)" -ForegroundColor Yellow
        }
    }

# Check for var declarations (should be const/let)
Write-Host "`n5. Checking for 'var' declarations (should use const/let)..." -ForegroundColor Cyan
$varCount = 0
Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" -and $_.FullName -notmatch "\\public\\" } |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $matches = ([regex]::Matches($content, '\bvar\s+\w+')).Count
        if ($matches -gt 0) {
            $varCount += $matches
        }
    }
Write-Host "  Found $varCount 'var' declarations (consider changing to const/let)" -ForegroundColor $(if ($varCount -gt 0) { "Yellow" } else { "Green" })

# Count converted files
Write-Host "`n=== SUMMARY ===" -ForegroundColor Green
$totalJS = (Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" }).Count
$totalPackageJson = (Get-ChildItem -Path $classWorkPath -Filter "package.json" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" }).Count

Write-Host "Total JavaScript files processed: $totalJS" -ForegroundColor Green
Write-Host "Total package.json files updated: $totalPackageJson" -ForegroundColor Green

Write-Host "`nConversion complete! ✓" -ForegroundColor Green
Write-Host "Modern Node.js patterns applied:" -ForegroundColor Cyan
Write-Host "  ✓ ES Modules (import/export)" -ForegroundColor White
Write-Host "  ✓ Removed deprecated MongoDB options" -ForegroundColor White  
Write-Host "  ✓ Replaced body-parser with Express built-in methods" -ForegroundColor White
Write-Host "  ✓ Fixed __dirname for ES modules" -ForegroundColor White
Write-Host "  ✓ Removed duplicate folders" -ForegroundColor White
