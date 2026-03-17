import { useState } from "react";
import { loginService } from "../../services/authService";
import toast from "../../utils/toast";
import formatPhoneNumber from "../../utils/formatPhoneNumber";

export function useLogin(loginContext) {
    const [loading, setLoading] = useState(false);

    const loginUser = async (phone, password) => {

        try {
            setLoading(true);

            const user = await loginService(formatPhoneNumber(phone), password);

            toast.success("Đăng nhập thành công");

            await loginContext();

            return user;

        } catch (err) {

            toast.error(err.message);

        } finally {

            setLoading(false);

        }
    };

    return { loginUser, loading };
}