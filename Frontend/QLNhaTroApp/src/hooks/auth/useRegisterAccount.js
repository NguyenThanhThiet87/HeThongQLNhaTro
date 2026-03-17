import { useState } from "react";
import toast from "../../utils/toast";
import { sendRegisterOTPService } from "../../services/authService";

export function useRegisterAccount(navigation) {

  const [loading, setLoading] = useState(false);

  const sendOTPRegister = async (
    name,
    phone,
    password,
    role,
    recaptchaVerifier
  ) => {

    try {

      if (!name || !phone || !password) {
        return toast.error("Vui lòng điền đầy đủ thông tin.");
      }

      setLoading(true);

      const result = await sendRegisterOTPService(
        phone,
        recaptchaVerifier
      );

      toast.success("OTP sent to: " + result.phone);

      navigation.navigate("OTPVerificationRegistor", {
        phone: phone,
        name: name,
        password: password,
        role: role
      });

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }
  };

  return {
    sendOTPRegister,
    loading
  };
}