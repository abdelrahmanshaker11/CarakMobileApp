import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import Reducers from './Models/Reducers'
import Routes from './Models/Routes';

import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

export default class App extends Component {

  componentDidMount() {
    this.requestUserPermission()
    this.notificationsListener()
  }

  async requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission({ provisional: true });
    if (authorizationStatus) {
      console.log('Permission settings:', authorizationStatus);
      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        this.getToken()
        console.log('User has notification permissions enabled.');
      } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        this.getToken()
        console.log('User has provisional notification permissions.');
      } else {
        console.log('User has notification permissions disabled');
      }
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("Firebase Cloud Messaging => ", fcmToken)
    if (!fcmToken) {
      // Get the device token
      await messaging().getToken().then(async token => {
        console.log("Firebase Cloud Messaging => ", token)
        await AsyncStorage.setItem('fcmToken', token);
      }).catch(( err )=>{
        console.log( err )
      });
    }
    // this.onTokenRefresh()
  }

  // async onTokenRefresh() {
  //   // Listen to whether the token changes
  //   return messaging().onTokenRefresh(async token => {
  //     await AsyncStorage.setItem('fcmToken', token);
  //   });
  // }

  notificationsListener() {

    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });

    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    //   navigation.navigate(remoteMessage.data.type);
    // });

    // messaging().getInitialNotification().then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log(
    //         'Notification caused app to open from quit state:',
    //         remoteMessage.notification,
    //       );
    //     }
    //   });
      
  }

  render() {
    return (
      <Provider store={createStore(Reducers, {}, applyMiddleware(ReduxThunk))} >
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </Provider>
    );
  }
}
