import React, {Component} from "react"
import { StyleSheet } from "react-native"
import { Container, Button, Text } from "native-base"

class Init extends Component {

    navigateToMain () {
        this.props.navigation.navigate("Main")
    }

    render () {
        return (
            <Container style={styles.con}>
                <Text style={styles.header}>Welcome to the app :)</Text>
                <Button onPress={this.navigateToMain.bind(this)}>
                    <Text>Go to the app.</Text>
                </Button>
            </Container>
        )
    }

}

const styles = StyleSheet.create({
    con: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 8
    },
    header: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 48
    }
})

export default Init