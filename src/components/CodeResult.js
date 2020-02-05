import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Linking,
  Animated,
} from 'react-native';

import validator from 'validator';
import Autolink from 'react-native-autolink';

import AppContext from '../context/AppContext';

const CodeResult = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(10));
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
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 400,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);

  useEffect(() => {
    return () => {
      backHandler.remove();
    };
  }, [backHandler]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        translateY: translateYAnim,
      }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Result</Text>
        <Text style={styles.text}>
          {validator.isURL(data) || data.includes('tel:') ? (
            <Text style={styles.link} onPress={() => Linking.openURL(data)}>
              {data}
            </Text>
          ) : (
            <Autolink text={data} />
          )}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
  },
  heading: {
    marginBottom: 14,
    color: '#000',
    fontSize: 20,
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
  link: {
    color: '#4285F4',
  },
});

export default CodeResult;
