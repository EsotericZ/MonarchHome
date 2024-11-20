import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/navigation/SideNav';
import Cookies from 'universal-cookie';
import { useUserContext } from './context/UserContext';

import { Admin } from './pages/admin/Admin';
import { Backlog } from './pages/backlog/Backlog';
import { BendDeduction } from './pages/programming/BendDeduction';
import { Dashboard } from './pages/home/Dashboard';
import { Departments } from './pages/departments/Departments';
import { Directory } from './pages/home/Directory';
import { Efficiency } from './pages/specialty/Efficiency';
import { Engineering } from './pages/programming/Engineering';
import { FixtureLaser } from './pages/departments/FixtureLaser';
import { Forming } from './pages/departments/Forming';
import { FormingProg } from './pages/programming/FormingProg';
import { Hardware } from './pages/programming/Hardware';
import { Inventory } from './pages/inventory/Inventory';
import { InventoryHome } from './pages/inventory/InventoryHome';
import { Laser } from './pages/departments/Laser';
import { Login } from './pages/login/Login';
import { Machining } from './pages/programming/Machining';
import { Profile } from './pages/profile/Profile';
import { Programming } from './pages/programming/Programming';
import { Purchasing } from './pages/inventory/Purchasing';
import { Punch } from './pages/departments/Punch';
import { Quality } from './pages/programming/Quality';
import { QualityInfo } from './pages/programming/QualityInfo';
import { Saw } from './pages/departments/Saw';
import { Scales } from './pages/inventory/Scales';
import { Shear } from './pages/departments/Shear';
import { SheetInventory } from './pages/specialty/SheetInventory';
import { Specialty } from './pages/specialty/Specialty';
import { StaticLaser } from './pages/departments/StaticLaser';
import { Supplies } from './pages/inventory/Supplies';
import { TapChart } from './pages/programming/TapChart';
import { Tasks } from './pages/tasks/Tasks';
import { TubeLaser } from './pages/departments/TubeLaser';
import { TubeLaserProg } from './pages/programming/TubeLaserProg';
import { VTiger } from './pages/specialty/VTiger';

export const App = () => {
  const { setCookieData } = useUserContext();
  const [loggedIn, setLoggedIn] = useState(!!new Cookies().get('jwt'));

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove('jwt', { path: '/', domain: '' });
    setCookieData({
      'name': '',
      'role': 'employee',
      'backlog': false,
      'engineering': false,
      'forming': false,
      'laser': false,
      'machining': false,
      'maintenance': false,
      'punch': false,
      'purchasing': false,
      'quality': false,
      'shipping': false,
      'tlaser': false,
      'saw': false,
      'shear': false,
      'specialty': false,
    });
    setLoggedIn(false);
  };

  return (
    <Router>
      <SideNav loggedIn={loggedIn}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/backlog' element={<Backlog />} />
          <Route path='/bendDeduction' element={<BendDeduction />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/departments' element={<Departments />} />
          <Route path='/directory' element={<Directory />} />
          <Route path='/engineering' element={<Engineering />} />
          <Route path='/efficiency' element={<Efficiency />} />
          <Route path='/fixtureLaser' element={<FixtureLaser />} />
          <Route path='/forming' element={<Forming />} />
          <Route path='/formingProg' element={<FormingProg />} />
          <Route path='/hardware' element={<Hardware />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inventoryHome' element={<InventoryHome />} />
          <Route path='/Laser' element={<Laser />} />
          <Route path='/login' element={<Login />} />
          <Route path='/machining' element={<Machining />} />
          <Route path='/profile' element={<Profile loggedIn={loggedIn} handleLogout={handleLogout} />} />
          <Route path='/programming' element={<Programming />} />
          <Route path='/punch' element={<Punch />} />
          <Route path='/purchasing' element={<Purchasing />} />
          <Route path='/quality' element={<Quality />} />
          <Route path='/qualityInfo' element={<QualityInfo />} />
          <Route path='/saw' element={<Saw />} />
          <Route path='/scales' element={<Scales />} />
          <Route path='/shear' element={<Shear />} />
          <Route path='/sheetInventory' element={<SheetInventory />} />
          <Route path='/specialty' element={<Specialty />} />
          <Route path='/staticLaser' element={<StaticLaser />} />
          <Route path='/supplies' element={<Supplies />} />
          <Route path='/tapChart' element={<TapChart />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/tubeLaser' element={<TubeLaser />} />
          <Route path='/tubeLaserProg' element={<TubeLaserProg />} />
          <Route path='/vtiger' element={<VTiger />} />
        </Routes>
      </SideNav>
    </Router>
  );
}