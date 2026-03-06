import axiosClient from "./axiosClient";

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
  return axiosClient.post("/auth/register", data);
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
  return axiosClient.post("/NguoiDung/is-exist-account", sdt);
}

export const createAccount = async (name, phone, password, role, idToken) => {
  try {
    const res = await fetch(
      "https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/register/account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          HoTen: name,
          SoDt: phone,
          MatKhau: password,
          MaVaiTro: role
        })
      }
    );

    const text = await res.text();

    return {
      success: res.ok,
      message: text
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

