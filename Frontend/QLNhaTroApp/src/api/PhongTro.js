import axiosClient from "./axiosClient";
import getAccessToken, { getCurrentUser } from "../utils/decodeToken";
export const getDayNhaTrosApi = async (maCnt) => {
  try {
    const token = await getAccessToken();

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/day-nha-tros?maChuNt=${maCnt}`;

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

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/day-nha-tro?maDayNt=${maDayNt}`;

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
        const user = await getCurrentUser();
        const token = await getAccessToken();
        const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/tao-day-tro`;

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
// --- PHONG ---
export const getPhongTrosApi = async (maDayNt) => {
  try {
    const token = await getAccessToken();

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/phongs?maDayNt=${maDayNt}`;

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

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/phong?maPhong=${maPhong}`;

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
// --- LOẠI PHÒNG ---
export const getLoaiPhongApi = async (maCnt) => {
    try {
        const token = await getAccessToken();
        const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/danh-sach-loai-phong?maChuNt=${maCnt}`;
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
        const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/PhongNhaTro/tao-loai-phong`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newRoomTypeData)
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