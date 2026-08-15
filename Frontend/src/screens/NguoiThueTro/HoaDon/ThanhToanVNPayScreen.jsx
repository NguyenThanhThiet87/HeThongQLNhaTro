import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import toast from "../../../utils/toast";
import { paymentCallbackVnpay } from "../../../api/VnPay";

export default function ThanhToanVNPayScreen({ route }) {
  const { paymentUrl } = route.params;
  const navigation = useNavigation();

  const handleShouldStartLoad = (request) => {
    if (request.url.startsWith("myapp://vnpay-callback")) {
      paymentCallbackVnpay(request.url).then((result) => {
        console.log("result", result);
        if (result.success) {
          toast.success("Thanh toán thành công!");
          console.log("Navigating back...");
          // Thử về 'HoaDon' (nếu ở tab Hóa đơn) hoặc 'Home' (nếu ở tab Trang chủ)
          navigation.navigate("HoaDon");

        } else {
          toast.error(result.message || "Thanh toán thất bại");
          navigation.goBack();
        }
      });
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <WebView
        source={{ uri: paymentUrl }}
        originWhitelist={['https://*', 'http://*', 'myapp://*']}  // ✅ Thêm dòng này
        onShouldStartLoadWithRequest={handleShouldStartLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  backText: { fontSize: 15, color: "#2563eb" },
});