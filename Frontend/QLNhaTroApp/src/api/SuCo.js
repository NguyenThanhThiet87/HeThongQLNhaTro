import api from "./axiosClient";
import getAccessToken from "../utils/decodeToken";


export const getPhongThietBiApi = async (maPhong) => {
  try {
    const res = await api.get(`/SuCoBaoTri/thiet-bi-phong?maPhong=${maPhong}`);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};


export const getThietBisApi = async () => {
  try {
    const res = await api.get(`/SuCoBaoTri/thiet-bi`);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};



export const updatePhongThietBiApi = async (maPhong, lstThietBi) => {
  try {
    const res = await api.post(`/SuCoBaoTri/gan-thiet-bi?maPhong=${maPhong}`, lstThietBi);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const updatePhongThietBiAllApi = async (maDayNt, lstThietBi) => {
  try {
    const res = await api.post(`/SuCoBaoTri/gan-thiet-bi-phong-all?maDayNt=${maDayNt}`, lstThietBi);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const guiBaoCaoSuCoApi = async (reporterId, maPhong, selectedDevices) => {
  try {
    const formData = new FormData();
    formData.append("MaNt", reporterId);
    formData.append("MaPhong", maPhong);

    console.log("--- FormData Payload ---");
    console.log("MaNd:", reporterId);
    console.log("MaPhong:", maPhong);

    selectedDevices.forEach((device, index) => {
      formData.append(`ChiTietSuCos[${index}].MaPhongThietBi`, device.maPhongThietBi);
      formData.append(`ChiTietSuCos[${index}].MoTaSuCo`, device.description);
      console.log(`Device[${index}]:`, device.maPhongThietBi, "| MoTa:", device.description);

      device.media.forEach((file, fileIdx) => {
        const filename = file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `${file.type}/${match[1]}` : `${file.type}/jpeg`;

        formData.append(`ChiTietSuCos[${index}].MinhChung`, {
          uri: file.uri,
          name: filename,
          type: type,
        });
        console.log(`  File[${fileIdx}]:`, filename, "| Type:", type);
      });
    });

    const token = await getAccessToken();
    const res = await fetch("https://eveline-prenasal-concha.ngrok-free.dev/api/SuCoBaoTri/gui-bao-cao", {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await res.json();
      return result;
    } else {
      const text = await res.text();
      console.error("Non-JSON response from server:", text);
      return {
        success: false,
        message: `Server trả về lỗi (${res.status}): ${text.substring(0, 100)}`
      };
    }
  } catch (error) {
    console.error("Lỗi guiBaoCaoSuCoApi:", error);
    return { success: false, message: "Lỗi kết nối API: " + error.message };
  }
};


export const getLichSuBaoCaoApi = async (maNt) => {
  try {
    const res = await api.get(`/SuCoBaoTri/lich-su-bao-cao?maNt=${maNt}`);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getChiTietBaoCaoApi = async (maSuCo) => {
  try {
    const res = await api.get(`/SuCoBaoTri/chi-tiet-bao-cao?maSuCo=${maSuCo}`);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const updateTrangThaiSuCoApi = async (maSuCo, maTtxuLy) => {
  try {
    const res = await api.post(`/SuCoBaoTri/cap-nhat-trang-thai`, { maSuCo, maTtxuLy });
    return res;
  } catch (error) {
    return { success: false, message: "Lỗi kết nối: " + error.message };
  }
};
export const getAllBaoCaoSuCoApi = async (maChuNt) => {
  try {
    const res = await api.get(`/SuCoBaoTri/bao-cao-su-co-all?maChuNt=${maChuNt}`);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};
