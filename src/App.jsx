import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/SideNav';

import { Dashboard } from './pages/dashboard/Dashboard';
import { Engineering } from './pages/programming/Engineering';
import { Login } from './pages/login/Login';
import { Profile } from './pages/profile/Profile';
import { Programming } from './pages/programming/Programming';
import { Quality } from './pages/programming/Quality';

export const App = () => {
  return (
    <Router>
      <SideNav>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/engineering' element={<Engineering />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/programming' element={<Programming />} />
          <Route path='/quality' element={<Quality />} />
        </Routes>
      </SideNav>
    </Router>
  );
}