import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Image } from 'react-native';
import { Textarea } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      Processing: false
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
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: true
    });
    this.props.navigation.goBack();
    return true;
  }

  sendReport() {
    const thisComponent = this
    thisComponent.setState({ Processing: true })
    if (this.state.message.length < 2) {
      thisComponent.setState({ Processing: false })
      alert("الرجاء كتابه رساله")
    } else {
      try {
        axios.post("https://rocky-cliffs-25615.herokuapp.com/api/addReport",
          {
            message: this.state.message,
          },
          { headers: { Authorization: `Bearer ${thisComponent.props.Token}` } },
        ).then(response => {
          // console.log(response)
          thisComponent.setState({ Processing: false, message: '' })
          setTimeout(() => {
            alert("تم")
          }, 100);
        }).catch(function (error) {
          // console.log(error)
          thisComponent.setState({ Processing: false })
          if (error.response && error.response.data && error.response.data.message) {
            if (error.response.data.message == "Unauthenticated.") {
              setTimeout(() => {
                alert('برجاء تسجيل الدخول أولاََ');
              }, 100);
            } else {
              setTimeout(() => {
                alert('Oops! ' + error.response.data.message);
              }, 100);
            }
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

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"تواصل معنا"}</Text>
        <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

        </View>
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18, alignItems: 'center', paddingVertical: 36, justifyContent: 'center' }} >

            <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 24 }]} >
              <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                <Image source={require('./../../../../Images/carLogo3.png')} style={styles.image} />
              </View>
            </View>

            <View style={[styles.column, { width }]} >
              <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                <View style={[styles.rowReverse, { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 18, }]} >
                  <Text style={{ fontSize: 22, color: '#000', marginTop: 18 }} >
                    {'اكتب رسالتك'}
                  </Text>
                </View>
              </View>

              <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 12, marginHorizontal: 18 }]}>
                <View style={[styles.shadow, { flex: 1, backgroundColor: '#FFF', marginHorizontal: 0, borderRadius: 12, shadowOpacity: 0.1, elevation: 5 }]} >
                  <Textarea
                    defaultValue={this.state.message}
                    onChangeText={(text) => this.setState({ message: text })}
                    style={{ flex: 1, height: 140, textAlign: 'right' }}
                    placeholder={"اكتب هنا"}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.sendReport()}
              style={[styles.loginButton, styles.shadow]}
            >
              <Text style={styles.buttonText}>{"أرسل"}</Text>
            </TouchableOpacity>

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
export default connect(mapStateToProps, {})(ContactUs)

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
  image: {
    width: width * 0.6,
    height: width * 0.3,
    resizeMode: "contain"
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
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
})

{/*
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler } from 'react-native';
import NavigationServices from '../../NavigationServices';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')

export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  UNSAFE_componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    NavigationServices.goBack();
    return true;
  }

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43' }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"عن التطبيق"}</Text>
        <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }} >
        <StatusBar backgroundColor='#003f43' barStyle="light-content" />
        {this.renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18 }} >

        </ScrollView>
      </View>
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
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  }
}) 
*/}