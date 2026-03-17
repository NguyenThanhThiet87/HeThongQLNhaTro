import { getAccessToken } from "../utils/decodeToken";

export const askChatBox = async (maNd, message) => {
  try {
    const token = await getAccessToken();
    const res = await fetch("https://eveline-prenasal-concha.ngrok-free.dev/api/ChatBox/Ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        MaNd: maNd,
        Message: message
      })
    });
    if (!res.ok) {
      throw new Error("Server error: " + res.status);
    }
    return await res.json(); // Trả về { question, answer }
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};