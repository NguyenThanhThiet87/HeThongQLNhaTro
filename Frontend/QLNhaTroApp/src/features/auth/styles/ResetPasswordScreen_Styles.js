import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101f22",
    paddingTop: 100,
    paddingHorizontal: 20
  },
  back: {
    position: "absolute",
    top: 60,
    left: 20,
    flexDirection: "row",
    alignItems: "center"
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
    color: "white",
    textAlign: "center"
  },
  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 10
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#182b2f",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#333"
  },
  input: {
    flex: 1,
    color: "white",
    marginHorizontal: 10
  },
  conditions: {
    marginTop: 20,
    paddingHorizontal: 5
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  conditionText: {
    color: "#aaa",
    fontSize: 12,
    marginLeft: 6
  },
  button: {
    marginTop: 30,
    backgroundColor: "#13c8ec",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    color: "#101f22"
  }
});
