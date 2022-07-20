import React, { useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Animated,
  Platform,
  PermissionsAndroid,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Lottie from 'lottie-react-native';

import RNBluetoothClassic from 'react-native-bluetooth-classic';

import OIcon from 'react-native-vector-icons/Octicons';
import SSIcon from 'react-native-vector-icons/SimpleLineIcons';

const Github = 'http://www.github.com/davidasix';
const Instagram = 'http://www.instagram.com/dave6dev';
const Website = 'http://www.dave6.com/'

const Row = (props) => {
  return (
    <TouchableOpacity style={styles.row} onPress={() => props.onPress()}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.rowText}>
          {props.title}
        </Text>
        <Text style={styles.rowSubText}>
          {props.sub}
        </Text>
      </View>
      <View style={styles.lottieContainer}>
        {props.children}
      </View>
    </TouchableOpacity>
  ) };

const Settings = () => {
  const [msm, setMsm ] = useState(new Animated.Value(1));
  const [ssm, setSsm ] = useState(new Animated.Value(0));
  const [btc, setBtc ] = useState(new Animated.Value(0));
  const [scanning, setScanning ] = useState(false);

  useEffect(() => {
    RNBluetoothClassic.onDeviceDiscovered((device) => {
      console.log(device);
    });
  }, []);

  const lightMode = (slug) => {
    let animconf = { duration: 1100, useNativeDriver: false }
    console.log(`${slug} : ${![slug]._value}`);
    switch (slug) {
      case 'msm':
        Animated.timing(msm, { ...animconf, toValue: 1 }).start();
        Animated.timing(ssm, { ...animconf, toValue: 0 }).start();
        break;
      case 'ssm':
        Animated.timing(msm, { ...animconf, toValue: 0 }).start();
        Animated.timing(ssm, { ...animconf, toValue: 1 }).start();
        break;
      default:
    }
  }

  const bt = async () => {
    if (Platform.OS !== 'android' && Platform.Version < 23) console.log('Wrong Platform');
    try {
      let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!permission) {
        let askPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (!askPermission) throw 'No Permission';
      }
      console.log('Permission Granted');
      setScanning(true);
      let devices = await RNBluetoothClassic.startDiscovery();
      devices = devices.map((d) => d.name);
      console.log({ devices });
      setScanning(false);
    } catch (e) {
      console.log(e);
    }
  }

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
            title='Multi-Select Mode'
            sub='Select lights additively, adding to the selection with each press. Press lights again to turn off.'
            onPress={() => lightMode('msm')}>
            <Lottie
              progress={msm}
              style={{ width: '200%' }}
              source={require('../../assets/lottie/checkX2.json')} />
          </Row>
          <Row
            title='Single Select Mode'
            sub='Selecting a light will turn it on and turn off all other lights. This is how a StopLight normally acts.'
            onPress={() => lightMode('ssm')}>
            <Lottie
              progress={ssm}
              style={{ width: '200%' }}
              source={require('../../assets/lottie/checkX2.json')} />
          </Row>
          <Row
            slug='btc'
            title={scanning ? `Searching for devices` : 'Not Searching'}
            sub={scanning ? `Connected to ${'device'}` : 'Press to connect.'}
            onPress={() => bt()}>
            {scanning && <ActivityIndicator size='large' color='#FF5522' />}
          </Row>

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
