import React from 'react';

const AppContext = React.createContext({
  barcodeData: null,
  setBarcodeData: () => {},
});

export default AppContext;
