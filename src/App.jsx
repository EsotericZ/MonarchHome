import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/SideNav';

import { BendDeduction } from './pages/programming/BendDeduction';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Engineering } from './pages/programming/Engineering';
import { Login } from './pages/login/Login';
import { Profile } from './pages/profile/Profile';
import { Programming } from './pages/programming/Programming';
import { Quality } from './pages/programming/Quality';
import { QualityInfo } from './pages/programming/QualityInfo';
import { TapChart } from './pages/programming/TapChart';

export const App = () => {
  return (
    <Router>
      <SideNav>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/bendDeduction' element={<BendDeduction />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/engineering' element={<Engineering />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/programming' element={<Programming />} />
          <Route path='/quality' element={<Quality />} />
          <Route path='/qualityInfo' element={<QualityInfo />} />
          <Route path='/tapChart' element={<TapChart />} />
        </Routes>
      </SideNav>
    </Router>
  );
}