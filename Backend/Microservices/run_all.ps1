$services = @(
    "IdentityService", 
    "PropertyService", 
    "ContractService", 
    "UtilityService", 
    "BillingService", 
    "MaintenanceService", 
    "CommunicationService"
)

Write-Host "Starting 7 Microservices..." -ForegroundColor Green

foreach ($service in $services) {
    Write-Host "Starting $service..." -ForegroundColor Cyan
    # Mở một cửa sổ PowerShell mới cho từng service và chạy dotnet run
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $service; dotnet run"
}

Write-Host "All services are starting up! Check the new windows." -ForegroundColor Green
