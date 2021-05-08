import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'

import HomeStack from './TabNavigator/HomeStack';
import MapStack from './TabNavigator/MapStack';
import LatestOffersStack from './TabNavigator/LatestOffersStack';
import DamageDetectStack from './TabNavigator/DamageDetectStack';
import MoreStack from './TabNavigator/MoreStack';

export default function App() {
    return (
        <Tab.Navigator
            initialRouteName="HomeStack"
            tabBarOptions={{
                tabStyle: {
                    borderTopColor: '#EFEFEF',
                    borderTopWidth: 1
                },
                activeTintColor: "#003f43",
                inactiveTintColor: "#CDCBCB"
            }}
        >
            <Tab.Screen
                name="MoreStack"
                component={MoreStack}
                options={{
                    unmountOnBlur:true,
                    title: "المزيد",
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <Feather name="more-horizontal" style={{ fontSize: 24, color: focused ? '#003f43' : '#CDCBCB' }} />
                        )
                    }
                }}
            />
            <Tab.Screen
                name="MapStack"
                component={MapStack}
                options={{
                    unmountOnBlur:true,
                    title: "مراكز الصيانه",
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <MaterialCommunityIcons name="map-outline" style={{ fontSize: 24, color: focused ? '#003f43' : '#CDCBCB' }} />
                        )
                    }
                }}
            />
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    unmountOnBlur:true,
                    title: "الرئيسية",
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <MaterialCommunityIcons name="home-outline" style={{ fontSize: 24, color: focused ? '#003f43' : '#CDCBCB' }} />
                        )
                    }
                }}
            />
            <Tab.Screen
                name="LatestOffersStack"
                component={LatestOffersStack}
                options={{
                    unmountOnBlur:true,
                    title: "عروض و خدمات",
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <MaterialCommunityIcons name="tag-text-outline" style={{ fontSize: 24, color: focused ? '#003f43' : '#CDCBCB' }} />
                        )
                    }
                }}
            />
            <Tab.Screen
                name="DamageDetectStack"
                component={DamageDetectStack}
                options={{
                    unmountOnBlur:true,
                    title: "كشف الاعطال",
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <Octicons name="tools" style={{ fontSize: 24, color: focused ? '#003f43' : '#CDCBCB' }} />
                        )
                    }
                }}
            />
        </Tab.Navigator>
    );
}