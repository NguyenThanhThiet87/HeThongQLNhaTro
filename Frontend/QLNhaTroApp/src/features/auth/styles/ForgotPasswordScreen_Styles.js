
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101f22",
    justifyContent: "center",
    padding: 20
  },
  card: {
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginVertical: 10
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#182b2f",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    width: "100%"
  },
  input: {
    flex: 1,
    color: "white"
  },
  button: {
    backgroundColor: "#13c8ec",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    color: "#101f22"
  },
  back: {
    color: "#aaa",
    marginTop: 20
  }
});
