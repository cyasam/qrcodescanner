import React, {useState, useEffect} from 'react';
import {StyleSheet, View, BackHandler, Vibration} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import KeepAwake from 'react-native-keep-awake';

import CodeResult from './components/CodeResult';
import AppContext from './context/AppContext';

const AppContainer = () => {
  const config = {
    zoom: 0.2,
    animatedLineHeight: 2,
    barcodeMask: {
      width: 200,
      height: 200,
    },
    vibrationDuration: 500,
  };

  const [animatedLineHeight, setAnimatedLineHeight] = useState(
    config.animatedLineHeight,
  );
  const [cameraRef, setCameraRef] = useState(null);
  const [barcodeData, setBarcodeData] = useState(null);

  const onBarCodeRead = barcode => {
    if (!barcodeData) {
      setBarcodeData(barcode);
    }
  };

  const handleBackPress = () => {
    setBarcodeData(null);
    cameraRef.resumePreview();
    setAnimatedLineHeight(config.animatedLineHeight);
  };

  KeepAwake.activate();

  useEffect(() => {
    if (barcodeData && cameraRef) {
      cameraRef.pausePreview();
      setAnimatedLineHeight(0);

      Vibration.vibrate(config.vibrationDuration);
    }

    return () => {
      KeepAwake.deactivate();
    };
  }, [barcodeData, cameraRef, config.vibrationDuration]);

  return (
    <AppContext.Provider
      value={{
        barcodeData,
        handleBackPress,
      }}>
      <View style={styles.sectionContainer}>
        <RNCamera
          ref={ref => {
            setCameraRef(ref);
          }}
          style={styles.camera}
          zoom={config.zoom}
          captureAudio={false}
          onBarCodeRead={onBarCodeRead}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          androidCameraPermissionOptions={null}>
          {({status}) => {
            if (status === 'NOT_AUTHORIZED') {
              BackHandler.exitApp();
            }

            return (
              <BarcodeMask
                width={config.barcodeMask.width}
                height={config.barcodeMask.height}
                animatedLineHeight={animatedLineHeight}
              />
            );
          }}
        </RNCamera>
        {barcodeData && <CodeResult />}
      </View>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingView: {
    margin: 20,
  },
});

export default AppContainer;
