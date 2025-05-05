// src/views/admin/panel-de-control/RegistroDePacientes/ConsentimientoDigitalizacion/ConsentimientoDigitalizacion.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEdit, faEraser } from '@fortawesome/free-solid-svg-icons';
import { generatePdf } from './PdfGenerado';
import styles from './ConsentimientoDigitalizacion.module.css'; // Ya no importamos el CSS Module
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

  const handeSearchNo = () => {
    Swalwait('Buscando Datos','Espere por favor...')
    GetNoConsentimiento(orderNumber,token)
    .then((res) => {
      if (res.dni) {
        setDni(res.dni)
        setName(res.nombresApellidos)
        setDate(res.fechaExamen)
        setSaveButton(true)
      } else {
        Swal.fire('Error', 'Ha ocurrido un error','error')
      }
    })
    .finally(() => {
        Swal.close()
    });
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

  const handlePrint = () => {
    if (!dni) return Swal.fire('Error', 'Coloque el DNI', 'error');

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

  return (
    <div className="p-4 font-sans">
      <div className="flex items-center gap-4 mb-4">
        <label className="block">
          Nro: Orden&nbsp;
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handeSearchNo(); // 👉 aquí llamas a la función que quieras
              }
            }}
            className={styles.input}
          />
        </label>

        <label className="block">
          Fecha:&nbsp;
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border border-gray-300 rounded py-1 px-2 w-32"
          />
        </label>
      </div>

      <h2 className="text-center text-xl font-bold my-4">
        DECLARACIÓN JURADA PARA EL USO DE LA FIRMA ELECTRÓNICA
      </h2>

      <div className="flex items-center gap-2 mb-4">
        <label className="block">
          Yo,&nbsp;
        </label>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-300 rounded py-1 px-2 flex-grow"
        />
        <label className="block whitespace-nowrap">
          &nbsp;identificado(a) con DNI N.º&nbsp;
        </label>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={e => setDni(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block">
          <input
            type="checkbox"
            checked={authorized}
            onChange={() => setAuthorized(!authorized)}
          />
          Autorizo el uso de mi firma electrónica y huella, exclusivamente para la impresión de informes médicos. Esta firma tendrá validez para los documentos necesarios implicados en este proceso. Asimismo, doy fe de que la información proporcionada es verídica, al igual que la información que brindaré durante los exámenes realizados en el centro médico Horizonte Medic. También, autorizo el envío de información médica a los correos electrónicos y/o números de celular de la empresa contratista.
        </label>
      </div>

      <div className={styles.footer}>
        <button className={`${styles.primaryButton} ease-in-out ${!saveButton ? 'bg-zinc-500 cursor-default ea' : 'bg-[#0069d9] cursor-pointer'}`} disabled={!saveButton} onClick={handleSave}>
          Grabar/actualizar
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center gap-1" onClick={handleReset}>
          <FontAwesomeIcon icon={faEraser} /> Limpiar
        </button>

        <div className="ml-auto">
          <button className="flex items-center gap-1 bg-white border border-gray-300 rounded py-1 px-2 text-sm hover:bg-gray-100" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentimientoDigitalizacion;