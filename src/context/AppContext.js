import React from 'react';

const AppContext = React.createContext({
  cameraRef: null,
  barcodeData: null,
  setBarcodeData: () => {},
});

export default AppContext;
