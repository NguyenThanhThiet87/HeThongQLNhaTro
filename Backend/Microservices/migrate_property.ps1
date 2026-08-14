$service = "PropertyService"
$monolith = "..\ServerQLNhaTro\ServerQLNhaTro"

Write-Host "Installing NuGet Packages for $service..."
dotnet add $service package Microsoft.EntityFrameworkCore -v 9.0.0
dotnet add $service package Microsoft.EntityFrameworkCore.Design -v 9.0.0
dotnet add $service package Microsoft.EntityFrameworkCore.Tools -v 9.0.0
dotnet add $service package Npgsql.EntityFrameworkCore.PostgreSQL -v 9.0.0
dotnet add $service package CloudinaryDotNet -v 1.29.2
dotnet add $service package Microsoft.AspNetCore.Authentication.JwtBearer -v 9.0.0

Write-Host "Creating folders..."
New-Item -ItemType Directory -Force -Path "$service/Models"
New-Item -ItemType Directory -Force -Path "$service/Controllers"
New-Item -ItemType Directory -Force -Path "$service/Services"
New-Item -ItemType Directory -Force -Path "$service/Data"
New-Item -ItemType Directory -Force -Path "$service/DTOs"

Write-Host "Copying files from Monolith..."
$models = @("Phong.cs", "DayNhaTro.cs", "LoaiPhong.cs", "TrangThaiPhong.cs", "ThietBi.cs", "PhongThietBi.cs", "AnhPhong.cs", "ChuNhaTro.cs")
foreach ($model in $models) {
    Copy-Item "$monolith/Models/$model" -Destination "$service/Models/"
}

Copy-Item "$monolith/Controllers/PhongNhaTroController.cs" -Destination "$service/Controllers/"
Copy-Item "$monolith/Services/CloudinaryService.cs" -Destination "$service/Services/"

Copy-Item -Recurse -Force "$monolith/DTOs/PhongViewDto.cs" -Destination "$service/DTOs/"
Copy-Item -Recurse -Force "$monolith/DTOs/DayNhaTroCreateDto.cs" -Destination "$service/DTOs/"
Copy-Item -Recurse -Force "$monolith/DTOs/ResponseDtos" -Destination "$service/DTOs/"
Copy-Item "$monolith/Helper.cs" -Destination "$service/"

Write-Host "Replacing namespaces..."
Get-ChildItem -Path $service -Recurse -Include *.cs | ForEach-Object {
    (Get-Content $_.FullName) -replace 'namespace ServerQLNhaTro', 'namespace PropertyService' -replace 'using ServerQLNhaTro', 'using PropertyService' | Set-Content $_.FullName
}

Write-Host "Migration script completed."
