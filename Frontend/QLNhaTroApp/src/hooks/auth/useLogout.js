import { useState } from "react";
import { logoutService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export const useLogout = () => {

  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {

    setLoading(true);

    await logoutService();

    await logout();

    setLoading(false);
  };

  return {
    handleLogout,
    loading
  };
};