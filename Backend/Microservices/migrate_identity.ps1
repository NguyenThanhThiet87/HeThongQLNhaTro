$service = "IdentityService"
$monolith = "..\ServerQLNhaTro\ServerQLNhaTro"

Write-Host "Installing NuGet Packages for $service..."
dotnet add $service package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add $service package Microsoft.EntityFrameworkCore.Design
dotnet add $service package Microsoft.EntityFrameworkCore.Tools
dotnet add $service package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add $service package BCrypt.Net-Next
dotnet add $service package Twilio # Just in case SpeedSms uses something similar or needs external libs, wait, I'll check it later.
dotnet add $service package CloudinaryDotNet # Might be needed for user avatar

Write-Host "Creating folders..."
New-Item -ItemType Directory -Force -Path "$service/Models"
New-Item -ItemType Directory -Force -Path "$service/Controllers"
New-Item -ItemType Directory -Force -Path "$service/Services"
New-Item -ItemType Directory -Force -Path "$service/Data"
New-Item -ItemType Directory -Force -Path "$service/DTOs"
New-Item -ItemType Directory -Force -Path "$service/Constants"

Write-Host "Copying files from Monolith..."
Copy-Item "$monolith/Models/NguoiDung.cs" -Destination "$service/Models/"
Copy-Item "$monolith/Models/RefreshToken.cs" -Destination "$service/Models/"
Copy-Item "$monolith/Models/VaiTroHeThong.cs" -Destination "$service/Models/"

Copy-Item "$monolith/Services/JwtTokenService.cs" -Destination "$service/Services/"
Copy-Item "$monolith/Services/SpeedSmsService.cs" -Destination "$service/Services/"

Copy-Item "$monolith/Controllers/NguoiDungController.cs" -Destination "$service/Controllers/"
Copy-Item "$monolith/Controllers/OtpController.cs" -Destination "$service/Controllers/"

Copy-Item -Recurse -Force "$monolith/DTOs" -Destination "$service/"
Copy-Item -Recurse -Force "$monolith/Constants" -Destination "$service/"
Copy-Item "$monolith/Helper.cs" -Destination "$service/"

Write-Host "Migration script completed."
