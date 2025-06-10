import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faStethoscope, faVial, faUserMd, faXRay, faHeartbeat, faLungs, faDeaf, faTooth, faEye, faHome, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './DrawerOverlay.module.css';

const accesos = [
  { icon: faUserCheck, label: 'Admisión' },
  { icon: faStethoscope, label: 'Triaje' },
  { icon: faVial, label: 'Laboratorio' },
  { icon: faUserMd, label: 'Psicología' },
  { icon: faUserMd, label: 'Medicina General' },
  { icon: faXRay, label: 'Rayos X' },
  { icon: faHeartbeat, label: 'EKG' },
  { icon: faLungs, label: 'Espirometría' },
  { icon: faDeaf, label: 'Audiometría' },
  { icon: faTooth, label: 'Odontología' },
  { icon: faEye, label: 'Oftalmología' },
];

const DrawerQuickAccess = ({ open, onClose, onNavigate, activeIndex }) => (
  <>
    {/* Overlay leve */}
    {open && <div className={styles.overlay} onClick={onClose} />}
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <span className="font-bold text-lg text-[#1a2536]">Accesos rápidos</span>
        <button onClick={onClose} aria-label="Cerrar menú">
          <FontAwesomeIcon icon={faTimes} className="text-2xl text-gray-500 hover:text-[#1a2536]" />
        </button>
      </div>
      <div className="flex flex-col gap-2 px-4 py-6">
        <button
          className="flex items-center gap-4 bg-gray-100 hover:bg-[#1a2536] rounded-xl px-4 py-4 transition-all duration-200 group text-left mb-2"
          onClick={() => onNavigate(7)}
        >
          <span className="text-blue-600 text-2xl group-hover:text-white transition-all duration-200">
            <FontAwesomeIcon icon={faHome} />
          </span>
          <span className="font-bold text-lg text-gray-900 group-hover:text-white transition-all duration-200">Inicio</span>
        </button>
        {accesos.map((item, idx) => (
          <button
            key={item.label}
            className={`flex items-center gap-4 bg-gray-100 hover:bg-[#1a2536] rounded-xl px-4 py-4 transition-all duration-200 group text-left ${activeIndex === idx ? 'ring-2 ring-[#1a2536]' : ''}`}
            onClick={() => onNavigate(idx)}
          >
            <span className="text-orange-500 text-2xl group-hover:text-white transition-all duration-200">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <span className="font-bold text-lg text-gray-900 group-hover:text-white transition-all duration-200">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  </>
);

export default DrawerQuickAccess; 