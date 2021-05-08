import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import SplashScreen from './Components/SplashScreen';
import TabNavigatorRoutes from './Components/TabNavigatorRoutes';

export default class Routes extends Component {
   render() {
      return (
         <Stack.Navigator initialRouteName="SplashScreen" >
            <Stack.Screen
               name="SplashScreen"
               component={SplashScreen}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  }
               }}
            />
            <Stack.Screen
               name="TabNavigatorRoutes"
               component={TabNavigatorRoutes}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  }
               }}
            />
         </Stack.Navigator>
      )
   }
}