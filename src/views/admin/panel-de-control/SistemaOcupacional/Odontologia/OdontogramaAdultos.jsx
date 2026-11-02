import { useState, useEffect } from "react";
import "./OdontogramaAdultos.css";
import CIE10List from "../../../../components/reusableComponents/CIE10List";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import { CAMPOS_DIENTES, CAMPOS_OBSERVACIONES } from "./camposOdontologia";

export default function OdontogramaAdultos({
  form,
  setForm,
  token,
  handleChange,
  handleCheckBoxChange,
  // Registro existente sin habilitar edición: el odontograma y las observaciones quedan solo de lectura.
  disabled = false,
  isFieldEdited = () => false,
  revertFields = () => {},
}) {
  const dientesSuperioresArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  const dientesInferioresArray = [
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  ];
  const mapeoDientes = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38,
  ]

  const [contextMenu, setContextMenu] = useState(null);

  const imagenInicivo = "https://cdn-icons-png.flaticon.com/512/91/91162.png";
  const imagenCanino = "https://cdn-icons-png.flaticon.com/512/91/91154.png";
  const imagenMolar = "https://cdn-icons-png.flaticon.com/512/91/91159.png";

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
    if (disabled) return;
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
      malEstado:
        estadosContados["Cariada por opturar"] +
        estadosContados["Por extraer"] +
        estadosContados["Fracturada"],
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
      className={`diente-item ${isFieldEdited(`d${diente}`) ? "ring-2 ring-orange-500 rounded" : ""}`}
      onContextMenu={(e) => handleContextMenu(e, diente)}
    >
      <img
        src={imgUrl}
        alt={`Diente ${diente}`}
        className={`diente-imagen ${rotate ? "rotate-180" : ""}`}
      />
      <span className="diente-numero ">{mapeoDientes[diente - 1]}</span>
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
    // {
    //   label: "Dientes en mal estado",
    //   key: "malEstado",
    //   icon: "●",
    //   color: "text-yellow-500",
    // },
  ];

  return (
    <div className="odontograma-container">
      <div className="flex items-center justify-center gap-3">
        <h2 className="text-blue-700 font-bold text-center text-2xl">
          Odontograma Adultos
        </h2>
        {CAMPOS_DIENTES.some(isFieldEdited) && (
          <RevertButton
            onClick={() => revertFields(CAMPOS_DIENTES)}
            title="Revertir los cambios del odontograma"
          />
        )}
      </div>
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
          <div className="flex items-center justify-between">
            <label className="observaciones-label text-[11px]">
              Observaciones:
            </label>
            {CAMPOS_OBSERVACIONES.some(isFieldEdited) && (
              <RevertButton
                onClick={() => revertFields(CAMPOS_OBSERVACIONES)}
                title="Revertir observaciones"
              />
            )}
          </div>
          <textarea
            name="observaciones"
            value={form.observaciones || ""}
            onChange={handleChange}
            disabled={disabled}
            className={`resize-none w-full border text-[11px] rounded px-2 py-1 ${disabled ? "bg-gray-300" : isFieldEdited("observaciones") ? "border-orange-600 bg-orange-100" : ""}`}
            rows="3"
          />

          <div className="bg-green-200 p-3 rounded-xl col-span-3">
            <CIE10List
              value={form.observacionesCie10}
              fieldName="observacionesCie10"
              label="Observaciones CIE10"
              token={token}
              setForm={setForm}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="checkbox-section">
          <label className="flex items-center gap-2 font-medium cursor-pointer pl-2 text-[10px]">
            <input
              type="checkbox"
              name="noPasoExamen"
              checked={form.observaciones.includes("NO PASO EXAMEN ODONTOLOGICO")}
              disabled={disabled}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  observaciones: e.target.checked ? "NO PASO EXAMEN ODONTOLOGICO" : "",
                }));
                handleCheckBoxChange(e);
              }}
            />
            No pasó examen odontológico
          </label>
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
