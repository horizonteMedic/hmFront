import React from 'react';
import microscopioImg from './microscopio.webp';

const HematologiaBioquimicaSIEO = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Barra superior sola y alineada */}
      <div className="flex flex-wrap items-center w-full gap-3 p-2 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <label className="font-medium flex items-center whitespace-nowrap"><input type="checkbox" className="mr-1"/> Consultas</label>
          <label className="font-medium flex items-center whitespace-nowrap"><input type="checkbox" className="mr-1"/> Particular</label>
          <label className="font-medium flex items-center whitespace-nowrap"><input type="checkbox" className="mr-1" defaultChecked/> Ficha Médica Ocupacional</label>
          <label className="font-medium flex items-center whitespace-nowrap">N° Orden:<input className="border rounded px-2 py-1 w-28 text-md ml-1" /></label>
          <label className="font-medium flex items-center whitespace-nowrap">N° Recibo:<input className="border rounded px-2 py-1 w-28 text-md ml-1" /></label>
          <label className="font-medium flex items-center whitespace-nowrap">DNI:<input className="border rounded px-2 py-1 w-28 text-md ml-1" /></label>
          <label className="font-medium flex items-center whitespace-nowrap">Fecha:<input type="date" className="border rounded px-2 py-1 w-36 text-md ml-1" /></label>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button className="bg-blue-600 hover:bg-blue-700 border border-blue-700 rounded px-4 py-1 text-md text-white font-semibold flex items-center"><i className="fa fa-pencil mr-2"></i>Editar</button>
          <label className="font-medium flex items-center whitespace-nowrap ml-2"><input type="checkbox" className="mr-1"/> <span className="text-red-600 font-semibold">INCOMPLETO</span></label>
        </div>
      </div>
      {/* Contenido principal en columnas */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Columna Izquierda: Formulario principal */}
        <div className="bg-white rounded shadow p-4 min-w-[400px] w-full md:w-[65%]">
          {/* Responsable y datos generales */}
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-2 w-full">
              <label className="font-medium min-w-[140px]">Responsable Lab :</label>
              <input className="border rounded px-2 py-1 flex-1 text-md" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <label className="font-medium min-w-[140px]">Nombres :</label>
              <input className="border rounded px-2 py-1 flex-1 text-md" />
              <span className="ml-4 font-bold text-blue-700 flex-1 text-right">G.F. Sang. Pedido</span>
            </div>
            <div className="flex items-center gap-2 w-full">
              <label className="font-medium min-w-[140px]">Emp. Contratista :</label>
              <input className="border rounded px-2 py-1 flex-1 text-md" />
              <label className="font-medium min-w-[90px] ml-4">Empresa :</label>
              <input className="border rounded px-2 py-1 flex-1 text-md" />
              <label className="font-medium flex items-center ml-4"><input type="checkbox" className="mr-1"/> N/A</label>
            </div>
          </div>
          {/* Hematología */}
          <fieldset className="border rounded p-3 mt-2 mb-2">
            <legend className="text-lg text-blue-700 font-bold px-2">Hematología</legend>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Grupo Sanguíneo y Factor */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <label className="font-medium">Grupo Sanguíneo :</label>
                <div className="flex gap-2 items-center mb-2">
                  <label className="font-medium"><input type="radio" name="grupo" className="mr-1"/>O</label>
                  <label className="font-medium"><input type="radio" name="grupo" className="mr-1"/>A</label>
                  <label className="font-medium"><input type="radio" name="grupo" className="mr-1"/>B</label>
                  <label className="font-medium"><input type="radio" name="grupo" className="mr-1"/>AB</label>
                </div>
                <div className="flex gap-2 items-center mb-2">
                  <span className="font-medium">Factor Rh:</span>
                  <label className="font-medium ml-2"><input type="radio" name="rh" className="mr-1"/>Rh(+)</label>
                  <label className="font-medium ml-2"><input type="radio" name="rh" className="mr-1"/>Rh(-)</label>
                </div>
              </div>
              {/* Valores Hematología alineados */}
              <div className="flex flex-1 gap-12">
                {/* Primera columna */}
                <div className="flex flex-col gap-1 w-full">
                  {[
                    {label: 'Hemoglobina', unit: 'g/dl'},
                    {label: 'Hematocrito', unit: '%'},
                    {label: 'V.S.G.', unit: 'mm/Hora'},
                    {label: 'Leucocitos', unit: 'mm³'},
                    {label: 'Hematíes', unit: 'mm³'},
                    {label: 'Plaquetas', unit: 'mm³'},
                    {label: 'Linfocitos', unit: '%'},
                  ].map((item, idx) => (
                    <div className="flex items-center mb-1" key={item.label}>
                      <label className="font-medium w-36 text-right whitespace-nowrap">{item.label} :</label>
                      <input className="border rounded px-2 py-1 w-32 text-md ml-2" />
                      <span className="ml-2">{item.unit}</span>
                    </div>
                  ))}
                </div>
                {/* Segunda columna */}
                <div className="flex flex-col gap-1 w-full">
                  {[
                    {label: 'Neutrófilos', unit: '%'},
                    {label: 'Abastonados', unit: '%'},
                    {label: 'Segmentados', unit: '%'},
                    {label: 'Monocitos', unit: '%'},
                    {label: 'Eosinófilos', unit: '%'},
                    {label: 'Basófilos', unit: '%'},
                  ].map((item, idx) => (
                    <div className="flex items-center mb-1" key={item.label}>
                      <label className="font-medium w-36 text-right whitespace-nowrap">{item.label} :</label>
                      <input className="border rounded px-2 py-1 w-32 text-md ml-2" />
                      <span className="ml-2">{item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
          {/* Bioquímica */}
          <fieldset className="border rounded p-3 mb-2">
            <legend className="text-md text-blue-700 font-semibold px-2">Bioquímica</legend>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <label className="font-medium min-w-[90px]">Glucosa:</label>
                <input className="border rounded px-2 py-1 w-24 text-md" />
                <span className="ml-2">mg/dl</span>
                <label className="font-medium ml-2"><input type="checkbox" className="mr-1"/> N/A</label>
                <span className="ml-2 text-gray-500">Valores normales 70 - 110 mg/dl</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <label className="font-medium min-w-[90px]">Creatinina:</label>
                <input className="border rounded px-2 py-1 w-24 text-md" />
                <span className="ml-2">mg/dl</span>
                <label className="font-medium ml-2"><input type="checkbox" className="mr-1"/> N/A</label>
                <span className="ml-2 text-gray-500">Valores normales 0.8 - 1.4 mg/dl</span>
              </div>
            </div>
          </fieldset>
          {/* Reacciones Serológicas */}
          <fieldset className="border rounded p-3 mb-2">
            <legend className="text-md text-blue-700 font-semibold px-2">Reacciones Serológicas</legend>
            <div className="flex flex-wrap gap-8">
              {/* RPR */}
              <div className="flex flex-col gap-1 min-w-[200px]">
                <label className="font-medium">RPR:</label>
                <div className="flex gap-2 items-center">
                  <input className="border rounded px-2 py-1 w-24 text-md" placeholder="N/A" />
                  <label className="font-medium ml-2"><input type="checkbox" className="mr-1" defaultChecked/> N/A</label>
                  <label className="font-medium ml-2"><input type="radio" name="rpr" className="mr-1"/>+</label>
                  <label className="font-medium ml-2"><input type="radio" name="rpr" className="mr-1"/>-</label>
                </div>
              </div>
              {/* VIH */}
              <div className="flex flex-col gap-1 min-w-[200px]">
                <label className="font-medium">VIH:</label>
                <div className="flex gap-2 items-center">
                  <input className="border rounded px-2 py-1 w-24 text-md" placeholder="N/A" />
                  <label className="font-medium ml-2"><input type="checkbox" className="mr-1" defaultChecked/> N/A</label>
                  <label className="font-medium ml-2"><input type="radio" name="vih" className="mr-1"/>+</label>
                  <label className="font-medium ml-2"><input type="radio" name="vih" className="mr-1"/>-</label>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        {/* Columna Derecha: Registros anteriores y microscopio */}
        <div className="bg-white rounded shadow p-4 min-w-[350px] w-full md:w-[35%] flex flex-col justify-between">
          <div>
            <div className="font-semibold text-blue-700 mb-2">Registros anteriores de grupo sanguíneo</div>
            <div className="border rounded bg-blue-50 min-h-[120px] mb-4"></div>
          </div>
          <div className="flex justify-center items-end mt-8">
            <img src={microscopioImg} alt="Microscopio" className="w-{[320px] h-[320px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HematologiaBioquimicaSIEO;
