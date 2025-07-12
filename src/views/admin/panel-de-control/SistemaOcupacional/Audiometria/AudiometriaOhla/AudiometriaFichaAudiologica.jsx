import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const AudiometriaFichaAudiologica = () => {
  // Estado para los datos del formulario (antes era data fijo)
  const [form, setForm] = useState({
    norden: "12345",
    fecha: "2024-06-01",
    tipoExamen: "Preocupacional",
    noExamen: false,

    nombres: "Juan Pérez García",
    edad: "35",
    bellPlus: false,

    sexo: "Masculino",
    ocupacion: "Operario",
    aniosTrabajo: "5",
    mesesTrabajo: "3",

    empresaContratista: "Contratista SAC",
    otoscopia: "Normal",

    empresa: "Empresa Principal S.A.",

    audiometroMarca: "AMPLIVOX",
    audiometroModelo: "AMPLIVOX 270",
    audiometroCalibracion: "2024-01-15",
    tiempoExposicion: "",
    h_d: false,
    min_d: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;

    // Solo permitir números (opcionalmente incluyendo vacío para poder borrar)
    if (/^\d*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const toggleCheckBox = (e) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: !f[name],
    }));
  };
  //===================================0

  // Helpers para parsear y actualizar el input inteligentemente
  const parseExposicion = (input) => {
    // Devuelve { hd: '', min: '' }
    const hdMatch = input.match(/(\d+)\s*H\/D/i);
    const minMatch = input.match(/(\d+)\s*MIN\/D/i);
    return {
      hd: hdMatch ? hdMatch[1] : "",
      min: minMatch ? minMatch[1] : "",
    };
  };

  const buildExposicion = (hd, min, h_d, min_d) => {
    let parts = [];
    if (h_d && hd) parts.push(`${hd} H/D`);
    if (min_d && min) parts.push(`${min} MIN/D`);
    return parts.join(" ");
  };

  // Cuando el usuario marca/desmarca H/D
  const handleCheckHD = (checked) => {
    const { hd, min } = parseExposicion(form.tiempoExposicion);
    let newHd = hd;
    // Si no hay número para H/D, intenta tomar el primer número
    if (checked && !hd) {
      const firstNum = form.tiempoExposicion.match(/\d+/);
      newHd = firstNum ? firstNum[0] : "";
    }
    setForm((f) => ({
      ...f,
      h_d: checked,
      tiempoExposicion: buildExposicion(
        checked ? newHd : "",
        min,
        checked,
        f.min_d
      ),
    }));
  };

  // Cuando el usuario marca/desmarca MIN/D
  const handleCheckMinD = (checked) => {
    const { hd, min } = parseExposicion(form.tiempoExposicion);
    let newMin = min;
    // Si no hay número para MIN/D, intenta tomar el segundo número
    if (checked && !min) {
      // Busca el segundo número
      const nums = form.tiempoExposicion.match(/\d+/g);
      newMin = nums && nums.length > 1 ? nums[1] : "";
    }
    setForm((f) => ({
      ...f,
      min_d: checked,
      tiempoExposicion: buildExposicion(
        hd,
        checked ? newMin : "",
        f.h_d,
        checked
      ),
    }));
  };

  // Función para guardar (placeholder)
  const handleSave = () => {
    // Aquí iría la lógica real de guardado
    Swal.fire({
      icon: "success",
      title: "Guardado",
      text: "Los datos han sido guardados/actualizados correctamente.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Función para imprimir (placeholder)
  const handlePrint = () => {
    if (!form.norden) {
      Swal.fire("Error", "Debe colocar un N° Orden", "error");
      return;
    }
    Swal.fire({
      title: "¿Desea Imprimir Ficha Audiológica?",
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
        // Aquí iría la función real de impresión, por ahora solo un mensaje
        Swal.fire({
          icon: "info",
          title: "Imprimiendo...",
          text: `Se imprimiría la ficha N° Orden: ${form.norden}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Función para limpiar (opcional, solo resetea los campos editables)
  const handleClear = () => {
    // Si tienes campos editables, aquí los puedes limpiar
    Swal.fire({
      icon: "info",
      title: "Limpiar",
      text: "Función de limpiar implementada (placeholder).",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="w-full bg-white rounded shadow p-4 border border-gray-200 mb-4">
      <div className="w-full flex flex-row flex-nowrap gap-4 text-[12px] pb-4">
        {/* Columna 1 */}
        <div className="basis-[65%] min-w-0 text-[12px] flex flex-col gap-3">
          {/* Fila 1 */}
          <div className="grid grid-cols-4 w-full gap-4">
            <div className="flex items-center gap-2">
              <label className="font-bold min-w-[80px] text-[13px]">
                Nro Orden :
              </label>
              <input
                name="norden"
                value={form.norden}
                onChange={handleChangeNumber}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    // handleClearnotO();
                    // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
                  }
                }}
                className="border border-gray-400 rounded px-2 py-1  text-[12px] w-full"
              />
            </div>
            <div className="flex items-center gap-2 ">
              <label className="font-bold min-w-[50px] text-[13px]">
                Fecha :
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full text-[11px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold min-w-[80px] text-[13px]">
                Tip. Exam. :
              </label>
              <input
                name="tipoExamen"
                value={form.tipoExamen}
                onChange={handleChange}
                disabled
                className="border rounded px-2 py-1  text-[12px] w-full min-w-[120px]"
              />
            </div>
            <div className="flex items-center gap-2 pl-8">
              <input
                type="checkbox"
                name="noExamen"
                checked={form.noExamen}
                onChange={toggleCheckBox}
              />
              <span className="text-red-500 font-bold"> No Examen</span>
            </div>
          </div>
          {/* Fila 2 */}
          <div className="grid grid-cols-4 w-full gap-4 ">
            <div className="flex items-center gap-2 col-span-2">
              <label className="font-bold min-w-[80px] text-[13px]">
                Nombres:
              </label>
              <input
                value={form.nombres}
                disabled
                className="border border-gray-400 rounded px-2 py-1 bg-gray-100 w-full text-[12px] "
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold text-[13px] min-w-[80px]">
                Edad :
              </label>
              <input
                value={form.edad}
                disabled
                className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-[50px]"
              />
              <span className="text-[11px]">años</span>
            </div>

            <div className="flex items-center gap-2 pl-8">
              <input
                name="bellPlus"
                type="checkbox"
                checked={form.bellPlus}
                onChange={toggleCheckBox}
              />
              <span className=" font-bold">BELL PLUS</span>
            </div>
          </div>

          {/* Fila 3 */}
          <div className="grid grid-cols-4 w-full gap-4 ">
            {/* Sexo */}
            <div className="flex items-center gap-2 col-span-2">
              <label className="font-bold text-[13px] min-w-[80px]">
                Sexo :
              </label>
              <input
                value={form.sexo}
                disabled
                className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full"
              />
            </div>

            {/* Años de trabajo */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[13px] min-w-[80px]">
                Años Trab. :
              </label>
              <input
                name="aniosTrabajo"
                value={form.aniosTrabajo}
                onChange={handleChangeNumber}
                maxLength={3}
                className="border rounded px-2 py-1  text-[12px] w-[50px]"
              />
            </div>

            {/* Meses de trabajo */}
            <div className="flex items-center gap-2 pl-8">
              <label className="font-bold text-[13px]">y Meses :</label>
              <input
                name="mesesTrabajo"
                value={form.mesesTrabajo}
                onChange={handleChangeNumber}
                maxLength={2}
                className="border border-gray-400 rounded px-2 py-1 text-[12px] w-[50px]"
              />
            </div>
          </div>

          {/* Fila 4 */}
          <div className="grid grid-cols-2 w-full gap-4 ">
            {/* Ocupación */}
            <div className="flex items-center gap-2 ">
              <label className="font-bold text-[13px] min-w-[80px]">
                Ocupación :
              </label>
              <input
                value={form.ocupacion}
                disabled
                className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full "
              />
            </div>

            {/* Otoscopia: ocupará 2 columnas para más espacio */}
            <div className="flex items-center gap-2 ">
              <label className="font-bold text-[13px] min-w-[80px]">
                Otoscopia:
              </label>
              <input
                name="otoscopia"
                value={form.otoscopia}
                onChange={handleChange}
                className="border rounded px-2 py-1 text-[12px] w-full "
              />
            </div>
          </div>

          {/* Fila 5 */}
          <div className="grid grid-cols-2 w-full gap-4 ">
            {/* Empresa */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[13px] min-w-[80px]">
                Empresa :
              </label>
              <input
                value={form.empresa}
                disabled
                className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full"
              />
            </div>

            {/* Contrata */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[13px] min-w-[80px]">
                Contrata :
              </label>
              <input
                value={form.empresaContratista}
                disabled
                className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full"
              />
            </div>
          </div>
        </div>
        {/* Columna 2 */}
        <div className="basis-[35%] min-w-0 flex flex-col gap-4 text-[12px]">
          <fieldset className="border rounded-lg min-w-[220px] text-[12px] p-3">
            <legend className="font-bold text-[14px]">AUDIÓMETRO</legend>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="font-bold text-[13px] min-w-[80px]">
                  Marca :
                </label>
                <input
                  name="audiometroMarca"
                  value={form.audiometroMarca}
                  disabled
                  className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold text-[13px] min-w-[80px]">
                  Modelo :
                </label>
                <input
                  name="audiometroModelo"
                  value={form.audiometroModelo}
                  disabled
                  className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold text-[13px] min-w-[80px]">
                  Modelo :
                </label>
                <input
                  name="audiometroCalibracion"
                  value={form.audiometroCalibracion}
                  disabled
                  className="border border-gray-400 rounded px-2 py-1 bg-gray-100 text-[12px] w-full"
                />
              </div>
            </div>
          </fieldset>
          <div className="flex items-center gap-2 pl-4">
            <label className="font-bold text-[13px] w-[150px]">
              Tiempo de exposición total ponderado 8h/d:
            </label>
            <div className="flex flex-col gap-3">
              <input
                name="tiempoExposicion"
                value={form.tiempoExposicion}
                onChange={handleChange}
                className="border  rounded px-2 py-1 text-[12px] w-full"
              />
              <div className="flex flex-row gap-4 pl-2">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.h_d}
                    onChange={(e) => handleCheckHD(e.target.checked)}
                  />
                  <span style={{ fontSize: "11px" }}>H/D</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.min_d}
                    onChange={(e) => handleCheckMinD(e.target.checked)}
                  />
                  <span style={{ fontSize: "11px" }}>MIN/D</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- NUEVO BLOQUE EN DOS COLUMNAS --- */}
      <div className="w-full flex flex-row flex-nowrap gap-4">
        {/* Columna Izquierda */}
        <div className="bg-white rounded shadow p-4 border border-gray-200 text-[12px] space-y-4 flex flex-col justify-between flex-1">
          <div className=" text-[12px] space-y-4">
            {/* Uso de protectores auditivos y apreciación del ruido */}
            <div className="grid grid-cols-3 gap-4 mb-2">
              <fieldset className="border rounded p-2 text-[12px] px-3">
                <legend className="font-bold text-[13px] mt-2">
                  Uso de protectores Auditivos
                </legend>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked /> Tapones
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Orejeras
                  </label>
                </div>
              </fieldset>
              <fieldset className="border rounded p-2 col-span-2 text-[12px]  px-3">
                <legend className="font-bold text-[12px] mt-2">
                  Apreciación del Ruido
                </legend>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1">
                    <input type="radio" /> Ruido muy intenso
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" checked /> Ruido moderado
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" /> Ruido no molesto
                  </label>
                </div>
              </fieldset>
            </div>
            {/* Antecedentes y Síntomas */}
            <div className="flex flex-row gap-4 mb-2">
              {/* Antecedentes */}
              <fieldset className="border rounded  flex-1 text-[12px] px-3 py-1">
                <table className="w-full mt-2">
                  <thead>
                    <tr className="text-left">
                      <th className="py-1">Antecedentes relacionados</th>
                      <th className="text-center">SI</th>
                      <th className="text-center">NO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Consumo de tabaco",
                      "Servicio Militar",
                      "Hobbies con exposición a ruido",
                      "Exposición laboral a químicos",
                      "Infección al Oído",
                      "Uso de Ototoxicos",
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1 pr-2">{item}</td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            name={`antecedente_si_${idx}`}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            name={`antecedente_no_${idx}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </fieldset>

              {/* Síntomas */}
              <fieldset className="border rounded flex-1 text-[12px] px-3 py-1">
                <table className="w-full mt-2">
                  <thead>
                    <tr className="text-left">
                      <th className="py-1">Síntomas actuales</th>
                      <th className="text-center">SI</th>
                      <th className="text-center">NO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Disminución de la audición",
                      "Dolor de Oídos",
                      "Zumbido",
                      "Mareos",
                      "Infección al Oído",
                      "Otra",
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1 pr-2">{item}</td>
                        <td className="text-center">
                          <input type="checkbox" name={`sintoma_si_${idx}`} />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" name={`sintoma_no_${idx}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </fieldset>
            </div>
            {/* Datos de profesional y botones */}
            <div className="flex flex-col gap-2 ml-4">
              <div className="flex items-center gap-2 mb-1">
                <label className="w-[200px] text-[12px]">
                  Nombre del profesional que realiza la audiometría :
                </label>
                <input
                  value=""
                  className="border border-gray-400 rounded-lg px-3 py-1 bg-white flex-1 text-[12px]"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="w-[200px] text-[12px]">Conclusiones :</label>
                <input
                  value=""
                  className="border border-gray-400 rounded-lg px-3 py-1 bg-white flex-1 text-[12px]"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="w-[200px] text-[12px]">
                  Nombre del Médico :
                </label>
                <input
                  value=""
                  className="border border-gray-400 rounded-lg px-3 py-1 bg-white flex-1 text-[12px]"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 text-[12px] border p-4 rounded-lg">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#059669] text-white transition"
              style={{ minWidth: "140px" }}
              onClick={handleSave}
            >
              <FontAwesomeIcon
                icon={faSave}
                style={{ color: "#fff", fontSize: "12px" }}
              />{" "}
              Guardar/Actualizar
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#facc14] text-[#FFFFFF] transition"
              style={{ minWidth: "120px" }}
              onClick={handleClear}
            >
              <FontAwesomeIcon
                icon={faBroom}
                style={{ color: "white", fontSize: "12px" }}
              />{" "}
              Limpiar
            </button>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-4 flex-1 border border-gray-200  bg-white rounded shadow ">
          <div className="flex-1 p-4 flex  flex-col gap-4 text-[12px] ">
            {/* Diapasones */}
            <fieldset className="border rounded flex-1 text-[12px] px-3 py-1">
              <table className="w-full mt-2">
                <thead>
                  <tr className="text-left">
                    <th className="text-center">O.D</th>
                    <th className="text-center">DIAPASONES RINNE Y WEBER</th>
                    <th className="text-center">O.I</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "250 Hz.", key: "250" },
                    { label: "500 Hz.", key: "500" },
                    { label: "1000 Hz.", key: "1000" },
                  ].map((hz, idx) => (
                    <tr key={hz.key}>
                      <td className="text-center">
                        <input
                          type="text"
                          name={`rinne_weber_od_${hz.key}`}
                          className="border border-gray-400 rounded px-2 py-1 text-[12px] w-full max-w-[150px]"
                        />
                      </td>
                      <td className="py-3 pr-2 text-center">{hz.label}</td>
                      <td className="text-center">
                        <input
                          type="text"
                          name={`rinne_weber_oi_${hz.key}`}
                          className="border border-gray-400 rounded px-2 py-1 text-[12px] w-full max-w-[150px]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>

            {/* Logoaudiometría */}
            <fieldset className="border rounded flex-1 text-[12px] px-3 py-1">
              <table className="w-full mt-2">
                <thead>
                  <tr className="text-left">
                    <th className="pl-1">LOGOAUDIOMETRÍA</th>
                    <th className="text-center">Derecha</th>

                    <th className="text-center">Izquierda</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Umbral de discriminación",
                    "% de discriminación",
                    "Umbral de Confort MCL",
                    "Umbral de Disconfort UCL",
                  ].map((label, idx) => (
                    <tr key={idx}>
                      <td className="py-3 pr-2 pl-1">{label}</td>
                      <td className="text-center">
                        <input
                          type="text"
                          name={`logoaudiometria_der_${idx}`}
                          className="border border-gray-400 rounded px-2 py-1 text-[12px] w-full max-w-[150px]"
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="text"
                          name={`logoaudiometria_izq_${idx}`}
                          className="border border-gray-400 rounded px-2 py-1 text-[12px] w-full max-w-[150px]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
          </div>
          {/* Imprimir Audiológica */}
          <fieldset className="border rounded  mx-6 p-4 mb-4 ">
            <legend className="font-bold text-[12px]">
              Imprimir Audiológica
            </legend>
            <div className="flex items-center gap-2">
              <label
                className="font-bold min-w-[90px]"
                style={{ fontSize: "12px" }}
              >
                Nro Orden :
              </label>
              <input
                className="border rounded-lg px-3 py-2 "
                style={{
                  fontSize: "12px",
                  width: "100px",
                  color: "#222",
                  fontWeight: "bold",
                  outline: "none",
                }}
              />
              <button
                type="button"
                className="ml-2 px-4 py-2.5 rounded-lg border-none bg-[#2664eb] transition text-white flex items-center justify-center"
                title="Imprimir Audiológica"
                onClick={handlePrint}
                style={{ fontSize: "12px" }}
              >
                <FontAwesomeIcon
                  icon={faPrint}
                  style={{ color: "#fff", fontSize: "12px" }}
                />
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default AudiometriaFichaAudiologica;
