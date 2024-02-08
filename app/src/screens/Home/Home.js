import React, {useState, useEffect} from 'react';
import {
  Alert,
  PermissionsAndroid,
  ToastAndroid,
  View,
  TouchableOpacity,
  Image,
  Text,
  NativeModules,
  NativeEventEmitter,
  BackHandler,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {stringToBytes, bytesToString} from 'convert-string';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import SSIcon from 'react-native-vector-icons/SimpleLineIcons';

const Home = props => {
  const [ddOpen, setddOpen] = useState(false);
  const [lamps, setLamps] = useState({r: 0, y: 0, g: 0});
  const [lampMode, setLampMode] = useState('msm');
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(false);
  const [btPermission, setBtPermission] = useState(false);
  var bleReader = null;

  useEffect(() => {
    // Moved setup to async function
    const setupBluetooth = async () => {
      try {
        // Check for permission to use bluetooth, required for new version of Android
        // Only connectPermission opens request alert, but SCAN is explicitly required as well
        const scanPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'StopLight Bluetooth Permission',
            message: 'Bluetooth Low Energy scan permission is required',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const connectPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'StopLight Bluetooth Permission',
            message: 'Bluetooth Low Energy connect permission is required',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          connectPermission !== PermissionsAndroid.RESULTS.GRANTED ||
          scanPermission !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          setBtPermission(false);
          console.log('error');
          throw new Error('Could not get BT Permission');
        }
        setBtPermission(true);
        // Bluetooth permission is granted, initialize BLE functions
        initializeBluetooth();
      } catch (err) {
        // Error occured due to lack of BT Permissions
        // console.error(err);
        Alert.alert(
          'Bluetooth permissions are required to use this app',
          'Please accept the permissions',
          [{text: 'OK', onPress: () => setupBluetooth()}],
        );
      }
    };

    // Called after Bluetooth permission has been granted
    // This function initializes the bluetooth connection by getting currently connected peripherals, and setting up ble listeners
    const initializeBluetooth = async () => {
      try {
        await BleManager.start({showAlert: true});
        let connected = await BleManager.getConnectedPeripherals([]);
        setConnectedDevices(connected);
        const connectHandler = bleManagerEmitter.addListener(
          'BleManagerConnectPeripheral',
          handleConnect,
        );
        const disconnectHandler = bleManagerEmitter.addListener(
          'BleManagerDisconnectPeripheral',
          handleDisconnect,
        );
        const screenFocusListener = props.navigation.addListener(
          'focus',
          async () => {
            let storedLampMode = await AsyncStorage.getItem('@lampMode');
            if (!storedLampMode) {
              storedLampMode = 'msm';
            }
            setLampMode(storedLampMode);
          },
        );
        return () => {
          connectHandler.remove();
          disconnectHandler.remove();
          // bleReader is a listener set up after a device has been connected to
          // The variable reads bits from the ble connection and assigns them to state
          // At app disconnect the variable could or could not be assigned, depending on if a device was connected to
          if (bleReader !== null) {
            bleReader.remove();
          }
          return screenFocusListener;
        };
      } catch (err) {
        // Error would be thrown if BLE manager could not run, or could not search for devices
        // In either case, app should be reloaded
        console.log(err);
        Alert.alert(
          "Couldn't connect to BlueTooth",
          'An error occurred. Please reload the app.',
          [
            {text: 'Ignore', onPress: () => {}},
            {
              text: 'Close App',
              style: 'destructive',
              onPress: () => BackHandler.exitApp(),
            },
          ],
        );
      }
    };
    // Function is called to ensure BT permissions available before BLE manager setup
    setupBluetooth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async device => {
    let connected = await BleManager.getConnectedPeripherals([]);
    setConnectedDevices(connected);
  };

  const handleDisconnect = async device => {
    let connected = await BleManager.getConnectedPeripherals([]);
    setConnectedDevices(connected);
  };

  const onPressLamp = async l => {
    if (!selectedDevice) {
      return ToastAndroid.show('Select a device', ToastAndroid.SHORT);
    }
    let serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
    let characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';
    try {
      // Calls to change a lamp return state from the BLE module.
      // This triggers the listener from onPressConnectedDevice and changes the screen light display
      if (!['ssm', 'msm'].includes(lampMode)) {
        throw 'Check Lamp Mode';
      }
      let text = l; // default, for msm
      if (lampMode === 'ssm') {
        text = 'm';
        Object.keys(lamps).forEach(c => (text += l === c ? +!lamps[l] : 0));
      }
      await BleManager.write(
        selectedDevice,
        serviceUUID,
        characteristicUUID,
        stringToBytes(text),
      );
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    }
  };

  const onPressConnectedDevice = async device => {
    let deviceID = String(device());
    // Default values for an HM-10 BLE Module
    let serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
    let characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';
    setSelectedDevice(deviceID);
    try {
      // Use services to get serviceUUId and CharUUID if you don't have it
      //let services = await BleManager.retrieveServices(deviceID);
      await BleManager.startNotification(
        deviceID,
        serviceUUID,
        characteristicUUID,
      );
      // Add event listener
      if (bleReader !== null) {
        bleReader.remove();
      }
      bleReader = bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        ({value, peripheral, characteristic, service}) => {
          // This is only set up to receive the response from command s, for State
          // returns a three character string of 0 and 1, for red, yellow, green
          // Convert bytes array to string
          let data = bytesToString(value);
          data = data.replace(/[\r\n]/gm, '');
          data = data.split('').map(char => char * 1);
          setLamps({r: data[0], y: data[1], g: data[2]});
        },
      );
      // Get initial state of lamps
      await BleManager.write(
        deviceID,
        serviceUUID,
        characteristicUUID,
        stringToBytes('s'),
      );
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    }
  };
  /**
   * would be cool to see the stoplight have a little movement if you drag on the edge of it
   ***/
  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={{flex: 1}} />
        <View
          style={{
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16, marginBottom: 5}}>
            {lampMode === 'msm' ? 'Multi-Select Mode' : 'Single Select Mode'}
          </Text>
          <DropDownPicker
            open={ddOpen}
            value={selectedDevice}
            items={connectedDevices.map(d => ({label: d.name, value: d.id}))}
            setOpen={setddOpen}
            setValue={onPressConnectedDevice}
            style={styles.dropdown}
            textStyle={{color: '#fff'}}
            dropDownContainerStyle={styles.dropdown}
            ArrowUpIconComponent={() => (
              <SSIcon name="arrow-up" size={15} color="#FFF" />
            )}
            ArrowDownIconComponent={() => (
              <SSIcon name="arrow-down" size={15} color="#FFF" />
            )}
          />
        </View>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <SSIcon
            name="settings"
            size={35}
            color="#FFF"
            onPress={() => props.navigation.navigate('settings')}
          />
        </View>
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.pole}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              opacity: 0.5,
            }}
            source={require('../../assets/MetalTexture.jpg')}
            resizeMode="cover"
          />
        </View>
        <View style={styles.outline}>
          <View style={styles.lightBox}>
            <TouchableOpacity
              onPress={() => onPressLamp('r')}
              style={[
                styles.lamp,
                {backgroundColor: 'hsl(0, 10%, 50%)'},
                lamps.r && [
                  styles.lampOn,
                  {backgroundColor: '#fc4444', shadowColor: '#FF0000'},
                ],
              ]}>
              <Image
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: '100%',
                  opacity: 0.4,
                }}
                source={require('../../assets/glassTexture.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View
            style={[styles.lightBox, {width: `${(2 / 3) * (3 / 4) * 100}%`}]}>
            <TouchableOpacity
              onPress={() => onPressLamp('y')}
              style={[
                styles.lamp,
                {backgroundColor: 'hsl(60, 10%, 50%)'},
                lamps.y && [
                  styles.lampOn,
                  {backgroundColor: '#f9fc44', shadowColor: '#FFFF00'},
                ],
              ]}>
              <Image
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: '100%',
                  opacity: 0.4,
                }}
                source={require('../../assets/glassTexture.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View
            style={[styles.lightBox, {width: `${(2 / 3) * (3 / 4) * 100}%`}]}>
            <TouchableOpacity
              onPress={() => onPressLamp('g')}
              style={[
                styles.lamp,
                {backgroundColor: 'hsl(126, 10%, 50%)'},
                lamps.g && [
                  styles.lampOn,
                  {backgroundColor: '#44fc57', shadowColor: '#00FF00'},
                ],
              ]}>
              <Image
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: '100%',
                  opacity: 0.4,
                }}
                source={require('../../assets/glassTexture.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: 'hsl(44, 88%, 75%)', //44, 88, 55
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    width: '90%',
    padding: 15,
    flexDirection: 'row',
    borderColor: '#fff',
    zIndex: 100,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    textWrap: 'nowrap',
  },
  outline: {
    width: '70%',
    aspectRatio: 0.5,
    maxHeight: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#e9b20e',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#fff',
    shadowColor: '#604806',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.27,
    elevation: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  lightBox: {
    width: `${(2 / 3) * 100}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    marginVertical: 3,
  },
  lamp: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: '#e9b20e',
    borderColor: '#FFF',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  lampOn: {
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  pole: {
    position: 'absolute',
    bottom: 0,
    width: 45,
    height: '50%',
    backgroundColor: '#636363',
    overflow: 'hidden',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
  },
  dropdown: {
    backgroundColor: '#e9b20e',
    borderColor: '#fff',
    color: '#fff',
  },
};

export default Home;
