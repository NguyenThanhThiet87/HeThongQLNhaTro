import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getUserNccProfileService, changePasswordService, updateNccProfileService, getCachedNccProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import toast from "../../utils/toast";

export const useUserProviderProfile = () => {
    const { user: authUser } = useAuth();

    const [user, setUser] = useState(() => {
        const cached = getCachedNccProfile();
        if (cached) return cached;
        if (authUser) {
            return {
                maNd: authUser.maNd,
                maNcc: authUser.maNd,
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
                maNcc: authUser.maNd,
                maNguoiDung: authUser.maNd,
                hoTen: authUser.hoTen,
                soDt: authUser.soDt,
                maVaiTro: authUser.maVaiTro
            });
        }
    }, [authUser]);

    const fetchUser = async () => {
        try {
            if (!getCachedNccProfile() && !authUser) {
                setLoading(true);
            }
            const data = await getUserNccProfileService();
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


export const useEditProviderProfile = (maNdRoute, navigation) => {
    const cached = getCachedNccProfile();
    const [loading, setLoading] = useState(false);

    const [maNcc, setMaNcc] = useState(cached?.maNcc || maNdRoute);
    const [avatar, setAvatar] = useState(cached?.avatar || "https://i.pravatar.cc/300");
    const [fullName, setFullName] = useState(cached?.hoTen ?? "");
    const [ngaySinh, setNgaySinh] = useState(cached?.ngaySinh ?? "");
    const [idCard, setIdCard] = useState(cached?.soCccd ?? "");
    const [soDienThoai, setSoDienThoai] = useState(cached?.soDt ?? "");
    const [address, setAddress] = useState(cached?.diaChi ?? "");
    const [gioiTinh, setGioiTinh] = useState(cached?.gioiTinh);
    const [moTaDv, setMoTaDv] = useState(cached?.moTaDv ?? "");
    const [khuVucPv, setKhuVucPv] = useState(cached?.khuVucPv ?? "");
    const [sanSang, setSanSang] = useState(cached?.sanSang ?? true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserNccProfileService(maNdRoute);
                if (data) {
                    setMaNcc(data.maNcc || maNdRoute);
                    if (data.avatar) setAvatar(data.avatar);
                    if (data.hoTen !== undefined) setFullName(data.hoTen);
                    if (data.ngaySinh !== undefined) setNgaySinh(data.ngaySinh);
                    if (data.soCccd !== undefined) setIdCard(data.soCccd);
                    if (data.soDt !== undefined) setSoDienThoai(data.soDt);
                    if (data.diaChi !== undefined) setAddress(data.diaChi);
                    if (data.gioiTinh !== undefined) setGioiTinh(data.gioiTinh);
                    if (data.moTaDv !== undefined) setMoTaDv(data.moTaDv);
                    if (data.khuVucPv !== undefined) setKhuVucPv(data.khuVucPv);
                    if (data.sanSang !== undefined) setSanSang(data.sanSang);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin nhà cung cấp:", err.message);
            }
        };

        fetchData();
    }, [maNdRoute]);

    const handleSaveChanges = async () => {
        try {
            setLoading(true);

            const data = {
                MaNcc: maNcc,
                HoTen: fullName,
                NgaySinh: ngaySinh,
                SoCccd: idCard,
                SoDt: soDienThoai,
                DiaChi: address,
                GioiTinh: gioiTinh,
                MoTaDv: moTaDv,
                KhuVucPv: khuVucPv,
                SanSang: sanSang,
                Avatar: avatar,
            };

            const result = await updateNccProfileService(data);

            if (result.success || result.data) {
                toast.success("Cập nhật thông tin thành công!");
                navigation.goBack();
            } else {
                toast.error("Cập nhật thất bại: " + (result.message || "Lỗi không xác định"));
            }

        } catch (err) {
            toast.error("Lỗi khi cập nhật thông tin: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        maNcc, setMaNcc,
        avatar, setAvatar,
        fullName, setFullName,
        ngaySinh, setNgaySinh,
        idCard, setIdCard,
        soDienThoai,
        address, setAddress,
        gioiTinh, setGioiTinh,
        moTaDv, setMoTaDv,
        khuVucPv, setKhuVucPv,
        sanSang, setSanSang,

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
            setLoading(false);
            return;
        }
        if (newPass !== confirm) {
            setConfirmError("Mật khẩu xác nhận không khớp");
            setLoading(false);
            return;
        }
        if (newPass.length < 8) {
            setNewPassError("Mật khẩu phải có ít nhất 8 ký tự");
            setLoading(false);
            return;
        }
        if (!/[0-9!@#$%^&*]/.test(newPass)) {
            setNewPassError("Mật khẩu phải chứa số hoặc ký tự đặc biệt");
            setLoading(false);
            return;
        }

        try {
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