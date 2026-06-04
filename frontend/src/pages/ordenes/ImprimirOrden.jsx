import { useState, useEffect } from 'react';
import api from '../../services/api';
import logoSertec from '../../assets/logo-sertec.png';

export default function ImprimirOrden() {
  const [orden, setOrden] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Campos editables del comprobante
  const [campos, setCampos] = useState({
    nombreApellido: '',
    telefonoEmail: '',
    productoEquipo: '',
    otros: '',
    descripcionFalla: '',
    trabajoRealizado: '',
    presupuesto: ''
  });

  const ordenId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    const fetchOrdenData = async () => {
      try {
        if (!ordenId) {
          setError('ID de orden no especificado');
          setLoading(false);
          return;
        }

        const ordenRes = await api.get(`/ordenes/${ordenId}`);
        const ordenData = ordenRes.data;
        setOrden(ordenData);

        let clienteData = null;
        let equipoData = null;

        if (ordenData.id_cliente) {
          const clienteRes = await api.get(`/clients/${ordenData.id_cliente}`);
          clienteData = clienteRes.data;
          setCliente(clienteData);
        }

        if (ordenData.id_equipo) {
          const equipoRes = await api.get(`/equipments/${ordenData.id_equipo}`);
          equipoData = equipoRes.data;
          setEquipo(equipoData);
        }

        // Pre-llenar campos con datos de la orden
        setCampos({
          nombreApellido: clienteData?.nombre || '',
          telefonoEmail: `${clienteData?.telefono || ''} - ${clienteData?.email || ''}`,
          productoEquipo: `${equipoData?.tipo_equipo || ''} ${equipoData?.marca || ''} ${equipoData?.modelo || ''}`.trim(),
          otros: equipoData?.nro_serie || '',
          descripcionFalla: ordenData.descripcion_falla || '',
          trabajoRealizado: ordenData.trabajo_realizado || '',
          presupuesto: ordenData.costo_mano_obra?.toString() || ''
        });

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrdenData();
  }, [ordenId]);

  const getFechaHora = () => {
    const now = new Date();
    const fecha = orden?.fecha_recepcion
      ? new Date(orden.fecha_recepcion).toLocaleDateString('es-AR')
      : now.toLocaleDateString('es-AR');
    const hora = now.toLocaleTimeString('es-AR');
    return { fecha, hora };
  };

  const igualarCopias = () => {
    // Ya están igualadas porque usan el mismo estado
    alert('Las copias ya están igualadas');
  };

  const imprimir = () => {
    const { fecha, hora } = getFechaHora();

    const generarCopia = () => `
      <div class="page">
        <div class="header">
          <img src="${window.location.origin}/src/assets/logo-sertec.png" alt="Sertec" style="height:60px;object-fit:contain;" />
          <div class="company-info">
            <strong>SERVICIO TECNICO</strong><br>
            Florida 537 - Local290 - Subsuelo // Tel 7731-2549<br>
            Whatsapp +54 9 11-2807-1132<br>
            E-Mail sertec310@hotmail.com
          </div>
        </div>

        <table class="info-table">
          <tr>
            <td class="label">Fecha y Hora</td>
            <td class="value">${fecha}&nbsp;&nbsp;&nbsp;&nbsp;${hora}</td>
          </tr>
          <tr>
            <td class="label">Nombre y Apellido</td>
            <td class="value">${campos.nombreApellido}</td>
          </tr>
          <tr>
            <td class="label">Telefono - Msn - Email</td>
            <td class="value">${campos.telefonoEmail}</td>
          </tr>
          <tr>
            <td class="label">Producto - Equipo</td>
            <td class="value">${campos.productoEquipo}</td>
          </tr>
          <tr>
            <td class="label">Otros</td>
            <td class="value">${campos.otros}</td>
          </tr>
          <tr>
            <td class="label tall">Descripcion de Falla</td>
            <td class="value tall">${campos.descripcionFalla}</td>
          </tr>
          <tr>
            <td class="label">Trabajo realizado</td>
            <td class="value">${campos.trabajoRealizado}</td>
          </tr>
          <tr>
            <td class="label presupuesto-label">Cliente Retira<br>Conforme</td>
            <td class="value presupuesto-value">
              <table class="presupuesto-table">
                <tr>
                  <td>Presupuesto:</td>
                  <td></td>
                  <td>$ ${campos.presupuesto}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div class="aviso">
          Pasado el plazo de 90 días, no se aceptan reclamos de ningun tipo sobre los articulos dejados en Servicio Tecnico
        </div>
      </div>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; background: white; padding: 10px; font-size: 12px; }
          .page { border: 1px solid #000; padding: 10px; margin-bottom: 20px; width: 100%; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 8px; }
          .logo-text { font-size: 32px; font-weight: bold; color: #c41e3a; font-style: italic; border: 2px solid #c41e3a; padding: 4px 12px; }
          .company-info { text-align: center; font-size: 11px; line-height: 1.6; flex: 1; }
          .company-info strong { font-size: 13px; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { border: 1px solid #000; padding: 5px 8px; }
          .label { width: 30%; background: #f5f5f5; font-weight: bold; text-align: center; font-size: 11px; }
          .value { width: 70%; font-size: 11px; min-height: 22px; }
          .tall { height: 60px; vertical-align: top; }
          .presupuesto-label { text-align: center; font-weight: bold; font-size: 11px; }
          .presupuesto-table { width: 100%; border-collapse: collapse; }
          .presupuesto-table td { border: 1px solid #000; padding: 5px; text-align: center; font-size: 11px; width: 33%; }
          .aviso { font-size: 10px; margin-top: 8px; text-align: left; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${generarCopia()}
        ${generarCopia()}
      </body>
      </html>
    `;

    const win = window.open('', '', 'width=900,height=800');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const updateCampo = (field, value) => {
    setCampos(prev => ({ ...prev, [field]: value }));
  };

  const { fecha, hora } = getFechaHora();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600">Cargando orden...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex gap-4 max-w-5xl mx-auto">

        {/* Comprobante */}
        <div className="flex-1">
          {/* Copia 1 */}
          <div className="bg-white border border-gray-400 p-3 mb-4 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
              <img src={logoSertec} alt="Sertec" className="h-16 object-contain" />
              <div className="text-center text-xs leading-5 flex-1 px-4">
                <div className="font-bold text-sm">SERVICIO TECNICO</div>
                <div>Florida 537 - Local290 - Subsuelo // Tel 7731-2549</div>
                <div>Whatsapp +54 9 11-2807-1132</div>
                <div>E-Mail sertec310@hotmail.com</div>
              </div>
            </div>

            {/* Tabla de datos */}
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1 w-1/3">Fecha y Hora</td>
                  <td className="border border-gray-600 px-2 py-1 text-blue-600">{fecha}&nbsp;&nbsp;&nbsp;{hora}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">Nombre y Apellido</td>
                  <td className="border border-gray-600 p-0">
                    <input className="w-full px-2 py-1 text-xs outline-none border-none" value={campos.nombreApellido} onChange={e => updateCampo('nombreApellido', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">Telefono - Msn - Email</td>
                  <td className="border border-gray-600 p-0">
                    <input className="w-full px-2 py-1 text-xs outline-none border-none" value={campos.telefonoEmail} onChange={e => updateCampo('telefonoEmail', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">Producto - Equipo</td>
                  <td className="border border-gray-600 p-0">
                    <input className="w-full px-2 py-1 text-xs outline-none border-none" value={campos.productoEquipo} onChange={e => updateCampo('productoEquipo', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">Otros</td>
                  <td className="border border-gray-600 p-0">
                    <input className="w-full px-2 py-1 text-xs outline-none border-none" value={campos.otros} onChange={e => updateCampo('otros', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-2">Descripcion de Falla</td>
                  <td className="border border-gray-600 p-0">
                    <textarea className="w-full px-2 py-1 text-xs outline-none border-none resize-none h-16" value={campos.descripcionFalla} onChange={e => updateCampo('descripcionFalla', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">Trabajo realizado</td>
                  <td className="border border-gray-600 p-0">
                    <textarea className="w-full px-2 py-1 text-xs outline-none border-none resize-none h-12" value={campos.trabajoRealizado} onChange={e => updateCampo('trabajoRealizado', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-2 text-xs leading-4">Cliente Retira<br/>Conforme</td>
                  <td className="border border-gray-600 p-0">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td className="border border-gray-600 px-2 py-1 text-xs font-bold">Presupuesto:</td>
                          <td className="border border-gray-600 px-2 py-1"></td>
                          <td className="border border-gray-600 p-0">
                            <input className="w-full px-2 py-1 text-xs outline-none border-none" value={`$ ${campos.presupuesto}`} onChange={e => updateCampo('presupuesto', e.target.value.replace('$ ', ''))} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs mt-2">
              Pasado el plazo de 90 días, no se aceptan reclamos de ningun tipo sobre los articulos dejados en Servicio Tecnico
            </p>
          </div>

          {/* Copia 2 - Solo lectura */}
          <div className="bg-white border border-gray-400 p-3 font-sans">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
              <img src={logoSertec} alt="Sertec" className="h-16 object-contain" />
              <div className="text-center text-xs leading-5 flex-1 px-4">
                <div className="font-bold text-sm">SERVICIO TECNICO</div>
                <div>Florida 537 - Local290 - Subsuelo // Tel 7731-2549</div>
                <div>Whatsapp +54 9 11-2807-1132</div>
                <div>E-Mail sertec310@hotmail.com</div>
              </div>
            </div>

            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1 w-1/3">Fecha y Hora</td>
                  <td className="border border-gray-600 px-2 py-1 text-blue-600">{fecha}&nbsp;&nbsp;&nbsp;{hora}</td>
                </tr>
                {[
                  ['Nombre y Apellido', campos.nombreApellido],
                  ['Telefono - Msn - Email', campos.telefonoEmail],
                  ['Producto - Equipo', campos.productoEquipo],
                  ['Otros', campos.otros],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">{label}</td>
                    <td className="border border-gray-600 px-2 py-1">{value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-2">Descripcion de Falla</td>
                  <td className="border border-gray-600 px-2 py-1 h-16 align-top">{campos.descripcionFalla}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-1">Trabajo realizado</td>
                  <td className="border border-gray-600 px-2 py-1 h-12 align-top">{campos.trabajoRealizado}</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 bg-gray-100 font-bold text-center px-2 py-2 text-xs leading-4">Cliente Retira<br/>Conforme</td>
                  <td className="border border-gray-600 p-0">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td className="border border-gray-600 px-2 py-1 text-xs font-bold">Presupuesto:</td>
                          <td className="border border-gray-600 px-2 py-1"></td>
                          <td className="border border-gray-600 px-2 py-1 text-xs">$ {campos.presupuesto}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs mt-2">
              Pasado el plazo de 90 días, no se aceptan reclamos de ningun tipo sobre los articulos dejados en Servicio Tecnico
            </p>
          </div>
        </div>

        {/* Botones laterales */}
        <div className="flex flex-col gap-2 pt-4">
          <button
            onClick={imprimir}
            className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 text-sm font-medium rounded transition"
          >
            Imprimir
          </button>
        </div>

      </div>
    </div>
  );
}