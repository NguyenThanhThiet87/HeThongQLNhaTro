namespace IdentityService.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class JwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(int userId, string hoTen, string soDt, string vaiTro)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var keyString = !string.IsNullOrEmpty(jwtSettings["Key"]) 
            ? jwtSettings["Key"] 
            : "a_very_long_secret_key_for_development_purposes_at_least_32_bytes";

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(keyString)
        );

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var claims = new[]
        {
            new Claim("maNd", userId.ToString()),
            new Claim("hoTen", hoTen ?? string.Empty),
            new Claim("soDt", soDt ?? string.Empty),
            new Claim("VaiTro", vaiTro ?? string.Empty)
        };

        var durationMinutes = double.TryParse(jwtSettings["DurationInMinutes"], out var d) ? d : 60;

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"] ?? "MyApp",
            audience: jwtSettings["Audience"] ?? "MyAppUser",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(durationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }

    internal object GenerateToken(int maNd, string hoTen, string soDt, int? maVaiTro)
    {
        throw new NotImplementedException();
    }
}
