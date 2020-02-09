import React from 'react';

const AppContext = React.createContext({
  config: null,
  cameraRef: null,
  barcodeData: null,
  animatedLineHeight: null,
  handleReadNewQRCode: () => {},
  handleSetCameraRef: () => {},
  handleSetBarcodeData: () => {},
  handleSetAnimatedLineHeight: () => {},
});

export default AppContext;
