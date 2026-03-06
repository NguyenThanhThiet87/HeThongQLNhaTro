/**
 * Format số điện thoại về chuẩn +84
 */
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("0")) {
    return "+84" + cleaned.substring(1);
  }

  if (!cleaned.startsWith("+")) {
    throw new Error("Số điện thoại không hợp lệ");
  }

  return cleaned;
};
export default formatPhoneNumber;