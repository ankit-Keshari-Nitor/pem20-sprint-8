import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { initI18n } from '@b2bi/shell';
import App from './App';
//import reportWebVitals from './reportWebVitals';

initI18n({
  ns: ['shell', 'common', 'pem', 'mod-partner', 'mod-sponsor-user', 'mod-activity-definition'],
  defaultNS: 'pem'
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
