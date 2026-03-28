using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class SpeedSmsService
{
    private readonly HttpClient _httpClient;
    private const string ApiUrl = "https://api.speedsms.vn/index.php/sms/send";
    private const string ApiToken = "WEyI7g7n-aDz5ZIGp-q1Argq6q736g0h"; // thay token của bạn

    public SpeedSmsService()
    {
        _httpClient = new HttpClient();

        var authToken = Convert.ToBase64String(
            Encoding.ASCII.GetBytes($"{ApiToken}:x")
        );

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Basic", authToken);
    }

    public async Task<bool> SendOtpAsync(string phone, string otp)
    {
        var phones = new[] { phone };
        var content = $"Ma OTP cua ban la {otp}. Hieu luc 2 phut.";
        var smsType = 2; // Gửi bằng đầu số ngẫu nhiên

        var payload = new
        {
            to = phones,
            content = content,
            sms_type = smsType
            // KHÔNG truyền sender
        };

        var json = JsonSerializer.Serialize(payload);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(ApiUrl, httpContent);
        var responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);

        if (!response.IsSuccessStatusCode)
            return false;

        using var doc = JsonDocument.Parse(responseBody);
        return doc.RootElement.GetProperty("status").GetString() == "success";
    }





}
