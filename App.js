import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';

import AppContainer from './src/AppContainer';

const App = () => {
  return (
    <>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
        hidden={false}
      />
      <SafeAreaView style={styles.container}>
        <AppContainer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    width: '100%',
  },
});

export default App;
