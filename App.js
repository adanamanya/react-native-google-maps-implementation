/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import RNGooglePlaces from 'react-native-google-places';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {Item, Input, Container, Icon, Button, Header, Body, Title, Right} from 'native-base';
import MapView, { MAP_TYPES, 
  PROVIDER_GOOGLE, PROVIDER_DEFAULT,
  ProviderPropType, UrlTile, Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
import FlipCard from 'react-native-flip-card';
import QRCode from 'react-native-qrcode-svg';
const { width, height } = Dimensions.get('window');
let id = 0;
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: [],
      a:{
        latitude: -7.582556,
        longitude: 	108.754219,
      },
      region: {
        latitude: -7.582556,
        longitude: 	108.754219,
        latitudeDelta: 50,
        longitudeDelta:  50 * ASPECT_RATIO,
        name: 'jakarta',
        url:'https://www.google.com/maps/search/?api=1&query=jakarta'
      },
      markers: [],
      lat: -7.582556,
      lng: 108.754219
    };
  }

  handleGetDirections = () => {
    const data = {
       source: {
        latitude: this.state.lat,
        longitude: this.state.lng
      },
      destination: {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude
      },
      params: [
        {
          key: "dirflg",
          value: "w"
        }
      ]
    }
    getDirections(data)
  }
 

  getCoordinates() {
    this.watchId = navigator.geolocation.getCurrentPosition(
     (position) => {
       this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude
       })
     console.log('gettin my location')
     console.log(this.state.lat)
     },
     (error) => console.error('Error: ', error),
     { enableHighAccuracy: true, timeout: 100000, maximumAge: 100000 }
    );
   }

  openSearchModal() {
    let data = ''
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
    console.log('then')
    console.log(place)
    console.log(place.longitude)
    const lgdlt = parseInt(place.north) - parseInt(place.south)
    this.setState({
      a: {
        longitude: place.longitude,
        latitude: place.latitude
      },
      region:{
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.019,
        longitudeDelta: 0.019 * ASPECT_RATIO,
        name: place.name,
        url:  'https://www.google.com/maps/search/?api=1&query=' +place.name.split(' ').join('+')
        },
        toolbar: true
    })  
    this.getCoordinates();
    console.log(this.state.region.name)
    console.log(this.state.region.url)
		// place represents user's selection from the
		// suggestions and it is a simplified Google Place object.
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

 
  render() {
    return (
      <Container>
      <Header hasTabs style={{ backgroundColor: '#00BCD4'}} iosStatusbar="light-content"
      androidStatusBarColor='#2196F3'>
          <Button transparent onPress={this.handleGetDirections}>
               <Icon name="ios-map"/>
               <Title>Click Me to Open in GMaps!!</Title>
          </Button>
              
                  
               
          <Right />
      </Header>
       <View style={styles.container}>
        <Item rounded style={{width: 200, height: 50, backgroundColor: "#ffff"}}>
        <Icon name="ios-search-outline" resizeMode='contain' />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.openSearchModal()}
        >
          
          <Text style={{marginLeft: 10}}>Search Place ...</Text>
          
        </TouchableOpacity>
        </Item>
        
        <View style={{alignSelf:"flex-end", marginRight: 40, marginTop: 10}}>
            <Text style={{marginLeft: 20, fontSize: 17, marginTop: 20}}>Flip / Tap the maps to get QR Code</Text>
        </View>
        <View style={{flex:1, height: height*0.65}}>
        <FlipCard
        style={{marginTop: 40, flex:1, marginBottom: height* 0.04, borderWidth: 0.5,
        borderColor: '#d6d7da',}}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={false}
        clickable={true}>
        <View style={{height: height * 0.65}}>
        <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        toolbarEnabled={this.state.toolbar}
        region={{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta,
        }}>
              <Marker
                identifier="Marker1"
                coordinate={this.state.a}
               />
        </MapView>
        </View>
        <View style={{height: height * 0.55, width:width*0.89, marginLeft: width* 0.30,justifyContent:"center"}}>
        <QRCode 
        size={250}
        style={{height: height*0.65}}
        value={this.state.region.url}
        />
        <Text>{this.state.region.name}</Text>
        </View>
        </FlipCard>
        </View>
      </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:30,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    width: width* 0.95,
    height: height,
    marginBottom: 30
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
