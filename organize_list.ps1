$csvPath = "c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\temp_sample.csv"
$outputPath = "c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\listado_organizado.txt"

# Read CSV with explicit encoding and delimiter
$data = Import-Csv -Path $csvPath -Delimiter ";" -Encoding Default

$grouped = [ordered]@{}

foreach ($row in $data) {
    $fullName = $row.NOMBRE
    if ([string]::IsNullOrWhiteSpace($fullName)) { continue }

    # Split by " - "
    $parts = $fullName -split " - ", 2

    if ($parts.Count -ge 2) {
        $type = $parts[0].Trim()
        $meas = $parts[1].Trim()

        if (-not $grouped.Contains($type)) {
            $grouped[$type] = [System.Collections.ArrayList]::new()
        }
        [void]$grouped[$type].Add($meas)
    }
}

# Write output using generic list of strings to avoid encoding issues with > redirect
$outputLines = [System.Collections.Generic.List[string]]::new()

foreach ($key in $grouped.Keys) {
    $outputLines.Add($key)
    foreach ($meas in $grouped[$key]) {
        $outputLines.Add($meas)
    }
    $outputLines.Add("") # Empty line separator
}

[System.IO.File]::WriteAllLines($outputPath, $outputLines)

Write-Host "Done. Output written to $outputPath"
