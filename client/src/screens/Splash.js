import React from "react"
import { View, StyleSheet, Image } from "react-native"

const Splash = (props) => {
    return (
        <View style={styles.splash}>
            <Image 
                style={{ width: 300, height: 300 }}
                source={{ uri: "https://i.imgur.com/61iLs8X.png" }}
            />
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