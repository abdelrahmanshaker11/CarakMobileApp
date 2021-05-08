/**
 * @format
 */
import React from 'react'; // Added for firebase configuration
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging'; // Added for firebase configuration

// Added for firebase configuration
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

// Added for firebase configuration
function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }
    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck); // HeadlessCheck Added instead of App for firebase configuration
