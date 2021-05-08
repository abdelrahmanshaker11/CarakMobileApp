import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Item } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import { SaveUser } from './../../../Actions' //redux

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: true
    });
    this.props.navigation.goBack();
    return true;
  }

  login = () => {
    const thisComponent = this
    const { password, email } = this.state
    thisComponent.setState({ Processing: true })
    try {
      axios.post('https://rocky-cliffs-25615.herokuapp.com/api/login', {
        password, email: email.toLowerCase()
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
            alert("خطأ فى تسجيل الدخول!  تحقق من البريد الإلكترونى و كلمة المرور");
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

  goRegister() {
    this.props.navigation.navigate('Register')
  }

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"تسجيل الدخول"}</Text>
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
              <Image source={require('./../../../../Images/carLogo3.png')} style={styles.image} />

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 35 }]}>
                <Input placeholder={'البريد الإلكترونى'} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ email: text })} />
              </Item>

              <Item style={[styles.inputFields, styles.shadow, { marginTop: 10 }]}>
                <Input placeholder={'كلمه المرور'} secureTextEntry={true} style={{ color: '#000' }} textAlign={'center'} onChangeText={(text) => this.setState({ password: text })} />
              </Item>

              <TouchableOpacity
                onPress={() => this.login()}
                style={[styles.loginButton, styles.shadow]}
              >
                <Text style={styles.buttonText}>{"تسجيل الدخول"}</Text>
              </TouchableOpacity>

              <Text style={{ alignSelf: 'center', fontWeight: 'bold', color: '#003f43', fontSize: 16 }}>
                {"فقدت كلمه المرور؟"}
              </Text>

              <TouchableOpacity
                onPress={() => this.goRegister()}
                style={[styles.registerButton, styles.shadow]}
              >
                <Text style={styles.registerButtonText}>{"أنشاء حساب"}</Text>
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
export default connect(mapStateToProps, { SaveUser })(Login)

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