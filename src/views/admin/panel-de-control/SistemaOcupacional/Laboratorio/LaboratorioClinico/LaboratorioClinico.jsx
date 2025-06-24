// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/LaboratorioClinico/LaboratorioClinico.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope, faTint, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import HematologiaBioquimicaSIEO from './Hematologia-bioquimicaSI-EO/Hematologia-bioquimicaSI-EO';
import ExamenOrina from './ExamenOrina/ExamenOrina';
import Hematologia from './Hematologia/Hematologia';

const LaboratorioClinico = ({token, selectedSede, userlogued}) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  //ESTADO PARA HEMATOLOGIA Y EXAMEN DE ORINA
  const [form, setForm] = useState({
    ficha: true,
    norden: '',
    fecha: today,
    responsable: '',
    paciente: '',
    empContratista: '',
    empresa: '',
    empresaNA: false,
    grupo: '',
    rh: '',
    hemoglobina: '',
    hematocrito: '',
    vsg: '',
    leucocitos: '',
    hematies: '',
    plaquetas: '',
    linfocitos: '',
    neutrofilos: '',
    abastonados: '',
    segmentados: '',
    monocitos: '',
    eosinofilos: '',
    basofilos: '',
    glucosa: '',
    glucosaNA: false,
    creatinina: '',
    creatininaNA: false,
    rpr: '',
    rprNA: false,
    rprPos: false,
    vih: '',
    vihNA: false,
    vihPos: false
  })
  const [formO, setFormO] = useState({
    // Examen Físico
    Incoloro: false,
    Medicamentosa: false,
    Transparente: false,
    Turbio: false,
    NoAplica: false,
    Color: '',
    Aspecto: 'N/A',
    Densidad: '',
    PH: '',
    // Examen Químico
    Nitritos: 'NEGATIVO',
    Proteínas: 'NEGATIVO',
    Cetonas: 'NEGATIVO',
    LeucocitosQ: 'NEGATIVO',
    AcAscorbico: 'NEGATIVO',
    Urobilinogeno: 'NEGATIVO',
    Bilirrubina: 'NEGATIVO',
    GlucosaQ: 'NEGATIVO',
    Sangre: 'NEGATIVO',
    // Sedimento
    LeucocitosS: '',
    Hematies: '',
    CelEpiteliales: '',
    Cristales: '',
    Cilindros: '',
    Bacterias: '',
    GramSC: '',
    Otros: '',
    // Drogas
    Cocaina: '',
    Marihuana: '',
    ScreeningPos: false,
    ScreeningNeg: false,
    ScreeningNA: false,
    ConfirmPos: false,
    ConfirmNeg: false,
    ConfirmNA: false,
    // Observaciones
    observaciones: '',
    // Imprimir
    printOrden: false,
    printRecibo: false,
    printValue: ''
  })
  
  const ClearForm = () => {
    setForm({
      ficha: true,
      norden: '',
      responsable: '',
      paciente: '',
      empContratista: '',
      empresa: '',
      empresaNA: false,
      grupo: '',
      rh: '',
      hemoglobina: '',
      hematocrito: '',
      vsg: '',
      leucocitos: '',
      hematies: '',
      plaquetas: '',
      linfocitos: '',
      neutrofilos: '',
      abastonados: '',
      segmentados: '',
      monocitos: '',
      eosinofilos: '',
      basofilos: '',
      glucosa: '',
      glucosaNA: false,
      creatinina: '',
      creatininaNA: false,
      rpr: '',
      rprNA: false,
      rprPos: false,
      vih: '',
      vihNA: false,
      vihPos: false
    });
  }

  const tabs = [
    {
      label: 'Hematología - Bioquímica SI-EO',
      icon: faMicroscope,
      component: <HematologiaBioquimicaSIEO token={token} selectedSede={selectedSede} userlogued={userlogued} form={form} setForm={setForm} setFormO={setFormO}/>
    },
    {
      label: 'Examen de Orina',
      icon: faTint,
      component: <ExamenOrina token={token} selectedSede={selectedSede} userlogued={userlogued} form={formO} setForm={setFormO} formH={form} ClearForm={ClearForm} setFormH={setForm}/>
    },
    {
      label: 'Hematograma',
      icon: faHeartbeat,
      component: <Hematologia token={token} selectedSede={selectedSede} userlogued={userlogued}/>
    }
  ];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${
              activeTab === idx
                ? 'bg-[#233245] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Content */}
      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default LaboratorioClinico;
