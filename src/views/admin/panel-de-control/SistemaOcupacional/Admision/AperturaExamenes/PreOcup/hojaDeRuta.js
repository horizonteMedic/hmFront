import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { getFetch } from '../../../../getFetch/getFetch.js';
import HojadeRutaDinamico from '../../../../../../jaspers/HojadeRutaDinamica/HojadeRutaDinamico.jsx';

// Cada hoja de ruta es un jasper de src/views/jaspers cuyo nombre lo indica el backend.
// El glob se evalúa una sola vez (a nivel de módulo) y carga cada jasper bajo demanda.
const jasperModules = import.meta.glob('../../../../../../jaspers/*.jsx');

const escaparHtml = (texto) =>
  String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const confirmarImpresion = (nOrden, nombres) =>
  Swal.fire({
    title: "<span style='font-size:1.3em;font-weight:bold;'>¿Desea Imprimir Hoja de Ruta?</span>",
    html: `<div style='font-size:1.1em;'>N° <b style='color:#2563eb;'>${escaparHtml(nOrden)}</b>${
      nombres ? ` - <span style='color:#0d9488;font-weight:bold;'>${escaparHtml(nombres)}</span>` : ''
    }</div>`,
    icon: 'question',
    background: '#f0f6ff',
    color: '#22223b',
    showCancelButton: true,
    confirmButtonText: 'Sí, Imprimir',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal2-border-radius',
      title: 'swal2-title-custom',
      htmlContainer: 'swal2-html-custom',
      confirmButton: 'swal2-confirm-custom',
      cancelButton: 'swal2-cancel-custom',
    },
    showClass: { popup: 'animate__animated animate__fadeInDown' },
    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
  });

// N° de atención dentro del día: la lista viene del más nuevo al más antiguo. Una historia que
// aún no está en la lista (recién registrada) es la siguiente a las ya registradas hoy.
const numeroOrdenDelDia = (registros, nOrden) => {
  const registro = registros.find((r) => r.n_orden === nOrden);
  if (registro) {
    const delDia = registros.filter((r) => r.fecha_apertura_po === registro.fecha_apertura_po);
    return delDia.length - delDia.findIndex((r) => r.n_orden === nOrden);
  }
  const hoy = format(new Date(), 'yyyy-MM-dd');
  return registros.filter((r) => r.fecha_apertura_po === hoy).length + 1;
};

const imprimirPorProtocolo = async (nOrden, token) => {
  const res = await getFetch(`/api/v01/ct/consentDigit/infoFormatoHojaRutaProtocolo/${nOrden}`, token);
  if (res?.codigo !== 200) return Swal.close();
  const { isConfirmed } = await confirmarImpresion(nOrden);
  if (isConfirmed) HojadeRutaDinamico(res.resultado);
};

/**
 * Imprime la hoja de ruta de una historia (con protocolo → formato dinámico; sin protocolo →
 * jasper que indica el backend según examen/empresa/psicosensometría/test de altura).
 * `hc`: { n_orden, nomExamen, razonEmpresa, n_psicosen, n_testaltura, nombres, protocolo }
 * `registros`: lista actual de historias, para calcular el N° de atención del día.
 */
export const imprimirHojaDeRuta = async ({ hc, registros, token }) => {
  if (hc.protocolo) return imprimirPorProtocolo(hc.n_orden, token);

  const nombre = await getFetch(
    `/api/v01/ct/consentDigit/nombreHojaRuta?nameExamen=${encodeURIComponent(hc.nomExamen ?? '')}` +
      `&empresa=${encodeURIComponent(hc.razonEmpresa ?? '')}&altaPsicosen=${Boolean(hc.n_psicosen)}&testAltura=${Boolean(hc.n_testaltura)}`,
    token
  );
  if (nombre?.id !== 1) {
    return Swal.fire('Sin hoja de ruta', 'No hay una hoja de ruta configurada para este examen', 'info');
  }

  const cargarJasper = jasperModules[`../../../../../../jaspers/${nombre.mensaje}.jsx`];
  if (!cargarJasper) {
    return Swal.fire('Advertencia', `No se encontró el componente jasper: ${nombre.mensaje}`, 'warning');
  }
  const jasper = await cargarJasper();
  if (typeof jasper.default !== 'function') return Swal.close();

  const datosHR = await getFetch(`/api/v01/ct/consentDigit/infoFormatoHojaRuta/${hc.n_orden}`, token);
  const { isConfirmed } = await confirmarImpresion(hc.n_orden, hc.nombres);
  if (isConfirmed) jasper.default({ ...datosHR, numeroOrden: numeroOrdenDelDia(registros, hc.n_orden) });
};
