import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import NotFound from "./pages/notFound";
import Header from './components/header';
import Footer from "./components/footer"; // Import Footer

function App() {
  return (
    <Router basename="/invoicing-system-web-app"> {/* Add basename */}
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
