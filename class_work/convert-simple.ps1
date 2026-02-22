# Simple bulk conversion script for CommonJS to ES modules

$classWorkPath = "c:\Users\PC\Desktop\sela-node-26--final\class_work\node-inonexerc"

Write-Host "Starting conversion..." -ForegroundColor Green

# Get all .js files (excluding node_modules, client, and config files)
$jsFiles = Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch "\\client\\" -and
        $_.FullName -notmatch "\\public\\" -and
        $_.Name -notmatch "\.config\.js$" -and
        $_.Name -notmatch "^config\.js$"
    }

$convertedCount = 0

foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Skip if already ES module
    if ($content -match "^import\s+" -or $content -match "^\s*import\s+") {
        continue
    }
    
    # Skip if no require statements
    if ($content -notmatch "require\s*\(") {
        continue
    }
    
    # Basic conversions
    $content = $content -replace "var\s+", "const "
    $content = $content -replace "const\s+(\w+)\s*=\s*require\('([^']+)'\);", "import `$1 from '`$2';"
    $content = $content -replace 'const\s+(\w+)\s*=\s*require\("([^"]+)"\);', 'import $1 from "$2";'
    $content = $content -replace "const\s+\{([^}]+)\}\s*=\s*require\('([^']+)'\);", "import {`$1} from '`$2';"
    $content = $content -replace 'const\s+\{([^}]+)\}\s*=\s*require\("([^"]+)"\);', 'import {$1} from "$2";'
    $content = $content -replace "require\('([^']+)'\);", "import '`$1';"
    $content = $content -replace 'require\("([^"]+)"\);', 'import "$1";'
    $content = $content -replace "module\.exports\s*=\s*", "export default "
    
    # Add .js to local imports
    $content = $content -replace "from\s+'(\./[^']+)'", "from '`$1.js'"
    $content = $content -replace 'from\s+"(\./[^"]+)"', 'from "$1.js"'
    $content = $content -replace "from\s+'(\.\./[^']+)'", "from '`$1.js'"
    $content = $content -replace 'from\s+  "(\.\./[^"]+)"', 'from "$1.js"'
    
    # Fix double .js.js
    $content = $content -replace "\.js\.js'", ".js'"
    $content = $content -replace '\.js\.js"', '.js"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $convertedCount++
        Write-Host "Converted: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "`nConverted $convertedCount files" -ForegroundColor Green

# Now convert package.json files
Write-Host "`nAdding type:module to package.json files..." -ForegroundColor Green

$packageFiles = Get-ChildItem -Path $classWorkPath -Filter "package.json" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" }

$packageCount = 0

foreach ($file in $packageFiles) {
    try {
        $json = Get-Content $file.FullName -Raw | ConvertFrom-Json
        
        if (-not $json.type -or $json.type -ne "module") {
            $json | Add-Member -MemberType NoteProperty -Name "type" -Value "module" -Force
            $json | ConvertTo-Json -Depth 10 | Set-Content -Path $file.FullName
            $packageCount++
            Write-Host "Updated: $($file.Name) in $($file.Directory.Name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error processing: $($file.FullName)" -ForegroundColor Red
    }
}

Write-Host "`nUpdated $packageCount package.json files" -ForegroundColor Green
Write-Host "`nConversion complete!" -ForegroundColor Green
