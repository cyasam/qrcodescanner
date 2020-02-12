import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import AppContext from '../context/AppContext';

const FlashButton = ({style, size}) => {
  const {config, flashMode, handleSetFlashMode} = useContext(AppContext);

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSetFlashMode}
        style={styles.button}>
        <View style={styles.icon}>
          <Svg viewBox="0 0 512 512" width={`${size}px`} height={`${size}px`}>
            <Path
              fill={config.flash.activeColor}
              d="M371.827 189.348C371.041 187.957 369.9 186.799 368.522 185.994C367.143 185.189 365.576 184.764 363.981 184.764H245.833L265.641 33.0424C265.853 31.0118 265.378 28.9686 264.291 27.2418C263.205 25.515 261.57 24.205 259.651 23.5227C257.731 22.8405 255.638 22.8257 253.709 23.4807C251.78 24.1357 250.127 25.4225 249.017 27.1338L105.336 279.484C104.496 280.854 104.035 282.424 104.002 284.032C103.969 285.64 104.364 287.228 105.146 288.631C105.929 290.035 107.071 291.204 108.455 292.018C109.839 292.832 111.414 293.261 113.018 293.261H229.4L213.703 445.211C213.549 447.235 214.074 449.252 215.195 450.942C216.316 452.632 217.969 453.897 219.89 454.536C221.811 455.176 223.891 455.153 225.798 454.471C227.704 453.79 229.329 452.488 230.413 450.774L371.719 198.451C372.539 197.079 372.98 195.513 372.999 193.914C373.018 192.315 372.614 190.739 371.827 189.348Z"
            />

            <Path
              fill={
                !flashMode
                  ? config.flash.activeColor
                  : config.flash.defaultColor
              }
              d="M329.21 497.004C327.109 497.004 325.009 496.202 323.405 494.598C320.198 491.394 320.198 486.195 323.405 482.987L402.983 403.407C406.19 400.2 411.386 400.2 414.595 403.407C417.802 406.611 417.802 411.81 414.595 415.019L335.015 494.598C333.412 496.202 331.312 497.004 329.21 497.004Z"
            />
            <Path
              fill={
                !flashMode
                  ? config.flash.activeColor
                  : config.flash.defaultColor
              }
              d="M408.788 497.004C406.687 497.004 404.587 496.201 402.983 494.598L323.405 415.017C320.198 411.81 320.198 406.609 323.405 403.405C326.612 400.198 331.808 400.198 335.017 403.405L414.595 482.986C417.802 486.193 417.802 491.394 414.595 494.598C412.99 496.201 410.888 497.004 408.788 497.004Z"
            />
          </Svg>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
});

export default FlashButton;
