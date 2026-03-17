import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getUserNtProfileService } from "../../services/userService";

export const useSecuritySettings = () => {

  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    try {

      const data = await getUserNtProfileService();

      setCurrentUser(data);

    } catch (error) {

      console.error("Lỗi khi lấy thông tin người thuê:", error.message);

    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  return {
    currentUser
  };
};