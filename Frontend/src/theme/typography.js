/**
 * Chuẩn typography và spacing cho toàn bộ ứng dụng
 * Dựa theo quy chuẩn màn hình Hóa Đơn (HoaDon.jsx / ChiTietHoaDonScreen.jsx)
 */

export const FONT_SIZES = {
  badge: 10,       // Tag, status badge, chip nhỏ
  caption: 11,     // Chú thích nhỏ, đơn vị biểu đồ
  sub: 13,         // Ngày tháng, mô tả phụ, text phụ
  body: 14,        // Nội dung chính, text bảng, input label, item label
  bodyLarge: 15,   // Text nhấn nhẹ
  cardTitle: 16,   // Tiêu đề card vừa
  section: 18,     // Tiêu đề các mục section trong màn hình
  header: 22,      // Tiêu đề đầu trang (Header Title)
  total: 24,       // Số tiền tổng lớn vừa
  totalLarge: 28,  // Số tiền tổng nổi bật (Doanh thu, tổng tiền)
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

export const COMMON_STYLES = {
  headerTitle: {
    fontSize: FONT_SIZES.header,
    fontWeight: FONT_WEIGHTS.bold,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.section,
    fontWeight: FONT_WEIGHTS.extraBold,
  },
  cardTitle: {
    fontSize: FONT_SIZES.cardTitle,
    fontWeight: FONT_WEIGHTS.bold,
  },
  bodyText: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
  },
  subText: {
    fontSize: FONT_SIZES.sub,
    fontWeight: FONT_WEIGHTS.regular,
  },
  badgeText: {
    fontSize: FONT_SIZES.badge,
    fontWeight: FONT_WEIGHTS.bold,
  },
};
