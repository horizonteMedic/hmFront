import jsPDF from "jspdf";
import header_Hematologia from "./header/header_Hematologia_Digitalizado";

export default function Hematologia_Digitalizado(datos = {}) {

        // Datos de ejemplo, reemplazar por datos reales en integración
        
        const doc = new jsPDF();
        header_Hematologia(doc, datos);

        // Márgenes y estilos
        const margin = 15;
        let y = 85; // Más abajo
        const lineHeight = 7;
        const lineHeightSmall = 5.5;
        const col1 = margin;
        const col2 = margin + 75;
        const col3 = margin + 120;
        const indent = 8;

        // Título principal
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMOGRAMA AUTOMATIZADO", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += lineHeight + 4;

        // Encabezados
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("PRUEBA", col1, y);
        doc.text("RESULTADO", col2, y);
        doc.text("VALORES NORMALES", col3, y);
        y += lineHeight + 2;

        // --- BLOQUE 1 ---
        doc.setFont('helvetica', 'bold');
        doc.text("HEMOGLOBINA", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtHemoglobina}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("Mujeres 12 - 16 g/dL", col3, y);
        y += lineHeightSmall;
        doc.text("Hombres 14 - 18 g/dL", col3, y);
        y += lineHeight + 2;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMATOCRITO", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtHematocrito}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("Mujeres 38 - 50 %", col3, y);
        y += lineHeightSmall;
        doc.text("Hombres 40 - 54 %", col3, y);
        y += lineHeight + 2;

        // --- BLOQUE 2 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMATÍES", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtHematies}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("4.0 - 5.5 x 10^6/mm³", col3, y);
        y += lineHeight + 1;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Volumen Corpuscular Medio", col1 + indent, y);
        doc.text(`${datos.txtVolumen}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("80 - 100 fL", col3, y);
        y += lineHeight;
        doc.setFontSize(10);
        doc.text("Hemoglobina Corpuscular Media", col1 + indent, y);
        doc.text(`${datos.txtHemocorpuscular}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("26 - 34 pg", col3, y);
        y += lineHeight;
        doc.setFontSize(10);
        doc.text("Concentración de la Hemoglobina", col1 + indent, y);
        y += lineHeightSmall;
        doc.text("Corpuscular Media", col1 + indent, y);
        doc.text(`${datos.txtConcentracion}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("31 - 37 g/dl", col3, y - lineHeightSmall);
        y += lineHeight + 2;

        // --- BLOQUE 3 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("LEUCOCITOS", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtLeucocitos}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("4 - 10 x 10^3/mm³", col3, y);
        y += lineHeight + 2;

        // --- BLOQUE 4 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("RECUENTO DIFERENCIAL", col1, y);
        y += lineHeight;
        // Subgrupos
        const subgrupos = [
            { label: "NEUTRÓFILOS (%)", key: "txtNeutrofilos", normal: "55 - 65 %" },
            { label: "ABASTONADOS (%)", key: "txtAbastonados", normal: "0 - 5 %" },
            { label: "SEGMENTADOS (%)", key: "txtSegmentados", normal: "55 - 65 %" },
            { label: "MONOCITOS (%)", key: "txtMonocitos", normal: "4 - 8 %" },
            { label: "EOSINÓFILOS (%)", key: "txtEosinofios", normal: "0 - 4 %" },
            { label: "BASÓFILOS (%)", key: "txtBasofilos", normal: "0 - 1 %" },
            { label: "LINFOCITOS (%)", key: "txtLinfocitos", normal: "20 - 40 %" },
        ];
        subgrupos.forEach(({ label, normal, key }) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, col1 + indent, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            // Muestra el valor desde datos, si no existe muestra "-"
            const value = datos[key] ?? "-";
            doc.text(String(value), col2, y);  // Valor actual
            doc.text(normal, col3, y);         // Rango normal

            doc.setFontSize(10);
            y += lineHeight;
            });
        y += 2;

        // --- BLOQUE 5 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("PLAQUETAS", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtPlaquetas}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("1.5 - 4.5 x 10^5/mm³", col3, y);
        y += lineHeight;

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        };
}
