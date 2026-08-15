const configuredOrigin = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

const normalizeOrigin = (value) => value.replace(/\/+$/, "").replace(/\/api$/, "");

export const API_ORIGIN = configuredOrigin ? normalizeOrigin(configuredOrigin) : null;
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : null;

export function requireApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "Thiếu EXPO_PUBLIC_API_BASE_URL. Tạo file .env từ .env.example và khởi động lại Expo.",
    );
  }

  return API_BASE_URL;
}
