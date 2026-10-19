import { useState } from "react";
import Swal from "sweetalert2";
import { faBandage, faBed, faFilePrescription } from "@fortawesome/free-solid-svg-icons";
import DescansoMedico from "../DescansoMedico/DescansoMedico";
import { actualizarDescanso } from "../DescansoMedico/controllerDescansoMedico";
import InformeAccidente from "../InformeAccidente/InformeAccidente";
import Receta from "../Receta/Receta";
import ComplementoDesplegable from "./ComplementoDesplegable";
import { camposVaciosComplemento, complementosConContenido, complementosRegistrados } from "./controllerComplementos";

// Datos de presentación de cada complemento, en el orden en que se muestran.
const COMPLEMENTOS = {
  descanso: {
    icono: faBed,
    titulo: "Descanso Médico",
    descripcion: "Indique los días de descanso del paciente y el tipo de evento.",
    textoBoton: "Generar Descanso Médico",
    selectorFoco: "[name='descansoDias']",
  },
  accidente: {
    icono: faBandage,
    titulo: "Informe Médico de Accidentes",
    descripcion: "Describa las circunstancias en que ocurrió el accidente.",
    textoBoton: "Generar Informe de Accidente",
    selectorFoco: "[name='accidenteCircunstancias']",
  },
  receta: {
    icono: faFilePrescription,
    titulo: "Receta (Reserva de Medicamentos)",
    descripcion: "Reserve los medicamentos que farmacia entregará al paciente.",
    textoBoton: "Generar Receta",
    selectorFoco: "#medicamentoReceta",
  },
};

/**
 * Descanso Médico, Informe de Accidente y Receta de las Historias Clínicas (solo en tickets de La Arena).
 *
 * Ninguno es obligatorio, así que cada uno aparece como una tarjeta con su botón «Generar…» y recién al pulsarlo
 * se muestran la sección y sus campos. «Quitar» la vuelve a cerrar y descarta lo escrito. Los que el ticket ya
 * tiene registrados, o que ya traen algo escrito, se muestran abiertos desde el principio.
 *
 * Siguen sin botón propio: se guardan con el Guardar de la Historia Clínica (ver controllerComplementos) y se
 * imprimen desde las opciones del mensaje de éxito o del botón IMPRIMIR N° TICKET. `onChange` es el manejador de
 * texto del formulario (en mayúsculas) y `disabled` bloquea la creación en un registro sin «Habilitar edición».
 */
export default function ComplementosDesplegables({ form, setForm, onChange, token, usuario, disabled = false }) {
  const [generados, setGenerados] = useState({ descanso: false, accidente: false, receta: false });

  const conContenido = complementosConContenido(form);
  const registrados = complementosRegistrados(form);
  const estaAbierto = (clave) => generados[clave] || conContenido[clave];

  const generar = (clave) => setGenerados((g) => ({ ...g, [clave]: true }));

  const quitar = async (clave) => {
    if (conContenido[clave]) {
      const { isConfirmed } = await Swal.fire({
        title: `¿Quitar ${COMPLEMENTOS[clave].titulo}?`,
        text: "Se borrará lo que escribió en esta sección.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, quitar",
        cancelButtonText: "Cancelar",
      });
      if (!isConfirmed) return;
    }
    setForm((f) => ({ ...f, ...camposVaciosComplemento[clave]() }));
    setGenerados((g) => ({ ...g, [clave]: false }));
  };

  // Cantidad de días y Fecha fin siempre concuerdan: el cambio de uno recalcula el otro.
  const handleChangeDescanso = (campo, valor) => {
    setForm((f) => ({ ...f, ...actualizarDescanso(f, campo, valor) }));
  };

  const secciones = {
    descanso: (acciones) => <DescansoMedico form={form} onChange={handleChangeDescanso} disabled={disabled} acciones={acciones} />,
    accidente: (acciones) => <InformeAccidente form={form} onChange={onChange} disabled={disabled} acciones={acciones} />,
    receta: (acciones) => (
      <Receta form={form} setForm={setForm} token={token} usuario={usuario} disabled={disabled} acciones={acciones} />
    ),
  };

  return (
    <section className="space-y-3">
      <div>
        <p className="font-semibold text-primario">Complementos de La Arena</p>
        <p className="text-gray-600">
          Documentos opcionales de este ticket: genere solo los que necesite. Se guardan junto con la Historia Clínica.
        </p>
      </div>

      {Object.entries(COMPLEMENTOS).map(([clave, datos]) => (
        <ComplementoDesplegable
          key={clave}
          {...datos}
          abierto={estaAbierto(clave)}
          registrado={registrados[clave]}
          disabled={disabled}
          onGenerar={() => generar(clave)}
          onQuitar={() => quitar(clave)}
        >
          {secciones[clave]}
        </ComplementoDesplegable>
      ))}
    </section>
  );
}
