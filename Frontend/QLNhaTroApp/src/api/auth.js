import api from "./axiosClient";

export const loginApi = async (phone, password) => {
  try {
    const res = await fetch("https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        SoDt: phone,
        MatKhau: password
      })
    });

    const result = await res.json();

    return result;

  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
};


export const registerApi = (data) => {
  return api.post("/auth/register", data);
};

export const resetPasswordApi = async (phone, newPassword, idToken) => {
  return await fetch("https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({
      phone,
      newPassword
    })
  });
}

export const isExistAccount = (sdt) => {
  return api.post("/NguoiDung/is-exist-account", sdt);
}


export const createAccount = (name, phone, password, role, idToken) => {
  return api.post(
    "/NguoiDung/register/account",
    {
      HoTen: name,
      SoDt: phone,
      MatKhau: password,
      MaVaiTro: role
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );
};

export const updateSoDt = async (maNd, soDt, idToken) => {
  try {
    const res = await fetch("https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/cap-nhat-sdt", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        MaNd: maNd,
        SoDt: soDt
      })
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