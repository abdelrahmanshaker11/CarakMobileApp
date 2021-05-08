import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Processing: false,
      SparePartsAdvArray: [],
      NewCarsAdvArray: [],
      UsedCarsAdvArray: [],
      OffersAdvArray: [],
      MaintainenceCentersAdvArray: [],
    };
  }

  maintainanceTypes = [
    { type: 1, name: "ميكانيكة", logo: require('../../../../Images/Mechanics.png') },
    { type: 2, name: "كهرباء", logo: require('../../../../Images/car-lights.png') },
    { type: 3, name: "عفشة", logo: require('../../../../Images/3afsha.png') },
    { type: 4, name: "كاوتش", logo: require('../../../../Images/wheels.png') },
    { type: 5, name: "زيوت", logo: require('../../../../Images/Oil.png') },
    { type: 6, name: "فرامل", logo: require('../../../../Images/break.png') },
    { type: 7, name: "شاكمان", logo: require('../../../../Images/exhaust.png') },
    { type: 8, name: "مفاتيح", logo: require('../../../../Images/carkey.png') },
    { type: 9, name: "سمكرة", logo: require('../../../../Images/samkary.png') },
    { type: 10, name: "عدادات", logo: require('../../../../Images/3adadat.png') },
    { type: 11, name: "زجاج", logo: require('../../../../Images/Glass.png') },
    { type: 12, name: "تكييف", logo: require('../../../../Images/air.png') },
    { type: 13, name: "شامل", logo: require('../../../../Images/car.png') },
  ]

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

  componentDidMount() {
    this.getData()
  }

  getData() {
    const thisComponent = this
    thisComponent.setState({ Processing: true })
    try {
      axios.get("https://rocky-cliffs-25615.herokuapp.com/api/profile", { headers: { Authorization: `Bearer ${this.props.Token}` } })
        .then(response => {
          console.log(response.data)
          thisComponent.setState({
            SparePartsAdvArray: response.data.spare_parts,
            NewCarsAdvArray: response.data.Newcar,
            UsedCarsAdvArray: response.data.Usedcar,
            OffersAdvArray: response.data.offer,
            MaintainenceCentersAdvArray: response.data.center,
            // data: response.data, 
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

  alert(msg) {
    // alert( msg )
    Alert.alert(
      "سبب الرفض",
      msg,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"حسابى"}</Text>
        <TouchableOpacity onPress={() => { this.props.navigation.navigate("MyProfileEdit") }} style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
          <FontAwesome5 name={"edit"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
      </View>
    )
  }

  renderSparePartsAdv() {
    return (
      <View style={{ width, alignItems: 'center' }} >
        {/**  Section 1  **/}

        <View style={{ width: width - 18 * 2, height: 50, backgroundColor: '#003f43', justifyContent: 'center', alignItems: 'center', marginTop: 18 }} >
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }} >{"إعلاناتى قطع غيار"}</Text>
        </View>

        {
          this.state.SparePartsAdvArray.length != 0 ?
            this.state.SparePartsAdvArray.map((item, index) => {
              return (
                <View
                  key={index.toString()}
                  style={[styles.rowReversed, {
                    width: width - 18 * 2, alignItems: 'center',
                    paddingHorizontal: 12, paddingVertical: 12,
                    borderColor: '#A8A8A8', borderBottomWidth: 1,
                    borderLeftWidth: 1, borderRightWidth: 1
                  }]} >
                  <View style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#CCC', marginLeft: 12, overflow: 'hidden' }} >
                    <Image source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </View>
                  <View style={{ flex: 1, height: '100%', alignItems: 'flex-end', paddingVertical: 4 }} >
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }} >{item.title}</Text>
                    <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"قطع غيار"}</Text>
                    {
                      item.status == 0 &&
                      (
                        <Text onPress={() => { this.alert(item.rejection_reason ? item.rejection_reason : "الوصف غير واضح") }} numberOfLines={1} style={{ color: 'red', fontSize: 14, marginTop: 4, textAlign: 'right' }} >{"اضغط هنا لمعرفة سبب الرفض"}</Text>
                      )
                    }
                  </View>
                  {
                    item.status == 0 ?
                      <View style={{ alignItems: 'center', marginRight: 8 }} >
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginBottom: 4 }} />
                        <Text style={{ textAlign: 'center' }} >{"تم\nالرفض"}</Text>
                      </View>
                      :
                      item.status == 1 ?
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'orange', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"قيد\nالانتظار"}</Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"تم\nالموافقة"}</Text>
                        </View>
                  }


                </View>
              )
            })
            :
            <View
              style={[styles.rowReversed, {
                width: width - 18 * 2, alignItems: 'center',
                paddingHorizontal: 12, paddingVertical: 12,
                borderColor: '#A8A8A8', borderBottomWidth: 1,
                borderLeftWidth: 1, borderRightWidth: 1,
                justifyContent: 'center'
              }]} >
              <View style={{ height: 40, justifyContent: 'center' }} >
                <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"لا يوجد إعلانات"}</Text>
              </View>
            </View>
        }

      </View>
    )
  }

  renderNewCarsAdv() {
    return (
      <View style={{ width, alignItems: 'center' }} >
        {/**  Section 1  **/}

        <View style={{ width: width - 18 * 2, height: 50, backgroundColor: '#003f43', justifyContent: 'center', alignItems: 'center', marginTop: 18 }} >
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }} >{"إعلاناتى فى سيارات جديدة"}</Text>
        </View>

        {
          this.state.NewCarsAdvArray.length != 0 ?
            this.state.NewCarsAdvArray.map((item, index) => {
              return (
                <View
                  key={index.toString()}
                  style={[styles.rowReversed, {
                    width: width - 18 * 2, alignItems: 'center',
                    paddingHorizontal: 12, paddingVertical: 12,
                    borderColor: '#A8A8A8', borderBottomWidth: 1,
                    borderLeftWidth: 1, borderRightWidth: 1
                  }]} >
                  <View style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#CCC', marginLeft: 12, overflow: 'hidden' }} >
                    <Image source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </View>
                  <View style={{ flex: 1, height: '100%', alignItems: 'flex-end', paddingVertical: 4 }} >
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }} >{item.title}</Text>
                    <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"سيارات جديدة"}</Text>
                    {
                      item.status == 0 &&
                      (
                        <Text onPress={() => { this.alert(item.rejection_reason ? item.rejection_reason : "الوصف غير واضح") }} numberOfLines={1} style={{ color: 'red', fontSize: 14, marginTop: 4, textAlign: 'right' }} >{"اضغط هنا لمعرفة سبب الرفض"}</Text>
                      )
                    }
                  </View>
                  {
                    item.status == 0 ?
                      <View style={{ alignItems: 'center', marginRight: 8 }} >
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginBottom: 4 }} />
                        <Text style={{ textAlign: 'center' }} >{"تم\nالرفض"}</Text>
                      </View>
                      :
                      item.status == 1 ?
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'orange', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"قيد\nالانتظار"}</Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"تم\nالموافقة"}</Text>
                        </View>
                  }


                </View>
              )
            })
            :
            <View
              style={[styles.rowReversed, {
                width: width - 18 * 2, alignItems: 'center',
                paddingHorizontal: 12, paddingVertical: 12,
                borderColor: '#A8A8A8', borderBottomWidth: 1,
                borderLeftWidth: 1, borderRightWidth: 1,
                justifyContent: 'center'
              }]} >
              <View style={{ height: 40, justifyContent: 'center' }} >
                <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"لا يوجد إعلانات"}</Text>
              </View>
            </View>
        }

      </View>
    )
  }

  renderUsedCarsAdv() {
    return (
      <View style={{ width, alignItems: 'center' }} >
        {/**  Section 1  **/}

        <View style={{ width: width - 18 * 2, height: 50, backgroundColor: '#003f43', justifyContent: 'center', alignItems: 'center', marginTop: 18 }} >
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }} >{"إعلاناتى فى سيارات مستعملة"}</Text>
        </View>

        {
          this.state.UsedCarsAdvArray.length != 0 ?
            this.state.UsedCarsAdvArray.map((item, index) => {
              return (
                <View
                  key={index.toString()}
                  style={[styles.rowReversed, {
                    width: width - 18 * 2, alignItems: 'center',
                    paddingHorizontal: 12, paddingVertical: 12,
                    borderColor: '#A8A8A8', borderBottomWidth: 1,
                    borderLeftWidth: 1, borderRightWidth: 1
                  }]} >
                  <View style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#CCC', marginLeft: 12, overflow: 'hidden' }} >
                    <Image source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </View>
                  <View style={{ flex: 1, height: '100%', alignItems: 'flex-end', paddingVertical: 4 }} >
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }} >{item.title}</Text>
                    <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"سيارات مستعملة"}</Text>
                    {
                      item.status == 0 &&
                      (
                        <Text onPress={() => { this.alert(item.rejection_reason ? item.rejection_reason : "الوصف غير واضح") }} numberOfLines={1} style={{ color: 'red', fontSize: 14, marginTop: 4, textAlign: 'right' }} >{"اضغط هنا لمعرفة سبب الرفض"}</Text>
                      )
                    }
                  </View>
                  {
                    item.status == 0 ?
                      <View style={{ alignItems: 'center', marginRight: 8 }} >
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginBottom: 4 }} />
                        <Text style={{ textAlign: 'center' }} >{"تم\nالرفض"}</Text>
                      </View>
                      :
                      item.status == 1 ?
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'orange', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"قيد\nالانتظار"}</Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"تم\nالموافقة"}</Text>
                        </View>
                  }
                </View>
              )
            })
            :
            <View
              style={[styles.rowReversed, {
                width: width - 18 * 2, alignItems: 'center',
                paddingHorizontal: 12, paddingVertical: 12,
                borderColor: '#A8A8A8', borderBottomWidth: 1,
                borderLeftWidth: 1, borderRightWidth: 1,
                justifyContent: 'center'
              }]} >
              <View style={{ height: 40, justifyContent: 'center' }} >
                <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"لا يوجد إعلانات"}</Text>
              </View>
            </View>
        }

      </View>
    )
  }

  renderOffersAdv() {
    return (
      <View style={{ width, alignItems: 'center' }} >
        {/**  Section 1  **/}

        <View style={{ width: width - 18 * 2, height: 50, backgroundColor: '#003f43', justifyContent: 'center', alignItems: 'center', marginTop: 18 }} >
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }} >{"إعلاناتى فى خدمات و عروض"}</Text>
        </View>

        {
          this.state.OffersAdvArray.length != 0 ?
            this.state.OffersAdvArray.map((item, index) => {
              return (
                <View
                  key={index.toString()}
                  style={[styles.rowReversed, {
                    width: width - 18 * 2, alignItems: 'center',
                    paddingHorizontal: 12, paddingVertical: 12,
                    borderColor: '#A8A8A8', borderBottomWidth: 1,
                    borderLeftWidth: 1, borderRightWidth: 1
                  }]} >
                  <View style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#CCC', marginLeft: 12, overflow: 'hidden' }} >
                    <Image source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </View>
                  <View style={{ flex: 1, height: '100%', alignItems: 'flex-end', paddingVertical: 4 }} >
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }} >{item.title}</Text>
                    <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"خدمات و عروض"}</Text>
                    {
                      item.status == 0 &&
                      (
                        <Text onPress={() => { this.alert(item.rejection_reason ? item.rejection_reason : "الوصف غير واضح") }} numberOfLines={1} style={{ color: 'red', fontSize: 14, marginTop: 4, textAlign: 'right' }} >{"اضغط هنا لمعرفة سبب الرفض"}</Text>
                      )
                    }
                  </View>
                  {
                    item.status == 0 ?
                      <View style={{ alignItems: 'center', marginRight: 8 }} >
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginBottom: 4 }} />
                        <Text style={{ textAlign: 'center' }} >{"تم\nالرفض"}</Text>
                      </View>
                      :
                      item.status == 1 ?
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'orange', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"قيد\nالانتظار"}</Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"تم\nالموافقة"}</Text>
                        </View>
                  }
                </View>
              )
            })
            :
            <View
              style={[styles.rowReversed, {
                width: width - 18 * 2, alignItems: 'center',
                paddingHorizontal: 12, paddingVertical: 12,
                borderColor: '#A8A8A8', borderBottomWidth: 1,
                borderLeftWidth: 1, borderRightWidth: 1,
                justifyContent: 'center'
              }]} >
              <View style={{ height: 40, justifyContent: 'center' }} >
                <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"لا يوجد إعلانات"}</Text>
              </View>
            </View>
        }

      </View>
    )
  }

  renderMaintainenceCentersAdv() {
    return (
      <View style={{ width, alignItems: 'center' }} >
        {/**  Section 2  **/}

        <View style={{ width: width - 18 * 2, height: 50, backgroundColor: '#003f43', justifyContent: 'center', alignItems: 'center', marginTop: 18 }} >
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }} >{"ورشتى"}</Text>
        </View>

        {
          this.state.MaintainenceCentersAdvArray.length != 0 ?
            this.state.MaintainenceCentersAdvArray.map((item, index) => {
              return (
                <View
                  key={index.toString()}
                  style={[styles.rowReversed, {
                    width: width - 18 * 2, alignItems: 'center',
                    paddingHorizontal: 12, paddingVertical: 12,
                    borderColor: '#A8A8A8', borderBottomWidth: 1,
                    borderLeftWidth: 1, borderRightWidth: 1
                  }]} >
                  <View style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#CCC', marginLeft: 12, overflow: 'hidden' }} >
                    <Image source={item.photo ? { uri: item.photo } : require('./../../../../Images/5.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </View>
                  <View style={{ flex: 1, height: '100%', alignItems: 'flex-end', paddingVertical: 4 }} >
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }} >{item.name}</Text>
                    <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{this.maintainanceTypes[item.maintenance_type - 1].name}</Text>
                    {
                      item.status == 0 &&
                      (
                        <Text onPress={() => { this.alert(item.rejection_reason ? item.rejection_reason : "الوصف غير واضح") }} numberOfLines={1} style={{ color: 'red', fontSize: 14, marginTop: 4, textAlign: 'right' }} >{"اضغط هنا لمعرفة سبب الرفض"}</Text>
                      )
                    }
                  </View>
                  {
                    item.status == 0 ?
                      <View style={{ alignItems: 'center', marginRight: 8 }} >
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginBottom: 4 }} />
                        <Text style={{ textAlign: 'center' }} >{"تم\nالرفض"}</Text>
                      </View>
                      :
                      item.status == 1 ?
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'orange', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"قيد\nالانتظار"}</Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center', marginRight: 8 }} >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green', marginBottom: 4 }} />
                          <Text style={{ textAlign: 'center' }} >{"تم\nالموافقة"}</Text>
                        </View>
                  }
                </View>
              )
            })
            :
            <View
              style={[styles.rowReversed, {
                width: width - 18 * 2, alignItems: 'center',
                paddingHorizontal: 12, paddingVertical: 12,
                borderColor: '#A8A8A8', borderBottomWidth: 1,
                borderLeftWidth: 1, borderRightWidth: 1,
                justifyContent: 'center'
              }]} >
              <View style={{ height: 40, justifyContent: 'center' }} >
                <Text numberOfLines={1} style={{ color: '#A8A8A8', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' }} >{"لا يوجد إعلانات"}</Text>
              </View>
            </View>
        }

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

            <View style={{ width, aspectRatio: 3 / 2, backgroundColor: '#CCC' }} >
              <Image source={require('./../../../../Images/cover.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
              <View
                style={{
                  width: 100, height: 100, backgroundColor: '#CCC',
                  position: 'absolute', bottom: -50, right: 18,
                  borderRadius: 12, borderWidth: 6, borderColor: '#003f43',
                  overflow: 'hidden'
                }}
              >
                <Image source={{ uri: this.props.User.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
              </View>
            </View>

            <View
              style={[styles.rowReversed, {
                width, paddingLeft: 128, paddingRight: 8,
                height: 50, justifyContent: 'flex-start',
                alignItems: 'center',
              }]} >
              <Text numberOfLines={1} style={{ fontSize: 28, fontWeight: 'bold', color: '#003f43', textAlign: 'left' }}>{this.props.User.name}</Text>
            </View>

            <View style={[styles.row, { width, justifyContent: 'flex-end', alignItems: 'center', marginTop: 22, paddingHorizontal: 28 }]} >
              <Text style={{ textAlign: 'right', fontSize: 14, color: '#A8A8A8' }} >{"* ملحوظة: إذا واجهتك اى مشكلة فى رفع الاعلانات او إضافة مراكز الصيانة يرجى التواصل معنا من ' تواصل معنا ' فى القائمة الرئيسية"}</Text>
            </View>

            <View style={{ width, paddingVertical: 12, alignItems: 'center', marginTop: 18 }} >

              {this.renderSparePartsAdv()}
              {this.renderNewCarsAdv()}
              {this.renderUsedCarsAdv()}
              {this.renderOffersAdv()}
              {this.renderMaintainenceCentersAdv()}

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
export default connect(mapStateToProps, {})(MyProfile)

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