import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Vibration, Dimensions, Platform} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import KeepAwake from 'react-native-keep-awake';

import CodeResult from './components/CodeResult';
import PendingView from './components/PendingView';
import NewReadButton from './components/NewReadButton';
import AppContext from './context/AppContext';

const isInside = (obj1, obj2) =>
  obj2.x >= obj1.x &&
  obj2.x + obj2.width <= obj1.x + obj1.width &&
  obj2.y >= obj1.y &&
  obj2.y + obj2.height <= obj1.y + obj1.height;

const createBarcodeBoundsData = bounds => ({
  height: parseFloat(bounds.size.height),
  width: parseFloat(bounds.size.width),
  x: parseFloat(bounds.origin.x),
  y: parseFloat(bounds.origin.y),
});

const AppContainer = () => {
  const config = {
    zoom: 0,
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

  const onBarCodeRead = barcode => {
    if (barcodeData) {
      return false;
    }

    const {bounds} = barcode;
    const barcodeInside = isInside(
      viewFinderBounds,
      createBarcodeBoundsData(bounds),
    );

    if (barcodeInside) {
      setBarcodeData(barcode);
    }
  };

  const onGoogleVisionBarcodesDetected = ({barcodes}) => {
    if (barcodeData) {
      return false;
    }

    const readedBarcode = barcodes.find(barcode => {
      const {bounds} = barcode;
      return isInside(viewFinderBounds, createBarcodeBoundsData(bounds));
    });

    if (readedBarcode) {
      setBarcodeData(readedBarcode);
    }
  };

  const handleBackPress = () => {
    setBarcodeData(null);
    cameraRef.resumePreview();
    setAnimatedLineHeight(config.animatedLineHeight);
  };

  const onPressNewReadButton = () => {
    handleBackPress();
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

  const barcodeReadProps = {};

  if (Platform.OS === 'ios') {
    barcodeReadProps.onBarCodeRead = onBarCodeRead;
  } else {
    barcodeReadProps.onGoogleVisionBarcodesDetected = onGoogleVisionBarcodesDetected;
  }

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
          {...barcodeReadProps}
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
        {barcodeData && (
          <>
            <NewReadButton
              style={styles.newReadButton}
              onPress={onPressNewReadButton}
            />
            <CodeResult style={styles.codeResult} />
          </>
        )}
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
  newReadButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    margin: 20,
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
