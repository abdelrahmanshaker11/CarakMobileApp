import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import Home from './HomeStack/Home';
import ScreenSpare from './HomeStack/ScreenSpare';
import ScreenCar from './HomeStack/ScreenCar';
import ScreenNews from './HomeStack/ScreenNews';

export default class Routes extends Component {
   render() {
      return (
         <Stack.Navigator initialRouteName="Home" >
            <Stack.Screen
               name="Home"
               component={Home}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="ScreenSpare"
               component={ScreenSpare}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="ScreenCar"
               component={ScreenCar}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="ScreenNews"
               component={ScreenNews}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
         </Stack.Navigator>
      )
   }
}