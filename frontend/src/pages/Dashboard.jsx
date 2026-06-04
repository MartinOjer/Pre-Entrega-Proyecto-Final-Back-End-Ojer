import { Users, Laptop, Package, FileText, Truck } from 'lucide-react';

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cards = [
    { title: 'Clientes', icon: Users, color: 'bg-blue-500', link: '/clientes' },
    { title: 'Equipos', icon: Laptop, color: 'bg-green-500', link: '/equipos' },
    { title: 'Órdenes', icon: FileText, color: 'bg-purple-500', link: '/ordenes' },
    { title: 'Repuestos', icon: Package, color: 'bg-orange-500', link: '/repuestos', roles: ['admin', 'tecnico'] },
    { title: 'Proveedores', icon: Truck, color: 'bg-red-500', link: '/proveedores', roles: ['admin', 'tecnico'] },
    { title: 'Usuarios', icon: Users, color: 'bg-gray-500', link: '/usuarios', roles: ['admin'] },
  ];

  const filteredCards = cards.filter(card => 
    !card.roles || card.roles.includes(usuario.rol)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido, {usuario.nombre}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.link}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
              <p className="text-gray-600 mt-2">Gestionar {card.title.toLowerCase()}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}