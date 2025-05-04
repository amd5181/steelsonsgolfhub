import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Set the global watermark background
document.body.style.background = "url('pitt-watermark.png') no-repeat center center fixed";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundColor = "#1a1a1a";
document.body.style.backgroundBlendMode = "overlay";

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
