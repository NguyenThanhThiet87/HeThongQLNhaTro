import { loginApi, isExistAccount, } from "../api/auth";
import { sendOTP } from "./phoneAuthService";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

import formatPhoneNumber from "../utils/formatPhoneNumber";

export const loginService = async (phoneNumber, password) => {

    const result = await loginApi(formatPhoneNumber(phoneNumber), password);

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

    const exist = await isExistAccount(formatPhoneNumber(phone));

    if (!exist.data.isExist) {
        throw new Error("Số điện thoại chưa đăng ký tài khoản: " + phone);
    }

    const result = await sendOTP(formatPhoneNumber(phone), recaptchaVerifier);

    if (!result.success) {
        throw new Error(result.message || "Gửi OTP thất bại");
    }

    return result;
};

import { verifyOTP } from "./phoneAuthService";
import { createAccount } from "../api/auth";

export const verifyOtpRegisterService = async ( phone, code, name, password, role) => {
    const result = await verifyOTP(formatPhoneNumber(phone), code);

    console.log("OTP verification result:", result);

    if (!result.success) {
        throw new Error(result.message || "OTP không hợp lệ");
    }

    const res = await createAccount(
        name,
        formatPhoneNumber(phone),
        password,
        role,
        result.idToken
    );
    console.log("Res: ", res)
    if (!res.success) {
        throw new Error(res.message || "Tạo tài khoản thất bại");
    }

    return res;
};

export const sendRegisterOTPService = async (phone, recaptchaVerifier) => {

  const exists = await isExistAccount(formatPhoneNumber(phone));

  if (exists.data.isExist) {
    throw new Error("Số điện thoại đã được đăng ký.");
  }

  const result = await sendOTP(formatPhoneNumber(phone), recaptchaVerifier);

  if (!result.success) {
    throw new Error(result.message || "Không thể gửi OTP");
  }

  return result;
};

export const logoutService = async () => {

  await SecureStore.deleteItemAsync("accessToken");

  await SecureStore.deleteItemAsync("refreshToken");

};