import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import More from './MoreStack/More';
import AboutUs from './MoreStack/AboutUs';
import AddMaintainance from './MoreStack/AddMaintainance';
import AddSevice from './MoreStack/AddSevice';
import ContactUs from './MoreStack/ContactUs';
import Groups from './MoreStack/Groups';
import Login from './MoreStack/Login';
import MyProfile from './MoreStack/MyProfile';
import MyProfileEdit from './MoreStack/MyProfileEdit';
import Notifications from './MoreStack/Notifications';
import Register from './MoreStack/Register';
import ScreenGroup from './MoreStack/ScreenGroup';
import ScreenGroupReplies from './MoreStack/ScreenGroupReplies';
import SellCarOrSpares from './MoreStack/SellCarOrSpares';

export default class Routes extends Component {
   render() {
      return (
         <Stack.Navigator initialRouteName="More" >
            <Stack.Screen
               name="More"
               component={More}
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="AboutUs"
               component={AboutUs}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="AddMaintainance"
               component={AddMaintainance}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="AddSevice"
               component={AddSevice}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="ContactUs"
               component={ContactUs}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="Groups"
               component={Groups}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="Login"
               component={Login}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="MyProfile"
               component={MyProfile}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="MyProfileEdit"
               component={MyProfileEdit}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="Notifications"
               component={Notifications}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="Register"
               component={Register}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="ScreenGroup"
               component={ScreenGroup}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="ScreenGroupReplies"
               component={ScreenGroupReplies}
               headerTitle=""
               options={{
                  header: () => { },
                  headerStyle: {
                     height: 0
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="SellCarOrSpares"
               component={SellCarOrSpares}
               headerTitle=""
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