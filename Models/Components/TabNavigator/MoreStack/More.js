import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('window')

import { connect } from 'react-redux' // redux
import { logOut } from './../../../Actions' //redux

class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  logout() {
    this.props.logOut()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
        <StatusBar backgroundColor='#003f43' barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
          {
            this.props.User ? // Logged In
              <View style={[{ backgroundColor: '#003f43', paddingVertical: 22, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#003f43', borderBottomWidth: 4 }]}>
                <TouchableOpacity
                  style={{ height: 80, width: 80, borderRadius: 40, borderWidth: 4, borderColor: '#E9E9E9', overflow: 'hidden' }}
                  activeOpacity={1}
                >
                  <Image
                    // source={require('../../../Images/user.jpg')}
                    source={{ uri: this.props.User.photo }}
                    style={{ flex: 1, height: null, width: null, resizeMode: 'stretch' }}
                    resizeMethod="resize"
                  />
                </TouchableOpacity>
                <Text style={{ marginTop: 5, fontStyle: 'italic', fontWeight: 'bold', fontSize: 22, color: '#FFF' }}>{this.props.User.name}</Text>
              </View>
              :
              <View style={[{ paddingVertical: 42, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#003f43', borderBottomWidth: 1 }]}>
                <Image source={require('../../../../Images/carLogo3.png')}
                  style={{ height: width * 0.3, width: width * 0.6, resizeMode: 'contain' }}
                />
              </View>
          }

          {
            this.props.User ? // Logged In
              <ScrollView showsVerticalScrollIndicator={false} >

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('MyProfile')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome name="user" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"حسابى"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('Groups')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome name="users" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"المجموعات"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('Notifications')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name="notifications" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"أشعارات"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('SellCarOrSpares')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome5 name="car" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"بيع سياره أو قطع غيار"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('AddSevice')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome name="plus" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"أضافة خدمة فى خدمات و عروض"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('AddMaintainance')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome5 name="tools" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"أضافة مركز صيانة"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('ContactUs')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="message-text-outline" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"تواصل معنا"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('AboutUs')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="message-alert-outline" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"عن التطبيق"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.logout()} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="logout" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"تسجيل الخروج"}</Text>
                </TouchableOpacity>

              </ScrollView>
              :
              <ScrollView showsVerticalScrollIndicator={false} >

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('Login')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="login" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"تسجيل الدخول"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('ContactUs')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="message-text-outline" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"تواصل معنا"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('AboutUs')} style={[styles.rowReversed, { alignItems: 'center', height: 50, paddingHorizontal: 8, width: "100%", borderBottomWidth: 1, borderBottomColor: '#707070' }]} >
                  <View style={{ height: "100%", aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="message-alert-outline" style={{ color: '#003f43', fontSize: 32, marginLeft: 8 }} />
                  </View>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontWeight: "bold", fontSize: 18 }} >{"عن التطبيق"}</Text>
                </TouchableOpacity>

              </ScrollView>
          }
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
export default connect(mapStateToProps, { logOut })(More)

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