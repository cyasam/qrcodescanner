import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, Dimensions, Platform, Vibration} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import PendingView from './PendingView';
import NewReadButton from './NewReadButton';
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

const Camera = () => {
  const {
    config,
    barcodeData,
    cameraRef,
    handleReadNewQRCode,
    handleSetCameraRef,
    handleSetBarcodeData,
  } = useContext(AppContext);

  const [animatedLineHeight, setAnimatedLineHeight] = useState(
    config.animatedLineHeight,
  );

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

  const readNewQRCode = () => {
    handleReadNewQRCode();
    setAnimatedLineHeight(config.animatedLineHeight);
  };

  useEffect(() => {
    if (barcodeData && cameraRef) {
      cameraRef.pausePreview();
      setAnimatedLineHeight(0);

      Vibration.vibrate(config.vibrationDuration);
    }
  }, [barcodeData, cameraRef, config.vibrationDuration]);

  const barcodeReadProps = {};

  if (Platform.OS === 'ios') {
    barcodeReadProps.onBarCodeRead = onBarCodeRead;
  } else {
    barcodeReadProps.onGoogleVisionBarcodesDetected = onGoogleVisionBarcodesDetected;
  }
  return (
    <>
      <RNCamera
        ref={ref => {
          handleSetCameraRef(ref);
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
          <NewReadButton style={styles.newReadButton} onPress={readNewQRCode} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newReadButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    margin: 20,
  },
});

export default Camera;
