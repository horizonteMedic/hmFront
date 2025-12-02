
export const ImportData = (dni, Swal, getFetch, token, set, RendeSet) => {
  Swal.fire({
    title: 'Cargando Datos',
    text: 'Espere por favor...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    didOpen: () => {
      Swal.showLoading();
    }
  });
  if (!dni) return Swal.fire('Error', 'Coloque un DNI valido', 'error')
  getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupDni/${dni}`, token)
    .then((res) => {
      if (!res) {
        return Swal.fire('Sin Resultado', 'No se encontro al paciente', 'error')
      } else {
        const [yyyy, mm, dd] = res.fechaAperturaPo.split('-');
        res.fechaAperturaPo = `${dd}/${mm}/${yyyy}`;
        set({
          ...res,
          nombresPa: res.nombres,
          apellidosPa: res.apellidos,
          userRegistroDatos: res.usuarioRegistro ?? "",
          idProtocolo: res.protocolo,
        });
        RendeSet(res)
        Swal.close();
      }
    })
    .catch(() => {
      Swal.fire('Error', 'Hubo un problema al obtener los datos', 'error');
    });
}

