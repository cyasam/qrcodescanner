import React, {useEffect, useContext} from 'react';
import {StyleSheet, View, Text, BackHandler, Linking} from 'react-native';

import validator from 'validator';
import Autolink from 'react-native-autolink';

import AppContext from '../context/AppContext';

const CodeResult = () => {
  const {barcodeData, handleBackPress} = useContext(AppContext);
  const {data} = barcodeData;

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    function() {
      handleBackPress();
      return true;
    },
  );
  useEffect(() => {
    return () => {
      backHandler.remove();
    };
  }, [backHandler]);

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>
        {validator.isURL(data) || data.includes('tel:') ? (
          <Text style={styles.link} onPress={() => Linking.openURL(data)}>
            {data}
          </Text>
        ) : (
          <Autolink text={data} />
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  resultText: {
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  link: {
    color: '#4285F4',
  },
});

export default CodeResult;
