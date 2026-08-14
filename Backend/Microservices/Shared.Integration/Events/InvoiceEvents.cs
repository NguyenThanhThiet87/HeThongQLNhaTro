namespace Shared.Integration.Events
{
    public interface IInvoiceCreatedEvent
    {
        int MaHoaDon { get; set; }
        int MaPhong { get; set; }
        string SoPhong { get; set; }
        int MaNguoiDaiDien { get; set; }
        decimal TongTien { get; set; }
        System.DateTime NgayLap { get; set; }
    }
}
