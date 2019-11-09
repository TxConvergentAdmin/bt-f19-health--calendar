import React, { Component, Fragment } from "react"
import { EventCard } from "./Cards"

const defaultStart = new Date()
defaultStart.setHours(defaultStart.getHours() + 2)
const defaultEnd = new Date()
defaultEnd.setHours(defaultEnd.getHours() + 5)

const defaultEvent = {
    title: "Data Structures Exam II",
    startDate: defaultStart,
    endDate: defaultEnd,
    location: {
        line1: "105 21st Street West",
        city: "Austin",
        state: "TX",
        zip: "78712"
    },
    priority: 0,
    type: "exam"
}

class EventList extends Component {

    constructor () {
        super()
        this.state = { events: [] }
    }

    componentDidMount () {
        this.getEvents()
    }

    async getEvents () {
        this.setState({ 
            events: [defaultEvent]
         })
    }

    render () {
        const { events } = this.state
        return (
            <Fragment>
                {events.map((event, i) => {
                    return <EventCard eventObject={event} key={i} />
                })}
            </Fragment>
        )
    }

}

export default EventList