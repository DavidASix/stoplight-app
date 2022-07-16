import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import OIcon from 'react-native-vector-icons/Octicons';

class Settings extends React.Component {
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
              Settings
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        </View>

      </View>
    );
  }

}


const styles = {
  pageContainer: {
    backgroundColor: 'hsl(44, 88%, 75%)',
    flex: 1,
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    marginVertical: '10%',
    borderRadius: 20
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
    overflow: 'hidden'
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
  borderColor: '#fff'
}
};

export default Settings;
