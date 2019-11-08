import React, { Component } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { Container, Content, Card, CardItem, Title, Text, Body, Button } from "native-base"
import { DefaultCard, SliderQuestionCard, ButtonQuestionCard } from "../components/Cards"

export default class Home extends Component {

    render () {
        return (
            <Container>
                <Content>
                    <View style={styles.cardContainer}>
                        <Title>Some Questions For You</Title>
                        <ButtonQuestionCard 
                            question="Do you have an upcoming test?" 
                            buttonChoices={[{ text: "Yes", val: true }, { text: "No", val: false }]}
                            onAnswer={(btnInfo) => Alert.alert(`${btnInfo.text} pressed.`, `${btnInfo.val}`, [{ text: "Ok", onPress: () => console.log(btnInfo) }])}
                        />
                        <SliderQuestionCard 
                            question="What's up?" 
                            onAnswer={(val) => Alert.alert("Slider submitted", `${val}`, [{ text: "OK" }])}
                        />
                    </View>
                    <View style={styles.cardContainer}>
                        <Title>Upcoming Events</Title>
                        <DefaultCard title="A Header">
                            <Text>Here is some text!!</Text>
                        </DefaultCard>
                    </View>
                </Content>
            </Container>
        )
    }

}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        paddingVertical: 12,
        textTransform: "capitalize",
        letterSpacing: 1,
        color: "#101010"
    },
    subtitle: {
        fontSize: 16,
        color: "#303030",
        textAlign: "center"
    },
    cardContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 16
    }
})