// @flow
import React, { Component } from 'react';
import Axios from 'axios';
import Polyline from '@mapbox/polyline';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

class GoogleMapPlayground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 30.7333,
        longitude: 76.7794,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      marker: {
          latitude: 30.7333,
          longitude: 76.7794
      },
      destination: '',
      polylineCoords: []
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        var r = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        };
        this.setState({region: r});
        var latlng = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.setState({marker: latlng});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      //alert(lastPosition);
    //  this.setState({lastPosition});
    });
  }

  _createRouteCoordinates = (response) => {
    if (response.data.status !== 'OK') {
      return [];
    }
    let points = response.data.routes[0].overview_polyline.points;
    let steps = Polyline.decode(points);
    let polylineCoords = [];

    for (let i=0; i < steps.length; i++) {
      let tempLocation = {
        latitude : steps[i][0],
        longitude : steps[i][1]
      }
      polylineCoords.push(tempLocation);
    }

    return polylineCoords;
  }

  onButtonPress = () => {
    let destination = encodeURI(this.state.destination);
    let currentLocation = encodeURI(this.state.region.latitude +','+ this.state.region.longitude);
    let url = 'maps.googleapis.com/maps/api/directions/json?mode=walking&origin='+currentLocation+'&destination='+destination+'&key=AIzaSyDNc-NcD-74uND4WxOX3ofjp-OO8be44Cg';
    Axios.get('https://' + url)
      .then((response) => {
        let polylineCoords = this._createRouteCoordinates(response);
        this.setState({ polylineCoords: polylineCoords })
      })
      .catch((error) => {
        alert(error);
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.search}>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(destination) => this.setState({destination: destination})}
             defaultValue={this.state.destination}
           />
        </View>

        <View style={styles.searchButton}>
        <Button
           onPress={this.onButtonPress}
           title="Show direction"
           accessibilityLabel="See an informative alert"
         />
        </View>

        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.region}
            >
            {
                this.state.polylineCoords && <MapView.Polyline
                  coordinates={this.state.polylineCoords}
                  strokeWidth={2}
                  strokeColor="red"
                />
            }
            <MapView.Marker
              coordinate={this.state.marker}
            />
          </MapView>
        </View>
      </View>
    );
  }
}

GoogleMapPlayground.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    top:100,
    alignItems: 'center'
  },
  map: {
     ...StyleSheet.absoluteFillObject,
  },
  search: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#009688',
  },
  searchButton: {
    ...StyleSheet.absoluteFillObject,
    top:50
  }
});

export default GoogleMapPlayground;
