import verifyOtpRegisterService from "../../services/authService";
import { useState } from "react";

export function useVerifyOTPRegister() {
  const [loading, setLoading] = useState(false);

  const verifyRegister = async (phone, otp, name, password, role) => {
    setLoading(true);
    try {
      const res = await verifyOtpRegisterService(phone, otp, name, password, role);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  return { verifyRegister, loading };
}