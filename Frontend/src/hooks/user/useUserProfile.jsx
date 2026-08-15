import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getUserNtProfileService, updateNtProfileService, changePasswordService } from "../../services/userService";
import toast from "../../utils/toast";

export const useUserNtProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {

        try {
            setLoading(true);

            const data = await getUserNtProfileService();

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


export const useEditNtProfile = (maNdRoute, navigation) => {

    const [loading, setLoading] = useState(false);

    const [maNd, setMaNd] = useState(maNdRoute);
    const [avatar, setAvatar] = useState("https://i.pravatar.cc/300");
    const [fullName, setFullName] = useState("");
    const [ngaySinh, setNgaySinh] = useState("");
    const [idCard, setIdCard] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [address, setAddress] = useState("");
    const [gioiTinh, setGioiTinh] = useState();
    const [ngheNghiep, setNgheNghiep] = useState("");
    const [hoTenNguoiThan, setHoTenNguoiThan] = useState("");
    const [soDienThoaiNguoiThan, setSoDienThoaiNguoiThan] = useState("");
    const [quanHeVoiNguoiThan, setQuanHeVoiNguoiThan] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            try {

                const data = await getUserNtProfileService(maNd);

                setMaNd(data.maNt);
                setAvatar(data.avatar || "https://i.pravatar.cc/300");
                setFullName(data.hoTen);
                setNgaySinh(data.ngaySinh);
                setIdCard(data.soCccd);
                setSoDienThoai(data.soDt);
                setAddress(data.diaChi);
                setGioiTinh(data.gioiTinh);
                setNgheNghiep(data.ngheNghiep);
                setHoTenNguoiThan(data.hoTenNguoiLienHe);
                setSoDienThoaiNguoiThan(data.sdtNguoiLienHe);
                setQuanHeVoiNguoiThan(data.quanHeNguoiLienHe);

            } catch (err) {
                console.error("Lỗi khi lấy thông tin người thuê:", err.message);
            }
        };

        fetchData();

    }, []);

    const handleSaveChanges = async () => {

        try {
            setLoading(true);

            const data = {
                MaNd: maNd,
                HoTen: fullName,
                NgaySinh: ngaySinh,
                SoCccd: idCard,
                SoDt: soDienThoai,
                DiaChi: address,
                GioiTinh: gioiTinh,
                NgheNghiep: ngheNghiep,
                HoTenNguoiLienHe: hoTenNguoiThan,
                SdtNguoiLienHe: soDienThoaiNguoiThan,
                QuanHeNguoiLienHe: quanHeVoiNguoiThan,
                Avatar: avatar,
            };

            await updateNtProfileService(data);

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
        ngheNghiep, setNgheNghiep,
        hoTenNguoiThan, setHoTenNguoiThan,
        soDienThoaiNguoiThan, setSoDienThoaiNguoiThan,
        quanHeVoiNguoiThan, setQuanHeVoiNguoiThan,

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