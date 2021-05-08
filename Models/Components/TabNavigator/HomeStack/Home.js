import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, Image, SafeAreaView } from 'react-native';
import { Input, Item, Icon } from 'native-base'
const { width, height } = Dimensions.get('window')
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Accordion from 'react-native-collapsible/Accordion';

import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import { getHomeData } from './../../../Actions' //redux

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Processing: false,
      selectedCategory: -1,
      next_page_url: null,
      data: [],
      activeSections: [],
      CarId: null,
      carModelId: null
    };
  }

  // Props => adv, solarPrices, Cars

  componentDidMount() {
    if (this.props.Cars.length == 0) {
      this.props.getHomeData()
    }
    this.getData('https://rocky-cliffs-25615.herokuapp.com/api/showSparePart', 5)
  }

  getData(url, selectedCategory) {
    const thisComponent = this
    thisComponent.setState({ Processing: true })
    try {
      axios.get(url, {
        ////
      }).then(function (response) {
        // console.log(response.data)
        thisComponent.setState({ Processing: false })
        if (response.data.length != 0) {
          if (selectedCategory == thisComponent.state.selectedCategory) {
            // console.log("same category ", selectedCategory)
            thisComponent.setState({
              data: selectedCategory != 2 ? [...thisComponent.state.data, ...response.data.data] : [...thisComponent.state.data, ...response.data],
              next_page_url: selectedCategory != 2 ? response.data.next_page_url : null,
              selectedCategory
            })
          }
          else {
            // console.log("diff category ", selectedCategory)
            thisComponent.setState({
              data: selectedCategory != 2 ? response.data.data : response.data,
              next_page_url: selectedCategory != 2 ? response.data.next_page_url : null,
              selectedCategory,
            })
          }
        } else {

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
      console.log(error)
      thisComponent.setState({ Processing: false })
      setTimeout(() => {
        alert('Oops! ' + "Something went wrong");
      }, 100);
    }
  }

  renderHeader() {
    return this.state.selectedCategory >= 3 ?
      (
        <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', paddingHorizontal: 18, zIndex: 1 }]} >
          <TouchableOpacity onPress={() => { }} style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
            <Text style={{ fontSize: 16, color: '#FFF', marginRight: 5, fontWeight: 'bold' }} >تصنيف</Text>
            <Image source={require('./../../../../Images/sort.png')} resizeMethod="resize" style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
          <Item style={[styles.inputFields, { paddingHorizontal: 12, flex:1, marginLeft:22 }]}>
            <Icon name='search' />
            <Input
              placeholder={'أبحث فى '+ (this.state.selectedCategory == 5 ? 'قطع غيار' : this.state.selectedCategory == 4 ? 'سيارات مستعملة' : 'سيارات جديدة')}
              style={{ color: '#764c22', textAlign: 'center' }}
              onChangeText={(text) => this.setState({ username: text })}
            />
          </Item>
        </View>
      )
      :
      (
        <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'center', backgroundColor: '#003f43', paddingHorizontal: 18, zIndex: 1 }]} >
          <Text style={{ fontFamily: 'Pacifico', color:'#FFF', fontSize:22 }} >{"Carak :)"}</Text>
        </View>
      )
  }

  renderCategories() {
    return (
      <View >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ transform: [{ rotateY: '180deg' }] }} >

          <TouchableOpacity onPress={() => this.selectCarNews()} activeOpacity={1} style={[styles.flex, styles.column, styles.shadow, { elevation: 4, width: 95, height: 95, borderRadius: 18, marginLeft: 8, overflow: 'hidden', backgroundColor: '#003f43', transform: [{ rotateY: '180deg' }] }]} >
            <View style={[styles.flex, { width: 95, height: 72, backgroundColor: '#eacf43', borderRadius: 18, overflow: 'hidden', borderColor: '#003f43', borderWidth: 4 }]}>
              <Image resizeMethod="resize" source={require('./../../../../Images/1.jpg')} style={{ flex: 1, width: null, height: null }} />
            </View>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#fff', fontSize: 12 }}>اخبار السيارات</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.selectCarPrices()} activeOpacity={1} style={[styles.flex, styles.column, styles.shadow, { elevation: 4, width: 95, height: 95, borderRadius: 18, marginLeft: 8, overflow: 'hidden', backgroundColor: '#003f43', transform: [{ rotateY: '180deg' }] }]} >
            <View style={[styles.flex, { width: 95, height: 72, backgroundColor: '#eacf43', borderRadius: 18, overflow: 'hidden', borderColor: '#003f43', borderWidth: 4 }]}>
              <Image resizeMethod="resize" source={require('./../../../../Images/2.jpg')} style={{ flex: 1, width: null, height: null }} />
            </View>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#fff', fontSize: 12 }}>اسعار السيارات</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.selectNewCars()} activeOpacity={1} style={[styles.flex, styles.column, styles.shadow, { elevation: 4, width: 95, height: 95, borderRadius: 18, marginLeft: 8, overflow: 'hidden', backgroundColor: '#003f43', transform: [{ rotateY: '180deg' }] }]} >
            <View style={[styles.flex, { width: 95, height: 72, backgroundColor: '#eacf43', borderRadius: 18, overflow: 'hidden', borderColor: '#003f43', borderWidth: 4 }]}>
              <Image resizeMethod="resize" source={require('./../../../../Images/3.jpg')} style={{ flex: 1, width: null, height: null }} />
            </View>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#fff', fontSize: 12 }}>سيارات جديده</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.selectUsedCars()} activeOpacity={1} style={[styles.flex, styles.column, styles.shadow, { elevation: 4, width: 95, height: 95, borderRadius: 18, marginLeft: 8, overflow: 'hidden', backgroundColor: '#003f43', transform: [{ rotateY: '180deg' }] }]} >
            <View style={[styles.flex, { width: 95, height: 72, backgroundColor: '#eacf43', borderRadius: 18, overflow: 'hidden', borderColor: '#003f43', borderWidth: 4 }]}>
              <Image resizeMethod="resize" source={require('./../../../../Images/4.jpg')} style={{ flex: 1, width: null, height: null }} />
            </View>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#fff', fontSize: 12 }}>سيارات مستعمله</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.selectSpareParts()} activeOpacity={1} style={[styles.flex, styles.column, styles.shadow, { elevation: 4, width: 95, height: 95, borderRadius: 18, marginLeft: 8, overflow: 'hidden', backgroundColor: '#003f43', transform: [{ rotateY: '180deg' }] }]} >
            <View style={[styles.flex, { width: 95, height: 72, backgroundColor: '#eacf43', borderRadius: 18, overflow: 'hidden', borderColor: '#003f43', borderWidth: 4 }]}>
              <Image resizeMethod="resize" source={require('./../../../../Images/5.jpg')} style={{ flex: 1, width: null, height: null }} />
            </View>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#fff', fontSize: 12 }}>قطع غيار</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    )
  }

  ////////////////////////////// News ///////////////////////////////

  selectCarNews() {
    // this.setState({ selectedCategory: 1 })
    this.state.selectedCategory != 1 &&
      this.getData('https://rocky-cliffs-25615.herokuapp.com/api/showNews', 1)
  }

  renderCarNews() {
    return (
      <View style={[styles.column, { width }]} >
        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center' }]} >
          <FontAwesome name='newspaper-o' style={{ fontSize: 32, color: '#003f43' }} />
          <Text style={{ color: '#003f43', fontWeight: 'bold', fontSize: 24, marginHorizontal: 8 }} >{"أخبار السيارات"}</Text>
        </View>

        {this.props.solarPrices && this.renderBenzenePrices()}
        {
          this.state.data.map((item, index) => {
            return (
              this.renderCarNewsItem(item, index)
            )
          })
        }

      </View>
    )
  }

  renderBenzenePrices() {
    return (
      <TouchableOpacity activeOpacity={1} style={[styles.row, styles.shadow, { justifyContent: 'center', paddingHorizontal: 8, marginTop: 12 }]} >
        <View style={[styles.flex, styles.shadow, styles.row, { width: width - (8 * 2), height: 280, borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFF' }]}>

          <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', borderRadius: 18, padding: 8, overflow: 'hidden' }]} >

            <View style={[styles.row, { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]} >

              <View style={{ backgroundColor: '#003f43', height: 28, width: 28, borderRadius: 28 / 2, justifyContent: 'center', alignItems: 'center', marginHorizontal: 0 }}>
                <Image resizeMethod="resize" source={require('../../../../Images/money-bag-with-dollar-symbol.png')} style={{ width: 18, height: 18 }} />
              </View>

              <View style={[styles.flex, styles.rowReversed, { marginHorizontal: 18 }]} >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>اسعار البنزين</Text>
              </View>

            </View>

            <View style={[styles.rowReversed, { flex: 1, backgroundColor: '#FFF', alignItems: 'center' }]} >
              <View style={[styles.row, { justifyContent: 'flex-end' }, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', }]}>
                <Text numberOfLines={1} style={[{ color: '#000', marginHorizontal: 18, fontSize: 16 }, { textAlign: 'right' }]}>
                  {"لتر بنزين 80"}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFF', height: 35, borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: '#000', fontSize: 16 }}>{this.props.solarPrices.oli82price}{" جنيه مصري"}</Text>
              </View>
            </View>

            <View style={[styles.rowReversed, { flex: 1, backgroundColor: '#FFF', alignItems: 'center' }]} >
              <View style={[styles.row, { justifyContent: 'flex-end' }, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', }]}>
                <Text numberOfLines={1} style={[{ color: '#000', marginHorizontal: 18, fontSize: 16 }, { textAlign: 'right' }]}>
                  {"لتر بنزين 92"}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFF', height: 35, borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: '#000', fontSize: 16 }}>{this.props.solarPrices.oli92price}{" جنيه مصري"}</Text>
              </View>
            </View>

            <View style={[styles.rowReversed, { flex: 1, backgroundColor: '#FFF', alignItems: 'center' }]} >
              <View style={[styles.row, { justifyContent: 'flex-end' }, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', }]}>
                <Text numberOfLines={1} style={[{ color: '#000', marginHorizontal: 18, fontSize: 16 }, { textAlign: 'right' }]}>
                  {"لتر بنزين 95"}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFF', height: 35, borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: '#000', fontSize: 16 }}>{this.props.solarPrices.oli95price}{" جنيه مصري"}</Text>
              </View>
            </View>

            <View style={[styles.rowReversed, { flex: 1, backgroundColor: '#FFF', alignItems: 'center' }]} >
              <View style={[styles.row, { justifyContent: 'flex-end' }, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', }]}>
                <Text numberOfLines={1} style={[{ color: '#000', marginHorizontal: 18, fontSize: 16 }, { textAlign: 'right' }]}>
                  {"لتر السولار"}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFF', height: 35, borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: '#000', fontSize: 16 }}>{this.props.solarPrices.solarprice}{" جنيه مصري"}</Text>
              </View>
            </View>

            <View style={[styles.rowReversed, { flex: 1, backgroundColor: '#FFF', alignItems: 'center' }]} >
              <View style={[styles.row, { justifyContent: 'flex-end' }, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', }]}>
                <Text numberOfLines={1} style={[{ color: '#000', marginHorizontal: 18, fontSize: 16 }, { textAlign: 'right' }]}>
                  {"متر الغاز للسيارات"}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFF', height: 35, borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: '#000', fontSize: 16 }}>{this.props.solarPrices.gasprice}{" جنيه مصري"}</Text>
              </View>
            </View>

          </View>

        </View>
      </TouchableOpacity>
    )
  }

  renderCarNewsItem(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ScreenNews', { news: item })}
        key={index.toString()}
        activeOpacity={1}
        style={[styles.row, styles.shadow, { justifyContent: 'center', paddingHorizontal: 8, marginTop: 12 }]}
      >
        <View style={[styles.flex, styles.shadow, styles.column, { width: width - (8 * 2), paddingBottom: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: '100%', aspectRatio: 1.8, backgroundColor: '#CCC', borderTopRightRadius: 18, borderTopLeftRadius: 18, overflow: 'hidden' }} >
            <Image resizeMethod="resize" source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null }} />
          </View>
          <View style={[styles.rowReversed, { width: '90%', marginTop: 12 }]} >
            <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: 'bold', color: '#003f43' }} >{item.title}</Text>
          </View>
          <View style={[styles.rowReversed, { width: '90%', marginTop: 4 }]} >
            <Text numberOfLines={4} style={{ textAlign: 'right', fontSize: 14 }} >{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  ////////////////////////////// Car Prices ///////////////////////////////

  selectCarPrices() {
    // this.setState({ selectedCategory: 2 })
    this.state.selectedCategory != 2 &&
      this.getData('https://rocky-cliffs-25615.herokuapp.com/api/showCarPrice', 2)
  }

  renderCarPrices() {
    return (
      <View style={[styles.column, { width }]} >
        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center', marginBottom: 8 }]} >
          <Foundation name='pricetag-multiple' style={{ fontSize: 32, color: '#003f43' }} />
          <Text style={{ color: '#003f43', fontWeight: 'bold', fontSize: 24, marginHorizontal: 8 }} >{"أسعار السيارات"}</Text>
        </View>

        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center', marginBottom: 18 }]} >
          <Text style={{ color: '#003f43', fontSize: 16, marginHorizontal: 8, textAlign: 'right' }} >{"تعرف الأن على متوسط أسعار السيارات الجديدة في مصر. هذه الصفحة ستساعد المشتري في معرفة متوسط الأسعار في السوق لكي يتخذ القرار السليم في شراء سيارة جديدة ... "}</Text>
        </View>

        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center', marginBottom: 8 }]} >
          <Text onPress={() => { console.log(this.state.data) }} style={{ color: '#003f43', fontWeight: 'bold', fontSize: 24, marginHorizontal: 8 }} >{"كل الماركات"}</Text>
        </View>

        <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }]} >
          {
            this.state.data &&
            <Accordion
              sections={this.state.data} // List
              activeSections={this.state.activeSections}
              renderSectionTitle={this._renderSectionTitle}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
            />
          }
        </View>

      </View>
    )
  }

  _renderSectionTitle = section => {
    return (
      <View style={[styles.column, { width, justifyContent: 'center', alignItems: 'center' }]} >
        <View style={[styles.row, { flex: 1, marginHorizontal: 18, backgroundColor: '#003f43', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
          <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, { borderRightWidth: 1, borderRightColor: '#FFF' }]}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: 'bold' }} >{section.name}</Text>
          </View>
        </View>
        <View style={[styles.row, { flex: 1, marginHorizontal: 18, backgroundColor: '#14524d', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
          <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, { borderRightWidth: 1, borderRightColor: '#FFF' }]}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }} >{"السعر"}</Text>
          </View>
          <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, { borderRightWidth: 1, borderRightColor: '#FFF' }]}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }} >{"الفقة"}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }} >{"الموديل"}</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderHeader = section => {
    return (
      <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
        <View style={[styles.row, styles.shadow, { flex: 1, marginHorizontal: 18, backgroundColor: '#FFF', height: 20, elevation: 2, marginBottom: 2 }]}>
          <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
            <AntDesign name="down" size={14} style={{ color: '#707070', marginHorizontal: 4 }} />
            <Text style={{ color: '#000', fontSize: 14, textAlign: 'center', fontWeight: 'bold' }} >{"التفاصيل"}</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
        <View style={[styles.column, { flex: 1, marginHorizontal: 18, backgroundColor: '#FFF', borderTopColor: '#FFF', borderTopWidth: 1, marginBottom: 2 }]}>

          {
            section.car_price.map((item, index) => {
              return (
                <View key={index.toString()} style={[styles.row, { flex: 1, backgroundColor: '#FFF', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
                  <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }, { borderRightWidth: 1, borderRightColor: '#DBEDFA' }]}>
                    <Text numberOfLines={1} style={{ color: '#14524d', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }} >{item.price + " ج.م "}</Text>
                  </View>
                  <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }, { borderRightWidth: 1, borderRightColor: '#DBEDFA' }]}>
                    <Text numberOfLines={1} style={{ color: '#14524d', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }} >{item.category}</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} style={{ color: '#003f43', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }} >{item.car_model_name}</Text>
                  </View>
                </View>
              )
            })
          }

        </View>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  ////////////////////////////// New Cars ///////////////////////////////

  selectNewCars() {
    // this.setState({ selectedCategory: 3 }) showNewCars
    this.state.selectedCategory != 3 &&
      this.getData('https://rocky-cliffs-25615.herokuapp.com/api/showNewCars', 3)
  }

  renderNewCars() {
    return (
      <View style={[styles.column, { width }]} >
        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center' }]} >
          <FontAwesome5 name='car' style={{ fontSize: 32, color: '#003f43' }} />
          <Text style={{ color: '#003f43', fontWeight: 'bold', fontSize: 24, marginHorizontal: 8 }} >{"سيارات جديدة"}</Text>
        </View>

        {
          this.state.data.map((item, index) => {
            return (
              this.renderNewCarItem(item, index)
            )
          })
        }

      </View>
    )
  }

  renderNewCarItem(item, index) {

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ScreenCar', { car: item })}
        key={index.toString()}
        activeOpacity={1}
        style={[styles.row, styles.shadow, { justifyContent: 'center', paddingHorizontal: 8, marginTop: 12 }]}
      >
        <View style={[styles.flex, styles.shadow, styles.rowReversed, { width: width - (8 * 2), overflow: 'hidden', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ flex: 2, height: '100%', backgroundColor: '#CCC', overflow: 'hidden' }} >
            <Image resizeMethod="resize" source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }} />
          </View>
          <View style={[styles.column, { flex: 3, paddingVertical: 12, paddingHorizontal: 12 }]} >
            <Text style={{ textAlign: 'left', fontSize: 14, color: '#003f43' }} >
              {
                new Date(item.created_date).getDate()
                + '/' +
                (parseInt(new Date(item.created_date).getMonth()) + 1).toString()
                + '/' +
                new Date(item.created_date).getFullYear()
              }
            </Text>
            <Text numberOfLines={1} style={{ textAlign: 'right', fontSize: 18, fontWeight: 'bold', color: '#003f43' }} >{item.title}</Text>
            <Text numberOfLines={2} style={{ textAlign: 'right', fontSize: 14 }} >{item.description}</Text>
            <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: 'bold', color: '#003f43' }} >{item.price + " ج.م "}</Text>
          </View>
        </View>
      </TouchableOpacity>

    )

  }

  ////////////////////////////// Used Cars ///////////////////////////////

  selectUsedCars() {
    // this.setState({ selectedCategory: 4 })
    this.state.selectedCategory != 4 &&
      this.getData('https://rocky-cliffs-25615.herokuapp.com/api/showUsedCars', 4)
  }

  renderUsedCars() {
    return (
      <View style={[styles.column, { width }]} >
        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center' }]} >
          <MaterialCommunityIcons name='car' style={{ fontSize: 32, color: '#003f43' }} />
          <Text style={{ color: '#003f43', fontWeight: 'bold', fontSize: 24, marginHorizontal: 8 }} >{"سيارات مستعملة"}</Text>
        </View>

        {
          this.state.data.map((item, index) => {
            return (
              this.renderUsedCarItem(item, index)
            )
          })
        }

      </View>
    )
  }

  renderUsedCarItem(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ScreenCar', { car: item })}
        key={index.toString()}
        activeOpacity={1}
        style={[styles.row, styles.shadow, { justifyContent: 'center', paddingHorizontal: 8, marginTop: 12 }]}
      >
        <View style={[styles.flex, styles.shadow, styles.rowReversed, { width: width - (8 * 2), borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ height: '100%', flex: 2, backgroundColor: '#CCC', borderRadius: 18, overflow: 'hidden' }} >
            <Image resizeMethod="resize" source={{ uri: item.photo }} style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }} />
          </View>
          <View style={[styles.column, { flex: 3, paddingVertical: 12, paddingHorizontal: 12 }]} >
            <Text style={{ textAlign: 'left', fontSize: 14, color: '#003f43' }} >
              {
                new Date(item.created_date).getDate()
                + '/' +
                (parseInt(new Date(item.created_date).getMonth()) + 1).toString()
                + '/' +
                new Date(item.created_date).getFullYear()
              }
            </Text>
            <Text numberOfLines={1} style={{ textAlign: 'right', fontSize: 18, fontWeight: 'bold', color: '#003f43' }} >{item.title}</Text>
            <Text numberOfLines={2} style={{ textAlign: 'right', fontSize: 14 }} >{item.description}</Text>
            <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: 'bold', color: '#003f43' }} >{item.price + " ج.م "}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  ////////////////////////////// Spare parts ///////////////////////////////

  selectSpareParts() {
    // this.setState({ selectedCategory: 5 })
    this.state.selectedCategory != 5 &&
      this.getData('https://rocky-cliffs-25615.herokuapp.com/api/showSparePart', 5)
  }

  renderSpareParts() {
    return (
      <View style={[styles.column, { width }]} >
        <View style={[styles.rowReversed, { width, paddingHorizontal: 18, alignItems: 'center' }]} >
          <MaterialCommunityIcons name='car-battery' style={{ fontSize: 32, color: '#003f43' }} />
          <Text style={{ color: '#003f43', fontWeight: 'bold', fontSize: 24, marginHorizontal: 8 }} >{"قطع غيار"}</Text>
        </View>

        {
          this.state.data.map((item, index) => {
            return (
              this.renderSparePartsItem(item, index)
            )
          })
        }

      </View>
    )
  }

  renderSparePartsItem(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ScreenSpare', { spare: item })}
        key={index.toString()}
        activeOpacity={1}
        style={[styles.row, styles.shadow, { justifyContent: 'center', paddingHorizontal: 8, marginTop: 12, }]}
      >
        <View style={[styles.flex, styles.shadow, styles.row, { width: width - (8 * 2), borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFF' }]}>
          <View style={{ flex: 1, backgroundColor: '#FFF', paddingVertical: 12 }}>
            <View style={[styles.column, { flex: 1, padding: 2, justifyContent: 'center' }]}>
              <View style={[styles.row, { justifyContent: 'center', marginBottom: 2, paddingHorizontal: 18 }]}>
                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }} >{item.title}</Text>
              </View>
              <View style={[styles.row, { justifyContent: 'center', marginVertical: 4, marginHorizontal: 14 }]} >
                <Text numberOfLines={1} style={{ fontSize: 14 }} >
                  {item.description}
                </Text>
              </View>
              <View style={[styles.rowReversed, { justifyContent: 'center', paddingHorizontal: 14, marginTop: 4 }]} >
                <View style={{ backgroundColor: '#003f43', height: 28, width: 28, borderRadius: 28 / 2, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome5 name="car" style={{ fontSize: 18, color: '#FFF' }} />
                </View>
                <View style={{ flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 9, marginHorizontal: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }}>
                  <Text numberOfLines={1} >{item.car_name}</Text>
                </View>
              </View>
              <View style={[styles.rowReversed, { justifyContent: 'center', paddingHorizontal: 14, marginTop: 4 }]} >
                <View style={{ backgroundColor: '#003f43', height: 28, width: 28, borderRadius: 28 / 2, justifyContent: 'center', alignItems: 'center' }}>
                  <EvilIcons name="calendar" style={{ fontSize: 24, color: '#FFF' }} />
                </View>
                <View style={{ flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 9, marginHorizontal: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>
                    {
                      new Date(item.created_date).getDate()
                      + '-' +
                      (parseInt(new Date(item.created_date).getMonth()) + 1).toString()
                      + '-' +
                      new Date(item.created_date).getFullYear()
                    }
                  </Text>
                </View>
              </View>
              <View style={[styles.row, { justifyContent: 'center', marginTop: 8, borderWidth: 2, borderColor: '#003f43', borderRadius: 12, height: 32, marginHorizontal: 8, overflow: 'hidden' }]} >
                <View style={{ flex: 0.6, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                  <Text numberOfLines={1} style={{ color: '#003f43', fontSize: 12, fontWeight: 'bold' }}>
                    {item.price}
                  </Text>
                </View>
                <View style={[{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }, { flex: 0.4, backgroundColor: '#003f43', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={[{ fontSize: 12 }, { color: '#FFF', }]}>
                    {'السعر'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden' }}>
            <Image source={{ uri: item.photo }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: "stretch" }} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  ////////////////////////////// render function ///////////////////////////////

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
        <StatusBar backgroundColor='#003f43' barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
          <Spinner
            visible={this.state.Processing}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
          {this.renderHeader()}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 18, alignItems: 'center' }} >
            {
              this.props.adv &&
              <TouchableOpacity activeOpacity={1} style={[styles.row, styles.shadow, { width, aspectRatio: 2.2, backgroundColor: '#eacf43' }]} >
                <Image source={{ uri: this.props.adv.photo }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
              </TouchableOpacity>
            }
            <View style={[styles.flex, styles.row, { height: 100, marginVertical: 12 }]}>
              {this.renderCategories()}
            </View>

            {
              this.state.selectedCategory == 1 ?
                this.renderCarNews()
                :
                this.state.selectedCategory == 2 ?
                  this.renderCarPrices()
                  :
                  this.state.selectedCategory == 3 ?
                    this.renderNewCars()
                    :
                    this.state.selectedCategory == 4 ?
                      this.renderUsedCars()
                      :
                      this.renderSpareParts()
            }

            {
              this.state.next_page_url &&
              (
                <TouchableOpacity
                  onPress={() => this.getData(this.state.next_page_url, this.state.selectedCategory)}
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

//redux
const mapStateToProps = state => {
  return {
    adv: state.HomeReducer.adv,
    solarPrices: state.HomeReducer.solarPrices,
    Cars: state.HomeReducer.Cars,
  }
}
// redux
export default connect(mapStateToProps, { getHomeData })(Home)

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
    width: width * 0.55,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 4
  },
})