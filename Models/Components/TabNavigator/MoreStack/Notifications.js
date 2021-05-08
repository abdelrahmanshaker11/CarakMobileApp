import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window')

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"الأشعارات"}</Text>
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18 }} >

            {/* item */}
            <View style={[styles.rowReversed, { width, paddingVertical: 12, paddingHorizontal: 12, borderBottomColor: '#CCC', borderBottomWidth: 1, justifyContent: 'flex-start', alignItems: 'center' }]} >
              <View style={{ width: 60, height: 60, overflow: 'hidden' }} >
                <Image source={require('./../../../../Images/carLogo3.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 16 }} >
                <Text style={{ textAlign: 'right' }} >{"لم يتم الموافقه علي الاعلان الذي قمت بإضافته لاحقا. أذهب الى حسابى لمعرفه سبب الرفض"}</Text>
              </View>
            </View>
            {/* item */}
            <View style={[styles.rowReversed, { width, paddingVertical: 12, paddingHorizontal: 12, borderBottomColor: '#CCC', borderBottomWidth: 1, justifyContent: 'flex-start', alignItems: 'center' }]} >
              <View style={{ width: 60, height: 60, overflow: 'hidden' }} >
                <Image source={require('./../../../../Images/carLogo3.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 16 }} >
                <Text style={{ textAlign: 'right' }} >{"لم يتم الموافقه علي الاعلان الذي قمت بإضافته لاحقا. أذهب الى حسابى لمعرفه سبب الرفض"}</Text>
              </View>
            </View>
            {/* item */}
            <View style={[styles.rowReversed, { width, paddingVertical: 12, paddingHorizontal: 12, borderBottomColor: '#CCC', borderBottomWidth: 1, justifyContent: 'flex-start', alignItems: 'center' }]} >
              <View style={{ width: 60, height: 60, overflow: 'hidden' }} >
                <Image source={require('./../../../../Images/carLogo3.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 16 }} >
                <Text style={{ textAlign: 'right' }} >{"لم يتم الموافقه علي الاعلان الذي قمت بإضافته لاحقا. أذهب الى حسابى لمعرفه سبب الرفض"}</Text>
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
  }
})