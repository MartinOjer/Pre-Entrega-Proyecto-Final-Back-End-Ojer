import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const usuarioData = JSON.parse(usuario);
    if (!roles.includes(usuarioData.rol)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
            <p className="font-bold">Acceso Denegado</p>
            <p>No tienes permiso para acceder a esta página</p>
          </div>
        </div>
      );
    }
  }

  return children;
}