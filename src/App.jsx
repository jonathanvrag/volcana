import StaticUnits from './components/staticUnits.jsx';
import DynamicUnits from './components/dynamicUnit.jsx';
import './App.css';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<StaticUnits />} />
        <Route path='/dinamicas' element={<DynamicUnits />} />
      </Routes>
    </div>
  );
}

export default App;
