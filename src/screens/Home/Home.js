import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import OIcon from 'react-native-vector-icons/Octicons';

class App extends React.Component {
  render() {
    return (
      <View>
      <Text>Home</Text>
      <OIcon name="gear" size={45} color="#900" />
      </View>
    );
  }
}


const styles = {
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
};

export default App;
