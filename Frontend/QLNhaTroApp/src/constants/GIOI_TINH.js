export const GIOI_TINH = [
  { value: 1, label: "Nam" },
  { value: 0, label: "Nữ" },
  { value: 2, label: "Khác" }
];

export function getTenGioiTinhByValue(value) {
  switch (value) {
    case 1: return "Nam";
    case 0: return "Nữ";
    case 2: return "Khác";
    default: return "Không xác định";
  }
}