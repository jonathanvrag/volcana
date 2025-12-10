import './App.css';
import { Route, Routes } from 'react-router-dom';
import PantallaPublica from './components/pages/PantallaPublica';
import CmsLayout from './components/pages/cms/CmsLayout';
import CmsPlaylists from './components/pages/cms/CmsPlaylist';
import CmsMedia from './components/pages/cms/CmsMedia';
import CmsAccount from './components/pages/cms/CmsAccount';
import CmsUsers from './components/pages/cms/CmsUsers';
import LoginPage from './components/pages/LoginPage';
import PrivateRoute from './router/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Pantalla pública */}
      <Route path='/' element={<PantallaPublica />} />

      {/* Login */}
      <Route path='/login' element={<LoginPage />} />

      {/* CMS protegido bajo /cms */}
      <Route element={<PrivateRoute />}>
        <Route path='/cms' element={<CmsLayout />}>
          <Route index element={<CmsPlaylists />} />
          <Route path='media' element={<CmsMedia />} />
          <Route path='account' element={<CmsAccount />} />
          <Route path='users' element={<CmsUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
