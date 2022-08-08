import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
  PermissionsAndroid,
  SectionList,
  ActivityIndicator,
  NativeEventEmitter,
  NativeModules,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
  const [scanning, setScanning] = useState(false);
  const [scannedDevices, setScannedDevice] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);

  useEffect(() => {
    const bleSetup = async () => {
      await BleManager.start({showAlert: true});
      let connected = await BleManager.getConnectedPeripherals([]);
      setConnectedDevices(connected);
    };
    bleSetup();
    const discoveryHandler = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscovery,
    );
    const scanStopHandler = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );
    const connectHandler = bleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      handleConnect,
    );
    const disconnectHandler = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnect,
    );
    const setAsyncStates = async () => {
      try {
        let lampMode = await AsyncStorage.getItem('@lampMode');
        if (!lampMode) {
          lampMode = 'msm';
        }
        setMsm(new Animated.Value((lampMode === 'msm') * 1));
        setSsm(new Animated.Value((lampMode === 'ssm') * 1));
      } catch (e) {
        ToastAndroid.show(e, ToastAndroid.SHORT);
      }
    };
    setAsyncStates();
    return () => {
      discoveryHandler.remove();
      scanStopHandler.remove();
      connectHandler.remove();
      disconnectHandler.remove();
    };
    /*
      this.handlerUpdate = this.bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
      this.bleUpdateState = this.bleManagerEmitter.addListener('BleManagerDidUpdateState', this.bleUpdateStateBt );*/
  }, []);

  const handleDiscovery = device => {
    setScannedDevice(prevDevices => {
      let storedIDs = prevDevices.map(d => d.id);
      return !storedIDs.includes(device.id) && !!device.name
        ? [...prevDevices, device]
        : prevDevices;
    });
  };

  const handleStopScan = () => {
    setScanning(false);
  };

  const handleConnect = async device => {
    ToastAndroid.show('Connection Successful', ToastAndroid.SHORT);
    await BleManager.stopScan();
    let connected = await BleManager.getConnectedPeripherals([]);
    setConnectedDevices(connected);
    setScannedDevice(prevDevices =>
      prevDevices.filter(d => d.id !== device.peripheral),
    );
  };

  const handleDisconnect = async device => {
    let connected = await BleManager.getConnectedPeripherals([]);
    setConnectedDevices(connected);
  };

  const onPressLampMode = slug => {
    return new Promise(async (resolve, reject) => {
      let animconf = {duration: 1100, useNativeDriver: false};
      try {
        await AsyncStorage.setItem('@lampMode', slug);
        switch (slug) {
          case 'msm':
            // Multi Select Mode
            Animated.timing(msm, {...animconf, toValue: 1}).start();
            Animated.timing(ssm, {...animconf, toValue: 0}).start();
            break;
          case 'ssm':
            // Single Select Mode
            Animated.timing(msm, {...animconf, toValue: 0}).start();
            Animated.timing(ssm, {...animconf, toValue: 1}).start();
            break;
          default:
        }
        resolve('Set');
      } catch (e) {
        reject('e');
      }
    });
  };

  const startScan = async () => {
    if (Platform.OS !== 'android' && Platform.Version < 23) {
      return ToastAndroid.show('Wrong platform', ToastAndroid.SHORT);
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
      setScanning(true);
      let connected = await BleManager.getConnectedPeripherals([]);
      setConnectedDevices(connected);
      setScannedDevice([]);
      await BleManager.scan([], 5, true);
      // Start Discovery
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    }
  };

  const onPressDevice = async device => {
    try {
      await BleManager.connect(device.id);
    } catch (e) {
      ToastAndroid.show('Error connecting to device.', ToastAndroid.SHORT);
    }
  };

  const renderDevice = props => {
    let item = props.item;
    let icon = '';
    let rssi = item.extra?.rssi || item.rssi;
    rssi = rssi || 'Get Closer';
    if (rssi > -70) {
      icon = 'signal-cellular-3';
    } else if (rssi > -85) {
      icon = 'signal-cellular-2';
    } else if (rssi > -95) {
      icon = 'signal-cellular-1';
    } else {
      icon = 'signal-cellular-outline';
    }
    return (
      <Row
        key={Math.random() * 1000}
        title={item.name}
        sub={`${item.id}, rssi: ${rssi}`}
        onPress={() => onPressDevice(item)}>
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
          onPress={() => onPressLampMode('msm')}>
          <Lottie
            progress={msm}
            style={{width: '200%'}}
            source={require('../../assets/lottie/checkX2.json')}
          />
        </Row>
        <Row
          title="Single Select Mode"
          sub="Selecting a light will turn it on and turn off all other lights. This is how a StopLight normally acts."
          onPress={() => onPressLampMode('ssm')}>
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
          onPress={() => startScan()}>
          {scanning && <ActivityIndicator size="large" color="#FF5522" />}
        </Row>

        <SectionList
          style={styles.list}
          sections={[
            {title: 'Connected Devices', data: connectedDevices},
            {title: 'Scanned Devices', data: scannedDevices},
          ]}
          renderItem={renderDevice}
          renderSectionHeader={props => <Text>{props.section.title}</Text>}
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
