import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { SubmitHistoriaC, SubmitHistoriaCMasivo } from "../model/AdminHistoriaC";
import { getToday } from "../../../../../utils/helpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";

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

export const handleSubirExcel = async (setData, setTotalPages) => {
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
  setData([])
  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryStr = e.target.result;

    const workbook = XLSX.read(binaryStr, { type: "binary" });

    const sheetName = workbook.SheetNames[0]; // primera hoja
    const sheet = workbook.Sheets[sheetName];

    // convierte a JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const dataPreparada = prepararDataExcel(jsonData);

    setData(dataPreparada);
    setTotalPages(Math.ceil(dataPreparada.length / 50));
  };

  reader.readAsBinaryString(file);
};

export const submitMasivo = async (data, sede, token, userlogued) => {
  LoadingDefault("Subiendo Datos");
  try {
    const { hora, fechaFormateada } = await getFechaHoraActual();

    const body = data.map(row => ({
      // Datos del Excel
      dni: row["DNI"] || null,
      razonEmpresa: row["EMPRESA"] || "",
      razonContrata: row["CONTRATA"] || "N/A",
      protocolo: row["PROTOCOLOS/PERFIL"] || "",
      cargo: row["CARGO"] || "",
      area: row["AREA"] || "",
      medico: row["MEDICO OCUP"] || "",
      tipoPago: row["FORMA DE PAGO"] || "",
      observacion1: row["OBSERVACION"] || "",
      precio: row["PRECIO"] ? `S/.${row["PRECIO"]}` : "S/.1",
      tipoPrueba: row["TIPO PRUEBA"] || "N/A",

      // Defaults del sistema
      nordenGenerado: null,
      nomEx: "SUPERFICIE",
      altura: "DEBAJO 2500",
      mineral: "N/A",
      fechaApertura: fechaFormateada,
      estado: "EN PROCESO",
      hora,
      fisttest: false,
      psicosen: false,
      testAltura: false,
      color: 30,
      grupoSanguineo: null,
      factorSanguineo: null,
      codigoClinica: "4353-H",
      visualCompl: false,
      trabajosCalientes: false,
      covid1: false,
      covid2: false,
      manipuladorAlimentos: false,
      nombreExamen: row["EXAMEN MEDICO"] || "ANUAL",
      autoriza: "DR. ARTEMIO",
      numeroOperacion: null,
      herramientasManuales: false,
      rxcDorsoLumbar: false,
      rxcKLumbar: false,
      rxcLumbosacra: false,
      rxcPlomos: false,
      mercurioo: false,
      marihuana: false,
      cocaina: false,
      espaciosConfinados: false,
      precioAdicional: "S/.0",
      tipoPruebaCovid: "RA",
      nombreHotel: "N/A",
      codigoSede: sede,
      usuarioRegistro: userlogued,
    }));

    console.log("Body a enviar:", body);

    const response = await SubmitHistoriaCMasivo(body, token);
    const errores = response?.resultado?.errores || [];

    // Campos que pueden variar entre body y respuesta API
    const camposIgnorar = new Set(["hora", "id"]);

    const sinVariables = (reg) => {
      const obj = {};
      Object.keys(reg)
        .filter(k => !camposIgnorar.has(k))
        .sort() // ← ordenar keys alfabéticamente
        .forEach(k => { obj[k] = reg[k]; });
      return JSON.stringify(obj);
    };

    // Set con los registros que fallaron (sin hora e id)
    const erroresSet = new Map(
      errores.map(err => [sinVariables(err.registro), err.motivo])
    );

    // DEBUG: compara lado a lado
    /*const keyError = sinVariables(errores[0].registro);
    const keyBody = sinVariables(body.find(r => r.dni === null)); // el que tiene dni null

    console.log("KEY ERROR:", keyError);
    console.log("KEY BODY:", keyBody);
    console.log("SON IGUALES:", keyError === keyBody);

    // Ver diferencias campo por campo
    const regError = errores[0].registro;
    const regBody = body.find(r => r.dni === null);
    Object.keys(regError).forEach(k => {
      if (camposIgnorar.has(k)) return;
      if (JSON.stringify(regError[k]) !== JSON.stringify(regBody?.[k])) {
        console.log(`DIFERENCIA en "${k}":`, JSON.stringify(regError[k]), "vs", JSON.stringify(regBody?.[k]));
      }
    })*/

    const resultados = body.map((registro, index) => {
      const key = sinVariables(registro);
      const motivo = erroresSet.get(key);

      return {
        ok: !motivo,
        error: motivo || null,
        row: data[index],
        registro
      };
    });



    Swal.close();
    return resultados;

  } catch (error) {
    Swal.close();
    console.error(error);
    throw error;
  }
};

export const getMasivoimport = async (dni, token, onResult) => {
  LoadingDefault("Importando Datos");
  getFetch(`/api/v01/ct/preNordenOcupacional/buscarPorDni/${dni}`, token)
    .then((res) => {
      console.log(res)

      Swal.close();
      const lista = res?.resultado || [];
      onResult(lista);
    })
}

const prepararDataExcel = (data) => {
  return data
    .map((row) => {
      const newRow = {};

      Object.keys(row).forEach((key) => {
        const value = row[key];

        newRow[key.toUpperCase()] =
          typeof value === "string"
            ? value.toUpperCase().trim()
            : value;
      });

      return newRow;
    })
    .filter(row => !isRowEmpty(row)); // 🔥 AQUÍ eliminas filas vacías
};


export const descargarPlantillaExcel = async (MedicosMulti, FormaPago, ExamenMulti) => {

  const listaMedicos = MedicosMulti.map(m => m.mensaje);
  const listaFormaPago = FormaPago.map(f => f.descripcion);
  const listaPerfiles = Array.from({ length: 20 }, (_, i) => `Perfil ${i + 1}`);

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("PLANTILLA");
  const sheetListas = workbook.addWorksheet("LISTAS");

  sheetListas.state = "hidden";

  const headers = [
    "DNI", "EMPRESA", "CONTRATA", "MEDICO OCUP",
    "CARGO", "TIPO PRUEBA", "AREA", "PROTOCOLOS/PERFIL",
    "PRECIO", "FORMA DE PAGO", "OBSERVACION", "EXAMEN MEDICO"
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

  listaPerfiles.forEach((p, i) => { sheetListas.getCell(`D${i + 1}`).value = p; });


  // 🔹 FILAS BASE
  for (let i = 0; i < 50; i++) {
    sheet.addRow([
      "", "GREEN PERU S.A", "N/A",
      "ARTEMIO ALEJANDRO GARCIA CABRERA",
      "", "N/A", "", "", "", "CREDITO", "", ""
    ]);
  }

  // 🔥 RANGOS
  const rangoMedicos = `LISTAS!$A$1:$A$${listaMedicos.length}`;
  const rangoFormaPago = `LISTAS!$C$1:$C$${listaFormaPago.length}`;
  const rangoPerfiles = `LISTAS!$D$1:$D$${listaPerfiles.length}`; // 🔥 NUEVO

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
      type: "list", allowBlank: false, formulae: [rangoPerfiles]
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

const isRowEmpty = (row) => {
  return Object.values(row).every(value => {
    if (value === null || value === undefined) return true;

    // string vacío o espacios
    if (typeof value === "string" && value.trim() === "") return true;

    return false;
  });
};

export const isRowValid = (row) => {
  return (
    row["DNI"]?.toString().trim() !== "" &&
    row["EMPRESA"]?.toString().trim() !== "" &&
    row["EXAMEN"]?.toString().trim() !== ""
  );
};

export const getRowStatus = (row, index, resultados) => {
  if (!isRowValid(row)) return "invalid";

  const result = resultados[index];

  if (!result) return "pending"; // aún no enviado

  return result.ok !== false ? "success" : "error";
};

const getFechaHoraActual = () => {

  const currentDate = new Date();

  // Hora
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  const hora = `${hours}:${minutes}:${seconds}`;

  // Fecha YYYY-MM-DD
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const fechaFormateada = `${year}-${month}-${day}`;

  return {
    hora,
    fechaFormateada
  };

};