import getAccessToken from "../utils/decodeToken";

export const getNguoiDungApi = async (maNd) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/nguoi-dung?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    console.log("Raw response text:", text);
    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getNguoiThueApi = async (maNd) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/chi-tiet-nguoi-thue?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    console.log("Raw response text:", text);
    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};