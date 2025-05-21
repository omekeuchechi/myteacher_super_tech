import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Register from './pages/auth';
import Login from './pages/login';
import UserDashboard from './pages/userDashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OnlineClass from './pages/online';


function App() {
  return (
    <Router basename="/myteacher_super_tech/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path="/auth" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/online-class" element={<OnlineClass />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/home';
// import About from './pages/about';
// import Register from './pages/auth';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/auth" element={<Register />} />
//         <Route path="/about" element={<About />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;