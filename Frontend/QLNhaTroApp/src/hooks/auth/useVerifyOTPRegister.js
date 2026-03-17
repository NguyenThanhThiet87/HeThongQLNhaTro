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