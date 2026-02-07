$ErrorActionPreference = "Continue"
try {
    Write-Host "Calling crawler endpoint..."
    $response = Invoke-WebRequest `
        -Uri "http://localhost:3001/api/auth/mercadolibre/crawl" `
        -Method POST `
        -UseBasicParsing
    
    Write-Host "`n=== SUCCESS ===" -ForegroundColor Green
    Write-Host $response.Content
}
catch {
    Write-Host "`n=== ERROR ===" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        $reader.Close()
        Write-Host "Error Body: $errorBody"
    }
    catch {
        Write-Host "Could not read error response body"
        Write-Host $_.Exception.Message
    }
}
