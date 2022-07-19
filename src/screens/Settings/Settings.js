import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Animated
} from 'react-native';
import Lottie from 'lottie-react-native';

import OIcon from 'react-native-vector-icons/Octicons';
import SSIcon from 'react-native-vector-icons/SimpleLineIcons';

const Github = 'http://www.github.com/davidasix';
const Instagram = 'http://www.instagram.com/dave6dev';
const Website = 'http://www.dave6.com/'

const Row = ({ title, sub, slug, lottie, progress, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(slug)}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.rowText}>
          {title}
        </Text>
        <Text style={styles.rowSubText}>
          {sub}
        </Text>
      </View>
      <View style={styles.lottieContainer}>
        <Lottie
          progress={progress}
          style={{ width: '200%' }}
          source={lottie} />
      </View>
    </TouchableOpacity>
  ) };

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msm: new Animated.Value(1),
      ssm: new Animated.Value(0),
      btc: new Animated.Value(0),
      bluetooth: ''
    }
  }

  rowPressed(slug) {
    let animconf = { duration: 1100, useNativeDriver: false }
    console.log(`${slug} : ${!this.state[slug]._value}`);
    switch (slug) {
      case 'msm':
        Animated.timing(this.state.msm, { ...animconf, toValue: 1 }).start();
        Animated.timing(this.state.ssm, { ...animconf, toValue: 0 }).start();
        break;
      case 'ssm':
        Animated.timing(this.state.msm, { ...animconf, toValue: 0 }).start();
        Animated.timing(this.state.ssm, { ...animconf, toValue: 1 }).start();
        break;
      default:
    }
  }

  render() {
    return (
      <View
        style={styles.pageContainer}>

        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }} />
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>
              Settings
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }} />
        </View>

        <View style={{ flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

          <Row
            slug='msm'
            title='Multi-Select Mode'
            sub='Select lights additively, adding to the selection with each press. Press lights again to turn off.'
            lottie={require('../../assets/lottie/checkX2.json')}
            progress={this.state.msm}
            onPress={(slug) => this.rowPressed(slug)} />
          <Row
            slug='ssm'
            title='Single Select Mode'
            sub='Selecting a light will turn it on and turn off all other lights. This is how a StopLight normally acts. '
            lottie={require('../../assets/lottie/checkX2.json')}
            progress={this.state.ssm}
            onPress={(slug) => this.rowPressed(slug)} />
          <Row
            slug='btc'
            title='Bluetooth Connected'
            sub={this.state.bluetooth ? `Connected to ${'device'}` : 'Press to connect.'}
            lottie={require('../../assets/lottie/checkX2.json')}
            progress={this.state.ssm}
            onPress={(slug) => this.rowPressed(slug)} />

        </View>

        <View style={{ marginVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
            <SSIcon name='social-github' size={30} color='#fff' style={{ marginHorizontal: 15 }} onPress={() => Linking.openURL(Github) }/>
            <SSIcon name='screen-desktop' size={30} color='#fff' style={{ marginHorizontal: 15 }} onPress={() => Linking.openURL(Website) }/>
            <SSIcon name='social-instagram' size={30} color='#fff' style={{ marginHorizontal: 15 }} onPress={() => Linking.openURL(Instagram) }/>
          </View>
          <Text style={{ marginTop: 0, color: '#fff' }}>
            Created by Dave6 for Dave6.
          </Text>
        </View>

      </View>
    );
  }

}


const styles = {
  pageContainer: {
    backgroundColor: 'hsl(44, 5%, 60%)',
    flex: 1,
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    marginVertical: '10%',
    borderRadius: 20,
    opacity: 0.9
  },
  headerContainer: {
    width: '90%',
    padding: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#fff'
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textWrap: 'nowrap'
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    minHeight: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowText: {
    color: '#fff',
    fontSize: 20
  },
  rowSubText: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: 12
  },
  lottieContainer: {
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
};

export default Settings;
