import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getUserCntProfileService, changePasswordService, updateCntProfileService, getCachedCntProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import toast from "../../utils/toast";

export const useUserCntProfile = () => {
    const { user: authUser } = useAuth();

    const [user, setUser] = useState(() => {
        const cached = getCachedCntProfile();
        if (cached) return cached;
        if (authUser) {
            return {
                maNd: authUser.maNd,
                maChuNt: authUser.maNd,
                maNguoiDung: authUser.maNd,
                hoTen: authUser.hoTen,
                soDt: authUser.soDt,
                maVaiTro: authUser.maVaiTro
            };
        }
        return null;
    });
    const [loading, setLoading] = useState(false);

    // Sync authUser immediately if user is still empty
    useEffect(() => {
        if (!user && authUser) {
            setUser({
                maNd: authUser.maNd,
                maChuNt: authUser.maNd,
                maNguoiDung: authUser.maNd,
                hoTen: authUser.hoTen,
                soDt: authUser.soDt,
                maVaiTro: authUser.maVaiTro
            });
        }
    }, [authUser]);

    const fetchUser = async () => {
        try {
            if (!getCachedCntProfile() && !authUser) {
                setLoading(true);
            }
            const data = await getUserCntProfileService();
            if (data) {
                setUser(data);
            }
        } catch (err) {
            console.log("Lỗi lấy user:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUser();
        }, [])
    );

    return {
        user,
        loading,
        refresh: fetchUser
    };
};


export const useEditCntProfile = (maNdRoute, navigation) => {
    const { user: authUser } = useAuth();
    const cached = getCachedCntProfile();
    const [loading, setLoading] = useState(false);

    const [maNd, setMaNd] = useState(cached?.maChuNt || cached?.maNd || maNdRoute || authUser?.maNd);
    const [avatar, setAvatar] = useState(cached?.avatar || "https://i.pravatar.cc/300");
    const [fullName, setFullName] = useState(cached?.hoTen ?? "");
    const [ngaySinh, setNgaySinh] = useState(cached?.ngaySinh ?? "");
    const [idCard, setIdCard] = useState(cached?.soCccd ?? "");
    const [soDienThoai, setSoDienThoai] = useState(cached?.soDt ?? "");
    const [address, setAddress] = useState(cached?.diaChi ?? "");
    const [gioiTinh, setGioiTinh] = useState(cached?.gioiTinh);
    const [tenNh, setTenNh] = useState(cached?.tenNh ?? "");
    const [soTk, setSoTk] = useState(cached?.soTk ?? "");
    const [soGpkd, setSoGpkd] = useState(cached?.soGpkd ?? "");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserCntProfileService(maNdRoute);
                if (data) {
                    setMaNd(data.maChuNt || data.maNd || maNdRoute || authUser?.maNd);
                    if (data.avatar) setAvatar(data.avatar);
                    if (data.hoTen !== undefined) setFullName(data.hoTen);
                    if (data.ngaySinh !== undefined) setNgaySinh(data.ngaySinh);
                    if (data.soCccd !== undefined) setIdCard(data.soCccd);
                    if (data.soDt !== undefined) setSoDienThoai(data.soDt);
                    if (data.diaChi !== undefined) setAddress(data.diaChi);
                    if (data.gioiTinh !== undefined) setGioiTinh(data.gioiTinh);
                    if (data.tenNh !== undefined) setTenNh(data.tenNh);
                    if (data.soTk !== undefined) setSoTk(data.soTk);
                    if (data.soGpkd !== undefined) setSoGpkd(data.soGpkd);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin chủ trọ:", err.message);
            }
        };

        fetchData();
    }, [maNdRoute, authUser]);

    const handleSaveChanges = async () => {
        try {
            setLoading(true);

            const data = {
                MaChuNt: maNd || cached?.maChuNt || cached?.maNd || maNdRoute || authUser?.maNd,
                HoTen: fullName,
                NgaySinh: ngaySinh,
                SoCccd: idCard,
                SoDt: soDienThoai,
                DiaChi: address,
                GioiTinh: gioiTinh,
                TenNh: tenNh,
                SoTk: soTk,
                SoGpkd: soGpkd,
                Avatar: avatar,
            };

            const res = await updateCntProfileService(data);
            if (res && res.success === false) {
                toast.error(res.message || "Cập nhật thất bại");
                return;
            }

            toast.success("Cập nhật thông tin thành công!");

            navigation.goBack();

        } catch (err) {
            toast.error("Lỗi khi cập nhật thông tin: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        maNd, setMaNd,
        avatar, setAvatar,
        fullName, setFullName,
        ngaySinh, setNgaySinh,
        idCard, setIdCard,
        soDienThoai,
        address, setAddress,
        gioiTinh, setGioiTinh,
        tenNh, setTenNh,
        soTk, setSoTk,
        soGpkd, setSoGpkd,

        handleSaveChanges
    };
};

export const useChangePassword = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [oldPassError, setOldPassError] = useState("");
    const [newPassError, setNewPassError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const handleReset = async () => {
        setLoading(true);
        // Kiểm tra điều kiện
        if (!oldPass || !newPass || !confirm) {
            setOldPassError(!oldPass ? "Vui lòng nhập mật khẩu cũ" : "");
            setNewPassError(!newPass ? "Vui lòng nhập mật khẩu mới" : "");
            setConfirmError(!confirm ? "Vui lòng xác nhận mật khẩu" : "");
            return;
        }
        if (newPass !== confirm) {
            setConfirmError("Mật khẩu xác nhận không khớp");
            return;
        }
        if (newPass.length < 8) {
            setNewPassError("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }
        if (!/[0-9!@#$%^&*]/.test(newPass)) {
            setNewPassError("Mật khẩu phải chứa số hoặc ký tự đặc biệt");
            return;
        }

        try {
            // Gọi API đổi mật khẩu (giả sử có authService.changePassword)
            const result = await changePasswordService({
                oldPassword: oldPass,
                newPassword: newPass
            });
            if (result.success) {
                toast.success("Đổi mật khẩu thành công");
                navigation.goBack();
            } else {
                setOldPassError(result.message || "Mật khẩu cũ không đúng");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
        setLoading(false);
    };

    return {
        loading,
        oldPass, setOldPass,
        newPass, setNewPass,
        confirm, setConfirm,
        showOldPass, setShowOldPass,
        showNewPass, setShowNewPass,
        showConfirm, setShowConfirm,
        oldPassError, setOldPassError,
        newPassError, setNewPassError,
        confirmError, setConfirmError,
        handleReset
    }
}