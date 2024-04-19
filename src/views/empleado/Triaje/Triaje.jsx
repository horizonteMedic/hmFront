import React, { useState } from 'react';
import './Triaje.css'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export default function Triaje() {
  const [tipo, setTipo] = useState('');
  const [numero, setNumero] = useState('');
  const [exMedico, setExMedico] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [contrata, setContrata] = useState('');
  const [historial, setHistorial] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [edad, setEdad] = useState('');
  const [fechaTriaje, setFechaTriaje] = useState(null);
  const [showDatePickerNacimiento, setShowDatePickerNacimiento] = useState(false);
  const [showDatePickerTriaje, setShowDatePickerTriaje] = useState(false);

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  const handleNumeroChange = (event) => {
    setNumero(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="triage-card">
      <h1><strong>Datos: </strong></h1>
      <div className="card-body">
        
        <form onSubmit={handleSubmit}>
        <div className="check-group">  
              <input type="radio" id="Recibo" value="Recibo" className="custom-checkbox" />
              <label htmlFor="Recibo">Recibo</label>
              <input type="radio" id="orden" value="orden" className="custom-checkbox" />
              <label htmlFor="orden">N° Orden</label>
            </div>
          <div className="input-group">
            
            <label htmlFor="numero">Nro:</label>
            <input type="text" id="numero" value={numero} onChange={handleNumeroChange} className="rounded-input" />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <div className="radio-group">
              <input type="radio" id="Recibo" value="Recibo" className="custom-checkbox" />
              <label htmlFor="Recibo">Recibo</label>
              <input type="radio" id="orden" value="orden" className="custom-checkbox" />
              <label htmlFor="orden">N° Orden</label>
            </div>
          </div>
         
          <div className="input-group">
            <label htmlFor="exMedico">Ex.Médico:</label>
            <select id="exMedico" value={exMedico} onChange={(e) => setExMedico(e.target.value)} className="rounded-select white-select">
              <option value="">Seleccionar</option>
              {/* Api*/}
              </select>
          </div>
          <div className="input-group">
            <label htmlFor="empresa">Empresa:</label>
            <select id="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className="rounded-select white-select">
              <option value="">Seleccionar</option>
              {/* Api*/}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="contrata">Contrata:</label>
            <select id="contrata" value={contrata} onChange={(e) => setContrata(e.target.value)} className="rounded-select white-select">
              <option value="">Seleccionar</option>
              {/* aplicaremos consumir API */}
            </select>
          </div>
          <hr className="separator" />
          <div className="input-group">
            <label htmlFor="historial">N° Historial:</label>
            <input type="text" id="historial" value={historial} onChange={(e) => setHistorial(e.target.value)} className="rounded-input" />
          </div>
          <div className="input-group">
            <label htmlFor="nombres">Nombres:</label>
            <input type="text" id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} className="rounded-input" />
          </div>
          <div className="input-group">
            <label htmlFor="apellidos">Apellidos:</label>
            <input type="text" id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="rounded-input" />
            <label htmlFor="edad">Edad:</label>
            <input type="text" id="edad" value={edad} onChange={(e) => setEdad(e.target.value)} className="rounded-input" />
          </div>
          <div className="input-group">
            <label htmlFor="fechaNacimiento">Fecha Nac.:</label>
            <DatePicker
              selected={fechaNacimiento}
              onChange={(date) => setFechaNacimiento(date)}
              dateFormat="dd/MM/yyyy"
              className="rounded-input"
              onClickOutside={() => setShowDatePickerNacimiento(false)}
              onFocus={() => setShowDatePickerNacimiento(true)}
              open={showDatePickerNacimiento}
            />
            <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" onClick={() => setShowDatePickerNacimiento(!showDatePickerNacimiento)} />
            <label htmlFor="fechaTriaje">Fecha Triaje:</label>
            <DatePicker
              selected={fechaTriaje}
              onChange={(date) => setFechaTriaje(date)}
              dateFormat="dd/MM/yyyy"
              className="rounded-input"
              onClickOutside={() => setShowDatePickerTriaje(false)}
              onFocus={() => setShowDatePickerTriaje(true)}
              open={showDatePickerTriaje}
            />
            <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" onClick={() => setShowDatePickerTriaje(!showDatePickerTriaje)} />
          </div>
        </form>
      </div>
    </div>
  );
}
