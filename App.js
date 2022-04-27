import React from 'react';
import { FlatList, Image as RNimage, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import { facelist, eyeslist, faciallist, hairlist } from './src/images/templates/templatelist';

var canvasContainer = undefined

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      assetsList: [],
      activeProperty: {
        face: facelist[0],
        eye: undefined,
        hair: undefined,
        beard: undefined
      }
    }
  }

  componentDidMount() {
    this.getList()
    this.getAccessoriesList('face')
  }

  getList = () => {
    const li = [
      { key: "face", imgLink: require('./src/images/ic_face.png') },
      { key: "eye", imgLink: require('./src/images/ic_eye.png') },
      { key: "hair", imgLink: require('./src/images/ic_hair.png') },
      { key: "beard", imgLink: require('./src/images/ic_beard.png') },
    ]

    this.setState({
      list: li
    })
  }

  getAccessoriesList = (type) => {
    switch (type) {
      case 'face':
        this.setState({
          assetsList: facelist
        })
        break;
      case 'eye':
        this.setState({
          assetsList: eyeslist
        })
        break;
      case 'beard':
        this.setState({
          assetsList: faciallist
        })
        break;
      case 'hair':
        this.setState({
          assetsList: hairlist
        })
        break;

      default:
        this.setState({
          assetsList: facelist
        })
        break;
    }
  }

  handleCanvas = (canvas) => {
    if (!(canvas instanceof Canvas)) {
      return;
    }
    canvas.width = 400;
    canvas.height = 400;
    canvasContainer = canvas
    this.updateCanvas()
  }

  updateCanvas = () => {
    if (!(canvasContainer instanceof Canvas)) {
      return;
    }
    const context = canvasContainer.getContext('2d');

    context.clearRect(0, 0, canvasContainer.width, canvasContainer.height);

    if (this.state.activeProperty) {
      if (this.state.activeProperty.face) {
        this.drawImageOnCanvas(canvasContainer, this.state.activeProperty.face.image)
      }

      if (this.state.activeProperty.eye) {
        this.drawImageOnCanvas(canvasContainer, this.state.activeProperty.eye.image)
      }

      if (this.state.activeProperty.hair) {
        this.drawImageOnCanvas(canvasContainer, this.state.activeProperty.hair.image)
      }

      if (this.state.activeProperty.beard) {
        this.drawImageOnCanvas(canvasContainer, this.state.activeProperty.beard.image)
      }
    }
  }

  drawImageOnCanvas = (canvas, imageSource) => {
    const image = new CanvasImage(canvas, 400, 400);
    const imageUri = RNimage.resolveAssetSource(imageSource).uri;
    image.src = imageUri
    const context = canvas.getContext('2d');

    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0)
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
        {
          this.state.activeProperty && (
            <Canvas ref={this.handleCanvas} />
          )
        }
        <View style={{
          height: 50,
          marginTop: 10,
          shadowColor: "#000",
          backgroundColor: 'white',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          width: '100%',
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <FlatList
            data={this.state.list}
            horizontal
            contentContainerStyle={{
              flex: 1,
              alignItems: 'center'
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                this.getAccessoriesList(item.key)
              }}>
                <RNimage source={item.imgLink} style={{ height: 40, width: 40, padding: 8, marginHorizontal: 10 }} />
              </TouchableOpacity>
            )}
          />
        </View>
        <FlatList
          data={this.state.assetsList}
          numColumns={4}
          contentContainerStyle={{
          }}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              var activeProperty = this.state.activeProperty
              switch (item.key) {
                case 'face':
                  activeProperty.face = item
                  break;
                case 'hair':
                  activeProperty.hair = item
                  break;
                case 'beard':
                  activeProperty.beard = item
                  break;
                case 'eye':
                  activeProperty.eye = item
                  break;
                default:
                  activeProperty = activeProperty
                  break;
              }
              this.setState({
                activeProperty: activeProperty
              }, () => {
                this.updateCanvas()
              })
            }}>
              <RNimage source={item.image} style={{ height: 100, width: 100, padding: 8 }} />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }
};
