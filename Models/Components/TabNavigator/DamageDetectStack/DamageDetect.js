import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Animated, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
import questions from '../../../ChatBotQuestions'
import AnimatedEllipsis from '../../../AnimatedEllipsis'

// Question = {
//   index: 0,
//   text: 'Question ?',
//   choices: [
//       { text: 'Choise 1', referToIndex: 1, statment: null },
//       { text: 'Choise 2', referToIndex: 2, statment: null },
//       { text: 'Choise 3', referToIndex: 0, statment: 'Answer' },
//   ]
// }

export default class DamageDetect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIn: new Animated.Value(0),
      scene: 1,
      Question: null,
      // type   : 0 => Statement  1 => Question
      // sender : 0 => Chatbot    1 => User
      chatBotArray: [],
      Processing: false
    };
  }

  UNSAFE_componentWillMount() {
    // this.props.navigation.dangerouslyGetParent().setOptions({
    //   tabBarVisible: false
    // });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  UNSAFE_componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    // this.props.navigation.dangerouslyGetParent().setOptions({
    //   tabBarVisible: true
    // });
    this.props.navigation.goBack();
    return true;
  }

  animateSplash() {
    Animated.timing(
      this.state.fadeIn,
      {
        toValue: 1,
        duration: 2000,
      }
    ).start(() => {
      setTimeout(() => {
        this.setState({ scene: 2, fadeIn: new Animated.Value(0) })
      }, 200);
    });
  }

  componentDidMount() {
    const Question = questions[0]
    this.setState({
      Question,
      scene: 1,
      // type   : 0 => Statement  1 => Question
      // sender : 0 => Chatbot    1 => User
      chatBotArray: [
        { type: 0, sender: 0, text: 'مرحباََ', QuestionIndex: null },
        // { type: 1, sender: 0, text: Question.text, QuestionIndex: Question.index },
      ]
    })
    this.animateSplash()
  }

  handleReload() {
    const Question = questions[0]
    this.setState({
      Question,
      scene: 1,
      // type   : 0 => Statement  1 => Question
      // sender : 0 => Chatbot    1 => User
      chatBotArray: [
        { type: 0, sender: 0, text: 'مرحباََ', QuestionIndex: null },
        // { type: 1, sender: 0, text: Question.text, QuestionIndex: Question.index },
      ]
    })
    this.animateSplash()
  }

  selectBotScene() {
    this.setState({ scene: 31 })
    const Question = questions[0]
    const chatBotArray = [...this.state.chatBotArray]
    this.setState({ Processing: true })
    setTimeout(() => {
      chatBotArray.push({ type: 1, sender: 0, text: Question.text, QuestionIndex: Question.index })
      this.setState({ chatBotArray, Processing: false })
    }, 1000);
  }

  handleUserChoise(item, index) {
    const chatBotArray = [...this.state.chatBotArray]
    if (item.statment) {
      chatBotArray.push({ type: 0, sender: 1, text: this.state.Question.choices[index].text, QuestionIndex: null })
      this.setState({ chatBotArray, Question: null })
      this.setState({ Processing: true })
      this.scrollView.scrollToEnd({ animated: false })
      setTimeout(() => {
        chatBotArray.push({ type: 0, sender: 0, text: item.statment, QuestionIndex: null })
        this.setState({ chatBotArray, Processing: false })
        setTimeout(() => {
          this.scrollView.scrollToEnd({ animated: false })
        }, 100);
      }, 1000);
    } else {
      chatBotArray.push({ type: 0, sender: 1, text: this.state.Question.choices[index].text, QuestionIndex: null })
      this.setState({ Processing: true })
      this.setState({ chatBotArray, Question: null })
      this.scrollView.scrollToEnd({ animated: false })
      setTimeout(() => {
        const question = questions[item.referToIndex]
        chatBotArray.push({ type: 1, sender: 0, text: question.text, QuestionIndex: question.index })
        this.setState({ chatBotArray, Question: question, Processing: false })
        setTimeout(() => {
          this.scrollView.scrollToEnd({ animated: false })
        }, 100);
      }, 1000);
    }
  }

  renderHeader() {
    return (
      <View style={[styles.flex, styles.rowReversed, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', zIndex: 1, borderBottomWidth: 1, borderBottomColor: '#003f43' }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleReload()} >
          <FontAwesome name={"refresh"} style={{ color: '#003f43', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Pacifico', color: '#003f43', fontSize: 22 }} >{"Carak :)"}</Text>
        <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

        </View>
      </View>
    )
  }

  renderScene1() {
    return (
      <Animated.View
        style={{
          flex: 1, width, justifyContent: 'center', alignItems: 'center',
          opacity: this.state.fadeIn,
        }}
      >
        <Image style={{ width: 300, height: 400 }} source={require('./../../../../Images/repairman.png')} />
      </Animated.View>
    )
  }

  renderScene2() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' }} >
        <View style={{ width: width - (18 * 2), alignItems: 'center', borderRadius: 12, backgroundColor: '#F5F5F5', paddingVertical: 42 }} >
          <TouchableOpacity
            onPress={() => { this.selectBotScene() }}
            style={[styles.column, {
              width: width - (36 * 2), paddingVertical: 12,
              borderRadius: 12, backgroundColor: '#E7E7E7',
              borderWidth: 2, borderColor: '#CCC', justifyContent: 'center'
            }]}
          >
            <Text
              style={{
                textAlign: 'center', fontFamily: 'Pacifico',
                fontSize: 18, color: '#003f43', fontWeight: 'bold'
              }}
            >
              {"كشف الأعطال عن طريق "}
            </Text>
            <Text
              style={{
                textAlign: 'center', fontFamily: 'Pacifico',
                fontSize: 18, color: '#003f43'
              }}
            >
              {" Chatbot "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { this.setState({ scene: 32 }) }}
            style={{
              width: width - (36 * 2), paddingVertical: 12,
              borderRadius: 12, backgroundColor: '#E7E7E7',
              marginTop: 22, borderWidth: 2, borderColor: '#CCC'
            }}
          >
            <Text
              style={{
                textAlign: 'center', fontFamily: 'Pacifico',
                fontSize: 18, color: '#003f43', fontWeight: 'bold'
              }}
            >
              {"رموز لوحة عداد السيارة"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => { this.setState({ scene: 33 }) }}
            style={{
              width: width - (36 * 2), paddingVertical: 12,
              borderRadius: 12, backgroundColor: '#E7E7E7',
              borderWidth: 2, borderColor: '#CCC'
            }}
          >
            <Text style={{
              textAlign: 'center', fontFamily: 'Pacifico',
              fontSize: 18, color: '#003f43',
              fontWeight: 'bold'
            }}
            >
              {"أشهر أعطال السيارات"}
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    )
  }

  renderChoise1() { // Chatbot 
    return (
      <View style={[styles.column, { flex: 1, width, backgroundColor: '#E6E6E6' }]} >
        <ScrollView ref={ref => { this.scrollView = ref }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: 18, justifyContent: 'flex-end' }} >
          <View style={[styles.column, { width, paddingHorizontal: 12 }]} >
            {
              this.state.chatBotArray.map((item, index) => {
                return (
                  item.sender == 0 ?
                    <View key={index.toString()} style={[styles.column, {}]} >
                      <View style={[styles.rowReversed, { marginVertical: 8, alignItems: 'flex-start' }]} >
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', overflow: 'hidden' }} >
                          <Image source={require('./../../../../Images/chatBot1.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                        </View>
                        <View style={[styles.row, { backgroundColor: '#FFF', marginHorizontal: 8, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 12, flexShrink: 1 }]} >
                          <Text style={{ color: '#2c3e50', fontSize: 14, textAlign: 'right', fontWeight: 'bold' }} >{item.text}</Text>
                        </View>
                      </View>
                      {
                        (this.state.Question && item.type == 1 && item.QuestionIndex == this.state.Question.index) &&
                        this.state.Question.choices.map((item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => this.handleUserChoise(item, index)}
                              key={index.toString()}
                              style={{
                                borderColor: '#28273f', borderWidth: 3,
                                borderRadius: 12, paddingVertical: 8,
                                paddingHorizontal: 8, marginVertical: 6,
                                backgroundColor: '#2c3e50'
                              }}
                            >
                              <Text style={{ color: '#FFF', textAlign: 'right', fontWeight: 'bold', fontSize: 14 }} >{item.text}</Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                    :
                    <View key={index.toString()} style={[styles.row, { marginVertical: 4, alignItems: 'flex-start' }]}  >
                      <View style={[styles.row, { backgroundColor: '#0084ff', marginHorizontal: 8, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 12, flexShrink: 1 }]} >
                        <Text style={{ color: '#FFF', fontSize: 14, textAlign: 'right', fontWeight: 'bold' }} >{item.text}</Text>
                      </View>
                    </View>
                )
              })
            }

            {
              this.state.Processing &&
              <View style={[styles.rowReversed, { marginVertical: 8, alignItems: 'center' }]} >
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', overflow: 'hidden' }} >
                  <Image source={require('./../../../../Images/chatBot1.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                </View>
                <View style={[styles.rowReversed, { backgroundColor: '#FFF', marginHorizontal: 8, paddingHorizontal: 18, borderRadius: 12, flexShrink: 1 }]} >
                  <AnimatedEllipsis
                    numberOfDots={3}
                    minOpacity={0.4}
                    animationDelay={200}
                    style={{
                      color: '#94939b',
                      fontSize: 28,
                      fontWeight: 'bold',
                      letterSpacing: 5,
                    }}
                  />
                </View>
              </View>
            }


          </View>
        </ScrollView>
      </View>
    )
  }

  renderChoise2() { // Signs
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' }} >
        <Text>b</Text>
      </ScrollView>
    )
  }

  renderChoise3() { // famous problems
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' }} >
        <Text>c</Text>

      </ScrollView>
    )
  }

  scenes() {
    switch (this.state.scene) {
      case 1:
        return this.renderScene1()
      case 2:
        return this.renderScene2()
      case 31:
        return this.renderChoise1()
      case 32:
        return this.renderChoise2()
      case 33:
        return this.renderChoise3()
      default:
        return this.renderScene1()
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
        <StatusBar backgroundColor='#003f43' barStyle="light-content" />
        {this.renderHeader()}
        <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
          {this.scenes()}
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