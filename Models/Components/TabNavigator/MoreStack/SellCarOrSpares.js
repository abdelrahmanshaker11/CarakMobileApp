import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions, BackHandler, Image, SafeAreaView, Platform } from 'react-native';
import { Input, Item, Textarea } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import ModalDropDown from './../../../ModalDropDown'

class SellCarOrSpares extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      Processing: false,

      carTitle: '',
      carDescribtion: '',
      carStatus: null,
      carPrice: '',
      carAddress: '',
      carYear: "",
      carImagePrimary: null,
      carImages: [],

      spareTitle: '',
      spareDescribtion: '',
      sparePrice: '',
      spareAddress: '',
      spareImagePrimary: null,
      spareImages: [],
      spareYear: "",

      Cars: [],
      CarId: null,
      carModelId: null

    };
  }

  carStatus = [{ id: 1, title: "جديد" }, { id: 0, title: "مستعمل" }]

  componentDidMount() {
    const thisComponent = this
    thisComponent.setState({ Processing: true })
    try {
      axios.get("https://rocky-cliffs-25615.herokuapp.com/api/showCarModel")
        .then(response => {
          // console.log( response.data )
          thisComponent.setState({ Cars: response.data, Processing: false })
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

  ////////////////////////////////////////////////////////

  carPrimaryPhotoAdd() {
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
        this.uploadPhotocar(source)

        // this.setState({
        //     imgPath: source, renderSelectedImage: true
        // });

      }
    });

  }

  carPhotosAdd() {
    if (this.state.carImages.length < 6) {
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
          this.uploadPhotocararray(source)

          // this.setState({
          //     imgPath: source, renderSelectedImage: true
          // });

        }
      });
    } else {
      alert("الحد الأقصى 6 صور")
    }
  }

  uploadPhotocar = (imagePicked) =>
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
            carImagePrimary: response.data,
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

  uploadPhotocararray = (imagePicked) =>
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
          var arr = thisComponent.state.carImages
          arr.push(response.data)
          thisComponent.setState({
            carImages: arr,
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

  addCar() {
    const thisComponent = this
    const {
      carTitle, carDescribtion, carImagePrimary, carPrice,
      carAddress, carStatus, carImages, carYear, CarId, carModelId
    } = thisComponent.state
    if (carTitle != '') {
      if (CarId) {
        if (carModelId) {
          if (carDescribtion != '') {
            if (carStatus) {
              if (carPrice != '') {
                if (carAddress != '') {
                  if (carYear != '' && carYear.length == 4) {
                    if (carImagePrimary) {
                      if (carImages.length >= 2) {
                        const photo = [...carImages]
                        photo.unshift(carImagePrimary)
                        console.log(carTitle, CarId.id, carModelId, carDescribtion, carStatus.id, carPrice, carAddress, carYear, photo)
                        thisComponent.setState({ Processing: true })
                        try {
                          axios.post('https://rocky-cliffs-25615.herokuapp.com/api/addCarForSell',
                            {
                              title: carTitle,
                              description: carDescribtion,
                              photo: JSON.stringify(photo),
                              price: carPrice,
                              address: carAddress,
                              year: carYear,
                              car_status: carStatus.id,
                              car_id: CarId.id,
                              car_model_id: carModelId
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
                    alert("من فضلك أكتب سنة موديل صحيحة")
                  }
                } else {
                  alert("من فضلك أكتب العنوان")
                }
              } else {
                alert("من فضلك أكتب سعر السيارة ")
              }
            } else {
              alert("من فضلك أختر حالة السيارة ")
            }
          } else {
            alert("من فضلك أضف تفاصيل الأعلان")
          }
        } else {
          alert("من فضلك أختر موديل السيارة ")
        }
      } else {
        alert("من فضلك أختر نوع السيارة ")
      }
    } else {
      alert("من فضلك أضف عنوان الأعلان")
    }
  }

  ////////////////////////////////////////////////////////

  sparePrimaryPhotoAdd() {
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
        this.uploadPhotospare(source)

        // this.setState({
        //     imgPath: source, renderSelectedImage: true
        // });

      }
    });

  }

  sparePhotosAdd() {
    if (this.state.spareImages.length < 6) {
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
          this.uploadPhotosparearray(source)

          // this.setState({
          //     imgPath: source, renderSelectedImage: true
          // });

        }
      });
    } else {
      alert("الحد الأقصى 6 صور")
    }
  }

  uploadPhotospare = (imagePicked) =>
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
            spareImagePrimary: response.data,
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

  uploadPhotosparearray = (imagePicked) =>
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
          var arr = thisComponent.state.spareImages
          arr.push(response.data)
          thisComponent.setState({
            spareImages: arr,
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

  addSpare() {
    const thisComponent = this
    const {
      spareTitle, spareDescribtion, spareImagePrimary, sparePrice,
      spareAddress, spareImages, spareYear, CarId, carModelId
    } = thisComponent.state
    if (spareTitle != '') {
      if (CarId) {
        if (carModelId) {
          if (spareDescribtion != '') {
            // if (carStatus) {
            if (sparePrice != '') {
              if (spareAddress != '') {
                if (spareYear != '' && spareYear.length == 4) {
                  if (spareImagePrimary) {
                    if (spareImages.length >= 2) {

                      const photo = [...spareImages]
                      photo.unshift(spareImagePrimary)
                      console.log(spareTitle, CarId.id, carModelId, spareDescribtion, sparePrice, spareAddress, spareYear, photo)
                      thisComponent.setState({ Processing: true })
                      try {
                        axios.post('https://rocky-cliffs-25615.herokuapp.com/api/addSparePart',
                          {
                            title: spareTitle,
                            description: spareDescribtion,
                            photo: JSON.stringify(photo),
                            price: sparePrice,
                            address: spareAddress,
                            year: spareYear,
                            // car_status: carStatus.id,
                            car_id: CarId.id,
                            car_model_id: carModelId
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
                  alert("من فضلك أكتب سنة موديل صحيحة")
                }
              } else {
                alert("من فضلك أكتب العنوان")
              }
            } else {
              alert("من فضلك أكتب سعر القطعة ")
            }
            // } else {
            //   alert("من فضلك أختر حالة السيارة ")
            // }
          } else {
            alert("من فضلك أضف تفاصيل الأعلان")
          }
        } else {
          alert("من فضلك أختر موديل السيارة ")
        }
      } else {
        alert("من فضلك أختر نوع السيارة ")
      }
    } else {
      alert("من فضلك أضف عنوان الأعلان")
    }
  }

  ////////////////////////////////////////////////////////

  renderHeader() {
    return (
      <View style={[styles.flex, styles.row, styles.shadow, { width: width, height: 65, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#003f43', zIndex: 1 }]} >
        <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
          <Entypo name={"chevron-left"} style={{ color: '#FFF', fontSize: 22 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#FFF' }} >{"بيع سيارة أو قطع غيار"}</Text>
        <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

        </View>
      </View>
    )
  }

  renderTabs() {
    return (
      <View style={[styles.row, { width, height: 80, backgroundColor: '#FFF', justifyContent: 'space-evenly', alignItems: 'center' }]} >
        <View style={[styles.row, { width: width - (36 * 2), height: "100%", justifyContent: 'space-between', alignItems: 'center' }]} >
          <TouchableOpacity onPress={() => this.setState({ tab: 1 })} style={[styles.shadow, this.state.tab == 1 ? { backgroundColor: '#eacf43' } : { backgroundColor: '#003f43' }, { height: 40, width: '48%', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }]} >
            <Text style={[this.state.tab == 1 ? { color: '#003f43' } : { color: '#fff' }, { fontWeight: 'bold' }]} >{"سيارة"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ tab: 2 })} style={[styles.shadow, this.state.tab == 2 ? { backgroundColor: '#eacf43' } : { backgroundColor: '#003f43' }, { height: 40, width: '48%', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }]} >
            <Text style={[this.state.tab == 2 ? { color: '#003f43' } : { color: '#fff' }, { fontWeight: 'bold' }]} >{"قطعه غيار"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSellCar() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32, alignItems: 'center' }} >

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'center', alignItems: 'center' }]} >
          <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
          <Text style={{ fontWeight: 'bold', marginHorizontal: 12 }} >{"بيع سيارة"}</Text>
          <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
        </View>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'عنوان الأعلان'}
            style={{ color: '#000' }}
            textAlign={'center'}
            defaultValue={this.state.carTitle}
            onChangeText={(text) => this.setState({ carTitle: text })}
          />
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12, height: 60, }]}>
          <View style={[styles.row, { flex: 1, justifyContent: 'center' }]} >
            <ModalDropDown
              // Data => Array
              data={this.state.Cars}
              // Default Value => Before Selection
              bottonDefaultValue={"نوع السيارة"}
              // Selection Process
              onSelect={(item, index) => {
                this.setState({ CarId: item, carModelId: null })
                if (this.refs.model) {
                  this.refs.model.reset();
                }
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
                  <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                    <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }]}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </Item>
        {
          this.state.CarId ?
            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12, height: 60, }]}>
              <View style={[styles.row, { flex: 1, justifyContent: 'center' }]} >
                <ModalDropDown
                  ref="model"
                  // Data => Array
                  data={this.state.CarId.car_models}
                  // Default Value => Before Selection
                  bottonDefaultValue={"موديل السيارة"}
                  // Selection Process
                  onSelect={(item, index) => {
                    this.setState({ carModelId: item.id })
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
                      <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                        <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }]}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            </Item>
            :
            <View></View>
        }

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Textarea
            defaultValue={this.state.carDescribtion}
            onChangeText={(text) => this.setState({ carDescribtion: text })}
            style={{ flex: 1, height: 140, textAlign: 'right' }}
            placeholder={"أكتب الوصف هنا"}
          />
        </Item>

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
          <Text style={{ textAlign: 'right' }} >{"* ملحوظة: يجب أن يكون الوصف دقيق و يصف حالة السيارة لكى يتم قبولة"}</Text>
        </View>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12, height: 60, }]}>
          <View style={[styles.row, { flex: 1, justifyContent: 'center' }]} >
            <ModalDropDown
              // Data => Array
              data={this.carStatus}
              // Default Value => Before Selection
              bottonDefaultValue={"حالة السيارة"}
              // Selection Process
              onSelect={(item, index) => {
                this.setState({ carStatus: item })
              }}
              // Value After Selection
              renderButtonText={(rowData) => (
                rowData.title
              )}
              // Styling
              bottonStyle={{
                width: '100%', height: 60, backgroundColor: '#FFF',
              }}
              bottonTextStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
              dropDownHeight={160}
              renderRow={function (item, index) {
                return (
                  <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                    <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }]}>
                      {item.title}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'أكتب السعر'}
            defaultValue={this.state.carPrice}
            style={{ color: '#000' }}
            keyboardType={"numeric"}
            textAlign={'center'}
            onChangeText={(text) => this.setState({ carPrice: text })}
          />
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'أكتب العنوان'}
            defaultValue={this.state.carAddress}
            style={{ color: '#000' }}
            // keyboardType={"numeric"}
            textAlign={'center'}
            onChangeText={(text) => this.setState({ carAddress: text })}
          />
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'سنة الموديل'}
            defaultValue={this.state.carYear}
            style={{ color: '#000' }}
            keyboardType={"numeric"}
            textAlign={'center'}
            onChangeText={(text) => this.setState({ carYear: text })}
          />
        </Item>

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
          <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 22 }} >{"* ضع صورة رئيسية للأعلان"}</Text>
        </View>

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
          <TouchableOpacity
            onPress={() => this.carPrimaryPhotoAdd()}
            activeOpacity={0.7}
            style={[styles.shadow, {
              backgroundColor: '#E9E9E9',
              width: 80, aspectRatio: 1,
              borderRadius: 12, overflow: 'hidden'
            }
            ]}>
            {
              this.state.carImagePrimary ?
                <Image source={{ uri: this.state.carImagePrimary }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
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
            <TouchableOpacity onPress={() => this.carPhotosAdd()} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#003f43', marginHorizontal: 12, alignItems: 'center', justifyContent: 'center' }} >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{"+"}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.rowReversed, { marginTop: 12, flexWrap: 'wrap' }]} >

            {
              this.state.carImages.map((item, index) => {
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
          onPress={() => this.addCar()}
          style={[styles.Button, styles.shadow]}
        >
          <Text style={styles.ButtonText}>{"أضف الأعلان"}</Text>
        </TouchableOpacity>

      </ScrollView>
    )
  }

  renderSellSparePart() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32, alignItems: 'center' }} >

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'center', alignItems: 'center' }]} >
          <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
          <Text style={{ fontWeight: 'bold', marginHorizontal: 12 }} >{"بيع قطعة غيار"}</Text>
          <View style={{ flex: 1, height: 2, backgroundColor: '#000' }} ></View>
        </View>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'عنوان الأعلان'}
            style={{ color: '#000' }}
            textAlign={'center'}
            defaultValue={this.state.spareTitle}
            onChangeText={(text) => this.setState({ spareTitle: text })}
          />
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12, height: 60, }]}>
          {/* <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} /> */}
          <View style={[styles.row, { flex: 1, justifyContent: 'center' }]} >
            <ModalDropDown
              // Data => Array
              data={this.state.Cars}
              // Default Value => Before Selection
              bottonDefaultValue={"نوع السيارة"}
              // Selection Process
              onSelect={(item, index) => {
                this.setState({ CarId: item, carModelId: null })
                if (this.refs.model) {
                  this.refs.model.reset();
                }
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
                  <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                    <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }]}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          {/* <View style={{ width: 14, height: 14, marginHorizontal: 8 }} ></View> */}
        </Item>

        {
          this.state.CarId ?
            <Item style={[styles.inputFields, styles.shadow, { marginTop: 12, height: 60, }]}>
              <View style={[styles.row, { flex: 1, justifyContent: 'center' }]} >
                <ModalDropDown
                  ref="model"
                  // Data => Array
                  data={this.state.CarId.car_models}
                  // Default Value => Before Selection
                  bottonDefaultValue={"موديل السيارة"}
                  // Selection Process
                  onSelect={(item, index) => {
                    this.setState({ carModelId: item.id })
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
                      <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                        <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }]}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            </Item>
            :
            <View></View>
        }

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Textarea
            defaultValue={this.state.spareDescribtion}
            onChangeText={(text) => this.setState({ spareDescribtion: text })}
            style={{ flex: 1, height: 140, textAlign: 'right' }}
            placeholder={"أكتب الوصف هنا"}
          />
        </Item>

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
          <Text style={{ textAlign: 'right' }} >{"* ملحوظة: يجب أن يكون الوصف دقيق لكى يتم قبولة"}</Text>
        </View>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'السعر'}
            style={{ color: '#000' }}
            keyboardType={"numeric"}
            defaultValue={this.state.sparePrice}
            textAlign={'center'}
            onChangeText={(text) => this.setState({ sparePrice: text })}
          />
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'أكتب العنوان'}
            defaultValue={this.state.spareAddress}
            style={{ color: '#000' }}
            // keyboardType={"numeric"}
            textAlign={'center'}
            onChangeText={(text) => this.setState({ spareAddress: text })}
          />
        </Item>

        <Item style={[styles.inputFields, styles.shadow, { marginTop: 12 }]}>
          <Input
            placeholder={'سنة الموديل'}
            defaultValue={this.state.spareYear}
            style={{ color: '#000' }}
            keyboardType={"numeric"}
            textAlign={'center'}
            onChangeText={(text) => this.setState({ spareYear: text })}
          />
        </Item>

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
          <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 22 }} >{"* ضع صورة رئيسية للأعلان"}</Text>
        </View>

        <View style={[styles.row, { width: width - (36 * 2), justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }]} >
          <TouchableOpacity
            onPress={() => this.sparePrimaryPhotoAdd()}
            activeOpacity={0.7}
            style={[styles.shadow, {
              backgroundColor: '#E9E9E9',
              width: 80, aspectRatio: 1,
              borderRadius: 12, overflow: 'hidden'
            }
            ]}>
            {
              this.state.spareImagePrimary ?
                <Image source={{ uri: this.state.spareImagePrimary }} resizeMethod="resize" style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
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
            <TouchableOpacity onPress={() => this.sparePhotosAdd()} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#003f43', marginHorizontal: 12, alignItems: 'center', justifyContent: 'center' }} >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{"+"}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.rowReversed, { marginTop: 12, flexWrap: 'wrap' }]} >

            {
              this.state.spareImages.map((item, index) => {
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
          onPress={() => this.addSpare()}
          style={[styles.Button, styles.shadow]}
        >
          <Text style={styles.ButtonText}>{"أضف الأعلان"}</Text>
        </TouchableOpacity>

      </ScrollView>
    )
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#003f43' }} >
        <StatusBar backgroundColor='#003f43' barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#FFF', width }} >
          {this.renderHeader()}
          {this.renderTabs()}
          <Spinner
            visible={this.state.Processing}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
          {
            this.state.tab == 1 ?
              this.renderSellCar() : this.renderSellSparePart()
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
export default connect(mapStateToProps, {})(SellCarOrSpares)

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