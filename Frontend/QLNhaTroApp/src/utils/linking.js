import { Linking, Alert } from 'react-native';

/**
 * Thực hiện mở trình gọi điện của thiết bị
 * @param {string} phoneNumber - Số điện thoại cần gọi
 */
export const makeCall = (phoneNumber) => {
    if (!phoneNumber) {
        Alert.alert("Lỗi", "Số điện thoại không hợp lệ.");
        return;
    }

    const url = `tel:${phoneNumber}`;

    Linking.openURL(url).catch(err => {
        console.log("Không thể mở trình gọi điện:", err);
        Alert.alert(
            "Thông báo",
            "Thiết bị của bạn không hỗ trợ tính năng gọi điện trực tiếp hoặc không tìm thấy ứng dụng phù hợp."
        );
    });
};
