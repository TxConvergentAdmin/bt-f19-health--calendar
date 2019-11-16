import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import { Container, Content, Text, Fab, Icon, Button } from "native-base"


class CreateEvent extends Component {
    constructor() {
        super()
        this.state= {
            eventType:null,
            title:null,
            description:null
        }
        this.onPressButton=this.onPressButton.bind(this)
    }
   
    onPressButton(type) {
        this.setState({eventType: type})
    }
    render () {
        const { eventType, title, description } = this.state
        console.log(eventType)
        return (
            <Container>
                <Content>
                    <Text style={styles.title}>Create Event</Text>
                   {/* <View style={styles.cardContainer}> */}
                        <Text style={styles.subtitle}>Enter Title</Text>
                        {/* user input */}
                   {/*} </View> */}
                   {/*} <View style={styles.cardContainer}> */}
                        <Text style={styles.subtitle}>Add Description</Text>
                        {/* user input */}
                   {/*} </View> */}
                   <Text style={styles.subtitle}>Type of Event</Text>
                   <View style={styles.flexView}>
                       <Text>Current Event Type: {eventType == null ? "Not Selected" : eventType}</Text>
                        <Button style={styles.centerButton} onPress={()=> this.onPressButton("Academic")}>
                            <Text>Academic</Text>
                        </Button>
                        <Button style={styles.centerButton} onPress={()=> this.onPressButton("Social")}>
                            <Text>Social</Text>
                        </Button>
                        <Button style={styles.centerButton} onPress={()=> this.onPressButton("Mental")}>
                            <Text>Mental</Text>
                        </Button>
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
        fontSize: 30,
        fontWeight: "500",
        color: "#303030",
        textAlign: "center",
        marginVertical: 4
    },
    centerButton: {
        width: "50%",
        marginVertical: 4
    },
    flexView: {
        display: "flex", 
        alignItems: "center",
        justifyContent: "center", 
        flexDirection: "column"
    }
})

export default CreateEvent