import React, { Component } from "react"
import { StyleSheet } from "react-native"
import { Container, Header, Footer, FooterTab, Content, Title, Button, Right, Left, Body, Text, Icon } from "native-base"
import { createAppContainer, NavigationActions } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation-tabs"

import Home from "./Home"

class TabProps {
    constructor (title, iconName, routName) {
        this.title = title
        this.iconName = iconName
        this.routeName = routName
    }
}

class FooterTabButton extends Component {

    switchTabs () {
        this.props.navigation.navigate(this.props.tabProps.route)
    }

    render () {
        const { title, iconName } = this.props.tabProps
        return (
            <Button vertical onPress={this.switchTabs.bind(this)}>
                <Icon name={iconName} />
                <Text>{title}</Text>
            </Button>
        )
    }
}

const tabs = [new TabProps("Home", "home", "Home"), new TabProps("My Calendar", "calendar", "Calendar")]

class RootView extends Component {

    render () {
        return (
            <Container>
                <Header noLeft style={styles.header}>
                    <Body>
                        <Title>Lorem Ipsum</Title>
                    </Body>
                </Header>
                <Content>
                    <Home />
                </Content>
            </Container>
        )
    }

}

class Calendar extends Component {
    render () {
        return (
            <Container>
                <Content>
                    <Text>This is where the calendar goes.</Text>
                </Content>
            </Container>
        )
    }
}

class CustomFooter extends Component {
    render () {
        const routes = this.props.navigation.state.routes
        console.log(routes)
        return (
            <Footer>
                <FooterTab>
                    {routes.map((route, i) => {
                        return (
                            <Button 
                                key={i} 
                                onPress={() => this.props.onTabPress({ route })}
                                onLongPress={() => this.props.onTabLongPress({ route })}
                                vertical
                            >
                                <Icon name={route.params.icon} />
                                <Text>{route.routeName}</Text>
                            </Button>
                        )
                    })}
                </FooterTab>
            </Footer>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        
    }
})

const tabNavigator = createBottomTabNavigator(
    {
        "Home": { 
            screen: Home, 
            navigationOptions: {
                title: "Home"
            },
            params: { icon: "home" } 
        },
        "My Calendar": { 
            screen: Calendar, 
            navigationOptions: {
                title: "My Calendar"
            },
            params: { icon: "calendar" } 
        }
    },
    {
        tabBarComponent: CustomFooter
    }
)

const stackNavigator = createStackNavigator(
    {
        "Tab Navigator": { screen: tabNavigator, navigationOptions: { title: "WTF" } }
    },
    
)

export default createAppContainer(stackNavigator)