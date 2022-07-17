import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  ImageBackground
} from 'react-native';

import OIcon from 'react-native-vector-icons/Octicons';
import SSIcon from 'react-native-vector-icons/SimpleLineIcons';

const Github = 'http://www.github.com/davidasix';
const Instagram = 'http://www.instagram.com/dave6dev';
const Website = 'http://www.dave6.com/'

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

        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>

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
