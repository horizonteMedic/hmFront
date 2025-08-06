import jsPDF from "jspdf";
import header_OIT from "./HeaderOIT";
import autoTable from "jspdf-autotable";

export default function OIT(datos = {}) {

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 8;
    const pageW = doc.internal.pageSize.getWidth();
    let y = 26;

    // 2) Encabezado (logo, campos, título)
    header_OIT(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("FORMULARIO DE INFORME RADIOGRAFICO CON METODOLOGIA OIT-2000",pageW / 2, y, { align: "center" })

   autoTable(doc, {
    startY: y+ 3,
    body: [
      [
        { content: "PLACA N°:", styles: { valign: "middle" } },
        { content: "$F{n_placa}" },
        { content: "HCL:" },
        { content: "$F{n_orden}" },
        { content: "LECTOR:" },
        { content: "$F{doc}" }
      ],
      [
        { content: "NOMBRE:" },
        { content: "$F{nombre}", colSpan: 3 },
        { content: "EDAD:" },
        { content: "$F{edad} AÑOS." }
      ],
      [
        { content: "FECHA DE LECTURA", rowSpan: 2 },
        { content: "$F{f_lectura}", colSpan: 2 },
        { content: "", rowSpan: 2 },
        { content: "FECHA DE RADIOGRAFÍA", rowSpan: 2 },
        { content: "$F{f_radiografia}" }
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
        { content: "I. CALIDAD RADIOGRAFICA", rowSpan: 4 },
        { content: "1 BUENA" },
        { content: "$F" },
        { content: "CAUSAS", rowSpan: 7 },
        { content: "1 SOBRE EXPOSICIÓN" },
        { content: "$F" },
        { content: "5 ESCÁPULAS"},
        { content: "$F"}
        ],
        [
        { content: "2 ACEPTABLE" },
        { content: "$F" },
        { content: "2 SUBEXPOSICIÓN" },
        { content: "$F" },
        { content: "6 ARTEFACTOS"},
        { content: "$F"}
        ],
        [
        { content: "3 BAJA CALIDAD" },
        { content: "$F" },
        { content: "3 POSICIÓN CENTRADO" },
        { content: "$F" },
        { content: "7 OTROS"},
        { content: "$F"}
        ],
        [
        { content: "4 INACEPTABLE" },
        { content: "$F" },
        { content: "4 INSPIRACIÓN" },
        { content: "$F" }
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
        { content: "$F{txt_defectostecnicos}" }
      ],
      [
        { content: "II. ANORMALIDADES PARENQUIMATOSAS (si NO hay anormalidades pase a III. A. Pleurales)", colSpan: 2}
      ]
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0]},
    margin: { left: 10, right: 10 }
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    body: [
      [
        { content: "2.1 ZONAS AFECTADAS (marque todas las zonas afectadas)",colSpan: 3,  },
        { content: "2.2 PROFUSIÓN (opacidades pequeñas)(consulte las radiografias estandar - marque la subcategoria de", colSpan: 3 },
        { content: "2.3 FORMA Y TAMAÑO (consulte las radiografias estandar, se requere dos simbolos, marque un primario)", colSpan: 4},
        { content: "2.4 OPACIDADES GRANDES (marque 0 si no hay niguna o marque A B o C)", colSpan: 3}
      ],
      [
        { content: "",},
        { content: "DER."},
        { content: "IZQ."},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "PRIMARIA", colSpan: 2},
        { content: "SECUNDARIA", colSpan: 2},
        { content: "", rowSpan: 4},
        { content: "$F"},
        { content: "", rowSpan: 4},
      ],
      [
        { content: "SUPERIOR"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
      ],
      [
        { content: "MEDIO"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
      ],
      [
        { content: "INFERIOR"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
      ],
      [
        { content: "III. ANORMALIDADES PLEURALES (si NO hay anormalidades pase a símbolos)", colSpan: 9},
        { content: "SI"},
        { content: ""},
        { content: "NO"},
        { content: ""}
      ],
      [
        { content: "               3.1 PLACAS PLEURALES (0 = NINGUNA, D = HEMITÓRAX DRECHO, I = HEMITÓRAX IZQUIERDO", colSpan: 13}
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
        { content: "CALCIFICACION (Marque)", rowSpan: 4, styles: { halign: 'center', valign: 'middle', cellWidth: 40  }},
        { content: "EXTENSIón (Pared torácica combinada\n para placas de perfil y de frente)", colSpan: 2},
        { content: "ANCHO (opcional) (Ancho mínimo exigido 3mm)", colSpan: 2}
      ],
      [
        { content: "$F"},
        { content: "< 1/4 de la pared lateral de tórax"},
        { content: "$F"},
        { content: "De 3 a 5 mm"}
      ],
      [
        { content: "$F"},
        { content: "Entre 1/4 y 1/2 de la pared lateral de tórax"},
        { content: "$F"},
        { content: "De 5 a 10 mm"}
      ],
      [
        { content: "$F"},
        { content: "> 1/2 de la pared lateral de tórax"},
        { content: "$F"},
        { content: "Mayor a 10 mm"}
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
        { content: "Pared Torácica de perfil", rowSpan: 2, styles: {cellWidth: 20}},
        { content: "O", styles: {halign: 'center', valign: 'middle'}},
        { content: "D", styles: {halign: 'center', valign: 'middle'}},
        { content: "I", styles: {halign: 'center', valign: 'middle'}},
        { content: "O", styles: {halign: 'center', valign: 'middle'}},
        { content: "D", styles: {halign: 'center', valign: 'middle'}},
        { content: "I", styles: {halign: 'center', valign: 'middle'}},
        { content: "", rowSpan: 2},
        { content: "$F"},
        { content: "$F"},
        { content: "", colSpan: 1, styles: { lineWidth: 0, cellWidth: 0 } },
        { content: "$F"},
        { content: "$F"},
        { content: "", colSpan: 1, styles: { lineWidth: 0 } },
        { content: "", rowSpan: 2},
        { content: "$F", colSpan: 3, styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", colSpan: 3, styles: {halign: 'center', valign: 'middle'}}
      ],
      [
        { content: ""},
        { content: ""},
        { content: ""},
        { content: ""},
        { content: ""},
        { content: ""},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
        { content: "$F"},
      ],
      [
        { content: "De Frente"},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: ""},
        { content: "", colSpan: 14, styles: { lineWidth: 0}},
      ],
      [
        { content: "Diafragma"},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: ""},
        { content: "", colSpan: 14, styles: { lineWidth: 0}},
      ],
      [
        { content: "Otro (S) Sitio (S)"},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: ""},
        { content: "", colSpan: 14, styles: { lineWidth: 0}},
      ],
      [
        { content: "Obliteración del Ángulo Castofrénico", colSpan:4},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: ""},
        { content: "", colSpan: 14, styles: { lineWidth: 0}},
      ],
      [
        { content: "               3.2 ENGROSAMIENTO DIFUSO DE LA PLEURA (0 = NINGUNA, D = HEMITÓRAX DRECHO, I = HEMITÓRAX IZQUIERDO", colSpan: 21}
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
        { content: "Pared Torácica", colSpan: 4, styles: {halign: 'center', valign: 'middle'}},
        { content: "Calcificación", colSpan: 3, styles: {halign: 'center', valign: 'middle'}},
        { content: "", styles: {lineWidth: 0}},
        { content: "Extensión", colSpan: 6, styles: {halign: 'center', valign: 'middle'}},
        { content: "Ancho", colSpan: 6, styles: {halign: 'center', valign: 'middle'}},
      ],
      [
        { content: "De Perfil", styles: {cellWidth: 15}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "", styles: {lineWidth: 0}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "", styles: {lineWidth: 0}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "", styles: {lineWidth: 0}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}, colSpan: 3},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}, colSpan: 3},
      ],
      [
        { content: "", },
        { content: "", colSpan: 6},
        { content: "", styles: {lineWidth: 0}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}}
      ],
      [
        { content: "De Frente", styles: {cellWidth: 15}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "", styles: {lineWidth: 0}, colSpan:13},
      ],
      [
        { content: "IV SIMBOLOS *", colSpan: 16, styles: {valign: 'middle'}},
        { content: "SI",styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "NO", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}}
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
        { content: "(Rodee con un circulo la respuesta adecuada, si rodea od, escriba a continuación un COMENTARIO)", colSpan: 15, styles: {valign: 'middle'}},
      ],
      [
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}, rowSpan: 2},
      ],
      [
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
        { content: "$F", styles: {halign: 'center', valign: 'middle'}},
      ],
      [
        { content: "Comentarios:", colSpan: 15, styles: { minCellHeight: 15}}
      ],
      [
        { content: "Firma y Sello de Médico", colSpan: 15}
      ]
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 6 },
    margin: { left: 10, right: 10 }
  });


    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}