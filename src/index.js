import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

console.log("PROXIED ENDPOINT IS ", process.env.REACT_APP_API_ENDPOINT);

root.render(
  <>
    <App />
  </>
);

