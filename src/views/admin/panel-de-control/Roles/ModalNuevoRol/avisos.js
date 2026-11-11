import Swal from 'sweetalert2';

// Aviso no bloqueante (esquina superior derecha) para confirmar un cambio sin cortar el flujo del usuario.
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
});

export const avisar = (icon, title) => toast.fire({ icon, title });

// Confirmación antes de quitar un acceso (acción que sí conviene confirmar).
export const confirmarQuitar = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, quitar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
  }).then((res) => res.isConfirmed);
