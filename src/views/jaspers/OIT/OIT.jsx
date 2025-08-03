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
        startY: 47,
        body: [
            [
                { content: "PLACA N°: ",  styles: { valign: "middle" }},
                { content: "$F{h_diagnostico}", styles: {valign: "middle"} },
                { content: "HCL: " },
                { content: "$F{h_tratamiento}" },
                { content: "Lector: " },
                { content: "$F{h_tratamiento}" }
            ],
            [
                { content: "NOMBRE: "},
                { content: "ROBERT DANIEL PLASENCIA DE LA CRUZ", colSpan: 3},
                { content: "EDAD: "},
                { content: "28 años"}

            ]
        ],
        margin: { top: y, left: 3, right: 3 },
        theme: "grid",
        styles: { fontSize: 8, textColor: [0, 0, 0], cellPadding: 1 },
        
    })



    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}