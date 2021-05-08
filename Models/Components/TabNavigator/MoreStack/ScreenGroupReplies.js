import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, SafeAreaView } from 'react-native';
import { Input, Item } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux

class ScreenGroupReplies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            Processing: false,
            next_page_url: 'https://rocky-cliffs-25615.herokuapp.com/api/showReplies/' + this.props.route.params.post.id,
            data: [],
        };
    }

    postObject = this.props.route.params.post
    // onPress={() => this.refs.scrollview.scrollToEnd({ animated: true })}

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
        //   this.props.navigation.dangerouslyGetParent().setOptions({
        //     tabBarVisible: true
        // });
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount() {
        this.getData()
        this.setState({ Processing: true })
    }

    getData() {
        const thisComponent = this
        try {
            axios.get(this.state.next_page_url)
                .then(response => {
                    console.log(response.data)
                    thisComponent.setState({
                        data: [...thisComponent.state.data, ...response.data.data],
                        next_page_url: response.data.next_page_url,
                        Processing: false
                    })
                }).catch(function (error) {
                    // console.log(error)
                    thisComponent.setState({ Processing: false })
                    if (error.response && error.response.data && error.response.data.message) {
                        setTimeout(() => {
                            alert('Oops! ' + error.response.data.message);
                        }, 100);
                    } else {
                        setTimeout(() => {
                            alert('Oops! ' + "Network error");
                        }, 100);
                    }
                })
        } catch (error) {
            // console.log(error)
            thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    refresh() {
        this.setState({ Processing: true })
        this.setState({
            data: [],
            next_page_url: 'https://rocky-cliffs-25615.herokuapp.com/api/showReplies/' + this.props.route.params.post.id,
        })
        this.getData()
    }

    addReply = () => {
        const thisComponent = this
        const { text } = this.state
        const post_id = this.props.route.params.post.id
        if (text == '') {
            alert('من فضلك اكتب شيء فى التعليق')
        } else {
            thisComponent.setState({ Processing: true, isVisible: false })
            try {
                axios.post('https://rocky-cliffs-25615.herokuapp.com/api/addReply',
                    {
                        text, post_id
                    },
                    { headers: { Authorization: `Bearer ${this.props.Token}` } },
                ).then(async function (response) {
                    console.log(response)
                    thisComponent.setState({ Processing: false, isVisible: false, text: '', photo: null })
                    thisComponent.refresh()
                }).catch(function (error) {
                    console.log(error)
                    thisComponent.setState({ Processing: false })
                    if (error.response && error.response.data && error.response.data.message) {
                        setTimeout(() => {
                            alert('Oops! ' + error.response.data.message);
                        }, 100);
                    } else {
                        setTimeout(() => {
                            alert('Oops! ' + "Network error");
                        }, 100);
                    }
                })
            } catch (error) {
                console.log(error)
                thisComponent.setState({ Processing: false })
                setTimeout(() => {
                    alert('Oops! ' + "Something went wrong");
                }, 100);
            }
        }
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"التعليقات"}</Text>
                <View style={{ height: '100%', aspectRatio: 1 }} >

                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
                <StatusBar backgroundColor='#003f43' barStyle="light-content" />
                <View style={{ flex: 1, backgroundColor: '#F1F1F1', width }} >
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    {this.renderHeader()}
                    <ScrollView ref="scrollview" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 60, alignItems: 'center' }} >

                        <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 12 }]} >
                            <View style={[styles.column, { width: "90%", alignItems: 'flex-end', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 12 }]} >
                                <View style={[styles.rowReversed, { alignItems: 'center', marginBottom: 8, width: '100%' }]} >
                                    <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: '#CCC', overflow: 'hidden' }} >
                                        <Image source={{ uri: this.postObject.user_photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                    </View>
                                    <View style={{ flex: 1, paddingHorizontal: 8 }} >
                                        <Text style={{ textAlign: 'right', fontSize: 16, color: "#444444", fontWeight: 'bold' }} >
                                            {this.postObject.user_name}
                                        </Text>
                                        <Text style={{ textAlign: 'right', fontSize: 12, color: "#444444" }} >
                                            {
                                                new Date(this.postObject.created_date).getFullYear()
                                                + '-' +
                                                (parseInt(new Date(this.postObject.created_date).getMonth()) + 1).toString()
                                                + '-' +
                                                new Date(this.postObject.created_date).getDate()
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.rowReversed, { padding: 8, width: '100%', backgroundColor: '#fff' }]} >
                                    <Text numberOfLines={4} style={{ textAlign: 'right', fontSize: 14 }} >{this.postObject.text}</Text>
                                </View>
                                {
                                    this.postObject.photo &&
                                    <View style={{ width: '100%', aspectRatio: 2.1, backgroundColor: '#f4f4f4' }} >
                                        <Image
                                            source={{ uri: this.postObject.photo }}
                                            style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                                        />
                                    </View>
                                }


                            </View>
                        </View>

                        <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                            <View style={{ flex: 1, height: 2, borderRadius: 5, backgroundColor: '#A8A8A8', marginVertical: 4 }} />
                            <Text style={{ fontSize: 18, color: '#A8A8A8', fontWeight: 'bold', marginHorizontal: 12 }} >{"التعليقات"}</Text>
                            <View style={{ flex: 1, height: 2, borderRadius: 5, backgroundColor: '#A8A8A8', marginVertical: 4 }} />

                        </View>


                        {/* item */}

                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <View key={ index.toString() } style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 12 }]} >
                                        <View style={[styles.column, { width: "90%", alignItems: 'flex-end', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 12 }]} >
                                            <View style={[styles.rowReversed, { alignItems: 'flex-start', width: '100%' }]} >
                                                <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: '#CCC', overflow: 'hidden' }} >
                                                    <Image source={{ uri: item.user_photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                                </View>
                                                <View style={{ flex: 1, paddingHorizontal: 8 }} >
                                                    <Text style={{ textAlign: 'right', fontSize: 16, color: "#444444", fontWeight: 'bold' }} >
                                                        {item.user_name}
                                                    </Text>
                                                    <Text style={{ textAlign: 'right', fontSize: 12, color: "#444444", marginBottom: 8 }} >
                                                        {
                                                            new Date(item.created_date).getFullYear()
                                                            + '-' +
                                                            (parseInt(new Date(item.created_date).getMonth()) + 1).toString()
                                                            + '-' +
                                                            new Date(item.created_date).getDate()
                                                        }
                                                    </Text>
                                                    <Text style={{ textAlign: 'right', fontSize: 14 }} >{item.text}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }

                        {
                            this.state.next_page_url && this.state.next_page_url != 'https://rocky-cliffs-25615.herokuapp.com/api/showPosts/' + this.props.route.params.post.id &&
                            //true &&
                            (
                                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 12 }]} >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ Processing: true })
                                            this.getData(this.state.next_page_url)
                                        }}
                                        style={[styles.column, {
                                            width: "90%", alignItems: 'center',
                                            backgroundColor: '#FFF', borderRadius: 18,
                                            paddingHorizontal: 12, paddingVertical: 12
                                        }]}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }} >{"عرض المزيد"}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                    </ScrollView>


                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 6 }]} >
                        <View
                            style={[styles.row, {
                                width: "100%", alignItems: 'center',
                                backgroundColor: '#FFF',
                                paddingHorizontal: 12, paddingVertical: 16
                            }]}
                        >
                            <Item style={[styles.inputFields]}>
                                <Input defaultValue={this.state.text} placeholder={'أكتب تعليق'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ text: text })} />
                            </Item>
                            <TouchableOpacity onPress={() => { this.addReply() }} style={[{ width: 50, height: 50, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]} >
                                <Entypo name="forward" style={{ color: '#CCC', fontSize: 35 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

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
export default connect(mapStateToProps, {})(ScreenGroupReplies)

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
    inputFields: {
        flex: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRadius: 12,
        backgroundColor: '#FFF',
        textAlign: 'center'
    },
})
