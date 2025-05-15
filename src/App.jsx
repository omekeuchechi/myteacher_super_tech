import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router basename="/myteacher_super_tech">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;