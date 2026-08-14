using IdentityService.DTOs;
using System.ComponentModel.DataAnnotations;
public class PhongCreateDto
{
    // Các trường dữ liệu cơ bản giữ nguyên
    public int MaDayNt { get; set; }
    public int MaLoaiP { get; set; }
    public string SoPhong { get; set; }
    public decimal GiaThucTe { get; set; }
    public int? MaTtphong { get; set; }
    public int? MaTtrPhong { get; set; }


    // Lưu ý: Khi gửi form-data, danh sách object phức tạp (ThietBis) 
    // cần frontend gửi đúng định dạng: ThietBis[0].MaThBi, ThietBis[0].TrangThai
    public List<PhongThietBiCreateDto>? ThietBis { get; set; }
}
