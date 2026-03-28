import toast from "../../utils/toast";
import { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import * as Notifications from "expo-notifications";
import { DeviceEventEmitter, LogBox } from "react-native";

// Ẩn thông báo lỗi hệ thống của Expo Go Android SDK 53
LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

// Cấu hình cách hiển thị thông báo hệ thống
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function useSignalR(user) {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  // Yêu cầu quyền thông báo
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission for notifications not granted');
        }
      } catch (e) {
        console.log("Failed to request notification permissions:", e);
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    if (!user) {
      if (connection) {
        connection.stop();
        setConnection(null);
      }
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://eveline-prenasal-concha.ngrok-free.dev/chatHub/?userId=" + user.maNd)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [user]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("Connected to SignalR hub");

          connection.on("ReceiveMessage", (user, message) => {
            setMessages(prev => [...prev, { user, message }]);
          });

          connection.on("ReceiveInvoiceNotification", async (data) => {
            console.log("Invoice Notification:", data);
            toast.success(data.message);
            // Hiển thị thông báo ra màn hình chính (banner hệ thống)
            try {
              await Notifications.scheduleNotificationAsync({
                content: { title: "Hóa đơn mới 📑", body: data.message, sound: true },
                trigger: null,
              });
            } catch (error) { }
          });

          connection.on("ReceivePaymentNotification", async (data) => {
            console.log("Received payment notification:", data);
            toast.success(data.message);
            // Hiển thị thông báo ra màn hình chính (banner hệ thống)
            try {
              await Notifications.scheduleNotificationAsync({
                content: { title: "Tiền đã về! 💰", body: data.message, sound: true },
                trigger: null,
              });
            } catch (error) { }
          });

          connection.on("ReceiveNotification", async (data) => {
            console.log("General Notification Received:", data);

            // Phát sự kiện toàn cục để các màn hình khác nhận biết
            DeviceEventEmitter.emit("ON_NOTIFICATION_RECEIVED", data);

            // Hiển thị Toast
            toast.info(data.message);

            // Hiển thị thông báo hệ thống (Banner)
            try {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: data.title || "Thông báo mới 🔔",
                  body: data.message,
                  sound: true,
                  data: data // Đính kèm data để xử lý khi người dùng nhấn vào
                },
                trigger: null,
              });
            } catch (error) {
              console.error("Failed to show banner notification:", error);
            }
          });

        })
        .catch(err => console.error("Connection failed: ", err));
    }
  }, [connection]);

  return { connection, messages };
}