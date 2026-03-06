import { StyleSheet } from "react-native";

export default StyleSheet.create({

    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },

    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,              // phần trái chiếm space còn lại
    },

    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        marginRight: 8
    },

    legendText: {
        color: "#94a3b8",
        fontSize: 13,
    },

    arrow: {
        marginLeft: "20%",       // khoảng cách với text
    }

});
