import jsPDF from "jspdf";
import header_OIT from "./HeaderOIT";
import autoTable from "jspdf-autotable";

export default function OIT(datos = {}) {

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 26;

  // 2) Encabezado (logo, campos, título)

  // 2) Encabezado (logo, campos, título)
  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const isValidUrl = url => url && url !== "Sin registro";
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
  ]).then(([s1]) => {
    // 2) Encabezado (logo, campos, título)
    header_OIT(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("FORMULARIO DE INFORME RADIOGRAFICO CON METODOLOGIA OIT", pageW / 2, y, { align: "center" })

    autoTable(doc, {
      startY: y + 3,
      body: [
        [
          { content: "PLACA N°:", styles: { valign: "middle", cellWidth: 30 } },
          { content: `${datos.nplaca}` },
          { content: "HCL:" },
          { content: `${datos.norden}` },
          { content: "LECTOR:", styles: { cellWidth: 20 } },
          { content: "" }
        ],
        [
          { content: "NOMBRE:" },
          { content: `${datos.nombres}`, colSpan: 3 },
          { content: "EDAD:" },
          { content: `${datos.edad}` }
        ],
        [
          { content: "FECHA DE LECTURA", rowSpan: 2 },
          { content: `${datos.flectura}`, colSpan: 2 },
          { content: "", rowSpan: 2 },
          { content: "FECHA DE RADIOGRAFÍA", rowSpan: 2 },
          { content: `${datos.fradiografia}` }
        ],
        [
          { content: "Día - Mes - Año", colSpan: 2 },
          { content: "Día - Mes - Año" }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0] },
      margin: { left: 10, right: 10 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "I. CALIDAD RADIOGRAFICA", rowSpan: 4, styles: { halign: 'center', valign: 'middle' } },
          { content: "1 BUENA" },
          { content: `${datos.rbBuena ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "CAUSAS", rowSpan: 7, styles: { halign: 'center', valign: 'middle' } },
          { content: "1 SOBRE EXPOSICIÓN" },
          { content: `${datos.rbSobreexposicion ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "5 ESCÁPULAS" },
          { content: `${datos.rbEscapulas ? 'X' : ""}`, styles: { cellWidth: 5, halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "2 ACEPTABLE" },
          { content: `${datos.rbAceptable ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "2 SUBEXPOSICIÓN" },
          { content: `${datos.rbSubexposicion ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "6 ARTEFACTOS" },
          { content: `${datos.rbArtefactos ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "3 BAJA CALIDAD" },
          { content: `${datos.rbBajacalidad ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "3 POSICIÓN CENTRADO" },
          { content: `${datos.rbPosicioncentrado ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "7 OTROS" },
          { content: `${datos.rbOtros ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "4 INACEPTABLE" },
          { content: `${datos.rbInaceptable ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "4 INSPIRACIÓN" },
          { content: `${datos.rbInspiracionInsuficiente ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } }
        ],

      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 35 }, // CALIDAD
        1: { cellWidth: 30 }, // texto calidad
        2: { cellWidth: 15 }, // $F
        3: { cellWidth: 20 }, // CAUSAS
        4: { cellWidth: 40 }, // texto causas
        5: { cellWidth: 15 }  // $F
      },
      margin: { left: 10, right: 10 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "COMENTARIO SOBRE DEFECTOS TÉCNICOS", styles: { halign: "left", cellWidth: 70 } },
          { content: "" }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0] },
      margin: { left: 10, right: 10 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "II. ANORMALIDADES PARENQUIMATOSAS (si NO hay anormalidades pase a III. A. Pleurales)", styles: {minCellWidth: 100} },
          { content: "SI", styles: { halign: 'center', valign: 'middle' } },
          { content: `${datos.anormalidades_parenquimatosas_si ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "NO", styles: { halign: 'center', valign: 'middle' } },
          { content: `${datos.anormalidades_parenquimatosas_no ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0] },
      margin: { left: 10, right: 10 }
    });

    const validacionesCeldas = [
      { row: 1, col: 3, key: "chk1" }, // fila 0, columna 1, se evalúa datos.chkA
      { row: 1, col: 4, key: "chk5" },
      { row: 1, col: 5, key: "chk9" },
      { row: 1, col: 11, key: "chko" },
      //
      { row: 2, col: 3, key: "chk2" },
      { row: 2, col: 4, key: "chk6" },
      { row: 2, col: 5, key: "chk10" },
      { row: 2, col: 6, key: "chkP1" },
      { row: 2, col: 7, key: "chkP4" },
      { row: 2, col: 8, key: "chkS1" },
      { row: 2, col: 9, key: "chkS4" },
      { row: 2, col: 11, key: "chka" },
      //
      { row: 3, col: 3, key: "chk3" },
      { row: 3, col: 4, key: "chk7" },
      { row: 3, col: 5, key: "chk11" },
      { row: 3, col: 6, key: "chkP2" },
      { row: 3, col: 7, key: "chkP5" },
      { row: 3, col: 8, key: "chkS2" },
      { row: 3, col: 9, key: "chkS5" },
      { row: 3, col: 11, key: "chkb" },
      //
      { row: 4, col: 3, key: "chk4" },
      { row: 4, col: 4, key: "chk8" },
      { row: 4, col: 5, key: "chk12" },
      { row: 4, col: 6, key: "chkP3" },
      { row: 4, col: 7, key: "chkP6" },
      { row: 4, col: 8, key: "chkS3" },
      { row: 4, col: 9, key: "chkS6" },
      { row: 4, col: 11, key: "chkc" },
      // Añade más según sea necesario
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "2.1 ZONAS AFECTADAS (marque todas las zonas afectadas)", colSpan: 3, },
          { content: "2.2 PROFUSIÓN (opacidades pequeñas)(consulte las radiografias estandar - marque la subcategoria de", colSpan: 3 },
          { content: "2.3 FORMA Y TAMAÑO (consulte las radiografias estandar, se requere dos simbolos, marque un primario)", colSpan: 4 },
          { content: "2.4 OPACIDADES GRANDES (marque 0 si no hay niguna o marque A B o C)", colSpan: 3 }
        ],
        [
          { content: "", },
          { content: "DER." },
          { content: "IZQ." },
          { content: "0/-", styles: { halign: 'center', valign: 'middle' } },
          { content: "0/0", styles: { halign: 'center', valign: 'middle' } },
          { content: "0/1", styles: { halign: 'center', valign: 'middle' } },
          { content: "PRIMARIA", colSpan: 2 },
          { content: "SECUNDARIA", colSpan: 2 },
          { content: "", rowSpan: 4 },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "", rowSpan: 4 },
        ],
        [
          { content: "SUPERIOR", styles: { cellWidth: 30 } },
          { content: `${datos.chk1D ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: `${datos.chk1I ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "1/0", styles: { halign: 'center', valign: 'middle' } },
          { content: "1/1", styles: { halign: 'center', valign: 'middle' } },
          { content: "1/2", styles: { halign: 'center', valign: 'middle' } },
          { content: "p", styles: { halign: 'center', valign: 'middle' } },
          { content: "q", styles: { halign: 'center', valign: 'middle' } },
          { content: "p", styles: { halign: 'center', valign: 'middle' } },
          { content: "s", styles: { halign: 'center', valign: 'middle' } },
          { content: "A", styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: "MEDIO" },
          { content: `${datos.chk2D ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: `${datos.chk2I ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "2/1", styles: { halign: 'center', valign: 'middle' } },
          { content: "2/2", styles: { halign: 'center', valign: 'middle' } },
          { content: "2/3", styles: { halign: 'center', valign: 'middle' } },
          { content: "q", styles: { halign: 'center', valign: 'middle' } },
          { content: "t", styles: { halign: 'center', valign: 'middle' } },
          { content: "q", styles: { halign: 'center', valign: 'middle' } },
          { content: "t", styles: { halign: 'center', valign: 'middle' } },
          { content: "B", styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: "INFERIOR" },
          { content: `${datos.chk3D ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: `${datos.chk3I ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "3/2", styles: { halign: 'center', valign: 'middle' } },
          { content: "3/3", styles: { halign: 'center', valign: 'middle' } },
          { content: "3/+", styles: { halign: 'center', valign: 'middle' } },
          { content: "r", styles: { halign: 'center', valign: 'middle' } },
          { content: "u", styles: { halign: 'center', valign: 'middle' } },
          { content: "r", styles: { halign: 'center', valign: 'middle' } },
          { content: "u", styles: { halign: 'center', valign: 'middle' } },
          { content: "C", styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: "III. ANORMALIDADES PLEURALES (si NO hay anormalidades pase a símbolos)", colSpan: 9 },
          { content: "SI" },
          { content: `${datos.chk2Si ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } },
          { content: "NO" },
          { content: `${datos.chk2No ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "               3.1 PLACAS PLEURALES (0 = NINGUNA, D = HEMITÓRAX DRECHO, I = HEMITÓRAX IZQUIERDO", colSpan: 13 }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
      margin: { left: 10, right: 10 },
      didDrawCell: function (data) {
        const { cell, row, column, doc } = data;

        // Buscar si la celda actual tiene una validación
        const validacion = validacionesCeldas.find(v => v.row === row.index && v.col === column.index);

        if (validacion && datos[validacion.key]) {
          // Coordenadas para centrar la X
          const x = cell.x + cell.width / 2;
          const y = cell.y + cell.height / 2;

          // Dibujar la X azul
          doc.setTextColor(0, 0, 255);
          doc.setFontSize(10);
          doc.text("X", x, y, { align: "center", baseline: "middle" });

          // Restaurar color original
          doc.setTextColor(0, 0, 0);
        }
      }
    });

    const validacionesCeldasPleurales = [
      { row: 1, col: 2, key: "chkE1" }, // fila 0, columna 1, se evalúa datos.chkA
      { row: 1, col: 4, key: "chkE4" },
      //
      { row: 2, col: 2, key: "chkE2" },
      { row: 2, col: 4, key: "chkE5" },
      //
      { row: 3, col: 2, key: "chkE3" },
      { row: 3, col: 4, key: "chkE6" },
      
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "SITIO (Marque las casillas adecuadas)", rowSpan: 4, styles: { halign: 'center', valign: 'middle', cellWidth: 40 } },
          { content: "CALCIFICACION (Marque)", rowSpan: 4, styles: { halign: 'center', valign: 'middle', cellWidth: 40 } },
          { content: "EXTENSIón (Pared torácica combinada\n para placas de perfil y de frente)", colSpan: 2 },
          { content: "ANCHO (opcional) (Ancho mínimo exigido 3mm)", colSpan: 2 }
        ],
        [
          { content: "1", styles: { halign: 'center', valign: 'middle' } },
          { content: "< 1/4 de la pared lateral de tórax" },
          { content: "4", styles: { halign: 'center', valign: 'middle' } },
          { content: "De 3 a 5 mm" }
        ],
        [
          { content: "2", styles: { halign: 'center', valign: 'middle' } },
          { content: "Entre 1/4 y 1/2 de la pared lateral de tórax" },
          { content: "5", styles: { halign: 'center', valign: 'middle' } },
          { content: "De 5 a 10 mm" }
        ],
        [
          { content: "3", styles: { halign: 'center', valign: 'middle' } },
          { content: "> 1/2 de la pared lateral de tórax" },
          { content: "6", styles: { halign: 'center', valign: 'middle' } },
          { content: "Mayor a 10 mm" }
        ]

      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
      margin: { left: 10, right: 10 },
      didDrawCell: function (data) {
        const { cell, row, column, doc } = data;

        // Buscar si la celda actual tiene una validación
        const validacion = validacionesCeldasPleurales.find(v => v.row === row.index && v.col === column.index);

        if (validacion && datos[validacion.key]) {
          // Coordenadas para centrar la X
          const x = cell.x + cell.width / 2;
          const y = cell.y + cell.height / 2;

          // Dibujar la X azul
          doc.setTextColor(0, 0, 255);
          doc.setFontSize(10);
          doc.text("X", x, y, { align: "center", baseline: "middle" });

          // Restaurar color original
          doc.setTextColor(0, 0, 0);
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "Pared Torácica de perfil", rowSpan: 2, styles: { cellWidth: 20 } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "", rowSpan: 2 },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "", colSpan: 1, styles: { lineWidth: 0, cellWidth: 0 } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "", colSpan: 1, styles: { lineWidth: 0 } },
          { content: "", rowSpan: 2 },
          { content: "D", colSpan: 3, styles: { halign: 'center', valign: 'middle' } },
          { content: "I", colSpan: 3, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "" },
          { content: "" },
          { content: "" },
          { content: "" },
          { content: "" },
          { content: "" },
          { content: "1", styles: { halign: 'center', valign: 'middle' } },
          { content: "2", styles: { halign: 'center', valign: 'middle' } },
          { content: "3", styles: { halign: 'center', valign: 'middle' } },
          { content: "1", styles: { halign: 'center', valign: 'middle' } },
          { content: "2", styles: { halign: 'center', valign: 'middle' } },
          { content: "3", styles: { halign: 'center', valign: 'middle' } },
          { content: "a", styles: { halign: 'center', valign: 'middle' } },
          { content: "b", styles: { halign: 'center', valign: 'middle' } },
          { content: "c", styles: { halign: 'center', valign: 'middle' } },
          { content: "a", styles: { halign: 'center', valign: 'middle' } },
          { content: "b", styles: { halign: 'center', valign: 'middle' } },
          { content: "c", styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: "De Frente" },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "" },
          { content: "", colSpan: 14, styles: { lineWidth: 0 } },
        ],
        [
          { content: "Diafragma" },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "" },
          { content: "", colSpan: 14, styles: { lineWidth: 0 } },
        ],
        [
          { content: "Otro (S) Sitio (S)" },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "" },
          { content: "", colSpan: 14, styles: { lineWidth: 0 } },
        ],
        [
          { content: "Obliteración del Ángulo Castofrénico", colSpan: 4 },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "" },
          { content: "", colSpan: 14, styles: { lineWidth: 0 } },
        ],
        [
          { content: "               3.2 ENGROSAMIENTO DIFUSO DE LA PLEURA (0 = NINGUNA, D = HEMITÓRAX DRECHO, I = HEMITÓRAX IZQUIERDO", colSpan: 21 }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
      margin: { left: 10, right: 10 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "Pared Torácica", colSpan: 4, styles: { halign: 'center', valign: 'middle' } },
          { content: "Calcificación", colSpan: 3, styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { lineWidth: 0 } },
          { content: "Extensión", colSpan: 6, styles: { halign: 'center', valign: 'middle' } },
          { content: "Ancho", colSpan: 6, styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: "De Perfil", styles: { cellWidth: 15 } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { lineWidth: 0 } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { lineWidth: 0 } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { lineWidth: 0 } },
          { content: "D", styles: { halign: 'center', valign: 'middle' }, colSpan: 3 },
          { content: "I", styles: { halign: 'center', valign: 'middle' }, colSpan: 3 },
        ],
        [
          { content: "", },
          { content: "", colSpan: 6 },
          { content: "", styles: { lineWidth: 0 } },
          { content: "1", styles: { halign: 'center', valign: 'middle' } },
          { content: "2", styles: { halign: 'center', valign: 'middle' } },
          { content: "3", styles: { halign: 'center', valign: 'middle' } },
          { content: "1", styles: { halign: 'center', valign: 'middle' } },
          { content: "2", styles: { halign: 'center', valign: 'middle' } },
          { content: "3", styles: { halign: 'center', valign: 'middle' } },
          { content: "a", styles: { halign: 'center', valign: 'middle' } },
          { content: "b", styles: { halign: 'center', valign: 'middle' } },
          { content: "c", styles: { halign: 'center', valign: 'middle' } },
          { content: "a", styles: { halign: 'center', valign: 'middle' } },
          { content: "b", styles: { halign: 'center', valign: 'middle' } },
          { content: "c", styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "De Frente", styles: { cellWidth: 15 } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "D", styles: { halign: 'center', valign: 'middle' } },
          { content: "I", styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { lineWidth: 0 }, colSpan: 13 },
        ],
        [
          { content: "IV SIMBOLOS *", colSpan: 16, styles: { valign: 'middle' } },
          { content: "SI", styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { halign: 'center', valign: 'middle' } },
          { content: "NO", styles: { halign: 'center', valign: 'middle' } },
          { content: "", styles: { halign: 'center', valign: 'middle' } }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
      margin: { left: 10, right: 10 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "(Rodee con un circulo la respuesta adecuada, si rodea od, escriba a continuación un COMENTARIO)", colSpan: 15, styles: { valign: 'middle' } },
        ],
        [
          { content: "aa", styles: { halign: 'center', valign: 'middle' } },
          { content: "at", styles: { halign: 'center', valign: 'middle' } },
          { content: "ax", styles: { halign: 'center', valign: 'middle' } },
          { content: "bu", styles: { halign: 'center', valign: 'middle' } },
          { content: "ca", styles: { halign: 'center', valign: 'middle' } },
          { content: "cg", styles: { halign: 'center', valign: 'middle' } },
          { content: "cn", styles: { halign: 'center', valign: 'middle' } },
          { content: "co", styles: { halign: 'center', valign: 'middle' } },
          { content: "cp", styles: { halign: 'center', valign: 'middle' } },
          { content: "cv", styles: { halign: 'center', valign: 'middle' } },
          { content: "di", styles: { halign: 'center', valign: 'middle' } },
          { content: "ef", styles: { halign: 'center', valign: 'middle' } },
          { content: "em", styles: { halign: 'center', valign: 'middle' } },
          { content: "es", styles: { halign: 'center', valign: 'middle' } },
          { content: "OD", styles: { halign: 'center', valign: 'middle' }, rowSpan: 2 },
        ],
        [
          { content: "fr", styles: { halign: 'center', valign: 'middle' } },
          { content: "hi", styles: { halign: 'center', valign: 'middle' } },
          { content: "ho", styles: { halign: 'center', valign: 'middle' } },
          { content: "id", styles: { halign: 'center', valign: 'middle' } },
          { content: "ih", styles: { halign: 'center', valign: 'middle' } },
          { content: "kl", styles: { halign: 'center', valign: 'middle' } },
          { content: "me", styles: { halign: 'center', valign: 'middle' } },
          { content: "pa", styles: { halign: 'center', valign: 'middle' } },
          { content: "pb", styles: { halign: 'center', valign: 'middle' } },
          { content: "pi", styles: { halign: 'center', valign: 'middle' } },
          { content: "px", styles: { halign: 'center', valign: 'middle' } },
          { content: "ra", styles: { halign: 'center', valign: 'middle' } },
          { content: "rp", styles: { halign: 'center', valign: 'middle' } },
          { content: "tb", styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: "Comentarios:", colSpan: 15, styles: { minCellHeight: 15 } }
        ],
        [
          { content: "Firma y Sello de Médico", colSpan: 15 }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
      margin: { left: 10, right: 10 }
    });

    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones deseadas del sello
      const sigW = 40; // ancho del sello
      const sigH = 40; // alto del sello

      const pageW = doc.internal.pageSize.getWidth();
      const marginRight = 18;

      // Posición del sello: derecha del cuadro de comentarios
      const sigX = pageW - marginRight - sigW;
      const sigY = doc.lastAutoTable.finalY - 30; // ajusta según se vea

      // Escalado proporcional
      const maxImgW = sigW - 5;
      const maxImgH = sigH - 5;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }


    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();

  })
}