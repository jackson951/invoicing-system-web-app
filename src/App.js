// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/header';
import Footer from './components/footer';
import Layout from './components/Layout';
import { AuthContextProvider } from './contexts/AuthContext'; // Optional
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Moved useApiInterceptors into a wrapper component inside Router
import { useApiInterceptors } from './api/web-api-service';

function InterceptorWrapper({ children }) {
  useApiInterceptors();
  return children;
}

function App() {
  return (
    <Router basename="/invoicing-system-web-app">
      <AuthContextProvider>
        <InterceptorWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Layout />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </InterceptorWrapper>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
