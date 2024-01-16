import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Welcome from "./pages/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App;
