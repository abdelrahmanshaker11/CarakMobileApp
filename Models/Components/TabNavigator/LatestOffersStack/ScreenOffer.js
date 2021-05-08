import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, SafeAreaView, Animated } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

export default class ScreenOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollX: new Animated.Value(0),
            Images: [
                ...[{ name: this.props.route.params.offer.photo }], ...this.props.route.params.offer.photos
            ]
        };
    }

    offerObject = this.props.route.params.offer

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
            <View style={[
                styles.flex, styles.row, styles.shadow,
                {
                    position: 'absolute', top: 0, left: 0, right: 0,
                    width: width, height: 80,
                    alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: 'transparent', zIndex: 1, paddingHorizontal: 18
                }
            ]} >
                <TouchableOpacity style={{ height: 50, width: 50, borderRadius: 50 / 2, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
                </TouchableOpacity>
                <View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}  >

                </View>
            </View>
        )
    }

    renderDots = () => {
        const dotPosition = Animated.divide(this.state.scrollX, width)
        return (
            <View style={[styles.flex, styles.row, styles.renderDotsView]}>
                {this.state.Images.map((item, index) => {
                    const opacity = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.5, 1, 0.5],
                        extrapolate: 'clamp'
                    })
                    return (
                        <Animated.View
                            key={index.toString()}
                            style={[
                                { backgroundColor: '#DCE0E9', width: 8, height: 8, borderRadius: 4, marginHorizontal: 6 },
                                { opacity }
                            ]}
                        />
                    )
                })}
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
                <StatusBar backgroundColor='#003f43' barStyle="light-content" />
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
                    {this.renderHeader()}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, alignItems: 'center' }} >

                        <View style={[styles.flex, { width, height: width }]}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                scrollEnabled
                                showsHorizontalScrollIndicator={false}
                                decelerationRate={0}
                                scrollEventThrottle={16}
                                snapToAlignment="center"
                                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }])}
                            >
                                {
                                    this.state.Images.map((item, index) =>
                                        <Image
                                            key={index.toString()}
                                            source={{ uri: item.name }}
                                            resizeMode='cover'
                                            style={{ width, height: width }}
                                        />
                                    )
                                }
                            </ScrollView>
                            {this.renderDots()}
                        </View>

                        <View style={{
                            width, height: 300, backgroundColor: '#FFF',
                            padding: 36, marginTop: -36, borderTopLeftRadius: 26,
                            borderTopRightRadius: 26,
                        }} >
                            <View style={[styles.rowReversed, { width: '100%' }]} >
                                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#003f43', textAlign: 'right' }}>{this.offerObject.title}</Text>
                            </View>
                            <View style={[styles.rowReversed, { width: '100%', marginTop: 8 }]} >
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#A8A8A8', textAlign: 'right' }}>{this.offerObject.description}</Text>
                            </View>
                            <View style={[styles.rowReversed, { width: '100%', marginTop: 12 }]} >
                                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#003f43', textAlign: 'right' }}>{"البائع : "}</Text>
                            </View>
                            <View style={[styles.flex, styles.rowReversed, { paddingVertical: 10, borderBottomColor: '#F8F8F8', borderBottomWidth: 1, marginTop: 8 }]}>
                                <View style={[styles.flex]}>
                                    <Image
                                        style={{ width: 80, height: 80, borderRadius: 12, marginLeft: 10 }}
                                        source={{ uri: this.offerObject.user_photo }}
                                    />
                                </View>
                                <View style={[styles.column, { flex: 1, alignItems: 'flex-end' }]}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }} >{this.offerObject.user_name}</Text>
                                    <Text style={{ color: '#A8A8A8', fontWeight: 'bold' }}>{this.offerObject.user_phonenumber}</Text>
                                </View>
                            </View>
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
    },
    renderDotsView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 46,
        justifyContent: 'center',
        alignItems: 'center'
    },
})