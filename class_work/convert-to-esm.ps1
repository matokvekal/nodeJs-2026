# PowerShell script to convert CommonJS to ES modules in class_work folder

$classWorkPath = "c:\Users\PC\Desktop\sela-node-26--final\class_work"

Write-Host "Starting conversion of CommonJS to ES modules..." -ForegroundColor Green

# Function to convert require to import
function Convert-RequireToImport {
    param([string]$filePath)
    
    if (-not (Test-Path $filePath)) {
        return
    }
    
    $content = Get-Content $filePath -Raw
    $originalContent = $content
    
    # Skip files that already use ES modules
    if ($content -match "import\s+.*\s+from\s+['\`"]") {
        Write-Host "Skipping $filePath - already uses ES modules" -ForegroundColor Yellow
        return
    }
    
    # Convert CommonJS patterns to ES modules
    
    # const x = require('x') -> import x from 'x'
    $content = $content -replace "const\s+(\w+)\s*=\s*require\s*\(\s*['\`"]([^'\`"]+)['\`"]\s*\)\s*;?", 'import $1 from ''$2'';'
    
    # var x = require('x') -> import x from 'x'
    $content = $content -replace "var\s+(\w+)\s*=\s*require\s*\(\s*['\`"]([^'\`"]+)['\`"]\s*\)\s*;?", 'import $1 from ''$2'';'
    
    # const { x, y } = require('x') -> import { x, y } from 'x'
    $content = $content -replace "const\s+\{([^}]+)\}\s*=\s*require\s*\(\s*['\`"]([^'\`"]+)['\`"]\s*\)\s*;?", 'import {$1} from ''$2'';'
    
    # var { x } = require('x') -> import { x } from 'x'  
    $content = $content -replace "var\s+\{([^}]+)\}\s*=\s*require\s*\(\s*['\`"]([^'\`"]+)['\`"]\s*\)\s*;?", 'import {$1} from ''$2'';'
    
    # require('x') side effect imports -> import 'x' 
    $content = $content -replace "require\s*\(\s*['\`"]([^'\`"]+)['\`"]\s*\)\s*;", "import '$1';"
    
    # module.exports = x -> export default x
    $content = $content -replace "module\.exports\s*=\s*", 'export default '
    
    # exports.x = y -> export const x = y (simplified - may need adjustment)
    # This is a basic conversion; complex cases may need manual review
    
    # Add .js extension to relative imports if not present
    $content = $content -replace "from\s+['\`"](\.\.?/[^'\`"]+)(?<!['\`"]\.js)['\`"]", 'from ''$1.js'''
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "Converted: $filePath" -ForegroundColor Cyan
    }
}

# Function to add "type": "module" to package.json
function Add-ModuleType {
    param([string]$filePath)
    
    if (-not (Test-Path $filePath)) {
        return
    }
    
    $content = Get-Content $filePath -Raw
    
    # Skip if already has "type": "module"
    if ($content -match '"type"\s*:\s*"module"') {
        return
    }
    
    # Add "type": "module" after the opening brace
    $content = $content -replace '(\{[^"]*"name")', '$1' -replace '(\{)', '$&' + "`n  `"type`": `"module`","
    $content = $content -replace '(\{)([^"]*"name")', '{"' + "`n  `"type`": `"module`",`n" + '$2'
    
    # Better approach: parse as JSON
    try {
        $json = $content | ConvertFrom-Json
        if (-not $json.type) {
            $json | Add-Member -MemberType NoteProperty -Name "type" -Value "module" -Force
            $content = $json | ConvertTo-Json -Depth 10
            Set-Content -Path $filePath -Value $content
            Write-Host "Added type:module to: $filePath" -ForegroundColor Green
        }
    } catch {
        Write-Host "Failed to parse JSON: $filePath" -ForegroundColor Red
    }
}

# Get all .js files in class_work (excluding node_modules)
$jsFiles = Get-ChildItem -Path $classWorkPath -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "client" -and $_.Name -notmatch "vite\.config\.js" }

Write-Host "Found $($jsFiles.Count) JavaScript files to process..." -ForegroundColor Green

foreach ($file in $jsFiles) {
    Convert-RequireToImport -filePath $file.FullName
}

# Get all package.json files
$packageFiles = Get-ChildItem -Path $classWorkPath -Filter "package.json" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "client" }

Write-Host "Found $($packageFiles.Count) package.json files to process..." -ForegroundColor Green

foreach ($file in $packageFiles) {
    Add-ModuleType -filePath $file.FullName
}

Write-Host "`nConversion complete!" -ForegroundColor Green
Write-Host "Note: Some complex patterns may require manual review." -ForegroundColor Yellow
