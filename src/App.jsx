import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Afiliados from './components/Afiliados';
import Precios from './components/Precios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/afiliados" element={<Afiliados />} />
        <Route path="/precios" element={<Precios />} />
      </Routes>
    </Router>
  );
}

export default App; 