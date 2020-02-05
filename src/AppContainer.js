import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Vibration, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import KeepAwake from 'react-native-keep-awake';

import CodeResult from './components/CodeResult';
import PendingView from './components/PendingView';
import AppContext from './context/AppContext';

const isInside = (obj1, obj2) =>
  obj2.x >= obj1.x &&
  obj2.x + obj2.width <= obj1.x + obj1.width &&
  obj2.y >= obj1.y &&
  obj2.y + obj2.height <= obj1.y + obj1.height;

const AppContainer = () => {
  const config = {
    zoom: 0.2,
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

  const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
  const viewFinderBounds = {
    width: config.barcodeMask.width,
    height: config.barcodeMask.height,
    x: (windowWidth - config.barcodeMask.width) / 2,
    y: (windowHeight - config.barcodeMask.height) / 2,
  };

  const [animatedLineHeight, setAnimatedLineHeight] = useState(
    config.animatedLineHeight,
  );
  const [cameraRef, setCameraRef] = useState(null);
  const [barcodeData, setBarcodeData] = useState(null);

  const onBarCodeRead = ({barcodes}) => {
    const readedBarcode = barcodes.find(barcode =>
      isInside(viewFinderBounds, {
        height: barcode.bounds.size.height,
        width: barcode.bounds.size.width,
        x: barcode.bounds.origin.x,
        y: barcode.bounds.origin.y,
      }),
    );

    if (readedBarcode) {
      setBarcodeData(readedBarcode);
    }
  };

  const handleBackPress = () => {
    setBarcodeData(null);
    cameraRef.resumePreview();
    setAnimatedLineHeight(config.animatedLineHeight);
  };

  useEffect(() => {
    KeepAwake.activate();

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
        cameraRef,
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
          onGoogleVisionBarcodesDetected={onBarCodeRead}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          androidCameraPermissionOptions={null}>
          {({status}) => {
            if (status === 'NOT_AUTHORIZED') {
              return <PendingView text={config.permissionErrorMessage} />;
            }

            return (
              <BarcodeMask
                width={config.barcodeMask.width}
                height={config.barcodeMask.height}
                edgeColor={config.barcodeMask.edgeColor}
                edgeBorderWidth={config.barcodeMask.edgeBorderWidth}
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
