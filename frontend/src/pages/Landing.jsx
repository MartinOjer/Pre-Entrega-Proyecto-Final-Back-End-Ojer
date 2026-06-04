import { MapPin, Phone, Mail, Clock, Wrench, Laptop, Smartphone, Printer, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Hero */}
      <header className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-white rounded-lg p-3">
                <Wrench className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-5xl font-bold">SERTEC</h1>
            </div>
            <p className="text-2xl mb-4">Servicio Técnico Especializado</p>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Reparación de notebooks, computadoras, impresoras y equipos electrónicos
            </p>
            <div className="mt-8">
              <a
                href="/login"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition transform hover:scale-105"
              >
                Acceso Empleados
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </header>

      {/* Servicios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600">Soluciones completas para todos tus equipos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Laptop className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Notebooks</h3>
              <p className="text-gray-600">Reparación de pantallas, teclados, baterías y más</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Computadoras</h3>
              <p className="text-gray-600">PC de escritorio, hardware y software</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Celulares</h3>
              <p className="text-gray-600">Pantallas, baterías y reparaciones generales</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Printer className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Impresoras</h3>
              <p className="text-gray-600">Mantenimiento y reparación de impresoras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por Qué Elegirnos?</h2>
            <p className="text-xl text-gray-600">Experiencia y calidad en cada reparación</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Técnicos Certificados</h3>
              <p className="text-gray-600">Personal capacitado y con experiencia en el rubro</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Garantía de Servicio</h3>
              <p className="text-gray-600">Todas nuestras reparaciones incluyen garantía</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Repuestos Originales</h3>
              <p className="text-gray-600">Utilizamos repuestos de primera calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto y Ubicación */}
      <section id="contacto" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contacto y Ubicación</h2>
            <p className="text-xl text-gray-600">Visitanos o comunicate con nosotros</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Dirección</h4>
                    <p className="text-gray-600">Florida 537 - Local 290 - Subsuelo</p>
                    <p className="text-gray-600">Ciudad Autónoma de Buenos Aires</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Teléfonos</h4>
                    <p className="text-gray-600">Tel: 7731-2549</p>
                    <p className="text-gray-600">WhatsApp: +54 9 11-2807-1132</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-gray-600">sertec310@hotmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Horarios de Atención</h4>
                    <p className="text-gray-600">Lunes a Viernes: 12:00 - 20:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Pasado el plazo de 90 días, no se aceptan reclamos de ningún tipo sobre los artículos dejados en Servicio Técnico
                </p>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-full min-h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016944181334!2d-58.37566492346215!3d-34.60373107295729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf7eb4b6b5%3A0x5c4f3c6c0b4f4f4e!2sFlorida%20537%2C%20C1005AAK%20CABA!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación SERTEC"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wrench className="w-6 h-6" />
              <span className="text-xl font-bold">SERTEC</span>
            </div>
            <p className="text-gray-400 mb-2">Servicio Técnico Especializado</p>
            <p className="text-gray-400 text-sm">© 2025 SERTEC. Todos los derechos reservados.</p>
            <div className="mt-4">
              <a
                href="/login"
                className="text-red-400 hover:text-red-300 text-sm transition"
              >
                Acceso Sistema de Gestión
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}