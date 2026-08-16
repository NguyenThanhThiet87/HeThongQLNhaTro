import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getNotifications } from "../api/ThongBao";
import { getCurrentUser } from "../utils/decodeToken";

/**
 * Tracks whether the signed-in user has at least one unread notification.
 * The value refreshes whenever the screen gains focus, including after the
 * user reads a notification and navigates back from the notification list.
 */
export function useUnreadNotifications() {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const refreshUnreadNotifications = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) {
      setHasUnreadNotifications(false);
      return;
    }

    const result = await getNotifications(user.maNd);
    if (result.success && Array.isArray(result.data)) {
      setHasUnreadNotifications(result.data.some((notification) => !notification.daDoc));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshUnreadNotifications();
    }, [refreshUnreadNotifications]),
  );

  return { hasUnreadNotifications, refreshUnreadNotifications };
}
