import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";


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

export const descargarPlantillaExcel = async (MedicosMulti, FormaPago, ExamenMulti) => {

  const listaMedicos = MedicosMulti.map(m => m.mensaje);
  const listaFormaPago = FormaPago.map(f => f.descripcion);
  const listaExamenes = ExamenMulti.map(e => e.mensaje); // 🔥 NUEVO

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("PLANTILLA");
  const sheetListas = workbook.addWorksheet("LISTAS");

  sheetListas.state = "hidden";

  const headers = [
    "DNI", "EMPRESA", "CONTRATA", "MEDICO OCUP",
    "CARGO", "TIPO PRUEBA", "AREA", "EXAMEN",
    "PRECIO", "FORMA DE PAGO", "OBSERVACION"
  ];

  sheet.addRow(headers);

  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "CCFFCC" }
    };
  });

  // 🔹 LISTAS
  listaMedicos.forEach((m, i) => {
    sheetListas.getCell(`A${i + 1}`).value = m;
  });

  listaFormaPago.forEach((f, i) => {
    sheetListas.getCell(`C${i + 1}`).value = f;
  });

  listaExamenes.forEach((e, i) => { // 🔥 NUEVO
    sheetListas.getCell(`D${i + 1}`).value = e;
  });

  // 🔹 FILAS BASE
  for (let i = 0; i < 50; i++) {
    sheet.addRow([
      "", "", "",
      "ARTEMIO ALEJANDRO GARCIA CABRERA",
      "", "N/A", "", "", "", "", ""
    ]);
  }

  // 🔥 RANGOS
  const rangoMedicos = `LISTAS!$A$1:$A$${listaMedicos.length}`;
  const rangoFormaPago = `LISTAS!$C$1:$C$${listaFormaPago.length}`;
  const rangoExamenes = `LISTAS!$D$1:$D$${listaExamenes.length}`; // 🔥 NUEVO

  // 🔥 VALIDACIONES
  for (let i = 2; i <= 51; i++) {

    // MEDICO OCUP
    sheet.getCell(`D${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [rangoMedicos]
    };

    // EXAMEN 🔥 NUEVO
    sheet.getCell(`H${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [rangoExamenes]
    };

    // FORMA DE PAGO
    sheet.getCell(`J${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [rangoFormaPago]
    };
  }

  sheet.columns = headers.map(() => ({ width: 25 }));

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Plantilla_Registro_Masivo.xlsx");
};