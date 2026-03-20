import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';

export default function useSignalR() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://eveline-prenasal-concha.ngrok-free.dev/api/chatHub") // đổi thành URL API của bạn
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("Connected to SignalR hub");

          connection.on("ReceiveMessage", (user, message) => {
            setMessages(prev => [...prev, { user, message }]);
          });
        })
        .catch(err => console.error("Connection failed: ", err));
    }
  }, [connection]);

  return { connection, messages };
}
