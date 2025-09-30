import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { logger } from './utils/logger';

logger.log('NBA Scores Extension starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error('Root element not found!');
  throw new Error('Root element not found');
}

logger.log('Root element found, creating React root...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

logger.log('React app rendered successfully!');