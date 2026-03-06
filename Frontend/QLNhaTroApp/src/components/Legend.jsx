import { View, Text, TouchableOpacity } from "react-native";
import styles from "./Legend.styles";
import { MaterialIcons } from "@expo/vector-icons";

export default function legend(label, value, color, highlight = false) {
    return (
        <TouchableOpacity style={styles.legendRow}>

            <View style={styles.leftContainer}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>
                    {label} ({value})
                </Text>
            </View>

            <MaterialIcons
                name="arrow-forward"
                size={16}
                color={color}
                style={styles.arrow}
            />

        </TouchableOpacity>
    );
}
