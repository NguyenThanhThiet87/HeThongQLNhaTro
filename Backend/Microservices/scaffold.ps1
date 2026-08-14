# Khởi tạo Solution chung
dotnet new sln -n HeThongQLNhaTroMicroservices

# Danh sách các services
$services = @("IdentityService", "PropertyService", "ContractService", "UtilityService", "BillingService", "MaintenanceService", "CommunicationService")

foreach ($service in $services) {
    Write-Host "Dang tao $service..."
    dotnet new webapi -n $service
    dotnet sln add "$service/$service.csproj"
}

Write-Host "Hoan tat khoi tao các dự án Microservices!"
