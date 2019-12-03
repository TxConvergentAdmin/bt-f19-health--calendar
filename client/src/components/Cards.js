import React, { Component } from "react"
import { Animated, StyleSheet, View, TextInput } from "react-native"
import { Container, Title, Text, Body, Button, Card, CardItem } from "native-base"
import moment from "moment"
import Slider from "./Slider"

const backgroundStyleNames = { red: "backgroundRed", yellow: "backgroundYellow", blue: "backgroundBlue" }
const COLORS = ["red", "yellow", "blue"]

class DefaultCard extends Component {

    constructor () {
        super()
        this.fade = new Animated.Value(0)
    }

    componentDidMount () {
        Animated.timing(this.fade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    }

    componentWillUnmount () {
        Animated.timing(this.fade, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }

    render () {
        const color = this.props.backgroundColor
        const myStyles = [styles.card]
        if (color)
            myStyles.push(styles[backgroundStyleNames[color]])
        return (
            <Animated.View style={[myStyles, { opacity: this.fade }]}>
                <View>
                    <Text style={styles.cardHeader}>{this.props.title}</Text>
                </View>
                <View style={styles.cardBody}>
                    {this.props.children}
                </View>
            </Animated.View>
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

class TextQuestionCard extends Component {

    constructor (props) {
        super(props)
        this.state = {
            text: null,
            focused: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleTextChange (text) {
        this.setState({ text: text })
    }

    handleSubmit () {
        const text = this.state.text
        console.log(text)
        this.props.onAnswer(text)
    }

    render () {
        const { text, focused } = this.state
        const myStyles = [styles.textBox]
        if (focused)
            myStyles.push(styles.textBoxFocused)
        return (
            <QuestionCard question={this.props.question}>
                <View style={styles.textFlexCon}>
                    <TextInput 
                        style={myStyles} 
                        value={text} 
                        onChangeText={(text) => this.handleTextChange(text)} 
                        onFocus={() => this.setState({ focused: true })}
                        onBlur={() => this.setState({ focused: false })}
                    />
                    <Button small onPress={this.handleSubmit} style={styles.cardTextSubmit}>
                        <Text>Submit</Text>
                    </Button>
                </View>
            </QuestionCard>
        )
    }
}

class SliderQuestionCard extends Component {

    constructor (props) {
        super(props)
        this.state = {
            val: this.props.minValue
        }
    }

    updateState (value) {
        let newVal = value
        if (this.props.wholeNums === true) 
            newVal = Math.floor(newVal)
        this.setState({ val: newVal })
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
        this.state = { timeUntilEvent: this.getTimeUntilEvent(), bgChoice: null }
    }

    componentDidMount () {
        setInterval(() => {
            const tu = this.getTimeUntilEvent()
            this.setState({ timeUntilEvent: tu })
        }, 1000 * 60)
    }

    // date is a Date object, returns a string
    getTimeUntilEvent () {
        const event = this.props.eventObject
        let timeUntil = (event.startDate - new Date()) / 1000 // Put in terms of seconds
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

    componentDidMount () {
        this.setState({ bgChoice: COLORS[ Math.floor(Math.random() * COLORS.length) ] })
    }

    render () {
        const event = this.props.eventObject || defaultEvent
        const tu = this.state.timeUntilEvent
        const bgChoice = this.state.bgChoice
        const localeOps = { timeZone: "America/Chicago", hour12: true, month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
        return (
            <DefaultCard title={ tu === null ? `${event.title} happening now.` : `${event.title} in ${tu}.` } backgroundColor={bgChoice}>
                <Text style={ {fontStyle: "italic", color: "#404040"} }>From {event.startDate.toLocaleString("en", localeOps)}</Text>
                <Text style={ {fontStyle: "italic", color: "#404040", marginBottom: 2} }>To {event.endDate.toLocaleString("en", localeOps)}</Text>
                <Text style={ {color: "#404040"} }>{ event.location ? `At ${event.location}` : null}</Text>
            </DefaultCard>
        )
    }

}

const styles = StyleSheet.create({
    card: {
        width: "90%",
        marginVertical: 4,
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 4
    },
    cardHeader: {
        paddingVertical: 2,
        fontSize: 24,
        fontWeight: "bold"
    },
    cardBody: {
        fontSize: 16
    },
    cardChildCon: {
        marginVertical: 8
    },
    btnFlexCon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    sliderFlexCon: {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    textFlexCon: {
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
    },
    backgroundRed: {
        backgroundColor: "#e5a2a2",
        color: "#f8f8f8"
    },
    backgroundYellow: {
        backgroundColor: "#ffffc1"
    },
    backgroundBlue: {
        backgroundColor: "#72d0ea",
        color: "#f8f8f8"
    },
    textBox: {
        borderBottomWidth: 2,
        borderBottomColor: "#606060",
        flex: 1,
        marginRight: 8
    },
    textBoxFocused: {
        borderBottomColor: "#b0b0b0",
    },
    cardTextSubmit: {
        flex: 0
    },
})

export { EventCard, ButtonQuestionCard, SliderQuestionCard, TextQuestionCard }