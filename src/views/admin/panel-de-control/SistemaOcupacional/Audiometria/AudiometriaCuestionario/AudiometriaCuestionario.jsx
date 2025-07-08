// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Manipuladores/Coprocultivo/Coprocultivo.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import { SubmitCoprocultivoManipulador } from "../../Laboratorio/Manipuladores/Coprocultivo/controllerCoprocultivo";

const TabSelector = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Parte 1", "Parte 2", "Parte 3"];
  return (
    <div className="w-full px-4">
      <div className="flex space-x-1 mb-2">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${
              activeTab === idx
                ? "bg-[#233245] text-white font-bold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg">
        {children[activeTab]}
      </div>
    </div>
  );
};

export default function AudiometriaCuestionario({ token, selectedSede, userlogued }) {
  const tabla = "ac_coprocultivo";
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

  const [form, setForm] = useState({
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    // MUESTRA
    muestra: "HECES",
    color: "",
    consistencia: "",
    moco_fecal: "",
    sangrev: "",
    restosa: "",
    // MICROSCÓPICO
    leucocitos: "",
    leucocitos_count: "",
    hematies: "",
    hematies_count: "",
    parasitos: "",
    gotasg: "",
    levaduras: "",
    // IDENTIFICACIÓN
    identificacion: "Escherichia coli(*)",
    florac: "",
    // RESULTADO
    resultado: "",
    // OBSERVACIONES
    observaciones:
      "No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas.",
    // Preguntas del cuestionario
    p1: 'NO',
    p2: 'NO',
    p3: 'NO',
    p4: 'NO',
    p5: 'NO',
    p6: 'NO',
    p7: 'NO',
    p8: 'NO',
    p9: 'NO',
    p10: 'NO',
    p11: 'NO',
    p12: 'NO',
    p13: 'NO',
    p14: 'NO',
    p15: 'NO',
    // Campos condicionales
    p1_cual: '',
    p1_cuando: '',
    p1_quehizo: '',
    p9_cual: '',
    p9_donde: '',
    p9_quehizo: '',
    p10_cual: '',
    p10_donde: '',
    p10_quehizo: '',
    p11_cual: '',
    p11_tiempo: '',
    p12_cual: '',
    p12_tiempo: '',
    p13_tiempo: '',
    p13_cuando: '',
    p13_donde: '',
    p14_cual: '',
    p14_donde: '',
    p14_quehizo: '',
    p15_cuantos: '',
    // Pregunta 16 (todas en false por defecto)
    p16_caza: false,
    p16_caza_tiempo: '',
    p16_tiro: false,
    p16_tiro_tiempo: '',
    p16_discoteca: false,
    p16_discoteca_tiempo: '',
    p16_auriculares: false,
    p16_auriculares_tiempo: '',
    p16_servicio: false,
    p16_servicio_tiempo: '',
    p16_boxeo: false,
    p16_boxeo_tiempo: '',
  });
  const [status, setStatus] = useState("");

  // inicializa fecha hoy

  const handleCheckRadio = (name, value) => {
    setForm((f) => ({
      ...f,
      [name]: f[name] === value.toUpperCase() ? "" : value.toUpperCase(),
    }));
  };
  const handleCheckRadioXValue = (name) => {
    setForm((f) => ({
      ...f,
      [name]: f[name].toUpperCase().includes("X CAMPO")
        ? ""
        : /\d/.test(f[name])
        ? f[name] + " X CAMPO"
        : " X CAMPO",
    }));
  };

  const handleClear = () => {
    setForm((f) => ({
      ...f,
      norden: "",
      fecha: today,
      nombres: "",
      edad: "",
      // MUESTRA
      muestra: "HECES",
      color: "",
      consistencia: "",
      moco_fecal: "",
      sangrev: "",
      restosa: "",
      // MICROSCÓPICO
      leucocitos: "",
      leucocitos_count: "",
      hematies: "",
      hematies_count: "",
      parasitos: "",
      gotasg: "",
      levaduras: "",
      // IDENTIFICACIÓN
      identificacion: "Escherichia coli(*)",
      florac: "",
      // RESULTADO
      resultado: "",
      // OBSERVACIONES
      observaciones:
        "No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas.",
    }));
  };

  const handleClearnotO = () => {
    setForm((f) => ({
      ...f,
      fecha: today,
      nombres: "",
      edad: "",
      // MUESTRA
      muestra: "HECES",
      color: "",
      consistencia: "",
      moco_fecal: "",
      sangrev: "",
      restosa: "",
      // MICROSCÓPICO
      leucocitos: "",
      leucocitos_count: "",
      hematies: "",
      hematies_count: "",
      parasitos: "",
      gotasg: "",
      levaduras: "",
      // IDENTIFICACIÓN
      identificacion: "Escherichia coli(*)",
      florac: "",
      // RESULTADO
      resultado: "",
      // OBSERVACIONES
      observaciones:
        "No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas.",
    }));
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Coprocultivo?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(form.norden, token, tabla);
      }
    });
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-center mb-6 font-bold" style={{fontSize:'13px'}}>CUESTIONARIO DE AUDIOMETRÍA</h2>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex flex-row gap-8 items-center w-full">
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="font-bold min-w-[90px]" style={{fontSize:'13px'}}>Nro Orden :</label>
              <input name="norden" value={form.norden} onChange={e => setForm(f => ({ ...f, norden: e.target.value }))} className="border rounded px-2 py-1" style={{fontSize:'11px', width:'90px'}} />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="font-bold" style={{fontSize:'13px'}}>Fecha :</label>
              <input type="date" name="fecha" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className="border rounded px-2 py-1" style={{fontSize:'11px', width:'120px'}} />
            </div>
            <div className="flex items-center gap-2 min-w-[300px] flex-1">
              <label className="font-bold" style={{fontSize:'13px'}}>Nombre Completo:</label>
              <input name="nombres" value={form.nombres} disabled className="border rounded px-2 py-1 bg-gray-100 flex-1" style={{fontSize:'11px'}} />
            </div>
          </div>
          <div className="flex flex-row gap-8 items-center w-full">
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="font-bold min-w-[90px]" style={{fontSize:'13px'}}>Edad :</label>
              <input name="edad" value={form.edad} disabled className="border rounded px-2 py-1 bg-gray-100" style={{fontSize:'11px', width:'70px'}} />
            </div>
            <div className="flex items-center gap-2 min-w-[300px]">
              <label className="font-bold mr-2" style={{fontSize:'13px'}}>Género :</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-1" style={{fontSize:'11px'}}>
                  <input type="radio" name="genero" value="Masculino" checked={form.genero === 'Masculino'} onChange={e => setForm(f => ({ ...f, genero: e.target.value }))} /> Masculino
                </label>
                <label className="flex items-center gap-1" style={{fontSize:'11px'}}>
                  <input type="radio" name="genero" value="Femenino" checked={form.genero === 'Femenino'} onChange={e => setForm(f => ({ ...f, genero: e.target.value }))} /> Femenino
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="font-bold mb-2" style={{fontSize:'13px'}}>Antecedentes médicos:</div>

        {/* Pregunta 1 - Formato tipo imagen, sin negrita y todo en 11px */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>1.- Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como : perdida de audición, hipoacusia, otitis medio agudo, cronico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar ocufenos, tinnitus mareos, vértigo, nauseas, rinitis alérgica parolisis facial, adormecimiento de hemicoro, tumores del sistema nerviosos central.</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p1_si" checked={form.p1 === 'SI'} onChange={e => setForm(f => ({ ...f, p1: f.p1 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuál?</span>
              <input name="p1_cual" value={form.p1_cual || ''} onChange={e => setForm(f => ({ ...f, p1_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p1 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Cuándo?</span>
              <input name="p1_cuando" value={form.p1_cuando || ''} onChange={e => setForm(f => ({ ...f, p1_cuando: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p1 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Qué Hizo?</span>
              <input name="p1_quehizo" value={form.p1_quehizo || ''} onChange={e => setForm(f => ({ ...f, p1_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p1 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p1_no" checked={form.p1 === 'NO'} onChange={e => setForm(f => ({ ...f, p1: f.p1 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 2 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>2.- Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p2_si" checked={form.p2 === 'SI'} onChange={e => setForm(f => ({ ...f, p2: f.p2 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p2_no" checked={form.p2 === 'NO'} onChange={e => setForm(f => ({ ...f, p2: f.p2 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 3 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>3.- Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p3_si" checked={form.p3 === 'SI'} onChange={e => setForm(f => ({ ...f, p3: f.p3 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p3_no" checked={form.p3 === 'NO'} onChange={e => setForm(f => ({ ...f, p3: f.p3 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 4 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p4_si" checked={form.p4 === 'SI'} onChange={e => setForm(f => ({ ...f, p4: f.p4 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p4_no" checked={form.p4 === 'NO'} onChange={e => setForm(f => ({ ...f, p4: f.p4 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 5 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p5_si" checked={form.p5 === 'SI'} onChange={e => setForm(f => ({ ...f, p5: f.p5 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p5_no" checked={form.p5 === 'NO'} onChange={e => setForm(f => ({ ...f, p5: f.p5 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 6 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>6.- Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16 horas anteriores a esta entrevista y examen.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p6_si" checked={form.p6 === 'SI'} onChange={e => setForm(f => ({ ...f, p6: f.p6 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p6_no" checked={form.p6 === 'NO'} onChange={e => setForm(f => ({ ...f, p6: f.p6 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 7 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>7.- Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p7_si" checked={form.p7 === 'SI'} onChange={e => setForm(f => ({ ...f, p7: f.p7 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p7_no" checked={form.p7 === 'NO'} onChange={e => setForm(f => ({ ...f, p7: f.p7 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 8 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda.</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p8_si" checked={form.p8 === 'SI'} onChange={e => setForm(f => ({ ...f, p8: f.p8 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <input type="checkbox" name="p8_no" checked={form.p8 === 'NO'} onChange={e => setForm(f => ({ ...f, p8: f.p8 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 9 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>9.- ¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estopediectomía)?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p9_si" checked={form.p9 === 'SI'} onChange={e => setForm(f => ({ ...f, p9: f.p9 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuál?</span>
              <input name="p9_cual" value={form.p9_cual || ''} onChange={e => setForm(f => ({ ...f, p9_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p9 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Dónde lo diagnosticaron?</span>
              <input name="p9_donde" value={form.p9_donde || ''} onChange={e => setForm(f => ({ ...f, p9_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p9 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Qué Hizo?</span>
              <input name="p9_quehizo" value={form.p9_quehizo || ''} onChange={e => setForm(f => ({ ...f, p9_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p9 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p9_no" checked={form.p9 === 'NO'} onChange={e => setForm(f => ({ ...f, p9: f.p9 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 10 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>10.- ¿Ha tenido traumatismo craneoencefálico traumatismo en el oído?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p10_si" checked={form.p10 === 'SI'} onChange={e => setForm(f => ({ ...f, p10: f.p10 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuál?</span>
              <input name="p10_cual" value={form.p10_cual || ''} onChange={e => setForm(f => ({ ...f, p10_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p10 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Dónde?</span>
              <input name="p10_donde" value={form.p10_donde || ''} onChange={e => setForm(f => ({ ...f, p10_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p10 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Qué Hizo?</span>
              <input name="p10_quehizo" value={form.p10_quehizo || ''} onChange={e => setForm(f => ({ ...f, p10_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p10 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p10_no" checked={form.p10 === 'NO'} onChange={e => setForm(f => ({ ...f, p10: f.p10 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 11 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>11.- ¿Ha consumido o consume medicamentos como: Clipatino, aminoglucósidos (bancomicina y amikacina) aspirina, furosemida y/o antituberculosos?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p11_si" checked={form.p11 === 'SI'} onChange={e => setForm(f => ({ ...f, p11: f.p11 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuál?</span>
              <input name="p11_cual" value={form.p11_cual || ''} onChange={e => setForm(f => ({ ...f, p11_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p11 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Por cuanto tiempo?</span>
              <input name="p11_tiempo" value={form.p11_tiempo || ''} onChange={e => setForm(f => ({ ...f, p11_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p11 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p11_no" checked={form.p11 === 'NO'} onChange={e => setForm(f => ({ ...f, p11: f.p11 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 12 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>12.- ¿Ha estado expuesto a solventes orgánicos (tolveno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono) plaguicidas, organofosforados y piretroides?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p12_si" checked={form.p12 === 'SI'} onChange={e => setForm(f => ({ ...f, p12: f.p12 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuál?</span>
              <input name="p12_cual" value={form.p12_cual || ''} onChange={e => setForm(f => ({ ...f, p12_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p12 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Por cuanto tiempo?</span>
              <input name="p12_tiempo" value={form.p12_tiempo || ''} onChange={e => setForm(f => ({ ...f, p12_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p12 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p12_no" checked={form.p12 === 'NO'} onChange={e => setForm(f => ({ ...f, p12: f.p12 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 13 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>13.- ¿Ha estado expuesto a vibraciones continuas?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p13_si" checked={form.p13 === 'SI'} onChange={e => setForm(f => ({ ...f, p13: f.p13 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p13_tiempo" value={form.p13_tiempo || ''} onChange={e => setForm(f => ({ ...f, p13_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p13 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Cuándo?</span>
              <input name="p13_cuando" value={form.p13_cuando || ''} onChange={e => setForm(f => ({ ...f, p13_cuando: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p13 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Dónde?</span>
              <input name="p13_donde" value={form.p13_donde || ''} onChange={e => setForm(f => ({ ...f, p13_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p13 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p13_no" checked={form.p13 === 'NO'} onChange={e => setForm(f => ({ ...f, p13: f.p13 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 14 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>14.- ¿Sufre de: hipertensión arterial diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p14_si" checked={form.p14 === 'SI'} onChange={e => setForm(f => ({ ...f, p14: f.p14 === 'SI' ? '' : 'SI' }))} />
              <span>SI</span>
              <span className="ml-2">¿Cuál?</span>
              <input name="p14_cual" value={form.p14_cual || ''} onChange={e => setForm(f => ({ ...f, p14_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p14 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Dónde lo diagnosticaron?</span>
              <input name="p14_donde" value={form.p14_donde || ''} onChange={e => setForm(f => ({ ...f, p14_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p14 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-7">¿Qué hizo?</span>
              <input name="p14_quehizo" value={form.p14_quehizo || ''} onChange={e => setForm(f => ({ ...f, p14_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p14 !== 'SI'} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" name="p14_no" checked={form.p14 === 'NO'} onChange={e => setForm(f => ({ ...f, p14: f.p14 === 'NO' ? '' : 'NO' }))} />
              <span>NO</span>
            </div>
          </div>
        </div>
        {/* Pregunta 15 */}
        <div className="mb-2 flex items-center" style={{fontSize:'11px'}}>
          <span className="mr-2"><b>15.- ¿Consume cigarrillos?</b></span>
          <div className="flex items-center gap-2 ml-auto">
            <input type="checkbox" name="p15_si" checked={form.p15 === 'SI'} onChange={e => setForm(f => ({ ...f, p15: f.p15 === 'SI' ? '' : 'SI' }))} />
            <span>SI</span>
            <span className="ml-2">¿Cuántos por mes?</span>
            <input name="p15_cuantos" value={form.p15_cuantos || ''} onChange={e => setForm(f => ({ ...f, p15_cuantos: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={form.p15 !== 'SI'} />
            <input type="checkbox" name="p15_no" checked={form.p15 === 'NO'} onChange={e => setForm(f => ({ ...f, p15: f.p15 === 'NO' ? '' : 'NO' }))} className="ml-4" />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 16 */}
        <div className="mb-2" style={{fontSize:'11px'}}>
          <div className="mb-1" style={{fontSize:'12px'}}><b>16.- ¿Ha realizado actividades de?</b></div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p16_caza" checked={form.p16_caza === true} onChange={e => setForm(f => ({ ...f, p16_caza: !f.p16_caza }))} />
              <span>Caza</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p16_caza_tiempo" value={form.p16_caza_tiempo || ''} onChange={e => setForm(f => ({ ...f, p16_caza_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={!form.p16_caza} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p16_tiro" checked={form.p16_tiro === true} onChange={e => setForm(f => ({ ...f, p16_tiro: !f.p16_tiro }))} />
              <span>Tiro al blanco</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p16_tiro_tiempo" value={form.p16_tiro_tiempo || ''} onChange={e => setForm(f => ({ ...f, p16_tiro_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={!form.p16_tiro} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p16_discoteca" checked={form.p16_discoteca === true} onChange={e => setForm(f => ({ ...f, p16_discoteca: !f.p16_discoteca }))} />
              <span>Concurrencia frecuente a discotecas y/o bares</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p16_discoteca_tiempo" value={form.p16_discoteca_tiempo || ''} onChange={e => setForm(f => ({ ...f, p16_discoteca_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={!form.p16_discoteca} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p16_auriculares" checked={form.p16_auriculares === true} onChange={e => setForm(f => ({ ...f, p16_auriculares: !f.p16_auriculares }))} />
              <span>Uso de auriculares</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p16_auriculares_tiempo" value={form.p16_auriculares_tiempo || ''} onChange={e => setForm(f => ({ ...f, p16_auriculares_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={!form.p16_auriculares} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p16_servicio" checked={form.p16_servicio === true} onChange={e => setForm(f => ({ ...f, p16_servicio: !f.p16_servicio }))} />
              <span>Servicio militar</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p16_servicio_tiempo" value={form.p16_servicio_tiempo || ''} onChange={e => setForm(f => ({ ...f, p16_servicio_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={!form.p16_servicio} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="p16_boxeo" checked={form.p16_boxeo === true} onChange={e => setForm(f => ({ ...f, p16_boxeo: !f.p16_boxeo }))} />
              <span>Boxeo</span>
              <span className="ml-2">¿Cuánto tiempo?</span>
              <input name="p16_boxeo_tiempo" value={form.p16_boxeo_tiempo || ''} onChange={e => setForm(f => ({ ...f, p16_boxeo_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'11px'}} disabled={!form.p16_boxeo} />
            </div>
          </div>
        </div>
      </div>
      {/* Acciones al pie, dentro del mismo formulario */}
      <div className="flex flex-row justify-between mt-8 gap-8" style={{ fontSize: '12px' }}>
        {/* Imprimir Cuestionario */}
        <fieldset className="border rounded p-3 min-w-[340px]">
          <div className="flex items-center gap-2">
            <label className="font-bold min-w-[90px]" style={{ fontSize: '12px' }}>Nro Orden :</label>
            <input
              name="norden_print"
              value={form.norden}
              onChange={e => setForm(f => ({ ...f, norden: e.target.value }))}
              className="border rounded-lg px-3 py-2"
              style={{ fontSize: '12px', width: '100px',  color: '#222', fontWeight: 'bold', outline: 'none' }}
            />
            <button
              type="button"
              className="ml-2 px-4 py-2.5 rounded-lg border-none bg-[#2664eb]  transition text-white flex items-center justify-center"
              title="Imprimir Cuestionario"
              onClick={handlePrint}
              style={{ fontSize: '13px' }}
            >
              <FontAwesomeIcon icon={faPrint} style={{ color: '#fff', fontSize: '13px' }} />
            </button>
          </div>
        </fieldset>
        {/* Cuestionario Terminado */}
        <fieldset className="border rounded p-3 min-w-[340px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#059669] text-white transition"
              style={{ minWidth: '160px', fontSize: '12px' }}
              // onClick={handleSave} // Debes definir esta función para guardar
            >
              <FontAwesomeIcon icon={faSave} style={{ color: '#fff', fontSize: '13px' }} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#facc14] text-[#FFFFFF] transition"
              style={{ minWidth: '120px', fontSize: '12px' }}
              onClick={handleClear}
            >
              <FontAwesomeIcon icon={faBroom} style={{ color: 'white', fontSize: '13px' }} /> Limpiar
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
