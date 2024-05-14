import React from 'react';
const ReportesMinera = () => {
  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white  rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-start font-bold color-azul text-white">Triaje</h1>
        </div>
      <div className="overflow-x-auto mb-4 p-3">
        <form>
          <div className="grid  gap-4 mb-4">
            <div>
              <label htmlFor="expmedico" className="block text-gray-700">
                Expediente Médico:
              </label>
            </div>
            <div>
              <label htmlFor="empresa" className="block  ">
                Empresa:
              </label>
          </div>
          <div>
            <label htmlFor="contrata" className="block ">
              Cpntrata:
            </label>
          </div>
          <div>
            <label htmlFor="historial" className="block  ">
              N° Historial:
            </label>
          </div>
          <div>
            <label htmlFor="nombres" className="block ">
              Nombres:
            </label>
          
          </div>
          <div>
            <label htmlFor="apellidos" className="block  ">
              Apellidos:
            </label>
          
          </div>
          <div>
            <label htmlFor="apellidos" className="block ">
              Apellidos:
            </label>
          
          </div>
          <div>
            <label htmlFor="fechaNacimiento" className="block">
              Fecha de Nacimiento
            </label>
          </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default ReportesMinera;
