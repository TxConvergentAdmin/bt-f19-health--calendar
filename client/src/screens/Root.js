import { createAppContainer, NavigationActions } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation-tabs"

import Home from "./Home"
import Calendar from "./Calendar"
import CreateEvent from "./CreateEvent"
import NewStudySession from "./NewStudySession"
import {CustomFooter as Footer} from "../components/Footer.js"

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
        tabBarComponent: Footer
    }
)

const stackNavigator = createStackNavigator(
    {
        "Tab Navigator": { screen: tabNavigator, navigationOptions: { title: "Care'n" } },
        "Create Event": { screen: CreateEvent, navigationOptions: { title: "Create A New Event" } },
        "New Study Session": { screen: NewStudySession, navigationOptions: { title: "Start New Study Session"} }
    }
    
)

export default createAppContainer(stackNavigator)