import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, SafeAreaView, StatusBar, Image, ScrollView, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window')
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios'
axios.defaults.timeout = 10000

// create a component
class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      myPosition: {
        accuracy: 0,
        altitude: 0,
        heading: 0,
        latitude: 0,
        longitude: 0
      },
      positions: [],
      selectedCenter: null
      // positions: [
      //   { "latitude": 37.786954, "longitude": -122.406417, name: '1', maintenance_type: 1 },
      //   { "latitude": 37.786954, "longitude": -122.404417, name: '2', maintenance_type: 2 },
      //   { "latitude": 37.782954, "longitude": -122.404417, name: '3', maintenance_type: 3 },
      //   { "latitude": 37.782054, "longitude": -122.404417, name: '4', maintenance_type: 4 },
      //   { "latitude": 37.785554, "longitude": -122.404417, name: '5', maintenance_type: 5 },
      //   { "latitude": 37.782054, "longitude": -122.405517, name: '6', maintenance_type: 6 },
      //   { "latitude": 37.782054, "longitude": -122.406617, name: '7', maintenance_type: 7 },
      //   { "latitude": 37.787754, "longitude": -122.407717, name: '8', maintenance_type: 8 },
      //   { "latitude": 37.783354, "longitude": -122.403317, name: '9', maintenance_type: 9 },
      //   { "latitude": 37.788854, "longitude": -122.408817, name: '10', maintenance_type: 10 },
      //   { "latitude": 37.781154, "longitude": -122.401117, name: '11', maintenance_type: 11 },
      //   { "latitude": 37.782254, "longitude": -122.408817, name: '12', maintenance_type: 12 },
      //   { "latitude": 37.783354, "longitude": -122.408817, name: '13', maintenance_type: 13 },
      // ],
    }
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

  mapStyle = [
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ myPosition: position.coords })
          this.getNearestCenters()
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
              this.setState({ myPosition: position.coords })
              this.getNearestCenters()
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

  getNearestCenters() {
    const thisComponent = this
    // thisComponent.setState({ Processing: true })
    try {
      axios.get("https://rocky-cliffs-25615.herokuapp.com/api/showM_Centers", {
        params: {
          latitude: thisComponent.state.myPosition.latitude, longitude: thisComponent.state.myPosition.longitude
        }
      })
        .then(response => {
          console.log(response.data)
          thisComponent.setState({ positions: response.data })
        }).catch(function (error) {
          // console.log(error)
          // thisComponent.setState({ Processing: false })
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
      // thisComponent.setState({ Processing: false })
      setTimeout(() => {
        alert('Oops! ' + "Something went wrong");
      }, 100);
    }
  }

  renderHeader() {
    return (
        <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingHorizontal: 18, zIndex: 1, borderBottomWidth:1, borderBottomColor:'#003f43' }]} >
          <Text style={{ fontFamily: 'Pacifico', color:'#003f43', fontSize:22 }} >{"Carak :)"}</Text>
        </View>
      )
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
        <StatusBar backgroundColor='#003f43' barStyle="light-content" />
        { this.renderHeader() }
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            customMapStyle={this.mapStyle}
            style={styles.map}
            region={{
              latitude: this.state.myPosition.latitude,//37.78825,
              longitude: this.state.myPosition.longitude,//-122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate={this.state.myPosition}
              title={"موقعك"}
            >
              <MaterialIcons name="location-on" style={{ color: 'blue', fontSize: 32 }} />
            </Marker>

            {
              this.state.positions.map((item, index) => {
                if (item.maintenance_type > 0 && item.maintenance_type < 14) {
                  return (
                    <Marker
                      key={index.toString()}
                      coordinate={{
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude)
                      }}
                      onPress={() => {
                        this.setState({ selectedCenter: item })
                        this.Scrollable.open()
                      }}
                    >
                      <FontAwesome5 name="tools" style={{ color: 'green', fontSize: 22 }} />
                      {/* <Callout style={{ width: 100, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }} >
                        <Text style={{ textAlign: 'center' }} >{item.name}</Text>
                        <Text style={{ textAlign: 'center', marginVertical: 8 }} >{this.maintainanceTypes[item.maintenance_type - 1].name}</Text>
                        <Image source={this.maintainanceTypes[item.maintenance_type - 1].logo} style={{ width: 30, height: 30, marginHorizontal: 8 }} />
                      </Callout> */}
                    </Marker>
                  )
                }
              })
            }

          </MapView>

          {/* Grid Menu */}
          <RBSheet
            ref={ref => {
              this.Scrollable = ref;
            }}
            closeOnDragDown
            customStyles={{
              container: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
              }
            }}
          >
            <ScrollView>
              {
                this.state.selectedCenter &&
                <View style={styles.gridContainer}>
                  <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#003f43', textAlign: 'center' }} >{this.state.selectedCenter.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'center', marginTop: 6 }} >
                    <Text style={{ fontSize: 24, color: '#A8A8A8', textAlign: 'center' }} >{this.state.selectedCenter.number}</Text>
                  </View>
                  <View style={{ flexDirection: 'row-reverse', width: '100%', marginTop: 18 }} >
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#003f43', textAlign: 'right' }} >{"نوع الصيانة : "}</Text>
                  </View>
                  <View style={{ flexDirection: 'row-reverse', width: '100%', marginTop: 8, alignItems: 'center' }} >
                    <Image source={this.maintainanceTypes[this.state.selectedCenter.maintenance_type - 1].logo} style={{ width: 40, height: 40 }} />
                    <Text style={{ fontSize: 22, color: '#000', textAlign: 'right', marginHorizontal: 8 }} >{this.maintainanceTypes[this.state.selectedCenter.maintenance_type - 1].name}</Text>
                  </View>
                </View>

              }
            </ScrollView>
          </RBSheet>

        </View>
      </SafeAreaView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  gridContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

//make this component available to the app
export default Map;