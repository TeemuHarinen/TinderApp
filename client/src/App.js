import Home from "./pages/Home"
import Mainscreen from "./pages/Mainscreen"
import Welcome from "./pages/Welcome"
import UpdateProfile from "./pages/UpdateProfile"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useCookies } from 'react-cookie'
import './App.css';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const authToken = cookies.AuthToken

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {authToken && <Route path="/welcome" element={<Welcome />} />}
        {authToken && <Route path="/mainscreen" element={<Mainscreen />} />}
        {authToken && <Route path="/update_profile" element={<UpdateProfile />} />}
      </Routes>
    </Router>
  )
}

export default App;
