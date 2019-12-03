import React, { Component } from "react"
import { View, StyleSheet, TextInput } from "react-native"
import { Container, Content, Text, Fab, Icon, Button, Item, Input } from "native-base"


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
                        {/* {<Item regular>
                            <Input placeholder='Regular Textbox' />
                        </Item>} */}
                        {/* user input */}
                   {/*} </View> */}
                   {/*} <View style={styles.cardContainer}> */}
                        <View style={styles.flexCon}>
                            <Text style={styles.subtitle}>Add Description</Text>
                            <TextInput style={styles.textbox} />

                            <Text style={styles.subtitle}>Enter Title</Text>
                            <TextInput style={styles.textbox} />

                            <Text style={styles.subtitle}>Duration of Event (in hours)</Text>
                            <TextInput style={styles.textbox} />
                        </View>
                        
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
    }, 
    textbox: {
        borderBottomWidth: 2,
        borderBottomColor: "#606060",
        padding: 4,
        marginVertical: 12,
        fontSize: 16,
        width: "70%",
        backgroundColor: "#f0f0f0"
    },
    flexCon: {
        display: "flex",
        alignItems: "center"
    }
})

export default CreateEvent