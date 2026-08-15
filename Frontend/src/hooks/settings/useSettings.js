import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getUserNtProfileService, getUserCntProfileService, getUserNccProfileService } from "../../services/userService";
import { getCurrentUser } from "../../utils/decodeToken";
import { ROLES } from "../../constants/roles";

export const useSecuritySettings = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const fetchUser = async () => {
    try {

      const user = await getCurrentUser();

      if (user.maVaiTro == ROLES.NGUOI_THUE) {
        const data = await getUserNtProfileService();
        setCurrentUser(data);
        return;
      } else if (user.maVaiTro == ROLES.CHU_TRO) {
        const data = await getUserCntProfileService();
        setCurrentUser(data);
        return;
      } else {
        const data = await getUserNccProfileService();
        setCurrentUser(data);
        return;
      }

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