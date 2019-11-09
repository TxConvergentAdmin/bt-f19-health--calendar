import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import { Container, Content, Text, Fab, Icon } from "native-base"
import EventList from "../components/EventList"
import QuestionList from "../components/QuestionList"

export default class Home extends Component {

    constructor () {
        super()
    }

    render () {
        return (
            <Container>
                <Content>
                    <Text style={styles.title}>Home</Text>
                    <View style={styles.cardContainer}>
                        <Text style={styles.subtitle}>Some Questions For You</Text>
                        <QuestionList />
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={styles.subtitle}>Upcoming Events</Text>
                        <EventList />
                    </View>
                </Content>
                <View>
                    <Fab onPress={() => this.props.navigation.navigate("Create Event")} >
                        <Icon name="ios-add"/>
                    </Fab>
                </View>
            </Container>
        )
    }

}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        marginVertical: 8,
        color: "#101010",
        textAlign: "center",
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "500",
        color: "#303030",
        textAlign: "center",
        marginVertical: 4
    },
    cardContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 16
    }
})