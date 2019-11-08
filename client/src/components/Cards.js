import React, { Component } from "react"
import { StyleSheet, View, Alert } from "react-native"
import { Container, Title, Text, Body, Button, Card, CardItem } from "native-base"
import Slider from "./Slider"

class DefaultCard extends Component {
    render () {
        return (
            <Card style={styles.card}>
                <CardItem header style={styles.cardHeader}>
                    <Text>{this.props.title}</Text>
                </CardItem>
                <CardItem>
                    <Body>
                        {this.props.children}
                    </Body>
                </CardItem>
            </Card>
        )
    }
}

class QuestionCard extends Component {
    render () {
        return (
            <DefaultCard title="A Question.">
                <Text>{this.props.question}</Text>
                <View style={styles.cardChildCon}>
                    {this.props.children}
                </View>
            </DefaultCard>
        )
    }
}

class ButtonQuestionCard extends Component {

    handleBtnClick (btnInfo) {
        this.props.onAnswer(btnInfo)
    }

    render () {
        return (
            <QuestionCard question={this.props.question}>
                <View style={styles.btnFlexCon}>
                    {this.props.buttonChoices.map((btn, i) => {
                        return (
                            <Button 
                            small
                            style={styles.cardBtn} 
                            key={i} 
                            onPress={this.handleBtnClick.bind(this, btn)}>
                                <Text>{btn.text}</Text>
                            </Button>
                        )
                    })}
                </View>
            </QuestionCard>
        )
    }
}

class SliderQuestionCard extends Component {

    constructor () {
        super()
        this.state = {
            val: 0
        }
    }

    updateState (value) {
        this.setState({ val: value })
    }

    handleSubmit () {
        this.props.onAnswer(this.state.val)
    }

    render () {
        const rounded = Math.floor(this.state.val * 100) / 100
        return (
            <QuestionCard question={this.props.question}>
                <Text style={{flex: 0}}>{rounded}</Text>
                <View style={styles.sliderFlexCon}>
                    <Slider
                        style={styles.cardSlider}
                        onValueChange={(value) => this.updateState(value)}
                        minimumValue={0}
                        maximumValue={1}
                    />
                    <Button 
                        small
                        onPress={this.handleSubmit.bind(this)}
                        style={styles.cardSliderSubmit}>
                        <Text>Submit</Text>
                    </Button>
                </View>
            </QuestionCard>
        )
    }

}

const styles = {
    card: {
        width: "90%",
        marginVertical: 0
    },
    cardHeader: {
        marginBottom: 0,
        paddingBottom: 2
    },
    cardChildCon: {
        marginVertical: 8
    },
    btnFlexCon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "space-between",
        justifyContent: "space-between"
    },
    sliderFlexCon: {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    cardSlider: {
        flex: 1,
        marginRight: 4
    },
    cardSliderSubmit: {
        flex: 0
    },
    cardBtn: {
        marginRight: 4,
    }
}

export { DefaultCard, ButtonQuestionCard, SliderQuestionCard }