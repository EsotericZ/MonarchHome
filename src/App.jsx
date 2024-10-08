import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/SideNav';
import Cookies from 'universal-cookie';

import { Admin } from './pages/admin/Admin';
import { BendDeduction } from './pages/programming/BendDeduction';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Engineering } from './pages/programming/Engineering';
import { FormingProg } from './pages/programming/FormingProg';
import { Hardware } from './pages/programming/Hardware';
import { Login } from './pages/login/Login';
import { Machining } from './pages/programming/Machining';
import { Profile } from './pages/profile/Profile';
import { Programming } from './pages/programming/Programming';
import { Quality } from './pages/programming/Quality';
import { QualityInfo } from './pages/programming/QualityInfo';
import { TapChart } from './pages/programming/TapChart';
import { TubeLaserProg } from './pages/programming/TubeLaserProg';

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!new Cookies().get('jwt'));

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove('jwt', { path: '/', domain: '' });
    setLoggedIn(false);
  };

  return (
    <Router>
      <SideNav loggedIn={loggedIn}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/bendDeduction' element={<BendDeduction />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/engineering' element={<Engineering />} />
          <Route path='/formingProg' element={<FormingProg />} />
          <Route path='/hardware' element={<Hardware />} />
          <Route path='/login' element={<Login />} />
          <Route path='/machining' element={<Machining />} />
          <Route path='/profile' element={<Profile loggedIn={loggedIn} handleLogout={handleLogout} />} />
          <Route path='/programming' element={<Programming />} />
          <Route path='/quality' element={<Quality />} />
          <Route path='/qualityInfo' element={<QualityInfo />} />
          <Route path='/tapChart' element={<TapChart />} />
          <Route path='/tubeLaserProg' element={<TubeLaserProg />} />
        </Routes>
      </SideNav>
    </Router>
  );
}