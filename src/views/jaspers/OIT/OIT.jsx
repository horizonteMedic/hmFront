import jsPDF from "jspdf";
import header_OIT from "./HeaderOIT";
import autoTable from "jspdf-autotable";

export default function OIT(datos = {}) {

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 8;
    const pageW = doc.internal.pageSize.getWidth();
    let y = 44;

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
        { content: "COMENTARIO SOBRE DEFECTOS TÉCNICOS", styles: { halign: "left" } },
        { content: "$F{txt_defectostecnicos}" }
      ],
      [
        { content: "II. ANORMALIDADES PARENQUIMATOSAS (si NO hay anormalidades pase a III. A. Pleurales)", colSpan: 2}
      ]
    ],
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 10 },
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
      ]
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1, textColor: [0, 0, 0], minCellHeight: 10 },
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