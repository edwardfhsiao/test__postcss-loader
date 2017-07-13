import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './app/app.jsx';

render(
  <div>
    <App />
  </div>,
  document.getElementById('root')
);
