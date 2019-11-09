import React from "react"
import { View, StyleSheet, Text } from "react-native"

const Splash = (props) => {
    return (
        <View style={styles.splash}>
            <Text style={styles.text}>Here is our splash :)</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    splash: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    text: {
        fontWeight: "bold"
    }
})

export default Splash