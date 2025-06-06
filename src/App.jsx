import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Register from './pages/auth';
import Login from './pages/login';
import UserDashboard from './pages/userDashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OnlineClass from './pages/online';
import Assets from './pages/assets';
import Settings from './pages/settings';
import Courses from './pages/courses';

// descritions of course in screens
import CopyRight from './pages/coursesPages/copyRight';
import BasicComputing from './pages/coursesPages/basicComputing';
import VirtualAssistant from './pages/coursesPages/virtualAssistant';
import DataEntry from './pages/coursesPages/dataEntry';




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
        <Route path="/assets" element={<Assets />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/courses" element={<Courses />} />
         {/* descritions of course in screens */}
        <Route path="/copy-right" element={<CopyRight />} />
        <Route path='/basic-computing' element={<BasicComputing />} />
        <Route path='/virtual-assistant' element={<VirtualAssistant />} />
        <Route path='/data-entry' element={<DataEntry />} />
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