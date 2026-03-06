import { getAuth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "./firebaseConfig";
import formatPhoneNumber from "../utils/formatPhoneNumber";

let verificationId = null;

/**
 * Gửi OTP
 * @param {string} phoneNumber
 * @param {object} recaptchaVerifierRef (ref từ FirebaseRecaptchaVerifierModal)
 */
export const sendOTP = async (phoneNumber, recaptchaVerifierRef) => {
  try {
    const auth = getAuth(app);
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const confirmation = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      recaptchaVerifierRef.current
    );

    verificationId = confirmation.verificationId;

    return {
      success: true,
      phone: formattedPhone
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Xác thực OTP
 * @param {string} phoneNumber
 * @param {string} otp
 */
export const verifyOTP = async (phoneNumber, otp) => {
  try {
    if (!verificationId) {
      throw new Error("Chưa gửi OTP");
    }

    const auth = getAuth(app);

    const credential = PhoneAuthProvider.credential(
      verificationId,
      otp
    );

    const result = await signInWithCredential(auth, credential);

    const firebaseUser = result.user;

    // Kiểm tra số điện thoại khớp
    if (firebaseUser.phoneNumber !== formatPhoneNumber(phoneNumber)) {
      throw new Error("Số điện thoại không khớp");
    }
    const idToken = await result.user.getIdToken();

    return {
      success: true,
      uid: firebaseUser.uid,
      idToken
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
