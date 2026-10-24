import Swal from 'sweetalert2';

// Bootstrap 5 está cargado globalmente: su `.border` / `.border-N` llevan !important y pisan a
// Tailwind, por eso los bordes completos se escriben como `border-[1px]`.
export const INPUT =
  'w-full rounded-md border-[1px] border-slate-300 bg-white px-[10px] py-[5px] text-lg font-semibold ' +
  'placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500';

export const BOTON =
  'inline-flex items-center justify-center gap-[6px] whitespace-nowrap rounded-md px-[14px] py-[6px] text-lg ' +
  'font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export const mostrarCargando = (titulo = 'Validando Datos') =>
  Swal.fire({
    title: titulo,
    text: 'Espere por favor...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });
