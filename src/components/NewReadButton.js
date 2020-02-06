import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const NewReadButton = ({style, onPress}) => {
  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onPress}>
        <Text style={styles.buttonText}>Read new QR-code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NewReadButton;
