import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import NotFound from "./pages/notFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route - Home page */}
        <Route path="/" element={<Home />} />
        
        {/* Other Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Optional: Add a fallback route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

