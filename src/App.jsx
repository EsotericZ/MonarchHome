import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/SideNav';

import { Dashboard } from './pages/dashboard/Dashboard';
import { Engineering } from './pages/programming/Engineering';

export const App = () => {
  return (
    <Router>
      <SideNav>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/engineering' element={<Engineering />} />
        </Routes>
      </SideNav>
    </Router>
  );
}