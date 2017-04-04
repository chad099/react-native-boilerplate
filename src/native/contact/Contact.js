import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Contacts from 'react-native-contacts';

export default class Contact extends Component {
  componentDidMount() {
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        // x.x
      } else {
        alert(JSON.stringify(contacts));
      }
    })
  }
  render() {
    return (
      <View>
        <Text>I am contact page.</Text>
      </View>
    );
  }
}
