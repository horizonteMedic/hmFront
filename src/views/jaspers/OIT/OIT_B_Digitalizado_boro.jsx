import jsPDF from "jspdf";
import header_OIT from "./HeaderOIT";
import autoTable from "jspdf-autotable";

export default async function OIT_B_Digitalizado_boro(datos = {}) {

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
    doc.text("FORMULARIO DE INFORME RADIOGRAFICO CON METODOLOGIA OIT-2000", pageW / 2, y, { align: "center" })

    autoTable(doc, {
      startY: y + 3,
      body: [
        [
          { content: "PLACA N°:", styles: { valign: "middle", cellWidth: 30, fillColor: [242, 242, 242] } },
          { content: `${datos.norden ? datos.norden : ""}`, styles: { valign: "middle", fillColor: [242, 242, 242] } },
          { content: "HCL:", styles: { valign: "middle", fillColor: [242, 242, 242] } },
          { content: `${datos.norden ? datos.norden : ""}`, styles: { valign: "middle", fillColor: [242, 242, 242] } },
          { content: "LECTOR:", styles: { cellWidth: 25, fillColor: [242, 242, 242] } },
          { content: `${datos.doctor ? datos.doctor : ""}`, styles: { valign: "middle", fillColor: [242, 242, 242] } }
        ],
        [
          { content: "NOMBRE:" },
          { content: `${datos.nombres ? datos.nombres : ""}`, colSpan: 3 },
          { content: "EDAD:" },
          { content: `${datos.edad ? datos.edad + ' AÑOS' : ""}` }
        ],
        [
          { content: "FECHA DE LECTURA", rowSpan: 2 },
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
      startY: doc.lastAutoTable.finalY,
      body: [
        [
          { content: "I. CALIDAD RADIOGRAFICA", rowSpan: 4, styles: { halign: 'center', valign: 'middle', fillColor: [242, 242, 242] } },
          { content: "1", styles: { valign: "middle" } },
          { content: "BUENA" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "CAUSAS", rowSpan: 7, styles: { halign: 'center', valign: 'middle' } },
          { content: "1", styles: { valign: "middle" } },
          { content: "SOBRE EXPOSICIÓN" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "5", styles: { valign: "middle" } },
          { content: "ESCÁPULAS" },
          { content: ``, styles: { cellWidth: 5, halign: 'center', valign: 'middle', textColor: [0, 0, 255] } }
        ],
        [
          { content: "2", styles: { valign: "middle" } },
          { content: "ACEPTABLE" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "2", styles: { valign: "middle" } },
          { content: "SUBEXPOSICIÓN" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "6", styles: { valign: "middle" } },
          { content: "ARTEFACTOS" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } }
        ],
        [
          { content: "3", styles: { valign: "middle" } },
          { content: "BAJA CALIDAD" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "3", styles: { valign: "middle" } },
          { content: "POSICIÓN CENTRADO" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "7", styles: { valign: "middle" } },
          { content: "OTROS" },
          { content: ``, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: "4", styles: { valign: "middle" } },
          { content: "INACEPTABLE" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } },
          { content: "4", styles: { valign: "middle" } },
          { content: "INSPIRACIÓN" },
          { content: ``, styles: { halign: 'center', valign: 'middle', textColor: [0, 0, 255] } }
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
          { content: "II. ANORMALIDADES PARENQUIMATOSAS (si NO hay anormalidades pase a III. A. Pleurales)", styles: { minCellWidth: 100 } },
          { content: "SI" },
          { content: "" },
          { content: "NO" },
          { content: "" }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], fillColor: [242, 242, 242] },
      margin: { left: 10, right: 10 }
    });

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
          { content: "0/-" },
          { content: "0/0" },
          { content: "0/1" },
          { content: "PRIMARIA", colSpan: 2 },
          { content: "SECUNDARIA", colSpan: 2 },
          { content: "", rowSpan: 4 },
          { content: "O", styles: { halign: 'center', valign: 'middle' } },
          { content: "", rowSpan: 4 },
        ],
        [
          { content: "SUPERIOR", styles: { cellWidth: 30 } },
          { content: "" },
          { content: "" },
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
          { content: "" },
          { content: "" },
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
          { content: "" },
          { content: "" },
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
          { content: "III. ANORMALIDADES PLEURALES (si NO hay anormalidades pase a símbolos)", colSpan: 9, styles: { fillColor: [242, 242, 242] } },
          { content: "SI", styles: { fillColor: [242, 242, 242] } },
          { content: "", styles: { fillColor: [242, 242, 242] } },
          { content: "NO", styles: { fillColor: [242, 242, 242] } },
          { content: "", styles: { fillColor: [242, 242, 242] } }
        ],
        [
          { content: "               3.1 PLACAS PLEURALES (0 = NINGUNA, D = HEMITÓRAX DRECHO, I = HEMITÓRAX IZQUIERDO", colSpan: 13 }
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
      margin: { left: 10, right: 10 }
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
          { content: "IV SIMBOLOS *", colSpan: 16, styles: { valign: 'middle', fillColor: [242, 242, 242] } },
          { content: "SI", styles: { halign: 'center', valign: 'middle', fillColor: [242, 242, 242] } },
          { content: "", styles: { halign: 'center', valign: 'middle', fillColor: [242, 242, 242] } },
          { content: "NO", styles: { halign: 'center', valign: 'middle', fillColor: [242, 242, 242] } },
          { content: "", styles: { halign: 'center', valign: 'middle', fillColor: [242, 242, 242] } }
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
          { content: "Comentarios:", colSpan: 15, styles: { minCellHeight: 11 } }
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