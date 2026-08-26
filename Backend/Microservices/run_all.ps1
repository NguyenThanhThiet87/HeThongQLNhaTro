# Load .env file for local development if present
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Write-Host "Loading environment variables from .env..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), [System.EnvironmentVariableTarget]::Process)
        }
    }
}

Write-Host "Building Shared.Integration first..." -ForegroundColor Yellow
dotnet build "$PSScriptRoot\Shared.Integration\Shared.Integration.csproj"

$services = @(
    "IdentityService", 
    "PropertyService", 
    "ContractService", 
    "UtilityService", 
    "BillingService", 
    "MaintenanceService", 
    "CommunicationService"
)

Write-Host "Building all microservices..." -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor DarkCyan
    dotnet build "$PSScriptRoot\$service\$service.csproj"
}

Write-Host "Starting 7 Microservices..." -ForegroundColor Green

foreach ($service in $services) {
    Write-Host "Starting $service..." -ForegroundColor Cyan
    $serviceDir = Join-Path $PSScriptRoot $service
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "
        `$envFile = '$envFile'
        if (Test-Path `$envFile) {
            Get-Content `$envFile | ForEach-Object {
                `$line = `$_.Trim()
                if (`$line -and -not `$line.StartsWith('#') -and `$line.Contains('=')) {
                    `$parts = `$line.Split('=', 2)
                    [System.Environment]::SetEnvironmentVariable(`$parts[0].Trim(), `$parts[1].Trim(), [System.EnvironmentVariableTarget]::Process)
                }
            }
        }
        cd `"$serviceDir`"
        dotnet run --no-build --launch-profile http
    " -WorkingDirectory $serviceDir
}

Write-Host "All services are starting up! Check the new windows." -ForegroundColor Green
