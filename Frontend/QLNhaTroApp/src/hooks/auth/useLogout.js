import { useState } from "react";
import { logoutService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export const useLogout = () => {

  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    // Giả lập một khoảng trễ ngắn để tạo hiệu ứng load mượt mà
    await new Promise(resolve => setTimeout(resolve, 800));

    await logoutService();

    await logout();

    setLoading(false);
  };

  return {
    handleLogout,
    loading
  };
};