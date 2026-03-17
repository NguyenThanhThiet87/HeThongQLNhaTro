import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101f22",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20
  },
  back: {
    position: "absolute",
    top: 60,
    left: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  backText: {
    color: "#aaa",
    marginLeft: 5
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#182b2f",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white"
  },
  subtitle: {
    color: "#aaa",
    marginTop: 5
  },
  phone: {
    color: "white",
    fontWeight: "600",
    marginBottom: 30
  },
  otpContainer: {
    flexDirection: "row",
    gap: 12
  },
  otpInput: {
    width: 40,
    height: 40,
    backgroundColor: "#182b2f",
    borderRadius: 16,
    textAlign: "center",
    fontSize: 15,
    color: "white",
    borderWidth: 1,
    borderColor: "#333"
  },
  activeInput: {
    borderColor: "#13c8ec",
    shadowColor: "#13c8ec",
    shadowOpacity: 0.6,
    shadowRadius: 10
  },
  expire: {
    marginTop: 30,
    color: "#aaa"
  },
  time: {
    color: "#13c8ec",
    fontWeight: "600"
  },
  resendText: {
    color: "#888"
  },
  resendBtn: {
    color: "#ccc",
    textDecorationLine: "underline"
  },
  verifyBtn: {
    marginTop: 40,
    backgroundColor: "#13c8ec",
    paddingVertical: 15,
    borderRadius: 14,
    width: "100%",
    alignItems: "center"
  },
  verifyText: {
    fontWeight: "bold",
    color: "#101f22"
  }
});
