import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')

export default class AboutUs extends Component {
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
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"عن التطبيق"}</Text>
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: 18, alignItems: 'center' }} >
            <View style={{ flex: 1, width: width - (18 * 2), backgroundColor: '#E6E6E6', borderRadius: 22, paddingHorizontal: 12, paddingVertical: 22 }} >
              <Text style={{ textAlign: 'right', fontSize: 18, marginBottom:12 }} >{"فكرة التطبيق هي حل جميع المشاكل التي قد تواجه جميع أصحاب السيارات."}</Text>
              <Text style={{ textAlign: 'right', fontSize: 18, marginBottom:12 }} >{"يحتوي على جميع قطع الغيار الجديدة والمستعملة للسيارات المقدمة من البائع. ينقسم التطبيق إلى فئات لتسهيل عملية العثور على قطع الغيار من خلال البحث عن نوع السيارة أو الموديل. من السهل جدًا على أصحاب السيارات العثور على قطع الغيار خاصة إذا كانوا يمتلكون سيارة نادرة."}</Text>
              <Text style={{ textAlign: 'right', fontSize: 18, marginBottom:12 }} >{"سيكون هناك مجتمع لكل نوع سيارة في حال أراد أي مستخدم طرح أسئلة حول سيارته ، وسيساعده مستخدمون آخرون من نفس نوع السيارة ويجيبون عليها ، وستمنح هذه الميزة الأشخاص الذين يرغبون في شراء نفس النوع من السيارات لإلقاء نظرة على وجهة نظر الملاك على السيارة ولديك فكرة عن مشاكلها قبل شرائها بالفعل. كما سيتيح التطبيق الفرصة للمستخدمين لبيع وتقديم سياراتهم المستعملة."}</Text>
              <Text style={{ textAlign: 'right', fontSize: 18, marginBottom:12 }} >{"إذا واجه المستخدم مشكلة في سيارته ، يمكنه فتح التطبيق ورؤية أقرب مركز صيانة وموقعه على الخريطة. ستعمل هذه الميزة من خلال تسجيل مراكز الصيانة ووضع موقعها على التطبيق ومن خلال جعل المستخدمين يضيفون مواقع آليات موثوقة وجيدة."}</Text>
              <Text style={{ textAlign: 'right', fontSize: 18 }} >{"أيضا يوجد بالتطبيق خدمة فحص السياره عن طريق بعض الاسألة للمستخدم و بعد الإجابة سيستطيع التطبيق معرفة سبب العطل."}</Text>
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