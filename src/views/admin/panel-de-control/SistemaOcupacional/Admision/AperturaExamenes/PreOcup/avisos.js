import Swal from 'sweetalert2';

export const mostrarCargando = (titulo = 'Validando Datos') =>
  Swal.fire({
    title: titulo,
    text: 'Espere por favor...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });
