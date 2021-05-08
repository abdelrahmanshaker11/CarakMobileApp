import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')

export default class ScreenNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    newsObject = this.props.route.params.news

    componentDidMount() {
        console.log(this.newsObject.created_at.slice(0, 10))
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        });
        this.props.navigation.goBack();
        return true;
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"أخبار"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
                <StatusBar backgroundColor='#003f43' barStyle="light-content" />
                <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
                    {this.renderHeader()}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: 18, alignItems: 'center' }} >
                        <View style={{ width: "95%", aspectRatio: 1.8, backgroundColor: '#CCC' }} >
                            <Image source={{ uri: this.newsObject.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                        </View>
                        <View style={{ backgroundColor: '#F0F0F0', width: '95%', marginTop: 18, paddingVertical: 32, paddingHorizontal: 12, borderRadius: 32, alignItems: 'flex-end' }} >
                            <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'right' }} >{this.newsObject.title}</Text>
                            <Text style={{ fontSize: 16, textAlign: 'right', marginTop: 6 }} >
                                {
                                    new Date(this.newsObject.created_at.slice(0, 10)).getDate()
                                    + '-' +
                                    (parseInt(new Date(this.newsObject.created_at.slice(0, 10)).getMonth()) + 1).toString()
                                    + '-' +
                                    new Date(this.newsObject.created_at.slice(0, 10)).getFullYear()
                                }
                            </Text>
                            <View style={{ width: '100%', height: 1, backgroundColor: '#A8A8A8', marginVertical: 12 }} />
                            <Text style={{ fontSize: 18, textAlign: 'right' }} >{this.newsObject.description}</Text>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 0
    },
    row: {
        flexDirection: 'row'
    },
    rowReversed: {
        flexDirection: 'row-reverse'
    },
    column: {
        flexDirection: 'column'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    }
})