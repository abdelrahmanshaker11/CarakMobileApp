import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import Map from './MapStack/Map';

export default class Routes extends Component {
   render() {
      return (
         <Stack.Navigator initialRouteName="Map" >
            <Stack.Screen
               name="Map"
               component={Map}
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