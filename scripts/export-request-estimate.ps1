param(
  [string]$OutDir = "exports/request-estimate"
)

$ErrorActionPreference = "Stop"

# Run from repo root.
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
  $files = @(
    "app/page.tsx",
    "app/SamCleaningClient.tsx",
    "app/layout.tsx",
    "app/api/bookings/route.ts",
    "lib/mongodb.ts",
    "app/globals.css",
    "app/sam-cleaning.css"
  )

  $missing = @()
  foreach ($f in $files) {
    if (-not (Test-Path -LiteralPath $f)) {
      $missing += $f
    }
  }
  if ($missing.Count -gt 0) {
    throw "Missing expected file(s): `n- " + ($missing -join "`n- ")
  }

  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

  $bundleTxt = Join-Path $OutDir "bundle.txt"
  $bundleZip = Join-Path $OutDir "bundle.zip"

  if (Test-Path -LiteralPath $bundleTxt) {
    Remove-Item -LiteralPath $bundleTxt -Force
  }
  if (Test-Path -LiteralPath $bundleZip) {
    Remove-Item -LiteralPath $bundleZip -Force
  }

  $nl = "`r`n"

  "Request An Estimate - Code Export" | Out-File -LiteralPath $bundleTxt -Encoding UTF8
  ("Generated: {0}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")) | Out-File -LiteralPath $bundleTxt -Encoding UTF8 -Append
  "" | Out-File -LiteralPath $bundleTxt -Encoding UTF8 -Append

  foreach ($f in $files) {
    ("===== {0} =====" -f $f) | Out-File -LiteralPath $bundleTxt -Encoding UTF8 -Append
    Get-Content -LiteralPath $f -Raw | Out-File -LiteralPath $bundleTxt -Encoding UTF8 -Append
    $nl | Out-File -LiteralPath $bundleTxt -Encoding UTF8 -Append
  }

  Compress-Archive -LiteralPath $files -DestinationPath $bundleZip

  Write-Host "Created:" -ForegroundColor Green
  Write-Host "- $bundleTxt"
  Write-Host "- $bundleZip"
  Write-Host "" 
  Write-Host "Note: .env is NOT included. Share env var names only (MONGODB_URI, MONGODB_DB)." -ForegroundColor Yellow
} finally {
  Pop-Location
}
