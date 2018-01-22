import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

const FB_APP_ID = '1595686217152578';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    result: null,
  };

  _signInFacebook = () => {
    return new Promise(function (resolve, reject) {
    let accessToken = '';
      Expo.Facebook.logInWithReadPermissionsAsync(FB_APP_ID, {
      permissions: ['public_profile', 'email', 'user_birthday'],
    })
      .then((response) => {
        switch (response.type) {
          case 'success':
            // token is a string giving the access token to use
            // with Facebook HTTP API requests.
            return response.token;
         case 'cancel':
           reject({
             type: 'error',
             msg: 'login canceled'
            })
           break;
         default:
           reject({
             type: 'error',
             msg: 'login failed'
           })
        }
      }).then((token) => {
        accessToken = token;
        return fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large),birthday&access_token=${token}`);
      }).then((response) => {
        console.log("DEBUG Response " + JSON.stringify(response));
         return response.json();
      }).then((facebookJSONResponse) => {
        console.log("DEBUG Then " + JSON.stringify(facebookJSONResponse));
        if (facebookJSONResponse.hasOwnProperty('error')) {
          reject({
            type: 'error',
          });
        } resolve({
          type: 'success',
          credentials: Object.assign({}, facebookJSONResponse, { accessToken })
        });
      }).catch(function (error) {
        console.log("DEBUG Error " + JSON.stringify(error));
        reject({
          type: 'error',
          msg: 'Facebook login failed'
        })
      });
     });
    }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {!this.state.result ? (
                <Button title="Login with Facebook" onPress={async () => {
                  const result = await this._signInFacebook();
                  console.log("result " + JSON.stringify(result));
                  this.setState({ result })
                  console.log("state " + JSON.stringify(this.state.result.credentials.id));
                  this._renderUserInfo()
                }} />
              ) : (
                this._renderUserInfo()
              )}
            </View>              

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn't automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  _renderUserInfo = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: this.state.result.credentials.picture.data.url }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 20 }}>{this.state.result.credentials.name}</Text>
        <Text>ID: {this.state.result.credentials.id}</Text>
      </View>
    );
  };  

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
