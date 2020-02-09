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

  const handleReadNewQRCode = () => {
    setBarcodeData(null);
    cameraRef.resumePreview();
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
        handleReadNewQRCode,
        handleSetCameraRef: ref => setCameraRef(ref),
        handleSetBarcodeData: barcode => setBarcodeData(barcode),
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
    width: '100%',
  },
  codeResult: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    margin: 20,
  },
});

export default AppContainer;
