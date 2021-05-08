import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, SafeAreaView, Image } from 'react-native';
import { Input, Item, Textarea } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux

class AddSevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Processing: false,
      title: '',
      description: '',
      primaryImage: null,
      photo: [],
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

  primaryPhotoAdd() {
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
        this.uploadPrimary(source)

        // this.setState({
        //     imgPath: source, renderSelectedImage: true
        // });

      }
    });

  }

  photosAdd() {
    if (this.state.photo.length < 6) {
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
          this.uploadPhotosarray(source)

          // this.setState({
          //     imgPath: source, renderSelectedImage: true
          // });

        }
      });
    } else {
      alert("الحد الأقصى 6 صور")
    }
  }

  uploadPrimary = (imagePicked) =>
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
            primaryImage: response.data,
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

  uploadPhotosarray = (imagePicked) =>
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
          var arr = thisComponent.state.photo
          arr.push(response.data)
          thisComponent.setState({
            photo: arr,
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

  addService() {
    const thisComponent = this
    const {
      title, description, primaryImage, photo
    } = thisComponent.state
    if (title != '') {
      if (description != '') {
        if (primaryImage) {
          if (photo.length >= 2) {
            const photoarr = [...photo]
            photoarr.unshift(primaryImage)
            console.log(title, description, primaryImage, photoarr)
            thisComponent.setState({ Processing: true })
            try {
              axios.post('https://rocky-cliffs-25615.herokuapp.com/api/addOffer',
                {
                  title, description, photo: JSON.stringify(photoarr)
                },
                { headers: { Authorization: `Bearer ${this.props.Token}` } },
              ).then(async function (response) {
                console.log(response)
                setTimeout(() => {
                  alert("تم بنجاح, سوف يتم مراجعة الأعلان قبل نشرة من قبل الموقع");
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
            alert("من فضلك أضف على الأقل صورتين للأعلان")
          }
        } else {
          alert("من فضلك أضف صورة رئيسية للأعلان")
        }
      } else {
        alert("من فضلك أضف تفاصيل الأعلان")
      }
    } else {
      alert("من فضلك أضف عنوان الأعلان")
    }
  }

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"أضافة خدمة"}</Text>
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32, paddingTop: 12, alignItems: 'center' }} >

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'center', alignItems: 'center' }]} >
              <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
              <Text style={{ fontWeight: 'bold', marginHorizontal: 12 }} >{"أضف خدمة"}</Text>
              <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
            </View>

            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
              <Input
                defaultValue={this.state.title}
                placeholder={'عنوان الأعلان'}
                style={{ color: '#000' }}
                textAlign={'center'}
                onChangeText={(text) => this.setState({ title: text })}
              />
            </Item>

            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
              <Textarea
                defaultValue={this.state.description}
                onChangeText={(text) => this.setState({ description: text })}
                style={{ flex: 1, height: 140, textAlign: 'right' }}
                placeholder={"أكتب الوصف هنا"}
              />
            </Item>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <Text style={{ textAlign: 'right' }} >{"* ملحوظة: يجب أن يكون الوصف دقيق لكى يتم قبولة"}</Text>
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 22 }} >{"* ضع صورة رئيسية للأعلان"}</Text>
            </View>

            <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
              <TouchableOpacity
                onPress={() => this.primaryPhotoAdd()}
                activeOpacity={0.7}
                style={[styles.shadow, {
                  backgroundColor: '#E9E9E9',
                  width: 80, aspectRatio: 1,
                  borderRadius: 12, overflow: 'hidden'
                }
                ]}>
                {
                  this.state.primaryImage ?
                    <Image source={{ uri: this.state.primaryImage }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                    :
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} >
                      <FontAwesome name="picture-o" color={"#FFF"} size={56} />
                    </View>
                }
              </TouchableOpacity>
            </View>

            <View style={[styles.column, { width: width - (36 * 2), height: 260, justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: 16, borderWidth: 3, borderColor: '#003f43', borderRadius: 12, padding: 12 }]} >

              <View style={[styles.rowReversed, { width: '100%' }]} >
                <Text style={{ textAlign: 'right', fontSize: 18 }} >{"أضف صور"}</Text>
                <TouchableOpacity onPress={() => this.photosAdd()} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#003f43', marginHorizontal: 12, alignItems: 'center', justifyContent: 'center' }} >
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{"+"}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.rowReversed, { marginTop: 12, flexWrap: 'wrap' }]} >

                {
                  this.state.photo.map((item, index) => {
                    return (
                      <View key={index.toString()} style={[styles.shadow, { backgroundColor: '#E9E9E9', margin: 8, borderRadius: 8, width: 80, height: 60, overflow: 'hidden' }]}>
                        <Image source={{ uri: item }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                      </View>
                    )
                  })
                }

              </View>

            </View>

            <TouchableOpacity
              onPress={() => this.addService()}
              style={[styles.Button, styles.shadow]}
            >
              <Text style={styles.ButtonText}>{"أضف الأعلان"}</Text>
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
export default connect(mapStateToProps, {})(AddSevice)

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
})