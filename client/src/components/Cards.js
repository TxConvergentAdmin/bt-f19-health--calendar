import React, { Component } from "react"
import { StyleSheet, View, Alert } from "react-native"
import { Container, Title, Text, Body, Button, Card, CardItem } from "native-base"
import moment from "moment"
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

    handleBtnClick (answer) {
        console.log("Pressed!")
        this.props.onAnswer(answer)
    }

    render () {
        return (
            <QuestionCard question={this.props.question}>
                <View style={styles.btnFlexCon}>
                    {this.props.buttonChoices.map((answer, i) => {
                        return (
                            <Button 
                            small
                            style={styles.cardBtn} 
                            key={i} 
                            onPress={this.handleBtnClick.bind(this, answer)}>
                                <Text>{answer.text}</Text>
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
                        minimumValue={this.props.minValue}
                        maximumValue={this.props.maxValue}
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

class EventCard extends Component {

    constructor (props) {
        super(props)
        this.state = { timeUntilEvent: this.getTimeUntilEvent() }
    }

    componentDidMount () {
        setInterval(() => {
            const tu = this.getTimeUntilEvent()
            console.log(tu)
            this.setState({ timeUntilEvent: tu })
        }, 1000 * 60)
    }

    // date is a Date object, returns a string
    getTimeUntilEvent () {
        const event = this.props.eventObject
        let timeUntil = (event.date - new Date()) / 1000 // Put in terms of seconds
        if (timeUntil > 0) {
            let unit
            // Put in terms of either days, hours, or minutes
            if (timeUntil > 3600 * 24) {
                timeUntil /= (3600 * 24)
                unit = "day"
            } else if (timeUntil > 3600) {
                timeUntil /= 3600
                unit = "hour"
            } else {
                timeUntil /= 60
                unit = "minute"
            }
            timeUntil = Math.floor(timeUntil)
            return `${timeUntil} ${timeUntil > 1 ? unit + "s" : unit}`
        } else {
            return null
        }
    }

    render () {
        const event = this.props.eventObject || defaultEvent
        const tu = this.state.timeUntilEvent
        return (
            <DefaultCard title={ tu === null ? `${event.title} happening now.` : `${event.title} in ${tu}.` }>
                <Text>At {`${event.location.line1}, ${event.location.city} ${event.location.state}`}</Text>
            </DefaultCard>
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

export { EventCard, ButtonQuestionCard, SliderQuestionCard }