import { StyleSheet } from "react-native";

export const colors = {
  primary: "#13c8ec",
  background: "#101f22",
  surface: "#182b2f",
  text: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  border: "rgba(255,255,255,0.1)",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },
  form: {
    marginTop: 40,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 60,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  forgotWrapper: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signUp: {
    color: colors.primary,
    fontWeight: "600",
  },
  bottomBar: {
    width: 48,
    height: 5,
    backgroundColor: colors.text,
    opacity: 0.3,
    borderRadius: 10,
    marginTop: 30,
  },
});