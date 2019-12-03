import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import { Container, Content, Text, Fab, Icon, Button } from "native-base"
import EventList from "../components/EventList"
import QuestionList from "../components/QuestionList"

export default class Home extends Component {

    constructor () {
        super()
        this.state = {
            fabActive: false
        }
        this.onSchedule = this.onSchedule.bind(this)
        this.elRef = React.createRef()
    }

    onSchedule () {
        this.elRef.current.getEvents()
    }

    render () {
        const fabActive = this.state.fabActive
        return (
            <Container>
                <Content>
                    <Text style={styles.title}>Home</Text>
                    <View style={styles.cardContainer}>
                        <Text style={styles.subtitle}>Some Questions For You</Text>
                        <QuestionList onSchedule={this.onSchedule} />
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={styles.subtitle}>Upcoming Events</Text>
                        <EventList ref={this.elRef} />
                    </View>
                </Content>
                <View>
                    <Fab active={fabActive} onPress={() => this.setState({ fabActive: !fabActive })} >
                        <Icon name="ios-add"/>
                        <Button 
                            style={{backgroundColor: "#e5a2a2"}} 
                            onPress={() => this.props.navigation.navigate("Create Event")}
                        >
                            <Icon name="calendar" />
                        </Button>
                        <Button
                            style={{backgroundColor: "#72d0ea"}}
                            onPress={() => this.props.navigation.navigate("New Study Session")}
                        >
                            <Icon name="md-book" />
                        </Button>
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