import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card, ListItem, Button, Image } from 'react-native-elements'

export default class ContactScreen extends React.Component {
  static navigationOptions = {
    title: 'Contact',
  };

  render() {
    const {state} = this.props.navigation;
    let contact = state.params ? state.params.contact : ''
    return(
      <View>
            <Card
                title={contact.familyname}
                image={{uri:contact.imageUrl, resizeMode: 'cover'}}>             
            </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    image: {
      height: 24,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
});
  