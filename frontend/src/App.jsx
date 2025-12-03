import './App.css';
import { Route, Routes } from 'react-router-dom';
import PantallaPublica from './components/pages/PantallaPublica';
import CmsLayout from './components/pages/cms/CmsLayout';
import CmsPlaylists from './components/pages/cms/CmsPlaylist';
import CmsMedia from './components/pages/cms/CmsMedia';

function App() {
  return (
    <Routes>
      {/* Pantalla pública */}
      <Route path='/' element={<PantallaPublica />} />

      {/* CMS bajo /cms */}
      <Route path='/cms' element={<CmsLayout />}>
        {/* /cms */}
        <Route index element={<CmsPlaylists />} />
        {/* /cms/media */}
        <Route path='media' element={<CmsMedia />} />
      </Route>
    </Routes>
  );
}

export default App;
