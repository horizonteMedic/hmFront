import Swal from "sweetalert2";
import * as XLSX from "xlsx";


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
          userRegistroDatos: res.usuarioRegistro ?? ""
        });
        RendeSet(res)
        Swal.close();
      }
    })
    .catch(() => {
      Swal.fire('Error', 'Hubo un problema al obtener los datos', 'error');
    });
}

export const handleSubirExcel = async (setData) => {
  const { value: file } = await Swal.fire({
    title: "Selecciona un archivo Excel",
    input: "file",
    inputAttributes: {
      accept: ".xlsx,.xls",
      "aria-label": "Sube tu Excel"
    },
    showCancelButton: true,
    confirmButtonText: "Procesar",
  });

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryStr = e.target.result;

    const workbook = XLSX.read(binaryStr, { type: "binary" });

    const sheetName = workbook.SheetNames[0]; // primera hoja
    const sheet = workbook.Sheets[sheetName];

    // convierte a JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const dataPreparada = prepararDataExcel(jsonData);

    console.log("Data preparada:", dataPreparada);

    setData(dataPreparada);
  };

  reader.readAsBinaryString(file);
};

const prepararDataExcel = (data) => {
  return data.map((row) => {
    const newRow = {};

    Object.keys(row).forEach((key) => {
      const value = row[key];

      // Solo transformar strings
      newRow[key.toUpperCase()] =
        typeof value === "string"
          ? value.toUpperCase().trim()
          : value;
    });

    return newRow;
  });
};