import { verifyOtpRegisterService } from "../../services/authService";
import { useState } from "react";
import toast from "../../utils/toast";
import { useNavigation } from "@react-navigation/native";
import formatPhoneNumber from "../../utils/formatPhoneNumber";

export function useVerifyOTPRegister() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const verifyRegister = async (phone, otp, name, password, role) => {
    if (__DEV__) console.info("[AUTH] Registration OTP verification started");
    setLoading(true);
    try {
      const res = await verifyOtpRegisterService(formatPhoneNumber(phone), otp, name, password, role);
      if (__DEV__) console.info("[AUTH] Registration OTP verification completed", { success: Boolean(res?.success) });
      if(res.success) {
        toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else {
        toast.error(res.message || "Tạo tài khoản thất bại. Vui lòng thử lại.");
      }
      await new Promise(r => setTimeout(r, 2000)); // Thêm delay 2s để test overlay

      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };


  return { verifyRegister, loading };
}
