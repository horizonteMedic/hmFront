// src/views/admin/panel-de-control/RegistroDePacientes/ConsentimientoDigitalizacion/ConsentimientoDigitalizacion.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEdit, faEraser } from '@fortawesome/free-solid-svg-icons';
import { generatePdf } from './PdfGenerado';
import styles from './ConsentimientoDigitalizacion.module.css';
import { VerifyHoF } from '../model/Submit';
import Swal from 'sweetalert2';
import { GetNoConsentimiento, SubmitConsentimiento } from '../model/Consentimiento';

const ConsentimientoDigitalizacion = ({token, userlogued}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [edad, setEdad] = useState('');
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
    setEdad('');
    setDni('');
    setAuthorized(false);
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
        Swal.fire('Exito', 'Consentimiento guardado exitosamente','success')
      } else {
        Swal.fire('Error', 'Ha ocurrido un error','error')
      }
    })
  };

  const handlePrint = () => {
      if (!dni) return Swal.fire('Error','Coloque el DNI','error') 
        // Mostrar el mensaje de carga
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
      VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${dni}/FIRMAP`)
    ])
    .then(([Huella, Firma]) => {
      const huellaData = Huella.id === 1 ? { id: 1, url: Huella.mensaje } : { id: 0, url: '' };
      const firmaData  = Firma.id === 1 ? { id: 1, url: Firma.mensaje } : { id: 0, url: '' };
      console.log('huella',huellaData)
      console.log('firma',firmaData)
      generatePdf({ nombre: name, edad, dni, orderNumber, FirmaP: firmaData, HuellaP: huellaData });
    })
    .catch(error => {
      Swal.fire('Error', 'No se pudo generar el consentimiento', 'error');
      console.error(error);
    })
    .finally(() => {
        Swal.close()
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label>
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
        <button className={styles.iconButton} onClick={handleSave}>
          <FontAwesomeIcon icon={faEdit} /> Editar
        </button>
        <label>
          Fecha:&nbsp;
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className={styles.input}
          />
        </label>
      </div>

      <h2 className={styles.title}>
        DECLARACIÓN JURADA PARA EL USO DE LA FIRMA ELECTRÓNICA
      </h2>

      <div className={styles.formRow}>
        <label>
          Yo,&nbsp;
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.input}
          />
        </label>
        &nbsp;de&nbsp;
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={e => setEdad(e.target.value)}
          className={styles.input}
        />
        &nbsp;años de edad, identificado(a) con DNI N.&deg;&nbsp;
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={e => setDni(e.target.value)}
            className={styles.input}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            checked={authorized}
            onChange={() => setAuthorized(!authorized)}
          />
          &nbsp;Autorizo el uso de mi firma electrónica y huella, exclusivamente para la impresión de informes médicos. Esta firma tendrá validez para los documentos necesarios implicados en este proceso. Asimismo, doy fe de que la información proporcionada es verídica, al igual que la información que brindaré durante los exámenes realizados en el centro médico Horizonte Medic. También, autorizo el envío de información médica a los correos electrónicos y/o números de celular de la empresa contratista.
        </label>
      </div>

      <div className={styles.footer}>
        <button className={`${styles.primaryButton} ease-in-out ${!saveButton ? 'bg-zinc-500 cursor-default ea' : 'bg-[#0069d9] cursor-pointer'}`} disabled={!saveButton} onClick={handleSave}>
          Grabar/actualizar
        </button>
        <button className={styles.secondaryButton} onClick={handleReset}>
          <FontAwesomeIcon icon={faEraser} /> Limpiar
        </button>

        <div className={styles.printSection}>
          <button className={styles.iconButton} onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentimientoDigitalizacion;
