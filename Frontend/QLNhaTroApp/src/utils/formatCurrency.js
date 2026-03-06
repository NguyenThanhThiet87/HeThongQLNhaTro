export const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    // Chuyển về string và loại bỏ ký tự không phải số
    const numericText = value.toString().replace(/[^0-9]/g, "");
    if (!numericText) return "";
    const formatted = numericText.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formatted;
}

export const convertNumberToWords = (number) => {
    const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
    const scales = ["", "nghìn", "triệu", "tỷ"];

    if (number === 0) return "Không đồng";
    let words = "";
    let scale = 0;

    while (number > 0) {
        let n = number % 1000;
        if (n !== 0) {
            let str = "";
            let hundreds = Math.floor(n / 100);
            let remainder = n % 100;
            if (hundreds > 0) str += units[hundreds] + " trăm ";
            if (remainder > 0) {
                if (remainder < 10) {
                    if (scale !== 0 && hundreds > 0) {
                        str += "lẻ " + units[remainder];
                    } else {
                        str += units[remainder];
                    }
                } else {
                    let ten = Math.floor(remainder / 10);
                    let unit = remainder % 10;
                    str += tens[ten];
                    if (unit > 0) str += " " + units[unit];
                }
            }
            words = str.trim() + " " + scales[scale] + " " + words;
        }
        number = Math.floor(number / 1000);
        scale++;
    }
    return words.trim() + " đồng";
}