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
    <GoogleOAuthProvider clientId="198264492253-v1j80ljj6f2r9s3288tj9qg45o02f57l.apps.googleusercontent.com">
      <AuthContextProvider> {/* ✅ Wrap your app in the AuthProvider */}
        <App />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Optional performance monitoring
reportWebVitals();
