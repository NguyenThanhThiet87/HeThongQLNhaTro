namespace ContractService.DTOs
{
    public class NguoiThueInHopDongDto
    {
        public int MaNt { get; set; } // ID người thuê đã có trong hệ thống
        public int MaVaiTro { get; set; } // 1: Chủ hộ, 2: Thành viên
        public int MaTttamTru { get; set; } // Chưa ĐK, Đã ĐK
    }
}
