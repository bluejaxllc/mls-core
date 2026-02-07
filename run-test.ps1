Write-Host "Running Mercado Libre API test..."
$output = & npx tsx test-ml-api.ts 2>&1 | Out-String
Write-Host $output
