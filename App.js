import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Router from './src/config/Router';

const App = () => {
  return (
    <>
      <Router />
    </>
    );
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
