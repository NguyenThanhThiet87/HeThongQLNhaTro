using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OpenAI.Chat;
using ServerQLNhaTro.Models;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
namespace ServerQLNhaTro.Services
{
    public class ChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        

        public ChatService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _apiKey = config["Groq:ApiKey"];
        }

        public async Task<string> AskLLM(string question, string context = "hhhhhh")
        {
            if (context.Equals(""))
                return "Tôi không có thông tin này, vui lòng liên hệ chủ trọ.";

            var prompt = $"""
Bạn là chatbot hỗ trợ người thuê nhà trọ.

Chỉ trả lời dựa trên thông tin được cung cấp bên dưới.
Nếu thông tin không có trong dữ liệu thì hãy trả lời:
"Tôi không có thông tin này, vui lòng liên hệ chủ trọ."

Thông tin nhà trọ:
{context}

Câu hỏi:
{question}
""";

            var body = new
            {
                model = "llama-3.1-8b-instant",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            var json = JsonConvert.SerializeObject(body);

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.groq.com/openai/v1/chat/completions"
            );

            request.Headers.Add("Authorization", $"Bearer {_apiKey}");
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            var result = await response.Content.ReadAsStringAsync();

            dynamic data = JsonConvert.DeserializeObject(result);

            string answer = data.choices[0].message.content;

            return answer;
        }

        public async Task<float[]> GetEmbedding(string text)
        {
            var body = new
            {
                model = "sentence-transformers/all-MiniLM-L6-v2",
                input = text
            };

            var json = JsonConvert.SerializeObject(body);

            var response = await _httpClient.PostAsync(
                "EMBEDDING_API",
                new StringContent(json, Encoding.UTF8, "application/json")
            );

            var result = await response.Content.ReadAsStringAsync();

            dynamic data = JsonConvert.DeserializeObject(result);

            return data.data[0].embedding;
        }

    }
}