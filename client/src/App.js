import Home from "./pages/Home"
import Mainscreen from "./pages/Mainscreen"
import Welcome from "./pages/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/mainscreen" element={<Mainscreen />} />
      </Routes>
    </Router>
  )
}

export default App;
