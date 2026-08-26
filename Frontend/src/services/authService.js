import { loginApi, isExistAccount, createAccount } from "../api/auth";
import { sendOTP, verifyOTP } from "./phoneAuthService";
import { setCachedTokens, clearTokens } from "../utils/decodeToken";
import { clearProfileCache } from "./userService";
import { jwtDecode } from "jwt-decode";
import formatPhoneNumber from "../utils/formatPhoneNumber";

export const loginService = async (phoneNumber, password) => {
    const result = await loginApi(formatPhoneNumber(phoneNumber), password);

    if (!result.success) {
        throw new Error(result.message || "Đăng nhập thất bại");
    }

    const data = result.data;
    const decoded = jwtDecode(data.accessToken);

    await setCachedTokens(data.accessToken, data.refreshToken);

    return decoded;
};

export const sendOtpService = async (phone, recaptchaVerifier) => {
    const exist = await isExistAccount(formatPhoneNumber(phone));

    if (!exist.data?.isExist) {
        throw new Error("Số điện thoại chưa đăng ký tài khoản: " + phone);
    }

    const result = await sendOTP(formatPhoneNumber(phone), recaptchaVerifier);

    if (!result.success) {
        throw new Error(result.message || "Gửi OTP thất bại");
    }

    return result;
};

export const verifyOtpRegisterService = async (phone, code, name, password, role) => {
    const result = await verifyOTP(formatPhoneNumber(phone), code);

    if (__DEV__) console.info("[AUTH] OTP verification service completed", { success: Boolean(result?.success) });

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
    console.log("Res: ", res);
    if (!res.success) {
        throw new Error(res.message || "Tạo tài khoản thất bại");
    }

    return res;
};

export const sendRegisterOTPService = async (phone, recaptchaVerifier) => {
    const exists = await isExistAccount(formatPhoneNumber(phone));

    if (exists.data?.isExist) {
        throw new Error("Số điện thoại đã được đăng ký.");
    }

    const result = await sendOTP(formatPhoneNumber(phone), recaptchaVerifier);

    if (!result.success) {
        throw new Error(result.message || "Không thể gửi OTP");
    }

    return result;
};

export const logoutService = async () => {
    await clearTokens();
    clearProfileCache();
};
