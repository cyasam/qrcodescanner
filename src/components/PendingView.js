import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AppContext from '../context/AppContext';

const PendingView = ({text}) => {
  const {cameraRef} = useContext(AppContext);
  const onPressPermissions = async () => {
    await cameraRef.refreshAuthorizationStatus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onPressPermissions}>
        <Text style={styles.buttonText}>Refresh Permissions</Text>
      </TouchableOpacity>
    </View>
  );
};

const lineHeight = size => {
  return size * 1.4;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 18,
    margin: 20,
    borderRadius: 5,
  },
  text: {
    color: '#000',
    fontSize: 18,
    lineHeight: lineHeight(18),
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PendingView;
