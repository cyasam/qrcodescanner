import React from 'react';

const AppContext = React.createContext({
  config: null,
  cameraRef: null,
  barcodeData: null,
  handleReadNewQRCode: () => {},
  handleSetCameraRef: () => {},
  handleSetBarcodeData: () => {},
});

export default AppContext;
