import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyC1l8lBknzksFTL1NCYc8oSiKUqGTg5bxQ",
  authDomain: "qlnhatro-cc8e1.firebaseapp.com",
  projectId: "qlnhatro-cc8e1",
  storageBucket: "qlnhatro-cc8e1.firebasestorage.app",
  messagingSenderId: "39598891152",
  appId: "1:39598891152:web:807bde27a2b6bef121b815",
  measurementId: "G-7JKNJKRK4F"
};

const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  // WEB
  auth = getAuth(app);
} else {
  // ANDROID / IOS
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { app, auth };
