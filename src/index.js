import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContextProvider } from './contexts/AuthContext'; // ✅ Import your AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="255589235540-uj6cb92hqirbci4jmvafi0gps42e3se7.apps.googleusercontent.com">
      <AuthContextProvider> {/* ✅ Wrap your app in the AuthProvider */}
        <App />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Optional performance monitoring
reportWebVitals();
