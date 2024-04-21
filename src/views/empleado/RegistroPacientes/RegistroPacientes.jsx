import React, { useState } from 'react';
import './Registro.css'
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../../components/Navbar-client"; // Importa el componente Navbar
import Footer from "../../components/Footer";

import 'react-datepicker/dist/react-datepicker.css';

export default function RegistroDePacientes() {
  const [dniLm, setDniLm] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [sexo, setSexo] = useState('');
  const [email, setEmail] = useState('');
  const [lugarNacimiento, setLugarNacimiento] = useState('');
  const [nivelEstudios, setNivelEstudios] = useState('');
  const [profOcupacion, setProfOcupacion] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [direccionHabitual, setDireccionHabitual] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [caserio, setCaserio] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para manejar el envío del formulario de registro de pacientes
  };

  return (
    <>
      <Navbar /> {/* Agrega el componente Navbar */}
    <div className="registro-card">
      <h1><strong>Datos: </strong></h1>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Primera columna */}
            <div className="col-lg-6">
              <div className="input-group">
                <label htmlFor="dni_lm">DNI / LM:</label>
                <input
                  type="text"
                  id="dni_lm"
                  value={dniLm}
                  onChange={(e) => setDniLm(e.target.value)}
                  className="rounded-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="nombres">Nombres:</label>
                <input
                  type="text"
                  id="nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="rounded-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="apellidos">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="rounded-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="fechaNacimiento">F. Nacimiento:</label>
                <DatePicker
                  selected={fechaNacimiento}
                  onChange={(date) => setFechaNacimiento(date)}
                  dateFormat="dd/MM/yyyy"
                  className="rounded-input"
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              </div>
              <div className="input-group">
                <label htmlFor="sexo">Sexo:</label>
                <select
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="rounded-select white-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-input"
                />
              </div>
            </div>
            {/* Segunda columna */}
            <div className="col-lg-6">
              <div className="input-group">
                <label htmlFor="lugar_nacimiento">Lugar de Nacimiento:</label>
                <input
                  type="text"
                  id="lugar_nacimiento"
                  value={lugarNacimiento}
                  onChange={(e) => setLugarNacimiento(e.target.value)}
                  className="rounded-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="nivelEstudios">Nivel de Estudios:</label>
                <select
                  id="nivelEstudios"
                  value={nivelEstudios}
                  onChange={(e) => setNivelEstudios(e.target.value)}
                  className="rounded-select white-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="universitario">Universitario</option>
                  <option value="secundaria">Secundaria</option>
                  <option value="primaria">Primaria</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="profOcupacion">Profesión/Ocupación:</label>
                <select
                  id="profOcupacion"
                  value={profOcupacion}
                  onChange={(e) => setProfOcupacion(e.target.value)}
                  className="rounded-select white-select"
                >
                  <option value="">Seleccionar</option>
                  {/* Opciones de profesión/ocupación */}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="estadoCivil">Estado Civil:</label>
                <select
                  id="estadoCivil"
                  value={estadoCivil}
                  onChange={(e) => setEstadoCivil(e.target.value)}
                  className="rounded-select white-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="soltero">Soltero/a</option>
                  <option value="casado">Casado/a</option>
                  <option value="divorciado">Divorciado/a</option>
                  <option value="viudo">Viudo/a</option>
                  <option value="conviviente">Conviviente</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="direccionHabitual">Dirección habitual:</label>
                <input
                  type="text"
                  id="direccionHabitual"
                  value={direccionHabitual}
                  onChange={(e) => setDireccionHabitual(e.target.value)}
                  className="rounded-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="departamento">Departamento:</label>
                <select
                  id="departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className="rounded-select white-select"
                >
                  <option value="">Seleccionar</option>
                  {/* Opciones de departamentos del Perú */}
                </select>
              </div>

              {/* Selector de provincia */}
              {departamento && (
                <div className="input-group">
                  <label htmlFor="provincia">Provincia:</label>
                  <select
                    id="provincia"
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    className="rounded-select white-select"
                  >
                    <option value="">Seleccionar</option>
                    {/* Opciones de provincias de acuerdo al departamento seleccionado */}
                  </select>
                </div>
              )}

              {/* Selector de distrito */}
              {provincia && (
                <div className="input-group">
                  <label htmlFor="distrito">Distrito:</label>
                  <select
                    id="distrito"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    className="rounded-select white-select"
                  >
                    <option value="">Seleccionar</option>
                    {/* Opciones de distritos de acuerdo a la provincia seleccionada */}
                  </select>
                </div>
              )}

              {/* Caserio */}
              <div className="input-group">
                <label htmlFor="caserio">Caserio:</label>
                <input
                  type="text"
                  id="caserio"
                  value={caserio}
                  onChange={(e) => setCaserio(e.target.value)}
                  className="rounded-input"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Registrar Paciente
          </button>
        </form>
      </div>
    </div>
    </>

  );
}
