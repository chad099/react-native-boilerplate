// @flow
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  View
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
      }
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.region}
            >
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
    alignItems: 'center'
  },
  map: {
     ...StyleSheet.absoluteFillObject,
  },
});

export default GoogleMapPlayground;
