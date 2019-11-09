import React, { Component } from "react"
import { Container, Footer, FooterTab, Button, Icon, Text } from "native-base"

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

class CustomFooter extends Component {
    render () {
        const routes = this.props.navigation.state.routes
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

export { CustomFooter }