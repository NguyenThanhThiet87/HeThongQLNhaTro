// Định dạng ngày sinh từ "dd/MM/yyyy" hoặc Date object sang "yyyy-MM-dd"
export function formatNgaySinh(ngaySinh) {
    if (!ngaySinh) return "";
    if (typeof ngaySinh === "string") {
        const [day, month, year] = ngaySinh.split("/");
        if (!day || !month || !year) return "";
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    if (ngaySinh instanceof Date) {
        return ngaySinh.toISOString().slice(0, 10);
    }
    return "";
}

export function getMonthDiff(startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    let months = (end.getFullYear() - start.getFullYear()) * 12 +
                 (end.getMonth() - start.getMonth());
    // Nếu muốn tính tròn tháng, kiểm tra ngày
    if (end.getDate() >= start.getDate()) months += 1;
    return months;
}

export function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const pad = n => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

// Định dạng ngày hạn: đưa vào ngày lập, cộng thêm 5 ngày, trả về "dd/MM/yyyy"
export function getDeadlineDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + 5);
    const pad = n => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
export function getMonthFromDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.getMonth() + 1;
}