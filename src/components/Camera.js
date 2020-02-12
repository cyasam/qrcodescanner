import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Vibration,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import PendingView from './PendingView';
import FlashButton from './FlashButton';
import AppContext from '../context/AppContext';

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

const Camera = ({style}) => {
  const {
    config,
    barcodeData,
    cameraRef,
    flashMode,
    animatedLineHeight,
    handleSetCameraRef,
    handleSetBarcodeData,
    handleSetAnimatedLineHeight,
  } = useContext(AppContext);

  const {FlashMode, BarCodeType} = RNCamera.Constants;

  const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
  const viewFinderBounds = {
    width: config.barcodeMask.width,
    height: config.barcodeMask.height,
    x: (windowWidth - config.barcodeMask.width) / 2,
    y: (windowHeight - config.barcodeMask.height) / 2,
  };

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
      handleSetBarcodeData(barcode);
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
      handleSetBarcodeData(readedBarcode);
    }
  };

  useEffect(() => {
    if (barcodeData && cameraRef) {
      cameraRef.pausePreview();
      handleSetAnimatedLineHeight(0);

      Vibration.vibrate(config.vibrationDuration);
    }
  }, [
    barcodeData,
    cameraRef,
    config.vibrationDuration,
    handleSetAnimatedLineHeight,
  ]);

  const barcodeReadProps = {};

  if (Platform.OS === 'ios') {
    barcodeReadProps.onBarCodeRead = onBarCodeRead;
  } else {
    barcodeReadProps.onGoogleVisionBarcodesDetected = onGoogleVisionBarcodesDetected;
  }

  const flashButtonSize = 24;
  const infoBoxPositionTop =
    (windowHeight - config.barcodeMask.height) / 2 - flashButtonSize * 2.4;
  const flashButtonPositionTop = (windowHeight + config.barcodeMask.height) / 2;

  return (
    <View style={style}>
      <RNCamera
        ref={ref => {
          handleSetCameraRef(ref);
        }}
        style={styles.camera}
        zoom={config.zoom}
        flashMode={flashMode ? FlashMode.torch : FlashMode.off}
        captureAudio={false}
        {...barcodeReadProps}
        barCodeTypes={[BarCodeType.qr]}
        androidCameraPermissionOptions={null}>
        {({status}) => {
          if (status === 'NOT_AUTHORIZED') {
            return <PendingView text={config.permissionErrorMessage} />;
          }

          return (
            <>
              <BarcodeMask
                style={styles.mask}
                width={config.barcodeMask.width}
                height={config.barcodeMask.height}
                edgeColor={config.barcodeMask.edgeColor}
                edgeBorderWidth={config.barcodeMask.edgeBorderWidth}
                animatedLineHeight={animatedLineHeight}
              />

              <View style={[styles.infoBox, {top: infoBoxPositionTop}]}>
                <Text style={styles.infoBoxText}>
                  Place inside QR code in the box
                </Text>
              </View>

              <FlashButton
                size={flashButtonSize}
                style={[styles.flashButton, {top: flashButtonPositionTop}]}
              />
            </>
          );
        }}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'center',
  },
  infoBox: {
    position: 'absolute',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  infoBoxText: {
    color: '#fff',
    fontSize: 15,
  },
  flashButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default Camera;
