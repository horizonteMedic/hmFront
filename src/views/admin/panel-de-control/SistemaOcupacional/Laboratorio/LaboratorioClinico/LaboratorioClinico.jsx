// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/LaboratorioClinico/LaboratorioClinico.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope, faTint, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import HematologiaBioquimicaSIEO from './Hematologia-bioquimicaSI-EO/Hematologia-bioquimicaSI-EO';
import ExamenOrina from './ExamenOrina/ExamenOrina';
import Hematologia from './Hematologia/Hematologia';
import { getFetch } from '../../../getFetch/getFetch';
const LaboratorioClinico = ({token, selectedSede, userlogued, permiso}) => {
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
    Color: 'AMARILLO CLARO',
    Aspecto: 'TRANSPARENTE',
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
    CelEpiteliales: 'ESCASAS',
    Cristales: 'NO SE OBSERVAN',
    Cilindros: 'NO SE OBSERVAN',
    Bacterias: 'NO SE OBSERVAN',
    GramSC: 'NO SE OBSERVAN',
    Otros: 'NO SE OBSERVAN',
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
    });
    setSearchMedico(listDoc[0])
  }
  const ClearFormO = () => {
    setFormO({
      Incoloro: false,
      Medicamentosa: false,
      Transparente: false,
      Turbio: false,
      NoAplica: false,
      Color: 'AMARILLO CLARO',
      Aspecto: 'TRANSPARENTE',
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
      CelEpiteliales: 'ESCASAS',
      Cristales: 'NO SE OBSERVAN',
      Cilindros: 'NO SE OBSERVAN',
      Bacterias: 'NO SE OBSERVAN',
      GramSC: 'NO SE OBSERVAN',
      Otros: 'NO SE OBSERVAN',
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
  }

  const [listDoc, setListDoc] = useState([])
  const [searchMedico, setSearchMedico]  = useState(form.responsable);
  
  useEffect(() => {
    getFetch(`/api/v01/ct/laboratorio/listadoUsuariosPorPrioridadNameUser?nameUser=${userlogued}`,token)
      .then((res) => {
        setListDoc(res)
        setForm(f => ({ ...f, responsable: res[0] }))
        setSearchMedico(res[0])
      })
      .catch(() => {});
  },[])

  const tabs = [
    {
      label: 'Hematología - Bioquímica SI-EO',
      icon: faMicroscope,
      vista: 'Laboratorio Clinico Formulario',
      permiso: 'Acceso Hematologia - Bioquimica SI-EO',
      component: <HematologiaBioquimicaSIEO token={token} selectedSede={selectedSede} userlogued={userlogued} form={form} setForm={setForm} setFormO={setFormO}
      listDoc={listDoc} setSearchMedico={setSearchMedico} searchMedico={searchMedico}/>
    },
    {
      label: 'Examen de Orina',
      icon: faTint,
      vista: 'Laboratorio Clinico Formulario',
      permiso: 'Acceso Hematologia - Bioquimica SI-EO',
      component: <ExamenOrina token={token} selectedSede={selectedSede} userlogued={userlogued} form={formO} setForm={setFormO} formH={form} ClearForm={ClearForm} setFormH={setForm} ClearFormO={ClearFormO} />
    },
    {
      label: 'Hemograma',
      icon: faHeartbeat,
      vista: 'Laboratorio Clinico Formulario',
      permiso: 'Acceso Hematograma',
      component: <Hematologia token={token} selectedSede={selectedSede} userlogued={userlogued} />
    }
  ];

  const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));


  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1 overflow-x-auto">
        {tabsConPermiso.map((tab, idx) => (
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
