import React, { Component } from 'react';
import { Overlay } from 'react-native-elements'
const { width, height } = Dimensions.get('window')
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'

//  ***** PROPS ***** //
// data
// bottonDefaultValue
// bottonStyle
// bottonTextStyle
// dropDownHeight

export default class ModalDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalDropDownVisible: false,
            ModalDropDownPX: 0,
            ModalDropDownPY: 0,
            ModalDropDownWidth: 0,
            ModalDropDownHeight: this.props.dropDownHeight ? this.props.dropDownHeight : 160,
            value: null,
            index: null
        };
    }

    reset() {
        this.setState({ value: null, index: null })
    }

    OpenModal() {
        this.ModalDropDown.measure((fx, fy, w, h, px, py) => {
            // console.log(height - 18, '/n', py + height + this.state.ModalDropDownHeight)
            if (height - 18 < py + h + this.state.ModalDropDownHeight) {
                this.setState({
                    ModalDropDownWidth: w,
                    ModalDropDownPX: px,
                    ModalDropDownPY: py - 2 - this.state.ModalDropDownHeight
                })
            } else {
                this.setState({
                    ModalDropDownWidth: w,
                    ModalDropDownPX: px,
                    ModalDropDownPY: py + h + 2
                })
            }
        })

        this.setState({ ModalDropDownVisible: true })
    }

    renderOverlay() {
        return (
            <Overlay
                isVisible={this.state.ModalDropDownVisible}
                onBackdropPress={() => this.setState({ ModalDropDownVisible: false })}
                windowBackgroundColor='transparent'
                overlayStyle={[styles.column, styles.shadow, {
                    position: 'absolute',
                    top: this.state.ModalDropDownPY,
                    left: this.state.ModalDropDownPX,
                    width: this.state.ModalDropDownWidth,
                    height: this.state.ModalDropDownHeight,
                    borderWidth: 1, borderColor: 'lightgray'
                }]}
                overlayBackgroundColor="#FFF"
                width="auto"
                height="auto"
            >
                <View style={{ width: '100%', height: '100%', backgroundColor: "#FFF" }} >
                    {
                        this.props.data && this.props.data.length != 0 ?
                            <ScrollView>
                                {
                                    this.props.data.map((item, index) => {

                                        return (
                                            <TouchableOpacity
                                                key={index.toString()}
                                                onPress={() => {
                                                    this.props.onSelect(item, index)
                                                    this.setState({
                                                        value: this.props.renderButtonText(item, index),
                                                        index: index,
                                                        ModalDropDownVisible: false
                                                    })
                                                }}
                                            >
                                                {this.props.renderRow(item, index)}
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                            :
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} >
                                <ActivityIndicator size="small" />
                            </View>
                    }
                </View>
            </Overlay>
        )
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[this.props.bottonStyle, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                ref={view => { this.ModalDropDown = view }}
                onPress={() => this.OpenModal()}
            >
                {this.renderOverlay()}
                <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                <Text numberOfLines={1} style={this.props.bottonTextStyle} >
                    {
                        this.state.value ?
                            this.state.value
                            :
                            this.props.bottonDefaultValue
                    }
                </Text>
                <View style={{ width: 14, height: 14, marginHorizontal: 8 }} ></View>
            </TouchableOpacity>
        )
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
