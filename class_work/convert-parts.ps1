# Convert Part1 and other part folders

$folders = @(
    "c:\Users\PC\Desktop\sela-node-26--final\class_work\Part1",
    "c:\Users\PC\Desktop\sela-node-26--final\class_work\socket-work",
    "c:\Users\PC\Desktop\sela-node-26--final\class_work\socket-react-work"
)

Write-Host "Converting Part1, socket-work folders..." -ForegroundColor Green

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        continue
    }
    
    # Get all .js files
    $jsFiles = Get-ChildItem -Path $folder -Filter "*.js" -Recurse | 
        Where-Object { 
            $_.FullName -notmatch "node_modules" -and 
            $_.FullName -notmatch "\\client\\" -and
            $_.FullName -notmatch "\\public\\" -and
            $_.Name -notmatch "vite\.config\.js"
        }
    
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
        $content = $content -replace "const\s+(\w+)\s*=\s*require\('([^']+)'\);?", "import `$1 from  '`$2';"
        $content = $content -replace 'const\s+(\w+)\s*=\s*require\("([^"]+)"\);?', 'import $1 from "$2";'
        $content = $content -replace "const\s+\{([^}]+)\}\s*=\s*require\('([^']+)'\);?", "import {`$1} from '`$2';"
        $content = $content -replace 'const\s+\{([^}]+)\}\s*=\s*require\("([^"]+)"\);?', 'import {$1} from "$2";'
        $content = $content -replace "require\('([^']+)'\);?", "import '`$1';"
        $content = $content -replace 'require\("([^"]+)"\);?', 'import "$1";'
        $content = $content -replace "module\.exports\s*=\s*", "export default "
        
        # Add .js to local imports
        $content = $content -replace "from\s+'(\./[^']+)'", "from '`$1.js'"
        $content = $content -replace 'from\s+"(\./[^"]+)"', 'from "$1.js"'
        $content = $content -replace "from\s+'(\.\./[^']+)'", "from '`$1.js'"
        $content = $content -replace 'from\s+"(\.\./[^"]+)"', 'from "$1.js"'
        
        # Fix double .js.js
        $content = $content -replace "\.js\.js'", ".js'"
        $content = $content -replace '\.js\.js"', '.js"'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Converted: $($file.FullName)" -ForegroundColor Cyan
        }
    }
    
    # Update package.json files
    $packageFiles = Get-ChildItem -Path $folder -Filter "package.json" -Recurse | 
        Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\client\\" }
    
    foreach ($file in $packageFiles) {
        try {
            $json = Get-Content $file.FullName -Raw | ConvertFrom-Json
            
            if (-not $json.type -or $json.type -ne "module") {
                $json | Add-Member -MemberType NoteProperty -Name "type" -Value "module" -Force
                $json | ConvertTo-Json -Depth 10 | Set-Content -Path $file.FullName
                Write-Host "Updated package.json: $($file.FullName)" -ForegroundColor Green
            }
        } catch {
            Write-Host "Error processing: $($file.FullName)" -ForegroundColor Red
        }
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green
