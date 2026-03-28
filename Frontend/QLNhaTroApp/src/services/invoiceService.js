import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { formatDate } from '../utils/formatNgaySinh';
import { getTenTrangThaiHoaDonByValue } from '../constants/TRANG_THAI_HOA_DON';
import { formatCurrency, convertNumberToWords } from '../utils/formatCurrency';
import toast from '../utils/toast';

export const exportInvoiceToPDF = async (hoaDon) => {
  if (!hoaDon) return;
  try {
    const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
              .header { border-bottom: 2px solid #13c8ec; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: baseline; }
              .header h1 { color: #13c8ec; margin: 0; font-size: 28px; }
              .header .invoice-info { text-align: right; }
              .header .invoice-info p { margin: 2px 0; color: #666; font-size: 14px; }
              .section { margin-bottom: 25px; background: #f9fafb; padding: 20px; border-radius: 8px; }
              .section-title { font-weight: bold; font-size: 14px; color: #000; margin-bottom: 12px; border-bottom: 1px solid #ddd; padding-bottom: 5px; text-transform: uppercase; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
              .row .label { color: #555; }
              .row .value { font-weight: 500; }
              .row.bold { font-weight: bold; color: #000; }
              .total-card { background: #1a2e32; color: #fff; padding: 30px; border-radius: 12px; margin-top: 40px; text-align: center; }
              .total-label { font-size: 12px; font-weight: bold; opacity: 0.8; letter-spacing: 1px; }
              .total-amount { font-size: 32px; font-weight: 900; margin: 10px 0; }
              .total-words { font-style: italic; font-size: 13px; opacity: 0.7; }
              .footer-note { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>HÓA ĐƠN</h1>
              <div class="invoice-info">
                <p>Mã: #HD${hoaDon.maHoaDon}</p>
                <p>Ngày lập: ${formatDate(hoaDon.ngayLap)}</p>
                <p>Trạng thái: ${getTenTrangThaiHoaDonByValue(hoaDon.maTthoaDon)}</p>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</p>
                <p style="margin: 0; font-size: 16px; color: #13c8ec;">${hoaDon.nguoiDaiDien?.hoTen}</p>
                <p style="margin: 0; color: #666;">Phòng: ${hoaDon.soPhong}</p>
                <p style="margin: 0; color: #666;">Dãy: ${hoaDon.tenDayNhaTro}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Chi tiết tiền điện</div>
              <div class="row"><span class="label">Chỉ số cũ:</span><span class="value">${hoaDon.chiSoDienNuoc?.csdienCu} kWh</span></div>
              <div class="row"><span class="label">Chỉ số mới:</span><span class="value">${hoaDon.chiSoDienNuoc?.csdienMoi} kWh</span></div>
              <div class="row bold" style="color: #13c8ec;"><span class="label">Tiêu thụ:</span><span class="value">${(hoaDon.chiSoDienNuoc?.csdienMoi - hoaDon.chiSoDienNuoc?.csdienCu) || 0} kWh</span></div>
              <div class="row"><span class="label">Đơn giá:</span><span class="value">${formatCurrency(hoaDon.chiSoDienNuoc?.giaDien)} đ</span></div>
              <div class="row bold"><span class="label">Thành tiền điện:</span><span class="value">${formatCurrency(hoaDon.tienDien)} đ</span></div>
            </div>

            <div class="section">
              <div class="section-title">Chi tiết tiền nước</div>
              <div class="row"><span class="label">Chỉ số cũ:</span><span class="value">${hoaDon.chiSoDienNuoc?.csnuocCu} m³</span></div>
              <div class="row"><span class="label">Chỉ số mới:</span><span class="value">${hoaDon.chiSoDienNuoc?.csnuocMoi} m³</span></div>
              <div class="row bold" style="color: #13c8ec;"><span class="label">Tiêu thụ:</span><span class="value">${(hoaDon.chiSoDienNuoc?.csnuocMoi - hoaDon.chiSoDienNuoc?.csnuocCu) || 0} m³</span></div>
              <div class="row"><span class="label">Đơn giá:</span><span class="value">${formatCurrency(hoaDon.chiSoDienNuoc?.giaNuoc)} đ</span></div>
              <div class="row bold"><span class="label">Thành tiền nước:</span><span class="value">${formatCurrency(hoaDon.tienNuoc)} đ</span></div>
            </div>

            <div class="section">
              <div class="section-title">Dịch vụ khác</div>
              <div class="row"><span class="label">Tiền phòng (Tháng ${new Date(hoaDon.ngayLap).getMonth() + 1}):</span><span class="value">${formatCurrency(hoaDon.tienPhong)} đ</span></div>
              <div class="row bold"><span class="label">Tổng cộng các phí khác:</span><span class="value">${formatCurrency(hoaDon.tienPhong)} đ</span></div>
            </div>

            <div class="total-card">
              <div class="total-label">TỔNG CỘNG THANH TOÁN</div>
              <div class="total-amount">${formatCurrency(hoaDon.tongTien)} đ</div>
              <div class="total-words">${convertNumberToWords(hoaDon.tongTien)}</div>
            </div>

            <div class="footer-note">Hóa đơn này được tạo bởi HeThongQLNhaTro. Cảm ơn bạn đã sử dụng dịch vụ.</div>
          </body>
        </html>
      `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
    toast.success("Hóa đơn đã được lưu dưới dạng PDF");
  } catch (error) {
    console.error("Lỗi xuất PDF:", error);
    toast.error("Không thể tạo file PDF");
  }
};
