import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBroom } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getVisita, patchAtencion } from "./controllerRegistroEspecialidades";
import FichaEspecialidadCard from "./FichaEspecialidadCard";
import BuscarMedicamentoModal from "./BuscarMedicamentoModal/BuscarMedicamentoModal";
import AnularEntregaModal from "./AnularEntregaModal/AnularEntregaModal";
import {formatearFechaCorta} from "../../../../utils/formatDateUtils"

const construirEntregasPorFicha = (fichasData) => {
  const mapa = {};
  fichasData.forEach((f) => {
    mapa[f.id] = (Array.isArray(f.medicamentosEntregados) ? f.medicamentosEntregados : []).map((m) => ({
      id: m.id,
      nombre: m.nombre,
      presentacion: m.presentacion,
      cantidad: m.cantidad,
      estado: "ACTIVA",
    }));
  });
  return mapa;
};

export default function RegistroEspecialidades() {
  const { token, userlogued } = useSessionData();

  const [codVisita, setCodVisita] = useState("");
  const [loading, setLoading] = useState(false);
  const [visita, setVisita] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [entregasPorFicha, setEntregasPorFicha] = useState({});
  const [atencionLoadingId, setAtencionLoadingId] = useState(null);
  const [fichaMedicamento, setFichaMedicamento] = useState(null);
  const [entregaAnular, setEntregaAnular] = useState(null);

  const visitaAbierta = visita?.estado === "ABIERTA";

  const handleLimpiar = () => {
    setCodVisita("");
    setVisita(null);
    setPaciente(null);
    setFichas([]);
    setEntregasPorFicha({});
  };

  const handleBuscar = async () => {
    if (!codVisita) {
      Swal.fire("Error", "Debe ingresar un código de visita", "error");
      return;
    }

    setLoading(true);
    const res = await getVisita(codVisita, token);
    setLoading(false);

    if (res.ok) {
      const fichasData = Array.isArray(res.data?.fichas) ? res.data.fichas : [];
      setVisita(res.data?.visita ?? null);
      setPaciente(res.data?.paciente ?? null);
      setFichas(fichasData);
      setEntregasPorFicha(construirEntregasPorFicha(fichasData));
      return;
    }

    setVisita(null);
    setPaciente(null);
    setFichas([]);
    if (res.status === 404) {
      Swal.fire("No encontrado", "No existe una visita con ese id.", "warning");
    } else {
      Swal.fire("Error", "Ha ocurrido un error al buscar la visita.", "error");
    }
  };

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  const handleToggleAtencion = async (ficha) => {
    if (!visitaAbierta || atencionLoadingId) return;

    const estaPaso = ficha.estado === "PASO";

    if (estaPaso) {
      const tieneMedicamentosActivos = (entregasPorFicha[ficha.id] || []).some((e) => e.estado !== "ANULADA");
      if (tieneMedicamentosActivos) {
        Swal.fire(
          "No se puede desactivar",
          "Esta especialidad tiene medicamentos entregados. Anule las entregas antes de quitar la atención.",
          "warning"
        );
        return;
      }
    }

    const nuevoEstado = estaPaso ? "NO_PASO" : "PASO";

    setAtencionLoadingId(ficha.id);
    const res = await patchAtencion(ficha.id, { usuarioRegistro: userlogued, estado: nuevoEstado }, token);
    setAtencionLoadingId(null);

    if (res.ok) {
      setFichas((prev) => prev.map((f) => (f.id === ficha.id ? { ...f, estado: nuevoEstado } : f)));
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title:
          nuevoEstado === "PASO"
            ? `${ficha.especialidad?.nombre}: marcado como atendido`
            : `${ficha.especialidad?.nombre}: desmarcado`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    if (res.status === 404) {
      Swal.fire("Error", "No existe esa ficha de especialidad.", "error");
    } else if (res.status === 400) {
      Swal.fire(
        "Error",
        res.data?.mensaje || res.data?.message || "No se pudo marcar la atención (revise el estado de la visita).",
        "error"
      );
    } else {
      Swal.fire("Error", "Ha ocurrido un error al registrar la atención.", "error");
    }
  };

  const handleEntregaRegistrada = (ficha, entrega) => {
    setEntregasPorFicha((prev) => ({
      ...prev,
      [ficha.id]: [...(prev[ficha.id] || []), entrega],
    }));
  };

  const handleEntregaAnulada = (ficha, entregaId) => {
    setEntregasPorFicha((prev) => ({
      ...prev,
      [ficha.id]: (prev[ficha.id] || []).map((e) => (e.id === entregaId ? { ...e, estado: "ANULADA" } : e)),
    }));
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Buscar Visita">
        <div className="flex items-end gap-3 flex-wrap">
          <InputTextOneLine
            label="Cod. Visita"
            name="codVisita"
            value={codVisita}
            onChange={(e) => setCodVisita(e.target.value.replace(/\D/g, ""))}
            onKeyUp={handleSearchKeyUp}
            labelWidth="100px"
            className="flex-1 min-w-[220px]"
          />
          <button
            type="button"
            onClick={handleBuscar}
            disabled={loading}
            className="azul-btn px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSearch} /> {loading ? "Buscando..." : "Buscar"}
          </button>
          {visita && (
            <button
              type="button"
              onClick={handleLimpiar}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          )}
        </div>
      </SectionFieldset>

      {visita && (
        <>
          <SectionFieldset legend="Información de la Visita" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <InputTextOneLine label="N° Visita" value={visita.id} disabled labelWidth="100px" />
            <InputTextOneLine label="N° Orden" value={visita.norden} disabled labelWidth="100px" /> */}
            <InputTextOneLine label="Estado" value={visita.estado} disabled labelWidth="100px" />
            <InputTextOneLine label="Fecha" value={formatearFechaCorta(visita.fechaVisita)} disabled labelWidth="100px" />
          </SectionFieldset>

          {paciente && (
            <SectionFieldset legend="Datos del Paciente" className="grid grid-cols-1  sm:grid-cols-2 gap-4">
              <InputTextOneLine label="Nombres" value={paciente.apellidos + " " + paciente.nombres} disabled labelWidth="100px" className="sm:col-span-2" />
              <InputTextOneLine label="DNI" value={paciente.dni} disabled labelWidth="100px" />
              <InputTextOneLine label="Sexo" value={paciente.sexo === "M" ? "Masculino" : paciente.sexo === "F" ? "Femenino" : ""} disabled labelWidth="100px" />
              <InputTextOneLine label="Fecha Nacimiento" value={formatearFechaCorta(paciente.fechaNacimiento) || ""} disabled labelWidth="100px" />
            </SectionFieldset>
          )}

          {!visitaAbierta && (
            <div className="text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded px-4 py-2">
              Esta visita no está ABIERTA. No se pueden registrar atenciones ni entregas de medicamentos.
            </div>
          )}

          <SectionFieldset legend="Especialidades">
            {fichas.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">Esta visita no tiene especialidades registradas.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {fichas.map((ficha) => (
                  <FichaEspecialidadCard
                    key={ficha.id}
                    ficha={ficha}
                    entregas={entregasPorFicha[ficha.id] || []}
                    visitaAbierta={visitaAbierta}
                    atencionLoading={atencionLoadingId === ficha.id}
                    onToggleAtencion={handleToggleAtencion}
                    onAbrirBuscarMedicamento={setFichaMedicamento}
                    onAbrirAnular={(f, entrega) => setEntregaAnular({ ficha: f, entrega })}
                  />
                ))}
              </div>
            )}
          </SectionFieldset>
        </>
      )}

      {fichaMedicamento && (
        <BuscarMedicamentoModal
          ficha={fichaMedicamento}
          token={token}
          usuarioRegistro={userlogued}
          entregasExistentes={entregasPorFicha[fichaMedicamento.id] || []}
          closeModal={() => setFichaMedicamento(null)}
          onEntregaRegistrada={handleEntregaRegistrada}
          onEntregaAnulada={(entregaId) => handleEntregaAnulada(fichaMedicamento, entregaId)}
        />
      )}

      {entregaAnular && (
        <AnularEntregaModal
          entrega={entregaAnular.entrega}
          token={token}
          usuarioRegistro={userlogued}
          closeModal={() => setEntregaAnular(null)}
          onAnulada={(entregaId) => handleEntregaAnulada(entregaAnular.ficha, entregaId)}
        />
      )}
    </div>
  );
}
