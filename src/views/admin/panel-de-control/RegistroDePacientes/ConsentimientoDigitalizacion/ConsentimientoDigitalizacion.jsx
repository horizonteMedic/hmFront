// src/views/admin/panel-de-control/RegistroDePacientes/ConsentimientoDigitalizacion/ConsentimientoDigitalizacion.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEdit, faEraser } from '@fortawesome/free-solid-svg-icons';
import { generatePdf } from './PdfGenerado';
import { VerifyHoF } from '../model/Submit';
import Swal from 'sweetalert2';
import { GetNoConsentimiento, SubmitConsentimiento } from '../model/Consentimiento';
import { getFetch } from '../../getFetch/getFetch';

const ConsentimientoDigitalizacion = ({token, userlogued}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [authorized, setAuthorized] = useState(true);
  const [saveButton, setSaveButton] = useState(false)

  const Swalwait = (title, body) => {
    Swal.fire({
      title: title,
      text: body,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  const handeSearchNo = async () => {
    try {
      Swalwait('Buscando Datos','Espere por favor...')
      const res = await GetNoConsentimiento(orderNumber,token)
      
      if (res.dni) {
        await Promise.all([
          new Promise(resolve => {
            setDni(res.dni)
            resolve()
          }),
          new Promise(resolve => {
            setName(res.nombresApellidos)
            resolve()
          }),
          new Promise(resolve => {
            setDate(res.fechaExamen)
            resolve()
          }),
          new Promise(resolve => {
            setSaveButton(true)
            resolve()
          })
        ])
        Swal.close()
      } else {
        Swal.fire('Error', 'Ha ocurrido un error','error')
      }
    } catch (error) {
      Swal.fire('Error', 'Ha ocurrido un error','error')
    }
  } 

  const handleReset = () => {
    setOrderNumber('');
    setDate('');
    setName('');
    setDni('');
  };

  const handleSave = () => {
    Swalwait('Enviando Datos','Espere por favor...')
    const data = {
      user: userlogued,
      norden: orderNumber
    }
    SubmitConsentimiento(data,token)
    .then((res) => {
      if (res.norden) {
        Swal.fire({title: 'Exito', text:'Consentimiento guardado exitosamente\n¿Desea Imprimir?',icon:'success',cancelButtonText: "No"}).then((res) => {if(res.isConfirmed) handlePrint()})
      } else {
        Swal.fire('Error', 'Ha ocurrido un error','error')
      }
    })
  };

  // Nuevo: función para validar si se puede guardar
  const canSave =
    String(orderNumber).trim() &&
    String(date).trim() &&
    String(name).trim() &&
    String(dni).trim() &&
    authorized;

  const handlePrint = () => {
    if (!String(dni).trim() && !String(orderNumber).trim()) {
      return Swal.fire('Error', 'Ingrese DNI y Nro orden', 'error');
    }
    if (!String(dni).trim()) {
      return Swal.fire('Error', 'Ingrese DNI', 'error');
    }
    if (!String(orderNumber).trim()) {
      return Swal.fire('Error', 'Ingrese Nro orden', 'error');
    }

    Swal.fire({
      title: 'Generando Consentimiento',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    Promise.all([
      VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${dni}/HUELLA`),
      VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${dni}/FIRMAP`),
      getFetch(`/api/v01/ct/consentDigit/infoFormatoConsentDigitalizado/${orderNumber}`, token)
    ])
    .then(([Huella, Firma, jasper]) => {
      const huellaData = Huella.id === 1 ? { id: 1, url: Huella.mensaje } : { id: 0, url: '' };
      const firmaData = Firma.id === 1 ? { id: 1, url: Firma.mensaje } : { id: 0, url: '' };
      generatePdf({ nombre: name, dni, orderNumber, FirmaP: firmaData, HuellaP: huellaData, token: token, jasper });
    })
    .catch(error => {
      Swal.fire('Error', 'No se pudo generar el consentimiento', 'error');
      console.error(error);
    })
    .finally(() => {
      Swal.close();
    });
  };
  console.log(date)
  return (
    <div className="max-w mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <label className="flex-1">
          <span className="block mb-1" style={{color: '#000',fontWeight:'bold'}}>Nro: Orden</span>
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handeSearchNo();
              }
            }}
            className="w-full border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Ingrese número de orden"
          />
        </label>
        <label className="flex-1">
          <span className="block mb-1" style={{color: '#000',fontWeight:'bold'}}>Fecha</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <h2 className="text-center text-2xl mb-8 tracking-wide" style={{color: '#000',fontWeight:'bold'}}>
        DECLARACIÓN JURADA PARA EL USO DE LA FIRMA ELECTRÓNICA
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
        <span className="font-medium" style={{color: '#000',fontWeight:'bold'}}>Yo,</span>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <span className="font-medium whitespace-nowrap" style={{color: '#000',fontWeight:'bold'}}>identificado(a) con DNI N.º</span>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={e => setDni(e.target.value)}
          className="w-40 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>

      <div className="flex items-start gap-3 mb-8">
        <input
          type="checkbox"
          checked={authorized}
          onChange={() => setAuthorized(!authorized)}
          className="mt-1 w-5 h-5 accent-blue-600 border-2 border-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-base leading-relaxed">
          Autorizo el uso de mi firma electrónica y huella, exclusivamente para la impresión de informes médicos. Esta firma tendrá validez para los documentos necesarios implicados en este proceso. Asimismo, doy fe de que la información proporcionada es verídica, al igual que la información que brindaré durante los exámenes realizados en el centro médico Horizonte Medic. También, autorizo el envío de información médica a los correos electrónicos y/o números de celular de la empresa contratista.
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 border-t pt-6 mt-6">
        <button
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white shadow transition-colors duration-200 ${canSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!canSave}
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faEdit} />
          Grabar/actualizar
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 shadow transition-colors duration-200"
          onClick={handlePrint}
        >
          <FontAwesomeIcon icon={faPrint} />
          Imprimir
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 shadow border border-gray-400 transition-colors duration-200"
          onClick={handleReset}
        >
          <FontAwesomeIcon icon={faEraser} />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default ConsentimientoDigitalizacion;