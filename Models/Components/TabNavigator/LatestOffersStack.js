import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import LatestOffers from './LatestOffersStack/LatestOffers';
import ScreenOffer from './LatestOffersStack/ScreenOffer';

export default class Routes extends Component {
   render() {
      return (
         <Stack.Navigator initialRouteName="LatestOffers" >
            <Stack.Screen
               name="LatestOffers"
               component={LatestOffers}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  }
               }}
            />
            <Stack.Screen
               name="ScreenOffer"
               component={ScreenOffer}
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