import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import DamageDetect from './DamageDetectStack/DamageDetect';

export default class Routes extends Component {
   render() {
      return (
         <Stack.Navigator initialRouteName="DamageDetect" >
            <Stack.Screen
               name="DamageDetect"
               component={DamageDetect}
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