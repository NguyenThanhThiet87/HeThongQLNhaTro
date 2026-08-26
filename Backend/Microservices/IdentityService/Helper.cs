using System.Net;

namespace IdentityService
{
    public class Helper
    {
        public static string GetPublicIdFromUrl(string url)
        {
            try
            {
                // 1. Tìm vị trí chữ "upload/"
                int uploadIndex = url.IndexOf("upload/");
                if (uploadIndex == -1) return null;

                // Cắt bỏ phần đầu, chỉ lấy từ sau chữ "upload/"
                // Chuỗi còn lại: "v1727411350/AooQuan/hevik/%C3%A1o%20hevik%20%C4%91en/..."
                string step1 = url.Substring(uploadIndex + 7); // +7 là độ dài chữ "upload/"

                // 2. Xử lý Version (v123456/)
                // Nếu bắt đầu bằng 'v' + số -> Cắt bỏ đến dấu '/' tiếp theo
                if (step1.StartsWith("v") && char.IsDigit(step1[1]))
                {
                    int slashIndex = step1.IndexOf('/');
                    if (slashIndex != -1)
                    {
                        step1 = step1.Substring(slashIndex + 1);
                    }
                }
                // Chuỗi lúc này: "AooQuan/hevik/%C3%A1o%20hevik%20%C4%91en/AO...jpg"

                // 3. Xử lý đuôi file (.jpg, .png)
                int lastDotIndex = step1.LastIndexOf('.');
                if (lastDotIndex != -1)
                {
                    step1 = step1.Substring(0, lastDotIndex);
                }
                // Chuỗi lúc này: "AooQuan/hevik/%C3%A1o%20hevik%20%C4%91en/AO..."

                // 4. QUAN TRỌNG: Giải mã URL (Decode)
                // Biến "%C3%A1" thành "á", "%20" thành " "
                string finalPublicId = WebUtility.UrlDecode(step1);

                return finalPublicId;
            }
            catch
            {
                return null;
            }
        }

        public static DateOnly? ParseDateOnly(string? dateStr)
        {
            if (string.IsNullOrWhiteSpace(dateStr)) return null;
            string[] formats = {
                "yyyy-MM-dd",
                "dd/MM/yyyy",
                "d/M/yyyy",
                "yyyy/MM/dd",
                "dd-MM-yyyy",
                "yyyy-MM-ddTHH:mm:ss",
                "yyyy-MM-ddTHH:mm:ss.fffZ",
                "yyyy-MM-ddTHH:mm:ssZ"
            };
            if (DateOnly.TryParseExact(dateStr.Trim(), formats, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var date))
            {
                return date;
            }
            if (DateTime.TryParse(dateStr.Trim(), out var dt))
            {
                return DateOnly.FromDateTime(dt);
            }
            return null;
        }
    }
}
