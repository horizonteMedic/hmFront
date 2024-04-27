import React from 'react';

const MatrizPostulante = () => {
  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white  rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-2xl font-bold color-azul text-white">Usuarios con Accesos</h1>
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          <div>
            <p className="font-semibold">R.U.C. Empresa</p>
            <p>20539739060</p>
          </div>
          <div>
            <p className="font-semibold">Fecha Inicio</p>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              placeholder="Ingrese la fecha de inicio"
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div>
            <p className="font-semibold">Fecha Fin</p>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              placeholder="Ingrese la fecha de fin"
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end p-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md azul-btn">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default MatrizPostulante;
