import React from 'react';

const AppContext = React.createContext({
  config: null,
  cameraRef: null,
  barcodeData: null,
  animatedLineHeight: null,
  flashMode: null,
  handleReadNewQRCode: () => {},
  handleSetCameraRef: () => {},
  handleSetBarcodeData: () => {},
  handleSetAnimatedLineHeight: () => {},
  handleSetFlashMode: () => {},
});

export default AppContext;
