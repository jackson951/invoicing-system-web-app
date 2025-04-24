import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // Corrected import path
import Register from "./pages/register"; // Corrected import path
import Login from "./pages/login";   // Corrected import path
import NotFound from "./pages/notFound"; // Corrected import path
import Header from './components/header';
import Footer from "./components/footer"; // Import Footer

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Include Header */}
        <main className="flex-grow">
          <Routes>
            {/* Default Route - Home page */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/invoicing-system-web-app" element={<Home />} />

            {/* Other Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Optional: Add a fallback route for unmatched paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer /> {/* Include Footer */}
      </div>
    </Router>
  );
}

export default App;
