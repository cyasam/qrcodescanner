import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import KeepAwake from 'react-native-keep-awake';

import CodeResult from './components/CodeResult';
import Camera from './components/Camera';
import AppContext from './context/AppContext';

const setZoom = zoom => {
  return Platform.OS === 'ios' ? zoom / 30 : zoom;
};

const AppContainer = () => {
  const config = {
    zoom: setZoom(0.2),
    animatedLineHeight: 2,
    barcodeMask: {
      width: 230,
      height: 230,
      edgeColor: '#4285F4',
      edgeBorderWidth: 2,
    },
    vibrationDuration: 300,
    permissionErrorMessage:
      "Scanner doesn't have the permissions required. Go to Settings and check permissions.",
  };

  const [cameraRef, setCameraRef] = useState(null);
  const [barcodeData, setBarcodeData] = useState(null);
  const [animatedLineHeight, setAnimatedLineHeight] = useState(
    config.animatedLineHeight,
  );

  const handleReadNewQRCode = () => {
    setBarcodeData(null);
    cameraRef.resumePreview();
    setAnimatedLineHeight(config.animatedLineHeight);
  };

  useEffect(() => {
    KeepAwake.activate();

    return () => {
      KeepAwake.deactivate();
    };
  }, [barcodeData]);

  return (
    <AppContext.Provider
      value={{
        config,
        cameraRef,
        barcodeData,
        animatedLineHeight,
        handleReadNewQRCode,
        handleSetCameraRef: ref => setCameraRef(ref),
        handleSetBarcodeData: barcode => setBarcodeData(barcode),
        handleSetAnimatedLineHeight: height => setAnimatedLineHeight(height),
      }}>
      <View style={styles.sectionContainer}>
        <Camera />
        {barcodeData && <CodeResult style={styles.codeResult} />}
      </View>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  codeResult: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    margin: 20,
    zIndex: 10,
  },
});

export default AppContainer;
