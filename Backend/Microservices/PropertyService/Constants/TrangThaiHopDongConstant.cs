namespace PropertyService.Constants
{
    public static class TrangThaiHopDongConstant
    {
        public const int ChoXacNhan = 1;    // Hợp đồng mới tạo, khách chưa ký/cọc
        public const int DangHieuLuc = 2;   // Khách đang ở (Trạng thái bình thường)
        public const int SapHetHan = 3;     // Còn dưới 15-30 ngày (Cần nhắc gia hạn)
        public const int DaThanhLy = 4;     // Kết thúc đúng hạn, đã dọn đi
        public const int ChamDutSom = 5;    // Hủy hợp đồng do vi phạm hoặc lý do khác
    }
}
