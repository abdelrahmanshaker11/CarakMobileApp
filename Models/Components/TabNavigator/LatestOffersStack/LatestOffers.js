import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, SafeAreaView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

export default class LatestOffers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Processing: false,
      next_page_url: null,
      data: [],
    };
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  UNSAFE_componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.props.navigation.navigate("HomeStack");
    return true;
  }

  componentDidMount() {
    this.getData("https://rocky-cliffs-25615.herokuapp.com/api/showOffers")
  }

  getData(URL) {
    const thisComponent = this
    thisComponent.setState({ Processing: true })
    try {
      axios.get(URL)
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

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', zIndex: 1, borderBottomWidth:1, borderBottomColor:'#003f43' }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#003f43', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#003f43' }} >{"عروض و خدمات"}</Text>
        <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

        </View>
      </View>
    )
  }

  renderItem(item, index) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ScreenOffer', { offer: item })} key={index.toString()} activeOpacity={1} style={[styles.row, styles.shadow, { justifyContent: 'center', paddingHorizontal: 8, marginTop: 12, }]} >
        <View
          style={[styles.flex, styles.shadow, {
            width: width - (8 * 2), height: (width * 0.65),
          }]}
        >
          <View style={[{ flex: 1, backgroundColor: '#CCC', overflow: 'hidden' }]}>
            <Image resizeMethod="resize" source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }} />
            <View style={[styles.flex, styles.column, { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000', alignItems: 'flex-end', justifyContent: 'flex-start', opacity: 0.7, paddingHorizontal: 18, paddingVertical: 12 }]} >
              <View style={[styles.rowReversed, { width: '100%', alignItems: 'center' }]} >
                <FontAwesome name={'circle-o'} style={{ marginLeft: 10, fontSize: 18, color: '#41d2a7' }} />
                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'right' }} >{item.title}</Text>
              </View>
              <Text numberOfLines={2} style={{ textAlign: 'right', color: '#FFF', fontSize: 16 }} >{item.description}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
        <View style={{ flex: 1, backgroundColor: '#FFF' }} >
          {this.renderHeader()}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18, alignItems: 'center' }} >

            {
              this.state.data.map((item, index) => {
                return (
                  this.renderItem(item, index)
                )
              })
            }

            {
              this.state.next_page_url &&
              (
                <TouchableOpacity
                  onPress={() => {
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