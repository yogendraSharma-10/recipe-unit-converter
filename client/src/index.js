import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import App from './App';
import './styles/main.css'; // Import global styles

/**
 * This is the entry point for the React client-side application.
 * It renders the main App component into the DOM.
 *
 * For React 18 and later, `ReactDOM.createRoot` is used for concurrent mode features.
 * The application is wrapped in `React.StrictMode` to help identify potential problems
 * in an application during development. It activates additional checks and warnings for its descendants.
 */

// Get the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a root for the React application using ReactDOM.createRoot.
// This is the recommended way to render a React app in React 18+.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// You can add additional client-side setup here if needed,
// for example, service worker registration for PWA features.
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// serviceWorkerRegistration.register();