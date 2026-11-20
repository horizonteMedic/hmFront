import ConsentAdmisionRegistroEntregaInformeEMO from "./Consent_Admision_RegistroEntregaInformeEMO.jsx";
import { VisorPdfPrueba, firmaDePrueba, huellaDePrueba, selloDePrueba } from "../../ModuloAsistencial/pruebaJasper.jsx";

// Simulador del "Registro de entrega e informe de resultados del EMO" para la ruta /fichapi: genera el PDF
// con datos de prueba y lo muestra en la misma página.

export const datosPrueba = () => ({
  nOrden: 123456,
  sede: "Trujillo",
  fechaEntrega: "2026-11-18",
  codigoColor: "#008f39",
  textoColor: "F",

  nombres: "CARLOS ANDRÉS",
  apellidos: "MENDOZA QUISPE",
  codPa: "12345678",
  empresa: "LA ARENA S.A.",

  digitalizacion: [
    { nombreDigitalizacion: "FIRMAP", url: firmaDePrueba() },
    { nombreDigitalizacion: "HUELLA", url: huellaDePrueba() },
    { nombreDigitalizacion: "SELLOFIRMA", url: selloDePrueba("Dra. Ana Torres Rojas", "012345") },
  ],
});

export default function RegistroEntregaInformeEMOPrueba() {
  return (
    <VisorPdfPrueba
      titulo="Registro de entrega e informe de resultados del EMO"
      generar={(doc) => ConsentAdmisionRegistroEntregaInformeEMO(datosPrueba(), doc)}
    />
  );
}
