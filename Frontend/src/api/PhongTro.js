import { API_BASE_URL } from "../config/api";
import axiosClient from "./axiosClient";
import getAccessToken, { getCurrentUser } from "../utils/decodeToken";
export const getDayNhaTrosApi = async (maCnt) => {
    try {
        const token = await getAccessToken();

        const url = `${API_BASE_URL}/PhongNhaTro/day-nha-tros?maChuNt=${maCnt}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const text = await res.text();
        return JSON.parse(text);

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const getDayNhaTroApi = async (maDayNt) => {
    try {
        const token = await getAccessToken();

        const url = `${API_BASE_URL}/PhongNhaTro/day-nha-tro?maDayNt=${maDayNt}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const text = await res.text();

        return JSON.parse(text);

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};
// Hàm tạo dãy trọ gọi từ React Native
export const taoDayNhaTroApi = async (dayNhaTroData, danhSachPhong) => {
    try {
        console.log("Dữ liệu DayNhaTro nhận vào API:", danhSachPhong);

        const user = await getCurrentUser();
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/tao-day-tro`;

        const formData = new FormData();

        // ==========================================
        // 1. Gắn thông tin cơ bản của Dãy trọ (Phẳng hóa)
        // ==========================================
        // Gửi thẳng tên biến khớp với C# DTO (DayNhaTroCreateDto)
        formData.append("MaChuNt", user.maNd);
        formData.append("TenDayNt", dayNhaTroData.TenDayNt);
        formData.append("DiaChi", dayNhaTroData.DiaChi);
        formData.append("SlPhong", dayNhaTroData.SlPhong);
        formData.append("TrangThaiHd", dayNhaTroData.TrangThaiHd);
        if (dayNhaTroData.KinhDo) formData.append("KinhDo", dayNhaTroData.KinhDo);
        if (dayNhaTroData.ViDo) formData.append("ViDo", dayNhaTroData.ViDo);

        // ==========================================
        // 2. Xử lý ảnh bìa (NẾU CÓ)
        // ==========================================
        if (dayNhaTroData.ImageUri) {
            const filename = dayNhaTroData.ImageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("AnhBia", {
                uri: dayNhaTroData.ImageUri,
                name: filename,
                type: type,
            });
        }

        // ==========================================
        // 3. Gắn danh sách phòng (Mảng Array)
        // ==========================================
        // C# đọc List<PhongItemDto> qua FromForm bằng cách duyệt index[0], index[1]...
        if (danhSachPhong && danhSachPhong.length > 0) {
            danhSachPhong.forEach((phong, index) => {
                formData.append(`DanhSachPhong[${index}].SoPhong`, phong.SoPhong);
                formData.append(`DanhSachPhong[${index}].GiaThucTe`, phong.GiaThucTe);
                formData.append(`DanhSachPhong[${index}].MaLoaiP`, phong.MaLoaiP);
                formData.append(`DanhSachPhong[${index}].MaTtphong`, phong.MaTtphong);
                formData.append(`DanhSachPhong[${index}].MaTtrPhong`, phong.MaTtrPhong);
            });
        }

        // ==========================================
        // 4. Bắn API
        // ==========================================
        const res = await fetch(url, {
            method: "POST",
            headers: {
                // TUYỆT ĐỐI KHÔNG set "Content-Type": "multipart/form-data" 
                // vì fetch sẽ tự sinh ra boundary an toàn hơn.
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const result = await res.json();
        return result;

    } catch (error) {
        console.error("Lỗi Network/Fetch taoDayNhaTroApi:", error);
        return { success: false, message: "Lỗi kết nối mạng: " + error.message };
    }
};

export const suaDayNhaTroApi = async (maDayNt, dayNhaTroData) => {
    try {
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/sua-day-tro?maDayNt=${maDayNt}`;

        const formData = new FormData();
        formData.append("TenDayNt", dayNhaTroData.TenDayNt || "");
        formData.append("DiaChi", dayNhaTroData.DiaChi || "");
        formData.append("TrangThaiHd", String(dayNhaTroData.TrangThaiHd));

        if (dayNhaTroData.KinhDo !== undefined && dayNhaTroData.KinhDo !== null) {
            formData.append("KinhDo", dayNhaTroData.KinhDo.toString());
        }
        if (dayNhaTroData.ViDo !== undefined && dayNhaTroData.ViDo !== null) {
            formData.append("ViDo", dayNhaTroData.ViDo.toString());
        }

        if (dayNhaTroData.ImageUri && !dayNhaTroData.ImageUri.startsWith('http')) {
            const filename = dayNhaTroData.ImageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("AnhBia", {
                uri: dayNhaTroData.ImageUri,
                name: filename,
                type: type,
            });
        }

        console.log("SuaDayNhaTro API URL:", url);
        console.log("SuaDayNhaTro API Data:", dayNhaTroData);

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("API Error Response:", errText);
            return { success: false, message: `Lỗi Server (${res.status}): ${errText}` };
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error("suaDayNhaTroApi Exception:", error);
        return { success: false, message: "Lỗi kết nối mạng: " + error.message };
    }
};
// --- PHONG ---
export const getPhongTrosApi = async (maDayNt) => {
    try {
        const token = await getAccessToken();

        const url = `${API_BASE_URL}/PhongNhaTro/phongs?maDayNt=${maDayNt}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const text = await res.text();

        return JSON.parse(text);

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const getPhongTroApi = async (maPhong) => {
    try {
        const token = await getAccessToken();

        const url = `${API_BASE_URL}/PhongNhaTro/phong?maPhong=${maPhong}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const text = await res.text();

        return JSON.parse(text);

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const taoPhongApi = async (newRoomData) => {
    try {
        console.log("Dữ liệu Phòng nhận vào API:", newRoomData);
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/phong`;

        const formData = new FormData();

        // Đúng key theo backend: MaChuNt
        formData.append("MaDayNt", newRoomData.MaDayNt);
        formData.append("SoPhong", newRoomData.SoPhong);
        formData.append("MaLoaiP", newRoomData.MaLoaiP);
        formData.append("GiaThucTe", newRoomData.GiaThucTe);
        formData.append("MaTtphong", newRoomData.MaTtphong);
        formData.append("MaTtrPhong", newRoomData.MaTtrPhong);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const result = await res.json();
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

// --- LOẠI PHÒNG ---
export const getLoaiPhongApi = async (maCnt) => {
    try {
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/danh-sach-loai-phong?maChuNt=${maCnt}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};
export const getLoaiPApi = async (maLoaiP) => {
    try {
        console.log("Fetching details for MaLoaiP:", maLoaiP); // Debug log
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/loai-phong?maLoaiP=${maLoaiP}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};
export const taoLoaiPhongApi = async (newRoomTypeData) => {
    try {
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/tao-loai-phong`;

        const formData = new FormData();

        // Đúng key theo backend: MaChuNt
        formData.append("MaChuNt", newRoomTypeData.MaChuNt);
        formData.append("TenLoaiP", newRoomTypeData.TenLoaiP);
        formData.append("GiaChuan", newRoomTypeData.GiaChuan);
        formData.append("MoTa", newRoomTypeData.MoTa);
        formData.append("SnguoiToiDa", newRoomTypeData.SnguoiToiDa);

        if (newRoomTypeData.UrlAnh) {
            const filename = newRoomTypeData.UrlAnh.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("UrlAnh", {
                uri: newRoomTypeData.UrlAnh,
                name: filename,
                type: type,
            });
        }

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const result = await res.json();
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const capNhatLoaiPhongApi = async (newRoomTypeData) => {
    try {
        console.log("Updating LoaiPhong with data:", newRoomTypeData); // Debug log
        const token = await getAccessToken();
        const url = `${API_BASE_URL}/PhongNhaTro/sua-loai-phong`;

        const formData = new FormData();

        // Đúng key theo backend: MaChuNt
        formData.append("MaLoaiP", newRoomTypeData.MaLoaiP);
        formData.append("TenLoaiP", newRoomTypeData.TenLoaiP);
        formData.append("GiaChuan", newRoomTypeData.GiaChuan);
        formData.append("MoTa", newRoomTypeData.MoTa);
        formData.append("SnguoiToiDa", newRoomTypeData.SnguoiToiDa);

        if (newRoomTypeData.UrlAnh) {
            const filename = newRoomTypeData.UrlAnh.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("UrlAnh", {
                uri: newRoomTypeData.UrlAnh,
                name: filename,
                type: type,
            });
        }

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const result = await res.json();
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};
export const deleteLoaiPhongApi = async (maLoaiP) => {
    try {
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE_URL}/PhongNhaTro/xoa-loai-phong?maLoaiP=${maLoaiP}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};
export const getThongKePhongApi = async (maNd) => {
    try {
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE_URL}/PhongNhaTro/thong-ke?maNd=${maNd}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const deletePhongApi = async (maPhong) => {
    try {
        console.log("Attempting to delete Phong with MaPhong:", maPhong); // Debug log
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE_URL}/PhongNhaTro/xoa-phong?maPhong=${maPhong}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};