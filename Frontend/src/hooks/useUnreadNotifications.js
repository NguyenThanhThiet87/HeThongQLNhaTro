import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DeviceEventEmitter } from "react-native";
import { getNotifications } from "../api/ThongBao";
import { getCurrentUser } from "../utils/decodeToken";

let globalHasUnread = false;
let lastFetchTime = 0;
const THROTTLE_MS = 30000; // 30 giây throttle giữa các lần fetch tự động

/**
 * Tracks whether the signed-in user has at least one unread notification.
 * Listens to SignalR realtime events and throttles REST API requests to prevent lag.
 */
export function useUnreadNotifications() {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(globalHasUnread);

  const refreshUnreadNotifications = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime < THROTTLE_MS) {
      setHasUnreadNotifications(globalHasUnread);
      return;
    }

    const user = await getCurrentUser();
    if (!user) {
      globalHasUnread = false;
      setHasUnreadNotifications(false);
      return;
    }

    lastFetchTime = now;
    try {
      const result = await getNotifications(user.maNd);
      if (result.success && Array.isArray(result.data)) {
        const unread = result.data.some((notification) => !notification.daDoc);
        globalHasUnread = unread;
        setHasUnreadNotifications(unread);
      }
    } catch (e) {
      // Ignored network errors to prevent blocking UI
    }
  }, []);

  // Lắng nghe sự kiện thông báo thời gian thực từ SignalR
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("ON_NOTIFICATION_RECEIVED", () => {
      globalHasUnread = true;
      setHasUnreadNotifications(true);
    });
    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshUnreadNotifications(false);
    }, [refreshUnreadNotifications]),
  );

  return { hasUnreadNotifications, refreshUnreadNotifications };
}

