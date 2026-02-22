# Script to fix __dirname in converted ES modules and remove deprecated patterns

$classWorkPath = "c:\Users\PC\Desktop\sela-node-26--final\class_work\node-inonexerc"

Write-Host "Fixing __dirname and deprecated patterns..." -ForegroundColor Green

# Get all app.js files that use __dirname
$appFiles = Get-ChildItem -Path $classWorkPath -Filter "app.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" }

$fixedCount = 0

foreach ($file in $appFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Add __dirname polyfill if file uses __dirname and doesn't have it
    if ($content -match "__dirname" -and $content -notmatch "fileURLToPath") {
        # Add imports at the top
        $content = $content -replace "(^import [^\n]+\n)", "`$1import { fileURLToPath } from 'url';`nimport path from 'path';`n"
        
        # Add __dirname definition after imports
        $content = $content -replace "(import [^\n]+;[\s\n]+)(const\s+app)", "`$1`nconst __filename = fileURLToPath(import.meta.url);`nconst __dirname = path.dirname(__filename);`n`n`$2"
        
        # If path is already imported, avoid duplicate
        $lines = $content -split "`n"
        $pathImportCount = ($lines | Where-Object { $_ -match "^import.*path.*from\s+'path'" }).Count
        if ($pathImportCount -gt 1) {
            # Remove duplicate path import
            $firstPathFound = $false
            $newLines = foreach ($line in $lines) {
                if ($line -match "^import.*path.*from\s+'path'" -and $firstPathFound) {
                    # Skip this line
                    continue
                } elseif ($line -match "^import.*path.*from\s+'path'") {
                    $firstPathFound = $true
                    $line
                } else {
                    $line
                }
            }
            $content = $newLines -join "`n"
        }
    }
    
    # Remove deprecated MongoDB options
    $content = $content -replace ",?\s*useNewUrlParser:\s*true,?\s*", ""
    $content = $content -replace ",?\s*useUnifiedTopology:\s*true,?\s*", ""
    $content = $content -replace ",?\s*useCreateIndex:\s*true,?\s*", ""
    $content = $content -replace ",?\s*useFindAndModify:\s*false,?\s*", ""
    
    # Clean up empty options objects
    $content = $content -replace "connect\([^,]+,\s*\{\s*\}\s*\)", "connect(`$1)"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixedCount++
        Write-Host "Fixed: $($file.Directory.Name)/app.js" -ForegroundColor Cyan
    }
}

Write-Host "`nFixed $fixedCount app.js files" -ForegroundColor Green

# Now fix main.js files
$mainFiles = Get-ChildItem -Path $classWorkPath -Filter "main.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "public" }

foreach ($file in $mainFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove deprecated MongoDB options
    $content = $content -replace ",?\s*useNewUrlParser:\s*true,?\s*", ""
    $content = $content -replace ",?\s*useUnifiedTopology:\s*true,?\s*", ""
    $content = $content -replace ",?\s*useCreateIndex:\s*true,?\s*", ""
    $content = $content -replace ",?\s*useFindAndModify:\s*false,?\s*", ""
    
    # Clean up  empty options  objects
    $content = $content -replace "connect\(([^,]+),\s*\{\s*\}\s*\)", "connect(`$1)"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.Directory.Name)/main.js" -ForegroundColor Cyan
    }
}

Write-Host "`nDeprecated options removal complete!" -ForegroundColor Green
