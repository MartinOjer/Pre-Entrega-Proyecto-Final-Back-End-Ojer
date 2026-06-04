import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Printer } from 'lucide-react';
import api from '../services/api';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_equipo: '',
    id_usuario: '',
    descripcion_falla: '',
    diagnostico: '',
    trabajo_realizado: '',
    costo_mano_obra: 0,
    estado: 'pendiente',
    fecha_entrega: ''
  });

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const canCreate = ['admin', 'recepcionista'].includes(usuario.rol);
  const canEdit = ['admin', 'tecnico'].includes(usuario.rol);
  const canDelete = usuario.rol === 'admin';

  useEffect(() => {
    fetchOrdenes();
    fetchClientes();
    fetchEquipos();
    fetchUsuarios();
  }, []);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ordenes');
      setOrdenes(response.data);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clients');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const fetchEquipos = async () => {
    try {
      const response = await api.get('/equipments');
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchOrdenes();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/ordenes/search?query=${searchQuery}`);
      setOrdenes(response.data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedOrden(null);
    setFormData({
      id_cliente: '',
      id_equipo: '',
      id_usuario: '',
      descripcion_falla: '',
      diagnostico: '',
      trabajo_realizado: '',
      costo_mano_obra: 0,
      estado: 'pendiente',
      fecha_entrega: ''
    });
    setShowModal(true);
  };

  const openEditModal = (orden) => {
    setModalMode('edit');
    setSelectedOrden(orden);
    setFormData({
      id_cliente: orden.id_cliente,
      id_equipo: orden.id_equipo,
      id_usuario: orden.id_usuario || '',
      descripcion_falla: orden.descripcion_falla,
      diagnostico: orden.diagnostico || '',
      trabajo_realizado: orden.trabajo_realizado || '',
      costo_mano_obra: orden.costo_mano_obra || 0,
      estado: orden.estado,
      fecha_entrega: orden.fecha_entrega || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        id_usuario: formData.id_usuario || null,
        fecha_entrega: formData.fecha_entrega || null
      };

      if (modalMode === 'create') {
        await api.post('/ordenes', dataToSend);
      } else {
        await api.put(`/ordenes/${selectedOrden.id_orden}`, dataToSend);
      }

      setShowModal(false);
      fetchOrdenes();
    } catch (error) {
      console.error('Error al guardar orden:', error);
      alert(error.response?.data?.error || 'Error al guardar orden');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta orden?')) return;

    try {
      await api.delete(`/ordenes/${id}`);
      fetchOrdenes();
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      alert('Error al eliminar orden');
    }
  };

  const handlePrint = (id) => {
    window.open(`/imprimir-orden?id=${id}`, '_blank');
  };

  const getClienteNombre = (id) => {
    const cliente = clientes.find(c => c.id_cliente === id);
    return cliente ? cliente.nombre : '-';
  };

  const getEquipoDescripcion = (id) => {
    const equipo = equipos.find(e => e.id_equipo === id);
    return equipo ? `${equipo.tipo_equipo} ${equipo.marca} ${equipo.modelo}` : '-';
  };

  const getUsuarioNombre = (id) => {
    if (!id) return 'Sin asignar';
    const user = usuarios.find(u => u.id_usuario === id);
    return user ? user.nombre : '-';
  };

  const getEstadoBadge = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      entregada: 'bg-purple-100 text-purple-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const filterEquiposByCliente = () => {
    if (!formData.id_cliente) return [];
    return equipos.filter(e => e.id_cliente === parseInt(formData.id_cliente));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Órdenes de Reparación</h1>
        <p className="text-gray-600">Gestiona las órdenes de trabajo</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por descripción, estado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Buscar
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchOrdenes();
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Limpiar
              </button>
            )}
          </div>
          {canCreate && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <Plus size={20} />
              Nueva Orden
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Cargando órdenes...</p>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No se encontraron órdenes</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordenes.map((orden) => (
                <tr key={orden.id_orden} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{orden.id_orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getClienteNombre(orden.id_cliente)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getEquipoDescripcion(orden.id_equipo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getUsuarioNombre(orden.id_usuario)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(orden.estado)}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${orden.costo_mano_obra || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {(canCreate || canEdit) && (
                        <button
                          onClick={() => handlePrint(orden.id_orden)}
                          className="text-green-600 hover:text-green-900"
                          title="Imprimir"
                        >
                          <Printer size={18} />
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => openEditModal(orden)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(orden.id_orden)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Nueva Orden' : 'Editar Orden'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    value={formData.id_cliente}
                    onChange={(e) => setFormData({...formData, id_cliente: e.target.value, id_equipo: ''})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equipo *
                  </label>
                  <select
                    value={formData.id_equipo}
                    onChange={(e) => setFormData({...formData, id_equipo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                    disabled={!formData.id_cliente}
                  >
                    <option value="">Seleccionar equipo...</option>
                    {filterEquiposByCliente().map(equipo => (
                      <option key={equipo.id_equipo} value={equipo.id_equipo}>
                        {equipo.tipo_equipo} {equipo.marca} {equipo.modelo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Técnico Asignado
                  </label>
                  <select
                    value={formData.id_usuario}
                    onChange={(e) => setFormData({...formData, id_usuario: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="">Sin asignar</option>
                    {usuarios.filter(u => u.rol === 'tecnico' || u.rol === 'admin').map(user => (
                      <option key={user.id_usuario} value={user.id_usuario}>
                        {user.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completada">Completada</option>
                    <option value="entregada">Entregada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Costo Mano de Obra
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costo_mano_obra}
                    onChange={(e) => setFormData({...formData, costo_mano_obra: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_entrega}
                    onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción de la Falla *
                  </label>
                  <textarea
                    value={formData.descripcion_falla}
                    onChange={(e) => setFormData({...formData, descripcion_falla: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diagnóstico
                  </label>
                  <textarea
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trabajo Realizado
                  </label>
                  <textarea
                    value={formData.trabajo_realizado}
                    onChange={(e) => setFormData({...formData, trabajo_realizado: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  {modalMode === 'create' ? 'Crear Orden' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}