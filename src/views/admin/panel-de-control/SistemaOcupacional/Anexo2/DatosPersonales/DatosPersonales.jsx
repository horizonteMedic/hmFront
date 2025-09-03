const DatosPersonales = () => {
  return (
    <div className="p-4" style={{ fontSize: '10px' }}>
      <h3 className="font-semibold mb-4 text-gray-800">Datos Personales</h3>
      
      {/* Header con información del examen */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-3">
            <div className="flex items-center space-x-2">
              <label className="w-16 font-medium text-gray-700">N° Orden:</label>
              <input type="text" defaultValue="96639" className="w-20 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Editar</button>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-2">
              <label className="w-20 font-medium text-gray-700">Ex-Médico:</label>
              <input type="text" defaultValue="PRE-OCUPACIONAL" className="w-32 px-1 py-0.5 border border-gray-300 rounded" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-2">
              <label className="w-24 font-medium text-gray-700">Fecha Exámen:</label>
              <input type="text" defaultValue="22/08/2025" className="w-24 px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Columna Izquierda */}
        <div className="lg:col-span-6 space-y-3">
          {/* Identificación Personal */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Identificación Personal</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">DNI:</label>
                <input type="text" defaultValue="72384273" className="w-20 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Nombres:</label>
                <input type="text" defaultValue="HADY KATHERINE" className="w-32 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Apellidos:</label>
                <input type="text" defaultValue="CASTILLO PLASENCIA" className="w-32 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Fecha Nac.:</label>
                <input type="text" defaultValue="23/01/1994" className="w-20 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Sexo:</label>
                <input type="text" defaultValue="F" className="w-8 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Edad:</label>
                <input type="text" defaultValue="31" className="w-8 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
            </div>
          </div>

          {/* Contacto y Estado Civil */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Contacto y Estado Civil</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Lugar Nac.:</label>
                <input type="text" defaultValue="TRUJILLO" className="w-24 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Domicilio:</label>
                <input type="text" defaultValue="SAC 1 URB PARQUE INDUSTRIAL MZ D LT 3" className="w-48 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Teléfono:</label>
                <input type="text" defaultValue="969394955" className="w-24 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Estado Civil:</label>
                <input type="text" defaultValue="SOLTERO" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Grado Inst.:</label>
                <input type="text" defaultValue="TECNICO" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Información Laboral</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Empresa:</label>
                <input type="text" defaultValue="MINERA BOROO MISQUICHILCA S.A." className="w-48 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Contrata:</label>
                <input type="text" defaultValue="N/A" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Mineral Exp:</label>
                <input type="text" defaultValue="NO APLICA" className="w-24 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Explotación:</label>
                <input type="text" defaultValue="SUPERFICIE" className="w-24 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Altura Labor:</label>
                <input type="text" defaultValue="DEBAJO 2500" className="w-24 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Comparación Grupo Sanguíneo */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Comparación Grupo Sanguíneo</h4>
            <div className="flex items-center space-x-2">
              <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span className="font-medium">-</span>
              <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-6 space-y-3">
          {/* Antecedentes Personales */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Ant. Personales</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="mr-1" />
                <label className="w-16 font-medium text-gray-700">Neoplasia:</label>
                <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="mr-1" />
                <label className="w-16 font-medium text-gray-700">ITS:</label>
                <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="mr-1" />
                <label className="w-16 font-medium text-gray-700">Quemaduras:</label>
                <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="mr-1" />
                <label className="w-16 font-medium text-gray-700">Cirugías:</label>
                <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="mr-1" />
                <label className="w-16 font-medium text-gray-700">Otros:</label>
                <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Residencia en el lugar de trabajo */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Residencia en el lugar de trabajo</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <label className="font-medium text-gray-700">Reside:</label>
                <label className="flex items-center">
                  <input type="radio" name="reside" value="SI" className="mr-1" />
                  <span>SI</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="reside" value="NO" className="mr-1" />
                  <span>NO</span>
                </label>
                <label className="w-12 font-medium text-gray-700">Tiempo:</label>
                <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-1" />
                  <label className="w-16 font-medium text-gray-700">ESSALUD:</label>
                  <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-1" />
                  <label className="w-16 font-medium text-gray-700">EPS:</label>
                  <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-1" />
                  <label className="w-16 font-medium text-gray-700">SCTR:</label>
                  <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-1" />
                  <label className="w-16 font-medium text-gray-700">Otros:</label>
                  <input type="text" className="w-16 px-1 py-0.5 border border-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Antecedentes Familiares */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Antecedentes Familiares</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Padre:</label>
                <input type="text" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Madre:</label>
                <input type="text" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Hermanos:</label>
                <input type="text" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium text-gray-700">Esposa(o):</label>
                <input type="text" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Detalles del Puesto */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Detalles del Puesto</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium text-gray-700">Puesto Postula:</label>
                <input type="text" defaultValue="ASISTENTE ADMINISTRATIVA" className="w-32 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium text-gray-700">Área:</label>
                <input type="text" defaultValue="ADMINISTRACION" className="w-24 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium text-gray-700">Puesto Actual:</label>
                <input type="text" defaultValue="N/A" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium text-gray-700">Tiempo:</label>
                <input type="text" defaultValue="N/A" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Medicamentos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Medicamentos</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <label className="font-medium text-gray-700">Toma medicamentos:</label>
                <label className="flex items-center">
                  <input type="radio" name="medicamentos" value="SI" className="mr-1" />
                  <span>SI</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="medicamentos" value="NO" className="mr-1" defaultChecked />
                  <span>NO</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Tipo:</label>
                <input type="text" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
                <label className="w-16 font-medium text-gray-700">Frecuencia:</label>
                <input type="text" className="w-20 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Número de Hijos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Número de Hijos</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Vivos:</label>
                <input type="text" defaultValue="0" className="w-8 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Muertos:</label>
                <input type="text" defaultValue="0" className="w-8 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">N° Dependientes:</label>
                <input type="text" className="w-8 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
            </div>
          </div>

          {/* Medidas Generales */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Medidas Generales</h4>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Talla:</label>
                <input type="text" defaultValue="170" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
                <span>m.</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Peso:</label>
                <input type="text" defaultValue="65" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
                <span>Kg.</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">IMC:</label>
                <input type="text" defaultValue="0.00" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
            </div>
          </div>

          {/* Absentismo */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">Absentismo: Enfermedades y accidentes</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium text-gray-700">Enfermedad, Accidente:</label>
                <input type="text" className="w-32 px-1 py-0.5 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-24 font-medium text-gray-700">Asociado al Trabajo:</label>
                <label className="flex items-center">
                  <input type="radio" name="asociado" value="SI" className="mr-1" />
                  <span>SI</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="asociado" value="NO" className="mr-1" />
                  <span>NO</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Año:</label>
                <input type="text" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
                <label className="w-20 font-medium text-gray-700">Días descanso:</label>
                <input type="text" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosPersonales;
