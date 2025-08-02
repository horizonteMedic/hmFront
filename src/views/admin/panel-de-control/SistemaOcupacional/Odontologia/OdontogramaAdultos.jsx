import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFileAlt,
  faBroom,
  faHistory,
  faSave,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import "./OdontogramaAdultos.css";

const tabla = "odontograma";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

export default function OdontogramaAdultos() {
  const dientesSuperioresArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  const dientesInferioresArray = [
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  ];

  const initialFormState = {
    norden: "",
    fechaExam: today,
    nombres: "",
    sexo: "",
    edad: "",
    empresa: "",
    contrata: "",

    d1: "Normal",
    d2: "Normal",
    d3: "Normal",
    d4: "Normal",
    d5: "Normal",
    d6: "Normal",
    d7: "Normal",
    d8: "Normal",
    d9: "Normal",
    d10: "Normal",
    d11: "Normal",
    d12: "Normal",
    d13: "Normal",
    d14: "Normal",
    d15: "Normal",
    d16: "Normal",
    d17: "Normal",
    d18: "Normal",
    d19: "Normal",
    d20: "Normal",
    d21: "Normal",
    d22: "Normal",
    d23: "Normal",
    d24: "Normal",
    d25: "Normal",
    d26: "Normal",
    d27: "Normal",
    d28: "Normal",
    d29: "Normal",
    d30: "Normal",
    d31: "Normal",
    d32: "Normal",

    ausente: 0,
    cariada: 0,
    porExtraer: 0,
    fracturada: 0,
    corona: 0,
    obturacion: 0,
    puente: 0,
    pprMetalica: 0,
    pprAcrilica: 0,
    pTotal: 0,
    normal: 32,
    malEstado: 0,

    observaciones: "",
    noPasoExamen: false,
  };
  const [form, setForm] = useState(initialFormState);
  const [contextMenu, setContextMenu] = useState(null);
  //NUEVOOOOOOOO================================================

  const imagenInicivo = "https://cdn-icons-png.flaticon.com/512/91/91162.png";
  const imagenCanino = "https://cdn-icons-png.flaticon.com/512/91/91154.png";
  const imagenMolar = "https://cdn-icons-png.flaticon.com/512/91/91159.png";

  const handleClear = () => {
    setForm(initialFormState);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
  };
  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: checked,
    }));
  };
  //FIN NUEVOOOOOOOO================================================

  // Cerrar menú contextual con ESC o click fuera
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest(".context-menu")) {
        setContextMenu(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const handleContextMenu = (event, diente) => {
    event.preventDefault();
    event.stopPropagation();

    // Calcular posición del menú
    const menuHeight = 400; // Altura del menú
    const windowHeight = window.innerHeight;
    const mouseY = event.clientY;
    const mouseX = event.clientX;

    // Determinar si es un diente inferior (dientes 17-32)
    const isDienteInferior = diente >= 17 && diente <= 32;

    let menuY;
    let menuX = mouseX - 2;

    // Para dientes inferiores, siempre mostrar arriba
    if (isDienteInferior) {
      menuY = mouseY - menuHeight - 10;
    } else {
      // Para dientes superiores, verificar espacio disponible
      if (mouseY + menuHeight > windowHeight) {
        menuY = mouseY - menuHeight - 10;
      } else {
        menuY = mouseY - 4;
      }
    }

    // Asegurar que el menú no se salga por arriba
    if (menuY < 10) {
      menuY = 10;
    }

    // Asegurar que el menú no se salga por los lados
    const menuWidth = 200;
    if (menuX + menuWidth > window.innerWidth) {
      menuX = window.innerWidth - menuWidth - 10;
    }
    if (menuX < 10) {
      menuX = 10;
    }

    setContextMenu({
      mouseX: menuX,
      mouseY: menuY,
      diente,
    });
  };

  //Registrar cambio
  const handleOptionClick = (option) => {
    const diente = contextMenu.diente;
    console.log(diente, "  ", option);
    const prevOption = form[`d${diente}`];

    if (prevOption === option) {
      setContextMenu(null);
      return;
    }

    if (option === "P.Total") {
      const nuevosDientes = {};
      const inicio = diente <= 16 ? 1 : 17;
      const fin = diente <= 16 ? 16 : 32;

      for (let i = inicio; i <= fin; i++) {
        nuevosDientes[`d${i}`] = option;
      }

      setForm((prev) => ({
        ...prev,
        ...nuevosDientes,
      }));
    } else {
      // Actualizar la opción del diente
      setForm((prev) => ({
        ...prev,
        [`d${diente}`]: option,
      }));
    }

    setContextMenu(null);
  };

  useEffect(() => {
    const estadosContados = {
      Ausente: 0,
      "Cariada por opturar": 0,
      "Por extraer": 0,
      Fracturada: 0,
      Corona: 0,
      "Obturacion Efectuada": 0,
      Puente: 0,
      "P.P.R Metalica": 0,
      "P.P.R Acrilica": 0,
      "P.Total": 0,
      Normal: 0,
      "Dientes en mal estado": 0,
    };

    for (let i = 1; i <= 32; i++) {
      const estado = form[`d${i}`];
      if (estadosContados.hasOwnProperty(estado)) {
        estadosContados[estado]++;
      }
    }

    setForm((prev) => ({
      ...prev,
      ausente: estadosContados["Ausente"],
      cariada: estadosContados["Cariada por opturar"],
      porExtraer: estadosContados["Por extraer"],
      fracturada: estadosContados["Fracturada"],
      corona: estadosContados["Corona"],
      obturacion: estadosContados["Obturacion Efectuada"],
      puente: estadosContados["Puente"],
      pprMetalica: estadosContados["P.P.R Metalica"],
      pprAcrilica: estadosContados["P.P.R Acrilica"],
      pTotal: Math.floor(estadosContados["P.Total"] / 16),
      normal: estadosContados["Normal"],
      malEstado: estadosContados["Dientes en mal estado"],
    }));
  }, [
    // Se puede hacer dinámicamente si tienes todos los nombres como "d1" a "d32"
    ...Array.from({ length: 32 }, (_, i) => form[`d${i + 1}`]),
  ]);

  const renderInput = (label, key) => (
    <div className="contador-item bg-gray-50">
      <label className="contador-label">{label}:</label>
      <input
        type="text"
        value={form[key]}
        disabled
        className="contador-input"
      />
    </div>
  );

  const renderDiente = (diente, imgUrl, rotate = false) => (
    <div
      className="diente-item"
      onContextMenu={(e) => handleContextMenu(e, diente)}
    >
      <img
        src={imgUrl}
        alt={`Diente ${diente}`}
        className={`diente-imagen ${rotate ? "rotate-180" : ""}`}
      />
      <span className="diente-numero ">{diente}</span>
      {form[`d${diente}`] && (
        <div className="indicador-diente">
          {renderIndicator(form[`d${diente}`])}
        </div>
      )}
    </div>
  );

  const renderIndicator = (option) => {
    switch (option) {
      case "Ausente":
        return <span className="text-blue-500 text-6xl">✕</span>;
      case "Cariada por opturar":
        return <span className="text-red-500 text-7xl">●</span>;
      case "Por extraer":
        return <span className="text-red-500 text-6xl">⊗</span>;
      case "Fracturada":
        return <span className="text-black text-6xl">╱</span>;
      case "Corona":
        return <span className="text-blue-500 text-6xl">▲</span>;
      case "Obturacion Efectuada":
        return <span className="text-blue-500 text-7xl">●</span>;
      case "Puente":
        return <span className="text-black text-6xl">▭</span>;
      case "P.P.R Metalica":
        return <span className="text-black text-6xl">―</span>;
      case "P.P.R Acrilica":
        return <span className="text-black text-6xl">=</span>;
      case "P.Total":
        return <span className="text-black text-6xl">≈</span>;
      case "Normal":
        return <span className="text-green-500 text-6xl">☑</span>;
      case "Dientes en mal estado":
        return <span className="text-yellow-500 text-3xl">🟡</span>;
      default:
        return null;
    }
  };

  const menuOptions = [
    { label: "Ausente", key: "ausente", icon: "✕", color: "text-blue-500" },
    {
      label: "Cariada por opturar",
      key: "cariada",
      icon: "●",
      color: "text-red-500",
    },
    {
      label: "Por extraer",
      key: "porExtraer",
      icon: "⊗",
      color: "text-red-500",
    },
    { label: "Fracturada", key: "fracturada", icon: "╱", color: "text-black" },
    { label: "Corona", key: "corona", icon: "▲", color: "text-blue-500" },
    {
      label: "Obturacion Efectuada",
      key: "obturacion",
      icon: "●",
      color: "text-blue-500",
    },
    { label: "Puente", key: "puente", icon: "▭", color: "text-black" },
    {
      label: "P.P.R Metalica",
      key: "pprMetalica",
      icon: "―",
      color: "text-black",
    },
    {
      label: "P.P.R Acrilica",
      key: "pprAcrilica",
      icon: "=",
      color: "text-black",
    },
    { label: "P.Total", key: "pTotal", icon: "≈", color: "text-black" },
    { label: "Normal", key: "normal", icon: "☑", color: "text-green-500" },
    {
      label: "Dientes en mal estado",
      key: "malEstado",
      icon: "●",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="odontograma-container">
      <h2 className="text-blue-700 mx-auto font-bold text-center text-2xl">
        Odontograma Adultos
      </h2>
      {/*DIENTES IMAGENES*/}
      <div className="seccion-titulo">Dientes Superiores</div>
      <div className="dientes-grid">
        {dientesSuperioresArray.slice(0, 8).map((diente) => (
          <div key={diente}>
            {renderDiente(
              diente,
              [6, 11].includes(diente)
                ? imagenCanino
                : [1, 2, 3, 14, 15, 16].includes(diente)
                ? imagenMolar
                : imagenInicivo,
              true
            )}
          </div>
        ))}
        <div className="w-4" />
        {dientesSuperioresArray.slice(8, 16).map((diente) => (
          <div key={diente}>
            {renderDiente(
              diente,
              [6, 11].includes(diente)
                ? imagenCanino
                : [1, 2, 3, 14, 15, 16].includes(diente)
                ? imagenMolar
                : imagenInicivo,
              true
            )}
          </div>
        ))}
      </div>

      <div className="seccion-titulo">Dientes Inferiores</div>
      <div className="dientes-grid">
        {dientesInferioresArray.slice(0, 8).map((diente) => (
          <div key={diente}>
            {renderDiente(
              diente,
              [22, 27].includes(diente)
                ? imagenCanino
                : [17, 18, 19, 30, 31, 32].includes(diente)
                ? imagenMolar
                : imagenInicivo,
              false
            )}
          </div>
        ))}
        <div className="w-4" />
        {dientesInferioresArray.slice(8, 16).map((diente) => (
          <div key={diente}>
            {renderDiente(
              diente,
              [22, 27].includes(diente)
                ? imagenCanino
                : [17, 18, 19, 30, 31, 32].includes(diente)
                ? imagenMolar
                : imagenInicivo,
              false
            )}
          </div>
        ))}
      </div>
      {/*LEYENDA*/}
      <div className="bg-white border rounded">
        <div className="leyenda-container mx-auto max-w-[800px]">
          {menuOptions.map((option) => (
            <div key={option.label} className="leyenda-item">
              <span className={`${option.color} `}>{option.icon}</span>
              <span className="text-[12px]">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/*CONTADORES*/}
      <div className="contador-container">
        {[
          { label: "Ausente", key: "ausente" },
          { label: "Cariada por opturar", key: "cariada" },
          { label: "Por extraer", key: "porExtraer" },
          { label: "Fracturada", key: "fracturada" },
          { label: "Corona", key: "corona" },
          { label: "Obturacion Efectuada", key: "obturacion" },
          { label: "Puente", key: "puente" },
          { label: "P.P.R Metalica", key: "pprMetalica" },
          { label: "P.P.R Acrilica", key: "pprAcrilica" },
          { label: "P.Total", key: "pTotal" },
          { label: "Normal", key: "normal" },
          { label: "Dientes en mal estado", key: "malEstado" },
        ].map((opcion) => (
          <div key={opcion.key}>{renderInput(opcion.label, opcion.key)}</div>
        ))}
      </div>
      {/*OBSERVACIONES & NO PASO EXAMEN*/}
      <div className="mt-4 px-6 text-[11px]">
        <div className="observaciones-section">
          <label className="observaciones-label text-[11px]">
            Observaciones:
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones || ""}
            onChange={handleChange}
            className="resize-none w-full border text-[11px] rounded px-2 py-1 "
            rows="3"
          />
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label pl-2">
            <input
              type="checkbox"
              name="noPasoExamen"
              checked={form.noPasoExamen}
              onChange={handleCheckBoxChange}
              className="checkbox-input"
            />
            No pasó examen odontológico
          </label>
        </div>
        {/*BOTONES ACCIONES*/}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2 ">
          <div className=" flex gap-4">
            <button
              type="button"
              // onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
            <div className="flex items-center gap-2">
              <input
                name="norden"
                // value={form.norden}
                // onChange={handleChange}
                className="border rounded px-2 py-1 text-base w-24"
              />

              <button
                type="button"
                // onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          {menuOptions.map((option) => (
            <div
              key={option.label}
              className="context-menu-item"
              onClick={() => handleOptionClick(option.label)}
            >
              <span className={`${option.color} text-xl`}>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
