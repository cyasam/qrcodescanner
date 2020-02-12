import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  Linking,
  Animated,
  BackHandler,
  View,
} from 'react-native';

import validator from 'validator';
import Autolink from 'react-native-autolink';

import NewReadButton from './NewReadButton';
import AppContext from '../context/AppContext';

const CodeResult = ({style}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(10));
  const {barcodeData, handleReadNewQRCode} = useContext(AppContext);
  const {data} = barcodeData;

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    function() {
      if (barcodeData) {
        handleReadNewQRCode();
        return true;
      }
      return false;
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

    return () => backHandler.remove();
  }, [fadeAnim, translateYAnim, backHandler]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          translateY: translateYAnim,
        },
      ]}>
      <View style={styles.containerInner}>
        <Text style={styles.heading}>Result</Text>
        <View style={styles.content}>
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
      </View>
      <NewReadButton
        style={styles.newReadButton}
        onPress={handleReadNewQRCode}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 16,
  },
  containerInner: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    marginBottom: 30,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  text: {
    color: '#000',
    fontSize: 17,
  },
  link: {
    color: '#4285F4',
  },
  newReadButton: {},
});

export default CodeResult;
