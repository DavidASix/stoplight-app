import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
  PermissionsAndroid,
  FlatList,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import Lottie from 'lottie-react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import RNBluetoothClassic from 'react-native-bluetooth-classic';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SSIcon from 'react-native-vector-icons/SimpleLineIcons';

const Github = 'http://www.github.com/davidasix';
const Instagram = 'http://www.instagram.com/dave6dev';
const Website = 'http://www.dave6.com/';

const Row = props => {
  return (
    <TouchableOpacity style={styles.row} onPress={() => props.onPress()}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.rowText}>{props.title}</Text>
        <Text style={styles.rowSubText}>{props.sub}</Text>
      </View>
      <View style={styles.lottieContainer}>{props.children}</View>
    </TouchableOpacity>
  );
};

const Settings = () => {
  const [msm, setMsm] = useState(new Animated.Value(1));
  const [ssm, setSsm] = useState(new Animated.Value(0));
  const [btc, setBtc] = useState(new Animated.Value(0));
  const [scanning, setScanning] = useState(false);
  const [devices, setDevice] = useState([]);

  useEffect(() => {
    RNBluetoothClassic.onDeviceDiscovered(device => {
      setDevice(prevDevices => {
        let storedIDs = prevDevices.map(d => d.address);
        //console.log(storedIDs, storedIDs.includes(device.address), device.address);
        return storedIDs.includes(device.address)
          ? prevDevices
          : [...prevDevices, device];
      });
    });
  }, []);

  const lightMode = slug => {
    let animconf = {duration: 1100, useNativeDriver: false};
    console.log(`${slug} : ${![slug]._value}`);
    switch (slug) {
      case 'msm':
        Animated.timing(msm, {...animconf, toValue: 1}).start();
        Animated.timing(ssm, {...animconf, toValue: 0}).start();
        break;
      case 'ssm':
        Animated.timing(msm, {...animconf, toValue: 0}).start();
        Animated.timing(ssm, {...animconf, toValue: 1}).start();
        break;
      default:
    }
  };

  const bt = async () => {
    if (Platform.OS !== 'android' && Platform.Version < 23) {
      return console.log('Wrong Platform');
    }
    try {
      let permission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (!permission) {
        let askPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!askPermission) {
          throw 'No Permission';
        }
      }
      console.log('Permission Granted');
      setScanning(true);
      setDevice([]);
      await RNBluetoothClassic.startDiscovery();
      setScanning(false);
    } catch (e) {
      console.log(e);
    }
  };

  const renderDevice = props => {
    let item = props.item;
    let icon = '';
    console.log(item.extra.rssi > -70);
    if (item.extra.rssi > -70) {
      icon = 'signal-cellular-3';
    } else if (item.extra.rssi > -85) {
      icon = 'signal-cellular-2';
    } else if (item.extra.rssi > -95) {
      icon = 'signal-cellular-1';
    } else {
      icon = 'signal-cellular-outline';
    }

    return (
      <Row
        key={Math.random() * 1000}
        title={item.name}
        sub={`${item.address}, rssi: ${item.extra.rssi}`}
        onPress={() => lightMode('ssm')}>
        <MIcon name={icon} size={25} color="#FFF" />
      </Row>
    );
  };
  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={{flex: 1}} />
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
        />
      </View>

      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Row
          title="Multi-Select Mode"
          sub="Select lights additively, adding to the selection with each press. Press lights again to turn off."
          onPress={() => lightMode('msm')}>
          <Lottie
            progress={msm}
            style={{width: '200%'}}
            source={require('../../assets/lottie/checkX2.json')}
          />
        </Row>
        <Row
          title="Single Select Mode"
          sub="Selecting a light will turn it on and turn off all other lights. This is how a StopLight normally acts."
          onPress={() => lightMode('ssm')}>
          <Lottie
            progress={ssm}
            style={{width: '200%'}}
            source={require('../../assets/lottie/checkX2.json')}
          />
        </Row>
        <Row
          slug="btc"
          title={scanning ? 'Searching for devices' : 'Not Searching'}
          sub={scanning ? `Connected to ${'device'}` : 'Press to connect.'}
          onPress={() => bt()}>
          {scanning && <ActivityIndicator size="large" color="#FF5522" />}
        </Row>
        <FlatList
          style={styles.list}
          data={devices}
          renderItem={renderDevice}
          keyExtractor={() => Math.random() * 1000}
        />
      </View>

      <View
        style={{
          marginVertical: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <SSIcon
            name="social-github"
            size={30}
            color="#fff"
            style={{marginHorizontal: 15}}
            onPress={() => Linking.openURL(Github)}
          />
          <SSIcon
            name="screen-desktop"
            size={30}
            color="#fff"
            style={{marginHorizontal: 15}}
            onPress={() => Linking.openURL(Website)}
          />
          <SSIcon
            name="social-instagram"
            size={30}
            color="#fff"
            style={{marginHorizontal: 15}}
            onPress={() => Linking.openURL(Instagram)}
          />
        </View>
        <Text style={{marginTop: 0, color: '#fff'}}>
          Created by Dave6 for Dave6.
        </Text>
      </View>
    </View>
  );
};

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
    opacity: 0.9,
  },
  headerContainer: {
    width: '90%',
    padding: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textWrap: 'nowrap',
  },
  list: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
    flex: 1,
    width: '90%',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    minHeight: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    color: '#fff',
    fontSize: 20,
  },
  rowSubText: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: 12,
  },
  lottieContainer: {
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
};

export default Settings;
