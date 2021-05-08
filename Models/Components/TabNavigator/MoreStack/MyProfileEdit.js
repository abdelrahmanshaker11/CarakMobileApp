import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Image, } from 'react-native';
import { Overlay } from 'react-native-elements'
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item } from 'native-base'
import ImagePicker from 'react-native-image-picker';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import { SaveUser } from './../../../Actions' //redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';

class MyProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            Processing: false,
            name: this.props.User.name,
            email: this.props.User.email,
            password: null,
            oldpassword: null,
            cpassword: null,
            phonenumber: this.props.User.phonenumber,
            photo: this.props.User.photo
        };
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
        // this.props.navigation.dangerouslyGetParent().setOptions({
        //   tabBarVisible: true
        // });
        this.props.navigation.goBack();
        return true;
    }

    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    SaveData() {
        const { name, password, phonenumber, email, photo } = this.state
        if (this.emailIsValid(email)) {
            if (name.length >= 1) {
                if (phonenumber.length >= 6) {
                    if (photo != null) {
                        this.UserEditData(name, password, phonenumber, email, photo)
                    } else {
                        alert("اختر صوره من فضلك")
                    }
                } else {
                    alert("اكتب رقم الهاتف ")
                }
            } else {
                alert("اكتب الاسم كاملا")
            }
        } else {
            alert("البريد الاكتروني غير صالح")
        }
    }

    UserEditData(name, password, phonenumber, email, photo) {
        const thisComponent = this
        // var fcmToken = await AsyncStorage.getItem("fcmToken");
        thisComponent.setState({ Processing: true })
        try {
            axios.post('https://rocky-cliffs-25615.herokuapp.com/api/editProfile',
                {
                    name, password, phonenumber, photo, email: email.toLowerCase()
                },
                { headers: { Authorization: `Bearer ${thisComponent.props.Token}` } },
            ).then(async function (response) {
                console.log(response)
                await AsyncStorage.setItem('User', JSON.stringify(response.data))
                // await AsyncStorage.setItem('Token', JSON.stringify(response.data.token))
                thisComponent.props.SaveUser(response.data, thisComponent.props.Token)
                thisComponent.setState({ Processing: false })
                setTimeout(() => {
                    alert("تم الحفظ");
                }, 100);
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
            this.setState({ Processing: true })
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
                //     photo: source, renderSelectedImage: true
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
                        photo: response.data,
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

    checkPassword() {
        const thisComponent = this
        thisComponent.setState({ isVisible: false })
        const { oldpassword, password, cpassword } = this.state
        if (oldpassword == null || oldpassword.length < 8) {
            alert('كلمة المرور القديمة غير صحيحة')
            thisComponent.setState({ isVisible: true, password: null, cpassword: null, oldpassword: null })
        } else {
            if (password == null || password.length < 8) {
                alert("كلمه السر يجب ان تكون ٨ حروف علي الاقل")
                thisComponent.setState({ isVisible: true, password: null, cpassword: null, oldpassword: null })
            } else {
                if (cpassword != password) {
                    alert("كلمة المرور و تاكيد كلمة المرور غير متطابقان")
                    thisComponent.setState({ isVisible: true, password: null, cpassword: null, oldpassword: null })
                } else {
                    thisComponent.setState({ Processing: true })
                    try {
                        axios.post('https://rocky-cliffs-25615.herokuapp.com/api/checkPassword',
                            {
                                password: oldpassword
                            },
                            { headers: { Authorization: `Bearer ${thisComponent.props.Token}` } },
                        ).then(async function (response) {
                            // console.log(response.data)
                            if (response.data) {
                                thisComponent.setState({ Processing: false })
                            } else {
                                thisComponent.setState({ Processing: false })
                                setTimeout(() => {
                                    alert('كلمة المرور القديمة غير صحيحة')
                                }, 100);
                                thisComponent.setState({ isVisible: true, password: null, cpassword: null, oldpassword: null })
                            }
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
                }
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
                <View style={[styles.column, { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 28 }]} >

                    <View style={{ width: '100%', height: 40, alignItems: 'flex-start' }} >
                        <TouchableOpacity onPress={() => { this.setState({ isVisible: false, password: null, cpassword: null, oldpassword: null }) }} style={{ height: 40, width: 40, borderRadius: 12, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24 }} >{"×"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', height: 40, alignItems: 'center' }} >
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }} >{"تغيير كلمة المرور"}</Text>
                    </View>

                    <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                        <Input placeholder={'كلمه المرور القديمة'} secureTextEntry={true} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ oldpassword: text })} defaultValue={this.state.oldpassword} />
                    </Item>

                    <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                        <Input placeholder={'كلمه المرور الجديدة'} secureTextEntry={true} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ password: text })} defaultValue={this.state.password} />
                    </Item>

                    <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                        <Input placeholder={'تأكيد كلمه المرور'} secureTextEntry={true} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ cpassword: text })} defaultValue={this.state.cpassword} />
                    </Item>

                    <TouchableOpacity
                        onPress={() => this.checkPassword()}
                        style={[styles.registerButton, styles.shadow]}
                    >
                        <Text style={styles.registerButtonText}>{"حفظ"}</Text>
                    </TouchableOpacity>

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
                <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"تعديل حسابى"}</Text>
                <View style={{ height: '100%', aspectRatio: 1 }} >

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
                    {this.renderOverlay()}
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18 }} >

                        <View style={{ width, alignItems: 'flex-end' }} >
                            <View style={[styles.row, { width, aspectRatio: 3, backgroundColor: '#eacf43', paddingHorizontal: 18, paddingVertical: 18 }]} >
                                <TouchableOpacity onPress={() => { this.setState({ isVisible: true }) }} style={{ backgroundColor: '#FFF', height: 40, paddingHorizontal: 18, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ fontWeight: 'bold' }} >{"تغيير كلمة المرور"}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.pickImageFromPhone()}
                                style={{
                                    width: 100, height: 100, backgroundColor: '#FFF',
                                    borderRadius: 12, borderWidth: 6, borderColor: '#003f43',
                                    overflow: 'hidden', marginHorizontal: 36, marginTop: -50
                                }}
                            >
                                <Image source={{ uri: this.state.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 35 }} >

                            <Text style={{ marginBottom: 8 }} >{'اسم المستخدم'}</Text>
                            <Item style={[styles.inputFields, styles.shadow]}>
                                <Input placeholder={'اسم المستخدم'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ name: text })} defaultValue={this.state.name} />
                            </Item>

                            <Text style={{ marginBottom: 8, marginTop: 18 }} >{'البريد الألكترونى'}</Text>
                            <Item style={[styles.inputFields, styles.shadow]}>
                                <Input placeholder={'البريد الألكترونى'} style={{ color: '#000' }} textAlign={'center'} disabled defaultValue={this.state.email} />
                            </Item>

                            <Text style={{ marginBottom: 8, marginTop: 18 }} >{'رقم الجوال'}</Text>
                            <Item style={[styles.inputFields, styles.shadow]}>
                                <Input keyboardType="numeric" placeholder={'رقم الجوال'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ phonenumber: text })} defaultValue={this.state.phonenumber} />
                            </Item>

                            <TouchableOpacity
                                onPress={() => this.SaveData()}
                                style={[styles.registerButton, styles.shadow]}
                            >
                                <Text style={styles.registerButtonText}>{"حفظ البيانات"}</Text>
                            </TouchableOpacity>


                        </View>

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
export default connect(mapStateToProps, { SaveUser })(MyProfileEdit)

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
        borderBottomColor: '#fff',
        width: width - (36 * 2),
        borderRadius: 12,
        backgroundColor: '#FFF',
        paddingVertical: 4,
        paddingHorizontal: 18,
        textAlign: 'center'
    },
    registerButton: {
        backgroundColor: '#eacf43',
        width: width - (36 * 3),
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginTop: 35,
        marginBottom: 25,
    },
    registerButtonText: {
        color: '#003f43',
        fontSize: 16,
        fontWeight: 'bold'
    },
})