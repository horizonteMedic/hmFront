import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faStethoscope, faVial, faUserMd, faXRay, faHeartbeat, faLungs, faDeaf, faTooth, faEye, faHome, faTimes, faFileWaveform, faSkull, faSkiingNordic, faBed, faMountain, fa2, fa6, fa1, faA, faBacterium, faMoon, faFileMedical, faTruckMedical, faSuitcaseMedical, faStairs, faCarSide, faMaskVentilator, faP, faPersonRifle, faFolderMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './DrawerOverlay.module.css';

const accesos = [
  { icon: faUserCheck, label: 'Admisión', key: "Admision" },
  { icon: faStethoscope, label: 'Triaje', key: "Triaje" },
  { icon: faVial, label: 'Laboratorio', key: "Laboratorio Clinico" },
  { icon: faUserMd, label: 'Psicología', key: "Psicologia" },
  { icon: faUserMd, label: 'Medicina General', key: "Medicina General" },
  { icon: faXRay, label: 'Rayos X', key: "Rayos X" },
  { icon: faHeartbeat, label: 'EKG', key: "EKG" },
  { icon: faFileWaveform, label: "Historia Ocupacional", key: "Historia Ocupacional" },
  { icon: faLungs, label: 'Espirometría', key: "Espirometria" },
  { icon: faDeaf, label: 'Audiometría', key: "Audiometria" },
  { icon: faTooth, label: 'Odontología', key: "Odontologia" },
  { icon: faEye, label: 'Oftalmología', key: "Oftalmologia" },
  { icon: faSkull, label: 'Evaluación Musculoesquelética', key: "Evaluación Musculoesquelética" },
  { icon: faSkiingNordic, label: 'Cuestionario Nordico', key: "Cuestionario Nordico" },
  { icon: faBed, label: 'Test Fatiga y Somnolencia', key: "Test Fatiga" },
  { icon: faMountain, label: 'Antecedentes de Altura', key: "Antecedentes de Altura" },
  { icon: fa2, label: "Anexo 2", key: "Anexo 2" },
  { icon: fa1, label: "Anexo 16", key: "Anexo 16" },
  { icon: fa1, label: "Anexo 16 A", key: "Anexo 16 A" },
  { icon: faBacterium, label: "Antecedentes Patológicos", key: "Antecedentes Patologicos" },
  { icon: faFileMedical, label: "Fichas Aptitud", key: "Fichas Aptitud" },
  { icon: faMoon, label: "Ficha S.A.S.", key: "Ficha SAS" },
  { icon: faCarSide, label: "Ficha Conduccion de Vehiculos", key: "Ficha Conduccion de Vehiculos" },
  { icon: faStairs, label: "Ficha Certificado de Altura", key: "Ficha Certificado de Altura" },
  { icon: faSuitcaseMedical, label: "Constancia Certificado Medico Ocupacional", key: "Constancia Certificado Medico Ocupacional" },
  { icon: faTruckMedical, label: "Ficha Interconsulta", key: "Ficha Interconsulta" },
  { icon: faMaskVentilator, label: "Uso de Respiradores", key: "Uso de Respiradores" },
  { icon: faPersonRifle, label: "Poderosa", key: "Poderosa" },
  { icon: faFolderMinus, label: "Eliminar Examenes", key: "Eliminar Examenes" },
];

const DrawerQuickAccess = ({ open, onClose, onNavigate, activeIndex, tieneVista }) => (
  <>
    {/* Overlay leve */}
    {open && <div className={styles.overlay} onClick={onClose} />}
    <div
      className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <span className="font-bold text-lg text-[#1a2536]">Accesos rápidos</span>
        <button onClick={onClose} aria-label="Cerrar menú">
          <FontAwesomeIcon icon={faTimes} className="text-2xl text-gray-500 hover:text-[#1a2536]" />
        </button>
      </div>
      <div className="flex flex-col gap-2 px-4 py-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <button
          className="flex items-center gap-4 bg-gray-100 hover:bg-[#1a2536] rounded-xl px-4 py-4 transition-all duration-200 group text-left mb-2"
          onClick={() => onNavigate("Inicio")}
        >
          <span className="text-blue-600 text-2xl group-hover:text-white transition-all duration-200">
            <FontAwesomeIcon icon={faHome} />
          </span>
          <span className="font-bold text-lg text-gray-900 group-hover:text-white transition-all duration-200">Inicio</span>
        </button>
        {accesos
          .filter(item => tieneVista(item.key))
          .map((item, idx) => (
            <button
              key={item.label}
              className={`flex items-center gap-4 bg-gray-100 hover:bg-[#1a2536] rounded-xl px-4 py-4 transition-all duration-200 group text-left ${activeIndex === idx ? 'ring-2 ring-[#1a2536]' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="text-orange-500 text-2xl group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={item.icon} />
                {item.key === "Anexo 16" && <FontAwesomeIcon icon={fa6} />}
                {item.key === "Anexo 16 A" && <><FontAwesomeIcon icon={fa6} /> <FontAwesomeIcon icon={faA} className='ml-1' /></>}
              </span>
              <span className="font-bold text-lg text-gray-900 group-hover:text-white transition-all duration-200">{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  </>
);

export default DrawerQuickAccess; 