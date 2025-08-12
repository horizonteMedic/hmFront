import jsPDF from "jspdf";
import header_OIT from "./HeaderOIT";
import autoTable from "jspdf-autotable";

export default function OIT_Digitalizado(datos = {}) {

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
          { content: "PLACA N°:", styles: { valign: "middle", cellWidth: 30 ,fillColor:[242, 242, 242] } },
          { content: `${datos.norden}`,styles: { valign: "middle",fillColor:[242, 242, 242] } },
          { content: "HCL:",styles: { valign: "middle",fillColor:[242, 242, 242] } },
          { content: `${datos.norden}`,styles: { valign: "middle",fillColor:[242, 242, 242] } },
          { content: "LECTOR:", styles: { cellWidth: 25, valign: "middle",fillColor:[242, 242, 242]  } },
          { content: `${datos.doctor}`,styles: { valign: "middle",fillColor:[242, 242, 242] } }
        ],
        [
          { content: "NOMBRE:",styles: { valign: "middle",} },
          { content: `${datos.nombres}`, colSpan: 3,styles: { valign: "middle",} },
          { content: "EDAD:",styles: { valign: "middle",} },
          { content: `${datos.edad} AÑOS`,styles: { valign: "middle",} }
        ],
        [
          { content: "FECHA DE LECTURA", rowSpan: 2,styles: { valign: "middle",} },
          { content: `${datos.flectura.split('-').reverse().join('-')}`, colSpan: 2 },
          { content: "", rowSpan: 2 },
          { content: "FECHA DE RADIOGRAFÍA", rowSpan: 2 },
          { content: `${datos.fradiografia.split('-').reverse().join('-')}` }
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
      startY: doc.lastAutoTable.finalY+2,
      body: [
        [
          { content: "I. CALIDAD RADIOGRAFICA", rowSpan: 4, styles: { halign: 'center', valign: 'middle',fillColor:[242, 242, 242]  } },
          { content: "1", styles: {valign:"middle"}},
          { content: "BUENA" },
          { content: `${datos.rbBuena ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: "CAUSAS", rowSpan: 7, styles: { halign: 'center', valign: 'middle' } },
          { content: "1", styles: {valign:"middle"}},
          { content: "SOBRE EXPOSICIÓN" },
          { content: `${datos.rbSobreexposicion ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: "5", styles: {valign:"middle"}},
          { content: "ESCÁPULAS" },
          { content: `${datos.rbEscapulas ? 'X' : ""}`, styles: { cellWidth: 5, halign: 'center', valign: 'middle', textColor: [0,0,255] } }
        ],
        [
          { content: "2", styles: {valign:"middle"}},
          { content: "ACEPTABLE" },
          { content: `${datos.rbAceptable ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: "2", styles: {valign:"middle"}},
          { content: "SUBEXPOSICIÓN" },
          { content: `${datos.rbSubexposicion ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' , textColor: [0,0,255]} },
          { content: "6", styles: {valign:"middle"}},
          { content: "ARTEFACTOS" },
          { content: `${datos.rbArtefactos ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } }
        ],
        [
          { content: "3", styles: {valign:"middle"}},
          { content: "BAJA CALIDAD" },
          { content: `${datos.rbBajacalidad ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: "3", styles: {valign:"middle"}},
          { content: "POSICIÓN CENTRADO" },
          { content: `${datos.rbPosicioncentrado ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: "7", styles: {valign:"middle"}},
          { content: "OTROS" },
          { content: `${datos.rbOtros ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "4", styles: {valign:"middle"}},
          { content: "INACEPTABLE" },
          { content: `${datos.rbInaceptable ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: "4", styles: {valign:"middle"}},
          { content: "INSPIRACIÓN" },
          { content: `${datos.rbInspiracionInsuficiente ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } }
        ],

      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 35 }, // I. CALIDAD RADIOGRAFICA (rowSpan)
        1: { cellWidth: 5 },  // Nº calidad
        2: { cellWidth: 28 }, // Texto calidad
        3: { cellWidth: 8 },  // X calidad
        4: { cellWidth: 23 }, // CAUSAS (rowSpan)
        5: { cellWidth: 5 },  // Nº causa
        7: { cellWidth: 8 },  // X causa
        8: { cellWidth: 5 },  // Nº causa extra
        9: { cellWidth: 28 }, // Texto causa extra
        10: { cellWidth: 8 }  // X causa extra
      },
      margin: { left: 10, right: 10 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "COMENTARIO SOBRE DEFECTOS TÉCNICOS", styles: { halign: "left", cellWidth: 70 } },
          { content: `${datos.txtDefectosTecnicos ? datos.txtDefectosTecnicos : ""}` }
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
          { content: "II. ANORMALIDADES PARENQUIMATOSAS (si NO hay anormalidades pase a III. A. Pleurales)", styles: {minCellWidth: 100,fillColor:[242, 242, 242] } },
          { content: "SI", styles: { halign: 'center', valign: 'middle',fillColor:[242, 242, 242]  } },
          { content: `${datos.anormalidades_parenquimatosas_si ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] ,fillColor:[242, 242, 242] } },
          { content: "NO", styles: { halign: 'center', valign: 'middle',fillColor:[242, 242, 242]  } },
          { content: `${datos.anormalidades_parenquimatosas_no ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255],fillColor:[242, 242, 242]  } }
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
          { content: `${datos.chk1D ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: `${datos.chk1I ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
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
          { content: `${datos.chk2D ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: `${datos.chk2I ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
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
          { content: `${datos.chk3D ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
          { content: `${datos.chk3I ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] } },
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
          { content: "III. ANORMALIDADES PLEURALES (si NO hay anormalidades pase a símbolos)", colSpan: 9,styles:{fillColor:[242, 242, 242] } },
          { content: "SI" ,styles:{fillColor:[242, 242, 242] }},
          { content: `${datos.chk2Si ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255],fillColor:[242, 242, 242]  } },
          { content: "NO" ,styles:{fillColor:[242, 242, 242] }},
          { content: `${datos.chk2No ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255],fillColor:[242, 242, 242]  } }
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
          { content: "EXTENSIÓN (Pared torácica combinada\n para placas de perfil y de frente)", colSpan: 2 },
          { content: "ANCHO (opcional) (Ancho mínimo exigido 3mm)", colSpan: 2 }
        ],
        [
          { content: "1", styles: { halign: 'center', valign: 'middle' } },
          { content: "< 1/4 de la pared lateral de tórax" },
          { content: "a", styles: { halign: 'center', valign: 'middle' } },
          { content: "De 3 a 5 mm" }
        ],
        [
          { content: "2", styles: { halign: 'center', valign: 'middle' } },
          { content: "Entre 1/4 y 1/2 de la pared lateral de tórax" },
          { content: "b", styles: { halign: 'center', valign: 'middle' } },
          { content: "De 5 a 10 mm" }
        ],
        [
          { content: "3", styles: { halign: 'center', valign: 'middle' } },
          { content: "> 1/2 de la pared lateral de tórax" },
          { content: "c", styles: { halign: 'center', valign: 'middle' } },
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

    const validacionesCeldasPleurales2 = [
      { row: 0, col: 8, key: "chk2_20" },
      { row: 0, col: 9, key: "chk2_22" },

      { row: 0, col: 11, key: "chk2_25" },
      { row: 0, col: 12, key: "chk2_27" },

      { row: 0, col: 15, key: "chk2_30" },
      { row: 0, col: 18, key: "chk2_34" },
      //
      { row: 1, col: 8, key: "chk2_19" }, 
      { row: 1, col: 9, key: "chk2_21" },
      { row: 1, col: 10, key: "chk2_23" },
      { row: 1, col: 11, key: "chk2_24" },
      { row: 1, col: 12, key: "chk2_26" },
      { row: 1, col: 13, key: "chk2_28" },
      { row: 1, col: 15, key: "chk2_29" },
      { row: 1, col: 16, key: "chk2_31" },
      { row: 1, col: 17, key: "chk2_32" },
      { row: 1, col: 18, key: "chk2_33" },
      { row: 1, col: 19, key: "chk2_35" },
      { row: 1, col: 20, key: "chk2_36" },
      //
      { row: 2, col: 1, key: "chk2_1" }, 
      { row: 2, col: 2, key: "chk2_4" },
      { row: 2, col: 3, key: "chk2_7" },
      { row: 2, col: 4, key: "chk2_10" },
      { row: 2, col: 5, key: "chk2_13" },
      { row: 2, col: 6, key: "chk2_16" },
       //
      { row: 3, col: 1, key: "chk2_2" }, 
      { row: 3, col: 2, key: "chk2_5" },
      { row: 3, col: 3, key: "chk2_6" },
      { row: 3, col: 4, key: "chk2_11" },
      { row: 3, col: 5, key: "chk2_14" },
      { row: 3, col: 6, key: "chk2_17" },
       //
      { row: 4, col: 1, key: "chk2_3" }, 
      { row: 4, col: 2, key: "chk2_6" },
      { row: 4, col: 3, key: "chk2_9" },
      { row: 4, col: 4, key: "chk2_12" },
      { row: 4, col: 5, key: "chk2_15" },
      { row: 4, col: 6, key: "chk2_18" },
      //
      { row: 5, col: 4, key: "chk2_37" }, 
      { row: 5, col: 5, key: "chk2_38" },
      { row: 5, col: 6, key: "chk2_39" },
    ];

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
      margin: { left: 10, right: 10 },
      didDrawCell: function (data) {
        const { cell, row, column, doc } = data;

        // Buscar si la celda actual tiene una validación
        const validacion = validacionesCeldasPleurales2.find(v => v.row === row.index && v.col === column.index);

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

    const validacionesCeldasEngrosa = [
      { row: 1, col: 1, key: "chk2_40" },
      { row: 1, col: 2, key: "chk2_42" },
      { row: 1, col: 3, key: "chk2_44" },
      { row: 1, col: 4, key: "chk2_46" },
      { row: 1, col: 5, key: "chk2_48" },
      { row: 1, col: 6, key: "chk2_50" },

      { row: 1, col: 8, key: "chk2_53" },
      { row: 1, col: 9, key: "chk2_55" },

      { row: 1, col: 11, key: "chk2_58" },
      { row: 1, col: 12, key: "chk2_60" },

      { row: 1, col: 14, key: "chk2_63" },
      { row: 1, col: 17, key: "chk2_67" },
      //
      { row: 2, col: 8, key: "chk2_52" },
      { row: 2, col: 9, key: "chk2_54" },
      { row: 2, col: 10, key: "chk2_56" },
      { row: 2, col: 11, key: "chk2_57" },
      { row: 2, col: 12, key: "chk2_59" },
      { row: 2, col: 13, key: "chk2_61" },
      { row: 2, col: 14, key: "chk2_62" },
      { row: 2, col: 15, key: "chk2_64" },  
      { row: 2, col: 16, key: "chk2_65" },
      { row: 2, col: 17, key: "chk2_66" },
      { row: 2, col: 18, key: "chk2_68" },
      { row: 2, col: 19, key: "chk2_69" },
      //
      { row: 3, col: 1, key: "chk2_41" },
      { row: 3, col: 2, key: "chk2_43" },
      { row: 3, col: 3, key: "chk2_45" },
      { row: 3, col: 4, key: "chk2_47" },
      { row: 3, col: 5, key: "chk2_49" },
      { row: 3, col: 6, key: "chk2_51" },
    ];

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
          { content: "IV SIMBOLOS *", colSpan: 16, styles: { valign: 'middle',fillColor:[242, 242, 242]  } },
          { content: "SI", styles: { halign: 'center', valign: 'middle',fillColor:[242, 242, 242]  } },
          { content: `${datos.chk3Si ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255],fillColor:[242, 242, 242]  } },
          { content: "NO", styles: { halign: 'center', valign: 'middle',fillColor:[242, 242, 242]  } },
          { content: `${datos.chk3No ? 'X' : ""}`, styles: { halign: 'center', valign: 'middle', textColor: [0,0,255] ,fillColor:[242, 242, 242] } }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
      margin: { left: 10, right: 10 },
      didDrawCell: function (data) {
        const { cell, row, column, doc } = data;

        // Buscar si la celda actual tiene una validación
        const validacion = validacionesCeldasEngrosa.find(v => v.row === row.index && v.col === column.index);

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

    const validacionesCeldasSimbolos = [
      { row: 1, col: 0, key: "chk_28" },
      { row: 1, col: 1, key: "chk_01" },
      { row: 1, col: 2, key: "chk_02" },
      { row: 1, col: 3, key: "chk_03" },
      { row: 1, col: 4, key: "chk_04" },
      { row: 1, col: 5, key: "chk_05" },
      { row: 1, col: 6, key: "chk_06" },
      { row: 1, col: 7, key: "chk_07" },
      { row: 1, col: 8, key: "chk_08" },
      { row: 1, col: 9, key: "chk_09" },
      { row: 1, col: 10, key: "chk_10" },
      { row: 1, col: 11, key: "chk_11" },
      { row: 1, col: 12, key: "chk_12" },
      { row: 1, col: 13, key: "chk_13" },
      { row: 1, col: 14, key: "chk_27" },
      //
      { row: 2, col: 0, key: "chk_29" },
      { row: 2, col: 1, key: "chk_14" },
      { row: 2, col: 2, key: "chk_15" },
      { row: 2, col: 3, key: "chk_16" },
      { row: 2, col: 4, key: "chk_17" },
      { row: 2, col: 5, key: "chk_18" },
      { row: 2, col: 6, key: "chk_19" },
      { row: 2, col: 7, key: "chk_20" },
      { row: 2, col: 8, key: "chk_21" },
      { row: 2, col: 9, key: "chk_22" },
      { row: 2, col: 10, key: "chk_23" },
      { row: 2, col: 11, key: "chk_24" },
      { row: 2, col: 12, key: "chk_25" },
      { row: 2, col: 13, key: "chk_26" },
    ];

    // autoTable(doc, {
    //   startY: doc.lastAutoTable.finalY,
    //   body: [
    //     [
    //       { content: "(Rodee con un circulo la respuesta adecuada, si rodea od, escriba a continuación un COMENTARIO)", colSpan: 15, styles: { valign: 'middle' } },
    //     ],
    //     [
    //       { content: "aa", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "at", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "ax", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "bu", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "ca", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "cg", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "cn", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "co", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "cp", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "cv", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "di", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "ef", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "em", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "es", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "OD", styles: { halign: 'center', valign: 'middle' }, rowSpan: 2 },
    //     ],
    //     [
    //       { content: "fr", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "hi", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "ho", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "id", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "ih", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "kl", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "me", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "pa", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "pb", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "pi", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "px", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "ra", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "rp", styles: { halign: 'center', valign: 'middle' } },
    //       { content: "tb", styles: { halign: 'center', valign: 'middle' } },
    //     ],
    //     [
    //       { content: `Comentarios:${datos.txtSComentarios}`, colSpan: 10, styles: { minCellHeight: 13, fontSize: 7  } }
    //     ],
    //     [
    //       { content: "Firma y Sello de Médico", colSpan: 15 }
    //     ]
    //   ],
    //   theme: "grid",
    //   styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
    //   margin: { left: 10, right: 10 },
    //   didDrawCell: function (data) {
    //     const { cell, row, column, doc } = data;

    //     // Buscar si la celda actual tiene una validación
    //     const validacion = validacionesCeldasSimbolos.find(v => v.row === row.index && v.col === column.index);

    //     if (validacion && datos[validacion.key]) {
    //       // Coordenadas para centrar la X
    //       const x = cell.x + cell.width / 2;
    //       const y = cell.y + cell.height / 2;

    //       // Dibujar la X azul
    //       doc.setTextColor(0, 0, 255);
    //       doc.setFontSize(10);
    //       doc.text("X", x, y, { align: "center", baseline: "middle" });

    //       // Restaurar color original
    //       doc.setTextColor(0, 0, 0);
    //     }
    //   }
    // });
    autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    body: [
      [
        {
          content:
            "(Rodee con un circulo la respuesta adecuada, si rodea od, escriba a continuación un COMENTARIO)",
          colSpan: 15,
          styles: { valign: "middle" }
        },
      ],
      [
        { content: "aa", styles: { halign: "center", valign: "middle" } },
        { content: "at", styles: { halign: "center", valign: "middle" } },
        { content: "ax", styles: { halign: "center", valign: "middle" } },
        { content: "bu", styles: { halign: "center", valign: "middle" } },
        { content: "ca", styles: { halign: "center", valign: "middle" } },
        { content: "cg", styles: { halign: "center", valign: "middle" } },
        { content: "cn", styles: { halign: "center", valign: "middle" } },
        { content: "co", styles: { halign: "center", valign: "middle" } },
        { content: "cp", styles: { halign: "center", valign: "middle" } },
        { content: "cv", styles: { halign: "center", valign: "middle" } },
        { content: "di", styles: { halign: "center", valign: "middle" } },
        { content: "ef", styles: { halign: "center", valign: "middle" } },
        { content: "em", styles: { halign: "center", valign: "middle" } },
        { content: "es", styles: { halign: "center", valign: "middle" } },
        { content: "OD", styles: { halign: "center", valign: "middle" }, rowSpan: 2 },
      ],
      [
        { content: "fr", styles: { halign: "center", valign: "middle" } },
        { content: "hi", styles: { halign: "center", valign: "middle" } },
        { content: "ho", styles: { halign: "center", valign: "middle" } },
        { content: "id", styles: { halign: "center", valign: "middle" } },
        { content: "ih", styles: { halign: "center", valign: "middle" } },
        { content: "kl", styles: { halign: "center", valign: "middle" } },
        { content: "me", styles: { halign: "center", valign: "middle" } },
        { content: "pa", styles: { halign: "center", valign: "middle" } },
        { content: "pb", styles: { halign: "center", valign: "middle" } },
        { content: "pi", styles: { halign: "center", valign: "middle" } },
        { content: "px", styles: { halign: "center", valign: "middle" } },
        { content: "ra", styles: { halign: "center", valign: "middle" } },
        { content: "rp", styles: { halign: "center", valign: "middle" } },
        { content: "tb", styles: { halign: "center", valign: "middle" } },
      ],
      [
        {
          content: `Comentarios: ${datos.txtSComentarios}`,
          colSpan: 12,
          styles: { fontSize: 6, cellPadding: 1 }
        },
        { content: "", colSpan: 13,}
      ],
      [
        { content: "Firma y Sello de Médico", colSpan: 15 }
      ]
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
    margin: { left: 10, right: 10 },
    didDrawCell: function (data) {
      const { cell, row, column, doc } = data;

      // Buscar si la celda actual tiene una validación
      const validacion = validacionesCeldasSimbolos.find(
        (v) => v.row === row.index && v.col === column.index
      );

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