$service = "ContractService"
$monolith = "..\ServerQLNhaTro\ServerQLNhaTro"

Write-Host "Installing NuGet Packages for $service..."
dotnet add $service package Microsoft.EntityFrameworkCore -v 9.0.0
dotnet add $service package Microsoft.EntityFrameworkCore.Design -v 9.0.0
dotnet add $service package Microsoft.EntityFrameworkCore.Tools -v 9.0.0
dotnet add $service package Npgsql.EntityFrameworkCore.PostgreSQL -v 9.0.0
dotnet add $service package Microsoft.AspNetCore.Authentication.JwtBearer -v 9.0.0
dotnet add $service package Swashbuckle.AspNetCore

Write-Host "Creating folders..."
New-Item -ItemType Directory -Force -Path "$service/Models"
New-Item -ItemType Directory -Force -Path "$service/Controllers"
New-Item -ItemType Directory -Force -Path "$service/Services"
New-Item -ItemType Directory -Force -Path "$service/Data"
New-Item -ItemType Directory -Force -Path "$service/DTOs"

Write-Host "Copying files from Monolith..."
$models = @("HopDongThue.cs", "HopDongNguoiThue.cs", "TrangThaiHopDong.cs", "NguoiThueTro.cs", "VaiTroNguoiThue.cs", "TrangThaiTamTru.cs", "NguoiLienHeKhanCap.cs")
foreach ($model in $models) {
    Copy-Item "$monolith/Models/$model" -Destination "$service/Models/"
}

Copy-Item "$monolith/Controllers/HopDongController.cs" -Destination "$service/Controllers/"

Copy-Item -Recurse -Force "$monolith/DTOs/HopDongCreateDto.cs" -Destination "$service/DTOs/"
Copy-Item -Recurse -Force "$monolith/DTOs/HopDongViewDto.cs" -Destination "$service/DTOs/"
Copy-Item -Recurse -Force "$monolith/DTOs/ResponseDtos" -Destination "$service/DTOs/"
Copy-Item "$monolith/Helper.cs" -Destination "$service/"

Copy-Item -Recurse -Force "..\IdentityService\DTOs\ApiResponse.cs" -Destination "$service/DTOs/"
Copy-Item -Recurse -Force "$monolith/Constants" -Destination "$service/"

Write-Host "Replacing namespaces..."
Get-ChildItem -Path $service -Recurse -Include *.cs | ForEach-Object {
    (Get-Content $_.FullName) -replace 'namespace ServerQLNhaTro', 'namespace ContractService' -replace 'using ServerQLNhaTro', 'using ContractService' -replace 'namespace IdentityService.DTOs', 'namespace ContractService.DTOs' | Set-Content $_.FullName
}

Write-Host "Migration script completed."
