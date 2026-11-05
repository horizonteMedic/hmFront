import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave } from "@fortawesome/free-solid-svg-icons";
import "./OdontogramaAdultos.css";
import { VerifyTRLO } from "./controllerOdontologia";
import { contarEstados, estadoDe, estadosVisibles } from "./estadosOdontograma";
import MenuContextualOdontograma, { posicionMenu } from "./MenuContextualOdontograma";

const tabla = "odontograma_lo";

export default function OdontogramaLevantarObservacion({
  form,
  setForm,
  handleChange,
  handleClear,
  handleSave,
  closeModal,
  token,
  selectedSede,
  handleClearnotO,
}) {
  const dientesSuperioresArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  const dientesInferioresArray = [
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  ];

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
    const estado = estadoDe(option);
    return estado ? <span className={`${estado.color} ${estado.tamano}`}>{estado.simbolo}</span> : null;
  };

  return (
    <>
      <div className="w-full flex justify-between pr-2 pt-2">
        <div></div>
        <h2 className="text-blue-700 mx-auto font-bold text-center text-2xl mt-6    ">
          LEVANTAR OBSERVACION
        </h2>
        <button
          className=" text-gray-500 hover:text-gray-700 text-2xl "
          onClick={closeModal}
        >
          ×
        </button>
      </div>

      <div className="odontograma-container max-h-[500px] overflow-auto">
        <div className="border p-6 rounded mb-6 text-[10px] ">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-semibold">N° Orden :</label>
              <input
                name="norden"
                value={form.norden || ""}
                onChange={handleChange}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleClearnotO();
                    VerifyTRLO(
                      form.norden,
                      tabla,
                      token,
                      setForm,
                      selectedSede
                    );
                  }
                }}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Fecha de Examen :</label>
              <input
                name="fechaExam"
                type="date"
                value={form.fechaExam}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Nombres :</label>
              <input
                name="nombres"
                value={form.nombres || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Sexo :</label>
                <input
                  name="sexo"
                  value={form.sexo}
                  disabled
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="font-semibold">Edad :</label>
                <input
                  name="edad"
                  value={form.edad}
                  disabled
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold">Empresa :</label>
              <input
                name="empresa"
                value={form.empresa || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>
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

          {/*BOTONES ACCIONES*/}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2 ">
            <div className=" flex gap-4">
              <button
                type="button"
                onClick={handleSave}
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
          </div>
        </div>

        <MenuContextualOdontograma menu={contextMenu} onElegir={handleOptionClick} />
      </div>
    </>
  );
}
