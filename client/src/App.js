import React, { Component } from "react"
import { registerRootComponent } from "expo"
import { createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import * as SecureStore from "expo-secure-store"

import Root from "./screens/Root"
import Init from "./screens/Init"
import Splash from "./screens/Splash"

class App extends Component {

    constructor () {
        super()
        this.state = {
            isLoading: true,
            timeoutDone: false,
            initialRoute: null
        }
    }

    // Check if this is our first time running the app and show the info screen first if it is
    async componentDidMount () {
        setTimeout(() => this.setState({ timeoutDone: true }), 3 * 1000)
        // await SecureStore.deleteItemAsync("initDone")
        const result = await SecureStore.getItemAsync("initDone")
        let route = "Main"
        if (result === null) {
            await SecureStore.setItemAsync("initDone", "foo")
            route = "onInit"
        } 
        this.setState({ isLoading: false, initialRoute: route })
    }

    render () {
        const { isLoading, timeoutDone, initialRoute } = this.state
        // Show a splash while loading the app
        if (isLoading || !timeoutDone) 
            return <Splash />
        // Now show our app once we're done
        const Container = createAppContainer(
            createStackNavigator(
                {
                    Main: Root,
                    onInit: Init
                },
                {
                    mode: "modal",
                    headerMode: "none",
                    initialRouteName: initialRoute
                }
            )
        )
        return <Container />
    }

}


registerRootComponent(App)