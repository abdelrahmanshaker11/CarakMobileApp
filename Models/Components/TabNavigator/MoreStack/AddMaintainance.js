import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, Platform, PermissionsAndroid, SafeAreaView, Image } from 'react-native';
// import NavigationServices from '../../NavigationServices';
import { Input, Item } from 'native-base'
import { Overlay } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
import ModalDropDown from './../../../ModalDropDown'
import axios from 'axios'
axios.defaults.timeout = 10000
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux

class AddMaintainance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myPosition: {
        accuracy: 0,
        altitude: 0,
        heading: 0,
        latitude: 0,
        longitude: 0
      },
      markerPosition: {
        latitude: 0,
        longitude: 0
      },
      maintainanceType: null,
      locationAccepted: false,
      isVisible: false,

      Processing: false,
      name: '',
      number: '',
      // photo , idphoto1 , idphoto2
      maintainanceImage: null,
      idphoto1: null,
      idphoto2: null

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

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ myPosition: position.coords, markerPosition: position.coords })
        },
        (error) => {
          alert(error.message)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Carak',
            'message': 'Carak access to your location '
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          Geolocation.getCurrentPosition(
            (position) => {
              this.setState({ myPosition: position.coords, markerPosition: position.coords })
            },
            (error) => {
              alert(error.message)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );

        } else {
          console.log("location permission denied")
          alert("Location permission denied");
        }
      } catch (err) {
        console.warn(err)
      }

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

  onRegionChange = (myPosition) => {
    this.setState({ myPosition });
  }

  //////////////////////////////////////////////

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
            maintainanceImage: response.data,
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

  //////////////////////////////////////////////

  pickImageFromPhone1() {
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
        this.uploadPhoto1(source)

        // this.setState({
        //     imgPath: source, renderSelectedImage: true
        // });

      }
    });
  }

  uploadPhoto1 = (imagePicked) =>
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
            idphoto1: response.data,
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

  //////////////////////////////////////////////

  pickImageFromPhone2() {
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
        this.uploadPhoto2(source)

        // this.setState({
        //     imgPath: source, renderSelectedImage: true
        // });

      }
    });
  }

  uploadPhoto2 = (imagePicked) =>
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
            idphoto2: response.data,
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

  //////////////////////////////////////////////

  addMaintainance() {
    const thisComponent = this
    const {
      name, number, maintainanceType, markerPosition, maintainanceImage, idphoto1, idphoto2
    } = thisComponent.state

    // console.log( markerPosition.latitude, '\n', markerPosition.longitude )

    if (name != '') {
      if (number != '') {
        if (maintainanceType != null) {
          thisComponent.setState({ Processing: true })
          try {
            axios.post('https://rocky-cliffs-25615.herokuapp.com/api/addM_Center',
              {
                name, number,
                latitude: markerPosition.latitude,
                longitude: markerPosition.longitude,
                maintenance_type: maintainanceType,
                photo: maintainanceImage,
                idphoto1, idphoto2
              },
              { headers: { Authorization: `Bearer ${this.props.Token}` } },
            ).then(async function (response) {
              console.log(response)
              setTimeout(() => {
                alert("تم بنجاح, سوف يتم مراجعة البيانات قبل نشرة من قبل الموقع");
              }, 100);
              thisComponent.setState({ Processing: false })
              thisComponent.handleBackButtonClick()
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
        } else {
          alert("من فضلك اختر نوع الصيانة")
        }
      } else {
        alert("من فضلك أكتب رقم هاتف")
      }
    } else {
      alert("من فضلك أكتب اسم الورشه")
    }

  }

  renderOverlay = () => {
    return (
      <Overlay
        isVisible={this.state.isVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        overlayBackgroundColor="#FFF"
        width={width * 0.9}
        height={height * 0.8}
        overlayStyle={{ overflow: 'hidden' }}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View
          style={[styles.column, { width: "100%", height: "100%", backgroundColor: '#FFF', justifyContent: 'center' }]}
        >
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            onRegionChange={this.onRegionChange}
            onPress={(event) => this.setState({ markerPosition: event.nativeEvent.coordinate })}
            initialRegion={{
              latitude: this.state.myPosition.latitude,//37.78825,
              longitude: this.state.myPosition.longitude,//-122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate={this.state.markerPosition}
              title={"My Position"}
            />
          </MapView>
          <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ isVisible: false, locationAccepted: true })} style={{ width: "100%", paddingVertical: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#65F700', borderTopWidth: 10, borderTopColor: '#FFF' }} >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24 }}>{"أضف"}</Text>
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
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"أضافة مركز صيانة"}</Text>
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
          {this.renderOverlay()}
          <Spinner
            visible={this.state.Processing}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32, paddingTop: 12, alignItems: 'center' }} >

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'center', alignItems: 'center' }]} >
              <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
              <Text style={{ fontWeight: 'bold', marginHorizontal: 12, textAlign: 'center' }} >{"أضف ورشة أو مركز صيانة"}</Text>
              <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
            </View>

            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
              <Input placeholder={'أسم الورشه'} style={{ color: '#000' }} defaultValue={this.state.name} textAlign={'center'} onChangeText={(text) => this.setState({ name: text })} />
            </Item>

            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
              <Input placeholder={'رقم الهاتف'} style={{ color: '#000' }} keyboardType="numeric" defaultValue={this.state.number} textAlign={'center'} onChangeText={(text) => this.setState({ number: text })} />
            </Item>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12, marginBottom:8 }]} >
              <Text style={{ textAlign: 'right' }} >{"* ملحوظة: يجب وضع رقم هاتف الورشة / مركز الصيانة لكى يستطيع المستخدم الاتصال قبل المجيء"}</Text>
            </View>

            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12, height: 60, }]}>
              <View style={[styles.row, { flex: 1, justifyContent: 'center' }]} >
                <ModalDropDown
                  // Data => Array
                  data={this.maintainanceTypes}
                  // Default Value => Before Selection
                  bottonDefaultValue={"نوع الصيانة"}
                  // Selection Process
                  onSelect={(item, index) => {
                    this.setState({ maintainanceType: item.type })
                  }}
                  // Value After Selection
                  renderButtonText={(rowData) => (
                    rowData.name
                  )}
                  // Styling
                  bottonStyle={{
                    width: '100%', height: 60, backgroundColor: '#FFF',
                  }}
                  bottonTextStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
                  dropDownHeight={160}
                  renderRow={function (item, index) {
                    return (
                      <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                        <View style={{ width: 30, height: 30, marginHorizontal: 8 }} ></View>
                        <Text numberOfLines={1} style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }]}>
                          {item.name}
                        </Text>
                        <Image source={item.logo} style={{ width: 30, height: 30, marginHorizontal: 8 }} />
                      </View>
                    );
                  }}
                />
              </View>
            </Item>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 22, textAlign: 'right' }} >{"* حدد مكان الورشة من الخريطه"}</Text>
            </View>

            <View style={[styles.row, { width, justifyContent: 'flex-end', alignItems: 'center', marginTop: 12, paddingHorizontal: 36 }]} >
              <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={{ backgroundColor: '#003f43', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 }} >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{"أفتح الخريطة"}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 18 }]} >
              <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 22, textAlign: 'right' }} >{"* أضافى : \n*  ضع صورة للورشة او مركز الصيانه"}</Text>
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              {
                this.state.maintainanceImage ?
                  <TouchableOpacity onPress={() => this.pickImageFromPhone()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', width: 80, aspectRatio: 1, borderRadius: 12, overflow: 'hidden' }]}>
                    <Image source={{ uri: this.state.maintainanceImage }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => this.pickImageFromPhone()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', aspectRatio: 1, borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center' }]}>
                    <FontAwesome name="picture-o" color={"#FFF"} size={56} />
                  </TouchableOpacity>
              }
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <Text style={{ textAlign: 'right' }} >{"* ملحوظة: وضع صورة للورشة أو مركز الصيانة لكى يستطيع المستخدم التعرف عليها عندما يصل للمكان التى تقع فية"}</Text>
            </View>
{/* 
            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 22, textAlign: 'right' }} >{"* أضافى : \n* ضع صورتين للبطاقة الشخصية"}</Text>
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              {
                this.state.idphoto1 ?
                  <TouchableOpacity onPress={() => this.pickImageFromPhone1()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', width: 80, aspectRatio: 1, borderRadius: 12, overflow: 'hidden', marginHorizontal: 12 }]}>
                    <Image source={{ uri: this.state.idphoto1 }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => this.pickImageFromPhone1()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', aspectRatio: 1, borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }]}>
                    <FontAwesome name="picture-o" color={"#FFF"} size={56} />
                  </TouchableOpacity>
              }
              {
                this.state.idphoto2 ?
                  <TouchableOpacity onPress={() => this.pickImageFromPhone2()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', width: 80, aspectRatio: 1, borderRadius: 12, overflow: 'hidden' }]}>
                    <Image source={{ uri: this.state.idphoto2 }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => this.pickImageFromPhone2()} activeOpacity={0.7} style={[styles.shadow, { backgroundColor: '#E9E9E9', aspectRatio: 1, borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center' }]}>
                    <FontAwesome name="picture-o" color={"#FFF"} size={56} />
                  </TouchableOpacity>
              }
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <Text style={{ textAlign: 'right' }} >{"* ملحوظة: وضع صورتين للبطاقة الشخصية لصاحب الورشة أو مركز الصيانة وذلك لحماية المستخدم من عمليات النصب او تعرضة للخطر و ايضا يضمن لك التطبيق ان هذه الصور سوف تكون سرية للغاية ولا يستطيع احد الأطلاع عليها"}</Text>
            </View> */}

            <TouchableOpacity
              onPress={() => this.addMaintainance()}
              style={[styles.Button, styles.shadow]}
            >
              <Text style={styles.ButtonText}>{"الأنتهاء"}</Text>
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
export default connect(mapStateToProps, {})(AddMaintainance)

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
  Button: {
    backgroundColor: '#eacf43',
    width: width - (36 * 2),
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 35,
    marginBottom: 25,
  },
  ButtonText: {
    color: '#003f43',
    fontSize: 16,
    fontWeight: 'bold'
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: "100%",
  },
})