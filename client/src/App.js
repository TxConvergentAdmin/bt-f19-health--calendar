import React, {Component} from "react"
import { registerRootComponent } from "expo"
import RootView from "./screens/RootView"

class App extends Component {

    render () {
        return <RootView />
    }
}

registerRootComponent(App)