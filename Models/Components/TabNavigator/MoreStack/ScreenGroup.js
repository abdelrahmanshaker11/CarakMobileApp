import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, SafeAreaView } from 'react-native';
import { Overlay } from 'react-native-elements'
import { Textarea } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux

class ScreenGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            text: '',
            photo: null,
            Processing: false,
            next_page_url: 'https://rocky-cliffs-25615.herokuapp.com/api/showPosts/' + this.props.route.params.group.id,
            data: [],
        };
    }

    // groupObject: this.props.route.params.group

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
            next_page_url: 'https://rocky-cliffs-25615.herokuapp.com/api/showPosts/' + this.props.route.params.group.id,
        })
        this.getData()
    }

    pickImageFromPhone() {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            this.setState({ Processing: true, isVisible: false })
            // console.log('Response = ', response);

            if (response.didCancel) {
                this.setState({ Processing: false })
                console.log('User cancelled image picker');
            } else if (response.error) {
                this.setState({ Processing: false })
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                this.setState({ Processing: false })
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = {
                    uri: (Platform.OS === 'android') ? response.uri : '~' + response.uri.substring(response.uri.indexOf('/Documents')),
                    fileName: response.fileName
                }
                this.uploadPhoto(source)

                // this.setState({
                //     imgPath: source, renderSelectedImage: true
                // });

            }
        });
    }

    uploadPhoto = (imagePicked) =>
        new Promise((resolve, reject) => {
            try {
                const thisComponent = this
                const data = new FormData();
                data.append('photo', { uri: imagePicked.uri, name: imagePicked.uri, type: 'image/jpeg' });
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                };
                // console.log(data)
                // thisComponent.setState({ Processing: false })
                return axios.post(
                    "https://rocky-cliffs-25615.herokuapp.com/api/uploadimage", data, config
                ).then(response => {
                    resolve(response)
                    console.log(response)
                    thisComponent.setState({
                        photo: response.data, isVisible: true
                    });
                    thisComponent.setState({ Processing: false })
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
                // console.log(error)
                thisComponent.setState({ Processing: false })
                setTimeout(() => {
                    alert('Oops! ' + "Something went wrong");
                }, 100);
            }
        });

    addPost = () => {
        const thisComponent = this
        const { text, photo } = this.state
        const group_id = this.props.route.params.group.id
        if (text == '') {
            alert('من فضلك اكتب شيء فى المنشور')
        } else {
            thisComponent.setState({ Processing: true, isVisible: false })
            try {
                axios.post('https://rocky-cliffs-25615.herokuapp.com/api/addPost',
                    {
                        text, photo, group_id
                    },
                    { headers: { Authorization: `Bearer ${this.props.Token}` } },
                ).then(async function (response) {
                    console.log(response)
                    // setTimeout(() => {
                    //     alert("تم بنجاح");
                    // }, 100);
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

    renderOverlay() {
        return (
            <Overlay
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({ isVisible: false })}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width="auto"
                height="auto"
                borderRadius={18}
            >
                <View style={[styles.column, { width: "90%", alignItems: 'flex-end', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 12 }]} >
                    <View style={[styles.rowReversed, { alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#003f43', borderRadius: 12, width: '100%' }]} >
                        <Textarea
                            defaultValue={this.state.text}
                            onChangeText={(text) => this.setState({ text: text })}
                            style={{ flex: 1, height: 140, textAlign: 'right' }}
                            placeholder={"اكتب هنا"}
                        />
                    </View>
                    <View style={[styles.row, { width: '100%', justifyContent: 'flex-start' }]} >
                        <TouchableOpacity onPress={() => this.pickImageFromPhone()} style={[styles.shadow, { width: 50, height: 50, backgroundColor: '#FFF', borderRadius: 8, justifyContent: 'center', overflow: 'hidden' }]} >
                            {
                                !this.state.photo ?
                                    <Entypo name="attachment" style={{ color: '#000', fontSize: 35, alignSelf: 'center' }} />
                                    :
                                    <Image source={{ uri: this.state.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.addPost() }} style={[styles.shadow, { width: 50, height: 50, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderRadius: 8, overflow: 'hidden', marginHorizontal: 8 }]} >
                            <Feather name="send" style={{ color: '#000', fontSize: 35 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{this.props.route.params.group.group_name}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ isVisible: true })} >
                    <Entypo name={"new-message"} style={{ color: '#FFF', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
                <StatusBar backgroundColor='#003f43' barStyle="light-content" />
                <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    {this.renderHeader()}
                    {this.renderOverlay()}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 60, alignItems: 'center' }} >

                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 12 }]} >
                                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('ScreenGroupReplies', { post: item })}  style={[styles.shadow, styles.column, { width: "90%", alignItems: 'flex-end', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 12 }]} >
                                            <View style={[styles.rowReversed, { alignItems: 'center', marginBottom: 8, width: '100%' }]} >
                                                <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: '#CCC', overflow: 'hidden' }} >
                                                    <Image source={{ uri: item.user_photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                                </View>
                                                <View style={{ flex: 1, paddingHorizontal: 8 }} >
                                                    <Text style={{ textAlign: 'right', fontSize: 16, color: "#444444", fontWeight: 'bold' }} >
                                                        {item.user_name}
                                                    </Text>
                                                    <Text style={{ textAlign: 'right', fontSize: 12, color: "#444444" }} >
                                                        {
                                                            new Date(item.created_date).getFullYear()
                                                            + '-' +
                                                            (parseInt(new Date(item.created_date).getMonth()) + 1).toString()
                                                            + '-' +
                                                            new Date(item.created_date).getDate()
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={[styles.rowReversed, { padding: 8, width: '100%', backgroundColor: '#fff' }]} >
                                                <Text numberOfLines={4} style={{ textAlign: 'right', fontSize: 14 }} >{item.text}</Text>
                                            </View>
                                            {
                                                item.photo &&
                                                <View style={{ width: '100%', aspectRatio: 2.1, backgroundColor: '#f4f4f4' }} >
                                                    <Image
                                                        source={{ uri: item.photo }}
                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                                                    />
                                                </View>
                                            }
                                            <View style={[styles.rowReversed, { alignItems: 'center', marginHorizontal: 8, justifyContent: 'center', marginTop:8 }]} >
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }} >{item.comment_number}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 4 }} >{"تعليق"}</Text>
                                            </View>

                                            <View style={[styles.rowReversed, { width: '100%', paddingVertical: 8, marginTop: 8, borderTopColor: '#444444', borderTopWidth: 1 }]} >
                                                <View style={[styles.rowReversed, { alignItems: 'flex-end', marginHorizontal: 8 }]} >
                                                    <Entypo name="new-message" style={{ fontSize: 32, color: '#444444', transform: [{ rotateY: '180deg' }] }} />
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 }} >{"أكتب تعليقا"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                        {
                            this.state.next_page_url && this.state.next_page_url != 'https://rocky-cliffs-25615.herokuapp.com/api/showPosts/' + this.props.route.params.group.id &&
                            (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ Processing: true })
                                        this.getData(this.state.next_page_url)
                                    }}
                                    style={{
                                        backgroundColor: '#003f43', marginTop: 18,
                                        paddingVertical: 12, paddingHorizontal: 22,
                                        borderRadius: 18
                                    }}
                                >
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#FFF' }} >{"عرض المزيد"}</Text>
                                </TouchableOpacity>
                            )
                        }

                    </ScrollView>
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
export default connect(mapStateToProps, {})(ScreenGroup)

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
