import { useState } from "react";
import { sendOtpService } from "../../services/authService";
import toast from "../../utils/toast";

export function useForgotPassword(navigation) {

  const [loading, setLoading] = useState(false);

  const sendOtp = async (phone, recaptchaVerifier) => {

    try {

      setLoading(true);

      const result = await sendOtpService(phone, recaptchaVerifier);

      toast.success("OTP sent to: " + result.phone);

      navigation.navigate("OTPVerification", {
        phone: result.phone
      });

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }
  };

  return {
    sendOtp,
    loading
  };
}