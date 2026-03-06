import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#101f22",
    },

    header: {
        paddingTop: 55,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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

    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 120
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "white",
        marginTop: 20,
    },

    subtitle: {
        color: "#aaa",
        marginTop: 6
    },

    bottom: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 20,
        backgroundColor: "#101f22"
    },

    continueBtn: {
        backgroundColor: "#13c8ec",
        paddingVertical: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },

    continueText: {
        fontWeight: "bold",
        color: "#101f22"
    },

    note: {
        textAlign: "center",
        fontSize: 12,
        color: "#555",
        marginTop: 12
    }

});
