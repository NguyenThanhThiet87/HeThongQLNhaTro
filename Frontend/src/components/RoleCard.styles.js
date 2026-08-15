import { StyleSheet } from "react-native";

export default StyleSheet.create({

    card: {
        backgroundColor: "#162a2e",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#1f3a3f"
    },

    cardSelected: {
        borderColor: "#13c8ec",
        backgroundColor: "rgba(19,200,236,0.08)"
    },

    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#0d191b",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },

    iconBoxSelected: {
        backgroundColor: "rgba(19,200,236,0.2)"
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },

    cardSubtitle: {
        fontSize: 12,
        fontWeight: "600",
        color: "#888",
        marginTop: 2,
        marginBottom: 6
    },

    cardDescription: {
        fontSize: 13,
        color: "#aaa"
    },

    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#555",
        alignItems: "center",
        justifyContent: "center"
    },

    radioSelected: {
        backgroundColor: "#13c8ec",
        borderColor: "#13c8ec"
    }

});
