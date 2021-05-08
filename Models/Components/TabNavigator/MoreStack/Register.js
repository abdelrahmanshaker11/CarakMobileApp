import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, KeyboardAvoidingView, SafeAreaView, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Item } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import { SaveUser } from './../../../Actions' //redux

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      phonenumber: '',
      // imgPath: this.props.User.imgPath ? { uri: this.props.User.imgPath } : require('./../../../Images/user.jpg'),
      imgPath: null,

    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.User) {
      // console.log('usr: ', nextProps.User, "\n", "token: ", nextProps.Token)
      this.props.navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: true
      });
      this.props.navigation.navigate('More')
    }
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
    //   this.props.navigation.dangerouslyGetParent().setOptions({
    //     tabBarVisible: true
    // });
    this.props.navigation.goBack();
    return true;
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
            imgPath: { uri: response.data },
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

  emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  goRegister() {
    const { name, password, phonenumber, email, imgPath, cpassword } = this.state
    if (this.emailIsValid(email)) {
      if (password.length >= 8) {
        if (name.length >= 1) {
          if (phonenumber.length >= 6) {
            if (password == cpassword) {
              if (imgPath != null) {
                this.UserRegister(name, password, phonenumber, email, imgPath)
              } else {
                alert("اختر صوره من فضلك")
              }
            } else {
              alert("كلمة المرور و تاكيد كلمة المرور غير متطابقان")
            }
          } else {
            alert("اكتب رقم الهاتف ")
          }
        } else {
          alert("اكتب الاسم كاملا")
        }
      } else {
        alert("كلمه السر يجب ان تكون ٨ حروف علي الاقل")
      }
    } else {
      alert("البريد الاكتروني غير صالح")
    }
  }

  UserRegister(name, password, phonenumber, email, imgPath) {
    const thisComponent = this
    // var fcmToken = await AsyncStorage.getItem("fcmToken");
    thisComponent.setState({ Processing: true })
    try {
      axios.post('https://rocky-cliffs-25615.herokuapp.com/api/register', {
        name, password, phonenumber, photo: imgPath.uri, email: email.toLowerCase()
      }).then(async function (response) {
        console.log(response)
        await AsyncStorage.setItem('User', JSON.stringify(response.data.user))
        await AsyncStorage.setItem('Token', JSON.stringify(response.data.token))
        thisComponent.props.SaveUser(response.data.user, response.data.token)
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
  }

  renderSelectedImage() {
    if (this.state.imgPath != null) {
      return (
        <TouchableOpacity activeOpacity={0.8}
          // onPress={() => this.pickImageFromPhone()}
          style={[{ width: width / 3, aspectRatio: 1, borderRadius: 12, overflow: 'hidden' }, styles.shadow]}
        >
          <Image
            source={this.state.imgPath}
            style={[{ flex: 1, borderRadius: 12, width: null, height: null, resizeMode: 'stretch' }]}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this.pickImageFromPhone()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', aspectRatio: 1, padding: 22, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }]}>
          <FontAwesome name="user" color={"#9d9d9d"} size={56} />
          <Text style={{ textAlign: 'center' }} >{"أضف صورتك الشخصيه"}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"أنشاء حساب"}</Text>
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
          <Spinner
            visible={this.state.Processing}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18 }} >
            <KeyboardAvoidingView
              enabled
              behavior="padding"
              style={styles.container}
            >
              {this.renderSelectedImage()}

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 35 }]}>
                <Input placeholder={'اسم المستخدم'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ name: text })} />
              </Item>

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                <Input placeholder={'البريد الألكترونى'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ email: text })} />
              </Item>

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                <Input keyboardType="numeric" placeholder={'رقم الجوال'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ phonenumber: text })} />
              </Item>

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                <Input placeholder={'كلمه المرور'} secureTextEntry={true} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ password: text })} />
              </Item>

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                <Input placeholder={'تأكيد كلمه المرور'} secureTextEntry={true} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ cpassword: text })} />
              </Item>


              <TouchableOpacity
                onPress={() => this.goRegister()}
                style={[styles.registerButton, styles.shadow]}
              >
                <Text style={styles.registerButtonText}>{"أنشاء الحساب"}</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
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
export default connect(mapStateToProps, { SaveUser })(Register)

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
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputFields: {
    borderBottomColor: '#fff',
    width: width - (36 * 3),
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 18,
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#003f43',
    width: width - (36 * 5),
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 35,
    marginBottom: 15,
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
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerButtonText: {
    color: '#003f43',
    fontSize: 16,
    fontWeight: 'bold'
  },
  image: {
    width: width * 0.6,
    height: width * 0.3,
    resizeMode: "contain"
  },
})