// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './AppRoutes'; // Import AppRoutes
import Header from './components/header';
import Footer from './components/footer';

// Optional: Import any context providers you want to wrap your app with
import { AuthProvider } from './contexts/AuthContext'; // For example, if you have an AuthContext

function App() {
  return (
    <Router basename="/invoicing-system-web-app"> {/* This handles your subpath on GitHub Pages */}
      <AuthProvider>
        {/* You can add more context providers here if needed */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <AppRoutes /> {/* Render the routes here */}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
