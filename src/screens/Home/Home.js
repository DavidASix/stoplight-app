import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import OIcon from 'react-native-vector-icons/Octicons';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      r: false,
      y: false,
      g: false
    }
  }

  changeLight(l) {
    this.setState({ [l]: !this.state[l] });
  }

  render() {
    let {r, y, g} = this.state;
    return (
      <View style={styles.pageContainer}>
        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }} />
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>
              StopLight
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <OIcon name="gear" size={35} color="#FFF" />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.outline}>
            <View style={styles.lightBox}>
              <TouchableOpacity
                onPress={() => this.changeLight('r')}
                style={[
                  styles.lamp, { backgroundColor: 'hsl(0, 10%, 50%)' },
                  r && [styles.lampOn, {  backgroundColor: '#fc4444', shadowColor: '#FF0000' }]
                ]}>
                <Image
                  source='../../assets/glassTexture.jpg'
                  style={{ position: 'absolute', width: '100%' }} />
                </TouchableOpacity>
            </View>
            <View style={[styles.lightBox, { width: `${(2/3)*(3/4)*100}%` }]}>
              <TouchableOpacity
                onPress={() => this.changeLight('y')}
                style={[
                  styles.lamp, { backgroundColor: 'hsl(60, 10%, 50%)' },
                  y && [styles.lampOn, {  backgroundColor: '#f9fc44', shadowColor: '#FFFF00' }]
                ]} />
            </View>
            <View style={[styles.lightBox, { width: `${(2/3)*(3/4)*100}%` }]}>
              <TouchableOpacity
                onPress={() => this.changeLight('g')}
                style={[
                  styles.lamp, { backgroundColor: 'hsl(126, 10%, 50%)' },
                  g && [styles.lampOn, {  backgroundColor: '#44fc57', shadowColor: '#00FF00' }]
                ]} />
            </View>
          </View>
        </View>

      </View>
    );
  }

}


const styles = {
  pageContainer: {
    backgroundColor: '#e9b20e',
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
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
  outline: {
    width: '70%',
    aspectRatio: 0.5,
    maxHeight: '90%',
    justifyContent:'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#e9b20e',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#fff',
    shadowColor: "#604806",
    shadowOffset: {
    	width: 0,
    	height: 5,
    },
    shadowOpacity: 0.50,
    shadowRadius: 6.27,
    elevation: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  lightBox: {
    width: `${(2/3)*100}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    marginVertical: 3
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
  },
  lampOn: {
  shadowColor: "#fff",
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 1,
  shadowRadius: 10,
  elevation: 20,
  }
};

export default App;
