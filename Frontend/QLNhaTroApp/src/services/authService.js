import { loginApi, isExistAccount, } from "../api/auth";
import { sendOTP } from "./phoneAuthService";

import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export const loginService = async (phoneNumber, password) => {

    const result = await loginApi(phoneNumber, password);

    if (!result.success) {
        throw new Error(result.message || "Đăng nhập thất bại");
    }

    const data = result.data;

    const decoded = jwtDecode(data.accessToken);

    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);

    return decoded;
};

export const sendOtpService = async (phone, recaptchaVerifier) => {

    const exist = await isExistAccount(phone);

    if (!exist) {
        throw new Error("Số điện thoại chưa đăng ký tài khoản: " + phone);
    }

    const result = await sendOTP(phone, recaptchaVerifier);

    if (!result.success) {
        throw new Error(result.message || "Gửi OTP thất bại");
    }

    return result;
};

import { verifyOTP } from "./phoneAuthService";
import { createAccount } from "../api/auth";

export const verifyOtpRegisterService = async ( phone, code, name, password, role) => {
    const result = await verifyOTP(phone, code);

    if (!result.success) {
        throw new Error(result.message || "OTP không hợp lệ");
    }

    const res = await createAccount(
        name,
        phone,
        password,
        role,
        result.idToken
    );

    if (!res.success) {
        throw new Error(res.message || "Tạo tài khoản thất bại");
    }

    return res;
};

export const sendRegisterOTPService = async (phone, recaptchaVerifier) => {

  const exists = await isExistAccount(phone);

  if (exists) {
    throw new Error("Số điện thoại đã được đăng ký.");
  }

  const result = await sendOTP(phone, recaptchaVerifier);

  if (!result.success) {
    throw new Error(result.message || "Không thể gửi OTP");
  }

  return result;
};

export const logoutService = async () => {

  await SecureStore.deleteItemAsync("accessToken");

  await SecureStore.deleteItemAsync("refreshToken");

};