import React, { Component, Fragment } from "react"
import { ButtonQuestionCard, SliderQuestionCard } from "./Cards"
import { Alert } from "react-native"

// Default button question
const defaultButtonQuestion = {
    type: "discrete",
    question: "Can you answer a yes or no question?",
    answers: [
        { text: "Yes", value: 1 },
        { text: "No", value: 0 },
        { text: "Maybe?", value: -1 }
    ]
}

const defaultSliderQuestion = {
    type: "fluid",
    question: "What is your favorite value on this slider?", 
    rangeStart: 0,
    rangeEnd: 100
}

class QuestionList extends Component {

    constructor () {
        super()
        this.state = {
            questions: []
        }
    }

    componentDidMount () {
        this.getQuestions()
    }

    async getQuestions () {
        this.setState({
            questions: [defaultButtonQuestion, defaultSliderQuestion]
        })
    }

    render () {
        const { questions } = this.state
        return (
            <Fragment>
                {questions.map((q, i) => {
                    if (q.type === "discrete") {
                        return <ButtonQuestionCard 
                                key={i}
                                question={q.question}
                                buttonChoices={q.answers}
                                onAnswer={(answer) => Alert.alert(`${answer.text} pressed.`, `${answer.value}`)} 
                            />
                    } else if (q.type === "fluid") {
                        return <SliderQuestionCard 
                                key={i}
                                question={q.question}
                                minValue={q.rangeStart}
                                maxValue={q.rangeEnd}
                                onAnswer={(val) => Alert.alert("Slider val", `${val}`)}
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