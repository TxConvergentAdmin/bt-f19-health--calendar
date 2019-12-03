import React, { Component } from "react"
import { View, Button, StyleSheet, Text, TextInput } from "react-native"
import { SliderQuestionCard } from "../components/Cards"

export default class NewStudySession extends Component {

    constructor () {
        super()
        this.state = {
            started: false,
            intervals: 4,
            times: [],
            secsLeft: 0,
            intervalId: undefined,
            curr: "",
            cards: [],
            thankYou: false
        }
        this.newSession = this.newSession.bind(this)
        this.endSession = this.endSession.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.getFeedback = this.getFeedback.bind(this)
    }

    newSession () {
        sessionIntervals = this.state.intervals
        newTimes = []
        for (let i = 0; i < sessionIntervals - 1; i++) {
            newTimes.push(5 * 60)
            newTimes.push(25 * 60)
        }
        this.setState({
            started: true,
            times: newTimes,
            secsLeft: 25 * 60,
            curr: "Work"
        }, () => {
            const id = setInterval(() => {
                const { started, intervals, times, secsLeft, intervalId, curr} = this.state
                if (secsLeft === 0) {
                    if (times.length === 0) {
                        this.endSession()
                        return
                    }
                    let nextTime = times.shift()
                    this.setState({
                        times: times,
                        secsLeft: nextTime,
                        curr: curr === "Work" ? "Break" : "Work"
                    })
                } else {
                    this.setState({ secsLeft: secsLeft - 1 })
                }
            }, 1000)
            this.setState({ intervalId: id })
        })
    }

    endSession () {
        const id = this.state.intervalId
        clearInterval(id)
        this.getFeedback()
        this.setState({
            started: false,
            times: [],
            secsLeft: 0,
            intervalId: undefined
        })
    }

    getFeedback () {
        this.setState({
            cards: this.state.cards.concat(
                [<SliderQuestionCard 
                    question="Please rate your productivity for this study session." 
                    minValue={0} 
                    maxValue={100} 
                    onAnswer={ (answer) => {
                        this.setState({ cards: [], thankYou: true })
                        setTimeout(() => this.setState({ thankYou: false }), 3000)
                    }}
                    key={0}
                />]
            )
        })
    }

    formatTime (totalSecs) {
        let mins = Math.floor(totalSecs / 60)
        let secs = totalSecs % 60
        mins = mins < 10 ? "0" + mins.toString() : mins.toString()
        secs = secs < 10  ? "0" + secs.toString() : secs.toString()
        return `${mins}:${secs}`
    }

    handleTextChange (text) {
        this.setState({
            intervals: parseInt(text)
        })
    }

    render () {
        const { started, intervals, times, secsLeft, curr, cards, thankYou } = this.state
        return (
            <View style={styles.body}>
                <Text style={styles.header}>Pomodoro Technique</Text>
                <View style={styles.inputAndLabel}>
                    <Text style={styles.label}>Intervals</Text>
                    <TextInput onChangeText={(text) => this.handleTextChange(text)} style={styles.textInput} value={intervals.toString()} />
                </View>
                <View style={styles.timeCon}>
                    { started ? <Text style={styles.subHead}>{ curr === "Work" ? "Keep Working!" : "Take a Break." }</Text> : null }
                    <Text style={styles.time}>{this.formatTime(secsLeft)}</Text>
                    <Text style={styles.upNext}>{ started && times.length > 0 ? `Up next: ${Math.floor(times[0] / 60)} minutes` : null }</Text>
                </View>
                <Button title={started ? "Terminate" : "Start"} style={styles.button} onPress={ started ? this.endSession : this.newSession} />
                <View style={styles.cardCon}>
                    { cards.length > 0 ? cards : null }
                    { thankYou ? <Text>Thanks for the input! This goes into making your experience better.</Text> : null }
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    body: {
        width: "100%",
        height: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around"
    },
    header: {
        fontSize: 24,
        fontWeight: "bold"
    },
    inputAndLabel: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        fontSize: 16,
        marginRight: 2
    },
    textInput: {
        borderBottomColor: "#404040",
        borderBottomWidth: 2,
        fontSize: 16,
        marginLeft: 2,
        padding: 2
    },
    subHead: {
        fontSize: 20,
        fontWeight: "600"
    },
    timeCon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    time: {
        fontSize: 72,
        fontWeight: "bold",
        marginVertical: 32
    },
    upNext: {
        fontSize: 14,
        color: "#606060",
        fontStyle: "italic"
    },
    cardCon: {}
})