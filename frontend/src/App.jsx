import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Equipos from './pages/Equipos';
import Ordenes from './pages/Ordenes';
import Repuestos from './pages/Repuestos';
import Proveedores from './pages/Proveedores';
import Usuarios from './pages/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';
import ImprimirOrden from './pages/ordenes/ImprimirOrden';

function App() {
  return (
    <Router>
      <Routes>

        {/* Redirige la raíz a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Página pública de inicio */}
        <Route path="/home" element={<Landing />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas - comparten el Layout con sidebar */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/imprimir-orden" element={<ProtectedRoute roles={['admin', 'recepcionista']}><ImprimirOrden /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/repuestos" element={<ProtectedRoute roles={['admin', 'tecnico']}><Repuestos /></ProtectedRoute>} />
          <Route path="/proveedores" element={<ProtectedRoute roles={['admin', 'tecnico']}><Proveedores /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute roles={['admin']}><Usuarios /></ProtectedRoute>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;