import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getUserNccProfileService, changePasswordService, updateNccProfileService } from "../../services/userService";
import toast from "../../utils/toast";

export const useUserProviderProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        try {
            setLoading(true);

            const data = await getUserNccProfileService();
            console.log(data)
            setUser(data);

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

    const [loading, setLoading] = useState(false);

    const [maNcc, setMaNcc] = useState(maNdRoute);
    const [avatar, setAvatar] = useState("https://i.pravatar.cc/300");
    const [fullName, setFullName] = useState("");
    const [ngaySinh, setNgaySinh] = useState("");
    const [idCard, setIdCard] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [address, setAddress] = useState("");
    const [gioiTinh, setGioiTinh] = useState();
    const [moTaDv, setMoTaDv] = useState("");
    const [khuVucPv, setKhuVucPv] = useState("");
    const [sanSang, setSanSang] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const data = await getUserNccProfileService(maNcc);

                console.log("Fetched NCC data for editing:", data);

                setMaNcc(data.maNcc);
                setAvatar(data?.avatar || "https://i.pravatar.cc/300");
                setFullName(data.hoTen ?? "");
                setNgaySinh(data.ngaySinh ?? "");
                setIdCard(data.soCccd ?? "");
                setSoDienThoai(data.soDt ?? "");
                setAddress(data.diaChi ?? "");
                setGioiTinh(data.gioiTinh ?? undefined);
                setMoTaDv(data.moTaDv ?? "");
                setKhuVucPv(data.khuVucPv ?? "");
                setSanSang(data.sanSang ?? true);

            } catch (err) {
                console.error("Lỗi khi lấy thông tin nhà cung cấp:", err.message);
            }
        };

        fetchData();

    }, []);

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

            if (result.success) {
                toast.success("Cập nhật thông tin thành công!");
                navigation.goBack();
            } else {
                toast.error("Cập nhật thất bại: " + result.message);
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