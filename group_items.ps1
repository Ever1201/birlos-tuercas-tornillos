
$inputFile = "listado.txt"
$outputFile = "listado_agrupado.txt"

if (-not (Test-Path $inputFile)) {
    Write-Host "Error: $inputFile not found."
    exit
}

$itemsByType = @{}

# Read file with handling for encoding (trying default, then UTF8)
try {
    $lines = Get-Content $inputFile
}
catch {
    Write-Host "Error reading file: $_"
    exit
}

Write-Host "Read $($lines.Count) lines from $inputFile"

foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) {
        continue
    }

    $parts = $line -split " - "
    
    if ($parts.Count -ge 2) {
        $itemType = $parts[0].Trim()
        # Join the rest back in case there are more dashes
        $itemMeasure = ($parts[1..($parts.Count - 1)] -join " - ").Trim()

        if (-not $itemsByType.ContainsKey($itemType)) {
            $itemsByType[$itemType] = @()
        }
        
        $itemsByType[$itemType] += $itemMeasure
    }
}

# Sort types
$sortedTypes = $itemsByType.Keys | Sort-Object

$outputContent = @()

foreach ($type in $sortedTypes) {
    $outputContent += $type
    $outputContent += $itemsByType[$type]
    $outputContent += "" # Empty line
}

$outputContent | Set-Content -Path $outputFile -Encoding UTF8

Write-Host "Grouped items written to $outputFile"
