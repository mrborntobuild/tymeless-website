import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Suppress Firebase errors from external sources
window.addEventListener('error', (event) => {
  if (event.message?.includes('Firebase') || 
      event.message?.includes('sentence-player') ||
      event.message?.includes('orchestration')) {
    event.preventDefault();
    console.warn('Suppressed external error:', event.message);
    return false;
  }
});

// Suppress unhandled promise rejections from external sources
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Firebase') ||
      event.reason?.message?.includes('sentence-player')) {
    event.preventDefault();
    console.warn('Suppressed external promise rejection:', event.reason);
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);