$csvPath = "c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\LISTA DE PRECIOS BTT(GENERAL).csv"
$outCsvPath = "c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\catalogo\PRODUCTOS_OPTIMIZADOS.csv"
$outJsPath = "c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\catalogo\js\products_data.js"

$FAMILIES = @()
$FAMILIES += @{ id = 'Tornillos'; keywords = @('TOR ', 'TORNILLO') }
$FAMILIES += @{ id = 'Tuercas'; keywords = @('TUERCA') }
$FAMILIES += @{ id = 'Birlos'; keywords = @('BIRLO') }
$FAMILIES += @{ id = 'Rondanas'; keywords = @('RONDANA', 'ARANDELA') }
$FAMILIES += @{ id = 'Pijas'; keywords = @('PIJA') }
$FAMILIES += @{ id = 'Varillas'; keywords = @('VARILLA') }
$FAMILIES += @{ id = 'Herramientas'; keywords = @('BROCA', 'DADO', 'MACHUELO', 'LINTERNA', 'MICROFIBRA') }

$groups = @{}

Write-Host "Reading CSV from $csvPath..."
if (-not (Test-Path $csvPath)) {
    Write-Error "File not found: $csvPath"
    exit 1
}

$lines = [System.IO.File]::ReadAllLines($csvPath, [System.Text.Encoding]::UTF8)

foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $cols = $line.Split(';')
    if ($cols.Count -lt 2) { continue }

    $fullName = $cols[1].TrimStart('"').TrimEnd('"').Trim()
    # Skip header or empty names
    if ([string]::IsNullOrWhiteSpace($fullName) -or $fullName -eq "NOMBRE" -or $fullName -eq "DESCRIPCION") { continue }

    # Split Type and Measurement
    $parts = $fullName -split " - "
    $fullType = $parts[0]
    $measurement = if ($parts.Count -gt 1) { $parts[1] } else { "N/A" }

    # Clean Name
    # Regex equivalent to: /\s(NGO|ZINC|GALV|INOX|CADM|NEGRO|GALVANIZADO|NGA|NGR|NUEVO|NUEVA)\b/gi
    $typeClean = $fullType -replace '\s(NGO|ZINC|GALV|INOX|CADM|NEGRO|GALVANIZADO|NGA|NGR|NUEVO|NUEVA|NVO)\b', ''
    $typeClean = $typeClean.Trim()

    # Find Family
    $familyId = "Otros"
    foreach ($fam in $FAMILIES) {
        $found = $false
        foreach ($kw in $fam.keywords) {
            # Simple string contains check (case insensitive in PS)
            if ($fullName.IndexOf($kw, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
                $familyId = $fam.id
                $found = $true
                break
            }
        }
        if ($found) { break }
    }

    # Find Subfamily (first 2 words)
    $nameParts = $typeClean -split '\s+'
    $subfamily = if ($nameParts.Count -ge 2) { $nameParts[0] + " " + $nameParts[1] } else { $typeClean }

    # Add to groups
    if (-not $groups.ContainsKey($typeClean)) {
        $groups[$typeClean] = @{
            family       = $familyId
            subfamily    = $subfamily
            name         = $typeClean
            measurements = [System.Collections.Generic.HashSet[string]]::new()
        }
    }
    [void]$groups[$typeClean].measurements.Add($measurement.Trim())
}

Write-Host "Generating entries for $($groups.Count) products..."

$outputContent = [System.Text.StringBuilder]::new()
# Use `n for newline to match JS expectations usually, or CRLF is fine too for Windows
[void]$outputContent.Append("FAMILIA;SUBFAMILIA;PRODUCTO;MEDIDAS`n")

# Get keys, sort them to have deterministic output (optional but nice)
$keys = $groups.Keys | Sort-Object

foreach ($key in $keys) {
    $g = $groups[$key]
    # Sort measurements for consistency
    $measurementsArray = @($g.measurements)
    $measurementsArray = $measurementsArray | Sort-Object
    $mList = $measurementsArray -join "|"
    [void]$outputContent.Append("$($g.family);$($g.subfamily);$($g.name);$mList`n")
}

$csvString = $outputContent.ToString()

Write-Host "Writing CSV to $outCsvPath..."
[System.IO.File]::WriteAllText($outCsvPath, $csvString, [System.Text.Encoding]::UTF8)

Write-Host "Writing JS to $outJsPath..."
# Write JS file: const PRODUCT_CSV_DATA = `...`;
# Escape backticks in content just in case (though unlikely in product names)
$jsCsvString = $csvString.Replace('`', '\`')
$jsContent = "const PRODUCT_CSV_DATA = ``$jsCsvString``;"
[System.IO.File]::WriteAllText($outJsPath, $jsContent, [System.Text.Encoding]::UTF8)

Write-Host "Optimization complete."
