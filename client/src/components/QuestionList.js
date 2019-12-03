import React, { Component, Fragment } from "react"
import { ButtonQuestionCard, SliderQuestionCard, TextQuestionCard } from "./Cards"
import { Alert, Text } from "react-native"

// Default button question
const defaultButtonQuestion = {
    type: "discrete",
    question: "Can you answer a yes or no question?",
    answers: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
        { text: "Maybe?", value: -1 }
    ],
    onAnswer: (answer) => {
        Alert.alert("ALERT!", `Answer: ${answer.value}`)
    }
}

const defaultSliderQuestion = {
    type: "fluid",
    question: "What is your favorite value on this slider?", 
    rangeStart: 0,
    rangeEnd: 100,
    onAnswer: (answer) => {
        Alert.alert("ALERT!", `Answer: ${answer}`)
    },
    wholeNums: true
}

const defaultTextQuestion = {
    type: "text",
    question: "Type stuff on here.",
    onAnswer: (answer) => {
        Alert.alert("ALERT!", `Answer: ${answer}`)
    }
}

const q3 = (n) => {
    return {
        type: "fluid",
        question: `On a scale of 1-10, how hard will exam ${n} be?`,
        rangeStart: 1,
        rangeEnd: 10,
        wholeNums: true,
        key: "priority",
        onAnswer (answer) {
            return answer / 2
        }
    }
}

const q2 = {
    type: "fluid",
    question: "How many exams do you have?", 
    rangeStart: 1,
    rangeEnd: 15,
    wholeNums: true,
    next: [],
    onAnswer (answer) {
        for (let i = 1; i <= answer; i++) {
            this.next.push({
                type: "text", 
                question: "What class is it?",
                key: "title",
                onAnswer: (answer) => {
                    return `${answer} Study Session.`
                }
            })
            this.next.push(q3(i))
        }
        return answer
    }
}

const q1 = {
    type: "discrete",
    question: "It's the last week of class! Do you have any exams coming up?",
    answers: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 }
    ],
    next: q2,
    onAnswer (answer) {
        if (answer.value == 1)
            return q2
    }
}

class QuestionList extends Component {

    constructor () {
        super()
        this.state = {
            questions: [],
            answers: { }
        }
    }

    componentDidMount () {
        this.getQuestions()
    }

    componentDidUpdate () {
        const { questions, answers } = this.state
        if (questions.length === 0) {
            if (answers != {}) {
                fetch("http://localhost:5000/events/schedule", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        info: answers
                    })
                })
                .then((response) => {
                    console.log(response)
                    if (response.status == 200) {
                        this.props.onSchedule()
                    }
                })
            }
        }
    }

    async getQuestions () {
        this.setState({
            questions: [q1]
        })
    }

    render () {
        const { questions } = this.state
        return (
            <Fragment>
                {questions.length === 0 ? <Text style={{marginVertical: 8}}>No questions here.</Text> : null}
                {questions.map((q, i) => {
                    if (!q) {
                        return null
                    }
                    if (q.type === "discrete") {
                        return <ButtonQuestionCard 
                                key={i}
                                question={q.question}
                                buttonChoices={q.answers}
                                onAnswer={ (answer) => {
                                    const prevAnswers =  this.state.answers
                                    let result = q.onAnswer(answer)
                                    let newQuestions = this.state.questions.filter((el, j) => i != j )
                                    if (Array.isArray(q.next)) {
                                        newQuestions = newQuestions.concat(q.next)
                                    } else if (q.next) {
                                        newQuestions.push(q.next)
                                    }
                                    const newAnswers = {
                                        ...prevAnswers
                                    }
                                    if (q.key)
                                        newAnswers[q.key] = result
                                    this.setState({ 
                                        questions: newQuestions,
                                        answers: newAnswers
                                    })
                                    
                                }} 
                            />
                    } else if (q.type === "fluid") {
                        return <SliderQuestionCard 
                                key={i}
                                question={q.question}
                                minValue={q.rangeStart}
                                maxValue={q.rangeEnd}
                                onAnswer={ (answer) => {
                                    const prevAnswers =  this.state.answers
                                    let result = q.onAnswer(answer)
                                    let newQuestions = this.state.questions.filter((el, j) => i != j)
                                    if (Array.isArray(q.next)) {
                                        newQuestions = newQuestions.concat(q.next)
                                    } else if (q.next) {
                                        newQuestions.push(q.next)
                                    }
                                    const newAnswers = {
                                        ...prevAnswers
                                    }
                                    if (q.key)
                                        newAnswers[q.key] = result
                                    this.setState({ 
                                        questions: newQuestions,
                                        answers: newAnswers
                                    })
                                }} 
                                wholeNums={q.wholeNums}
                            />
                    } else if (q.type === "text") {
                        return <TextQuestionCard 
                                key={i}
                                question={q.question}
                                onAnswer={ (answer) => {
                                    const prevAnswers = this.state.answers
                                    let result = q.onAnswer(answer)
                                    this.setState({ 
                                        questions: questions.filter((el, j) => i != j ), 
                                        answers: {
                                            ...prevAnswers,
                                            [q.key]: result
                                        } 
                                    })
                                }} 
                            />
                    } else {
                        return null
                    }
                })}
            </Fragment>
        )
    }

}

export default QuestionList