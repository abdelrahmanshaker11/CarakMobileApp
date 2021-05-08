import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux' // redux
import { SaveUser } from './../Actions'
const { width, height } = Dimensions.get('window')

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.User) {
            // console.log('usr: ', nextProps.User, "\n", "token: ", nextProps.Token)
            setTimeout(() => {
                this.props.navigation.dispatch(
                    StackActions.replace('TabNavigatorRoutes')
                )
            }, 1000)
        }
    }

    componentDidMount = async () => {
        const usr = await AsyncStorage.getItem('User')
        const token = await AsyncStorage.getItem('Token')
        // console.log(usr, token)
        if (usr && token) {
            this.props.SaveUser(JSON.parse(usr), JSON.parse(token))
        } else {
            setTimeout(() => {
                this.props.navigation.dispatch(
                    StackActions.replace('TabNavigatorRoutes')
                )
            }, 1000)
        }
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#003F51' }]} >
                <StatusBar backgroundColor='#003F51' barStyle="light-content" />
                <View style={[styles.container, { width }]} >
                    <Image
                        source={require('./../../Images/carLogo3.png')}
                        style={[styles.image]}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

//redux
const mapStateToProps = state => {
    return {
        User: state.AuthReducer.User,
        Token: state.AuthReducer.Token,
    }
}
// redux
export default connect(mapStateToProps, { SaveUser })(SplashScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0'
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        resizeMode: 'contain'
    },
});