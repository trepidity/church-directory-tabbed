import React from 'react';
import { graphql } from 'react-apollo'; // 2.0.4
import { Constants } from 'expo';
import gql from 'graphql-tag'; // 2.6.1
import "apollo-client"; // 2.2.0
import { ScrollView, StyleSheet } from 'react-native';
import { List, ListItem, Card } from 'react-native-elements'; // 0.18.5
import { ExpoLinksView } from '@expo/samples';

const allContactsQuery = gql`
  query {
    allContacts(orderBy: familyname_ASC) {
      id
      name
      familyname
      imageUrl
      description
    }
  }
`;

class MembersScreen extends React.Component {
  static navigationOptions = {
    title: 'Members',
  };

  render() {
    const { navigate } = this.props.navigation;
    let contacts = [];
    if (this.props.data.allContacts) {
      contacts = this.props.data.allContacts;
    }
    return (
       <Card containerStyle={{padding: 0}} >
          <List>
            {contacts.map((contact, i) => (
              <ListItem
                key={i}
                roundAvatar
                avatar={{uri:contact.imageUrl}}
                title={contact.familyname}
                onPress={() => navigate('Contact', { contact: contact })}
              />
            ))}
          </List>
      </Card>
    );
  }
}

export default graphql(allContactsQuery)(MembersScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
