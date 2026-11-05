import { useState, useEffect } from "react";
import "./OdontogramaAdultos.css";
import CIE10List from "../../../../components/reusableComponents/CIE10List";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import { CAMPOS_DIENTES, CAMPOS_OBSERVACIONES } from "./camposOdontologia";
import { contarEstados, estadoDe, estadosVisibles } from "./estadosOdontograma";
import MenuContextualOdontograma, { posicionMenu } from "./MenuContextualOdontograma";

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

    setContextMenu(posicionMenu(event, diente));
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
    setForm((prev) => ({ ...prev, ...contarEstados(form) }));
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
    const estado = estadoDe(option);
    return estado ? <span className={`${estado.color} ${estado.tamano}`}>{estado.simbolo}</span> : null;
  };

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
          {estadosVisibles(form).map((estado) => (
            <div key={estado.label} className="leyenda-item">
              <span className={`${estado.color} `}>{estado.simbolo}</span>
              <span className="text-[12px]">{estado.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/*CONTADORES*/}
      <div className="contador-container">
        {[
          ...estadosVisibles(form).map(({ label, clave }) => ({ label, key: clave })),
          { label: "Dientes en mal estado", key: "malEstado" },
        ].map((opcion) => (
          <div key={opcion.key}>{renderInput(opcion.label, opcion.key)}</div>
        ))}
      </div>
      {/*OBSERVACIONES & NO PASO EXAMEN*/}
      <div className="mt-4 px-6 text-[11px]">
        <div className="observaciones-section">
          <label className="observaciones-label text-[11px]">Procedimiento:</label>
          <textarea
            name="procedimiento"
            value={form.procedimiento || ""}
            onChange={handleChange}
            disabled={disabled}
            className={`resize-none w-full border text-[11px] rounded px-2 py-1 mb-3 ${disabled ? "bg-gray-300" : isFieldEdited("procedimiento") ? "border-orange-600 bg-orange-100" : ""}`}
            rows="3"
          />
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

      <MenuContextualOdontograma menu={contextMenu} onElegir={handleOptionClick} />
    </div>
  );
}
