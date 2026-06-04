import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
    if (!fecha) return "";
    if (fecha.includes("/")) return fecha;
    const [anio, mes, dia] = fecha.split("-");
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
    const pageW = doc.internal.pageSize.getWidth();

    await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

    const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
    doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

    drawColorBox(doc, {
        color: datos.codigoColor,
        text: datos.textoColor,
        x: pageW - 30,
        y: 10,
        size: 22,
        showLine: true,
        fontSize: 30,
        textPosition: 0.9
    });
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const filaAltura = 5;
    let yPos = 43 - 7;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("I. DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
    yPos += filaAltura;

    const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : (datos.sexoPaciente || '');

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text((datos.apellidosPaciente || '') + " " + (datos.nombresPaciente || ''), tablaInicioX + 40, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.dniPaciente || datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text((datos.edadPaciente || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text((sexo || ''), tablaInicioX + 105, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
    doc.line(tablaInicioX + 110, yPos, tablaInicioX + 110, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Estado Civil:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.estadoCivilPaciente || datos.estadoCivil || '', tablaInicioX + 25, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Tipo Examen:", tablaInicioX + 47, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.nomExamen || datos.tipoExamen || datos.nombreExamen || '', tablaInicioX + 68, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha Nacimiento:", tablaInicioX + 112, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || datos.fechaNacimiento || ''), tablaInicioX + 145, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 110, yPos, tablaInicioX + 110, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.lugarNacimientoPaciente || datos.lugarNacimiento || '', tablaInicioX + 36, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Nivel de Estudio:", tablaInicioX + 112, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.nivelEstudioPaciente || datos.nivelEstudios || '', tablaInicioX + 145, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.ocupacionPaciente || datos.ocupacion || '', tablaInicioX + 22, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.cargoDe || datos.cargoPaciente || datos.cargoDesempenar || '', tablaInicioX + 16, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.areaO || datos.areaPaciente || datos.area || '', tablaInicioX + 15, yPos + 3.5);
    yPos += filaAltura;

    // EMPRESA
    const empresaTexto = String(datos.razonEmpresa || datos.empresa || '');
    const empresaLines = doc.splitTextToSize(empresaTexto, 170);
    const empresaRowHeight = Math.max(filaAltura, empresaLines.length * 4);

    doc.rect(tablaInicioX, yPos, tablaAncho, empresaRowHeight);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(empresaLines.length > 2 ? 7.5 : 9);
    empresaLines.forEach((line, index) => {
        doc.text(line, tablaInicioX + 18, yPos + 3.5 + (index * 4));
    });
    yPos += empresaRowHeight;

    // CONTRATA
    const contrataTexto = String(datos.razonContrata || datos.contrata || '');
    const contrataLines = doc.splitTextToSize(contrataTexto, 170);
    const contrataRowHeight = Math.max(filaAltura, contrataLines.length * 3.5);

    doc.rect(tablaInicioX, yPos, tablaAncho, contrataRowHeight);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(contrataLines.length > 2 ? 7.5 : 9);
    contrataLines.forEach((line, index) => {
        doc.text(line, tablaInicioX + 18, yPos + 3.5 + (index * 4));
    });
    yPos += contrataRowHeight;

    // UBICACIÓN EXACTA DEL SITIO
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Ubicación Exacta del Sitio:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.ubicacionSitio || '', tablaInicioX + 52, yPos + 3.5);
    yPos += filaAltura;

    // TIEMPO DE EXPERIENCIA
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Tiempo de Experiencia:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.tiempoExperiencia || '', tablaInicioX + 45, yPos + 3.5);
    yPos += filaAltura;

    return yPos;
};

// Sección de items con SI / NO / N/A
const drawItems = (doc, datos = {}, y) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const filaAltura = 5;

    // Las tres columnas tienen el mismo ancho, alineadas al borde derecho de la tabla
    const colW = 10;
    const colNA = tablaInicioX + tablaAncho - colW;
    const colNO = colNA - colW;
    const colSI = colNO - colW;

    // Centro real de cada columna
    const centerSI = colSI + colW / 2;
    const centerNO = colNO + colW / 2;
    const centerNA = colNA + colW / 2;

    const items = [
        {
            field: "evaluacionRiesgoRealizada",
            text: "¿Se ha realizado una evaluación de riesgo al trabajo específico?"
        },
        {
            field: "personalCompetenteAreaElectrica",
            text: "¿Las personas que van a realizar el trabajo son competentes en el área eléctrica?"
        },
        {
            field: "conoceTipoVoltaje",
            text: "¿Las personas que van a realizar el trabajo conocen el voltaje (medio, bajo, otro) que se va a intervenir?"
        },
        {
            field: "personalCertificadoVoltaje",
            text: "¿Están certificadas las personas para trabajar en este tipo de voltaje?"
        },
        {
            field: "eppApropiadoTarea",
            text: "¿Los elementos y equipos de protección personal son los apropiados para la tarea y según el tipo de voltaje?"
        },
        {
            field: "sistemaDesenergizado",
            text: "¿Se ha verificado que se encuentra des-energizado el sistema que va a ser intervenido?"
        },
        {
            field: "sistemaAislado",
            text: "¿Ha sido aislado el sistema que va a ser intervenido?"
        },
        {
            field: "tarjetasAdvertenciaInstaladas",
            text: "¿Se han instalado tarjetas de advertencias y/o peligroso?"
        },
        {
            field: "bloqueosInstalados",
            text: "¿Se han instalado los bloqueos pertinentes?"
        },
        {
            field: "sistemasAterrizados",
            text: "¿Se encuentran aterrizados los sistemas que van a ser intervenidos?"
        },
        {
            field: "trabajosSimultaneosControlados",
            text: "¿Si existen trabajos simultáneos que pueden afectar el trabajo ya fueron notificados y se tomaron las acciones pertinentes?"
        },
        {
            field: "personalEntrenadoRiesgoElectrico",
            text: "¿Todas las personas que intervienen en el trabajo, han sido entrenadas en riesgos eléctricos?"
        },
        {
            field: "medidasSeguridadSatisfactorias",
            text: "¿Se siente usted satisfecho y considera que de todas las medidas de seguridad industrial han sido tomadas y se va a desarrollar un trabajo seguro?"
        }
    ];

    // ── SECCIÓN NOTA ──────────────────────────────────────────────────────────
    const notaTexto =
        "Nota: Para permitir los trabajos con riesgo eléctrico en todas las áreas donde se lleven a cabo tareas con energías peligrosas, solo se admitirían todos los ítems inspeccionados marcados con un SI o N/A";

    const notaFontSize = 7;
    const notaLineH = 3.5;
    const notaPadV = 1.5;
    const notaMaxW = colSI - tablaInicioX - 4;

    doc.setFont("helvetica", "normal").setFontSize(notaFontSize);
    const notaLines = doc.splitTextToSize(notaTexto, notaMaxW);
    const notaAltura = notaLines.length * notaLineH + notaPadV * 2;
    const notaTextStartY = y + notaPadV + notaLineH * 0.82;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(tablaInicioX, y, colSI - tablaInicioX, notaAltura);
    notaLines.forEach((line, i) => {
        doc.text(line, tablaInicioX + 2, notaTextStartY + i * notaLineH);
    });

    const bloqueX = colSI;
    const bloqueW = tablaInicioX + tablaAncho - colSI;
    doc.setFillColor(255, 192, 0);
    doc.rect(bloqueX, y, bloqueW, notaAltura, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("ELÉCTRICO", bloqueX + bloqueW / 2, y + notaAltura / 2 + 1.5, { align: "center" });

    y += notaAltura;

    // ── CABECERA ITEMS / SI / NO / N/A ────────────────────────────────────────
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, y, tablaAncho, filaAltura, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("ITEMS", tablaInicioX + (colSI - tablaInicioX) / 2, y + 3.5, { align: "center" });
    doc.text("SI", centerSI, y + 3.5, { align: "center" });
    doc.text("NO", centerNO, y + 3.5, { align: "center" });
    doc.text("N/A", centerNA, y + 3.5, { align: "center" });

    doc.line(colSI, y, colSI, y + filaAltura);
    doc.line(colNO, y, colNO, y + filaAltura);
    doc.line(colNA, y, colNA, y + filaAltura);
    y += filaAltura;

    // ── FILAS DE ITEMS ────────────────────────────────────────────────────────
    const itemFontSize = 7.5;
    const itemLineH = 3.5;
    const itemPadV = 0.8;

    items.forEach((item, idx) => {
        const respuesta = datos[item.field] || '';

        doc.setFont("helvetica", "normal").setFontSize(itemFontSize);
        const itemLines = doc.splitTextToSize(`${idx + 1}  ${item.text}`, colSI - tablaInicioX - 4);
        const textBlockH = itemLines.length * itemLineH;
        const rowH = Math.max(filaAltura, textBlockH + itemPadV * 2);

        doc.rect(tablaInicioX, y, tablaAncho, rowH);
        doc.line(colSI, y, colSI, y + rowH);
        doc.line(colNO, y, colNO, y + rowH);
        doc.line(colNA, y, colNA, y + rowH);

        const textStartY = y + (rowH - textBlockH) / 2 + itemLineH * 0.75;
        itemLines.forEach((line, li) => {
            doc.text(line, tablaInicioX + 2, textStartY + li * itemLineH);
        });

        doc.setFont("helvetica", "bold").setFontSize(9);
        const xMarkY = y + rowH / 2 + 1.5;
        if (respuesta === 'SI') doc.text("X", centerSI, xMarkY, { align: "center" });
        if (respuesta === 'NO') doc.text("X", centerNO, xMarkY, { align: "center" });
        if (respuesta === 'NA') doc.text("X", centerNA, xMarkY, { align: "center" });

        y += rowH;
    });

    return y;
};

// Sección de aprobación del certificado
const drawApprovalSection = (doc, datos = {}, y) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const tituloAltura = 5;
    const opcionesAltura = 8;
    const alturaTotal = tituloAltura + opcionesAltura;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(tablaInicioX, y, tablaAncho, alturaTotal);

    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, y, tablaAncho, tituloAltura, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("APROBACIÓN DEL CERTIFICADO", tablaInicioX + 2, y + 3.5);
    y += tituloAltura;

    const options = [
        { key: "APTO", label: "APTO" },
        { key: "RESTRICCION", label: "APTO CON RESTRICCIÓN" },
        { key: "NO_APTO", label: "NO APTO" },
    ];

    const boxSize = 4.5;
    const spacing = 25;
    let currentX = tablaInicioX + 10;
    const yCenter = y + (opcionesAltura / 2) + 1.5;

    options.forEach((opt) => {

        const aptitud =
            datos.apto
                ? "APTO"
                : datos.noApto
                    ? "NO_APTO"
                    : datos.conRestriccion
                        ? "RESTRICCION"
                        : "";

        const isSelected = aptitud === opt.key;
        doc.setFont(
            "helvetica",
            isSelected ? "bold" : "normal"
        ).setFontSize(9);

        doc.text(opt.label, currentX, yCenter);

        const textWidth = doc.getTextWidth(opt.label);

        const boxX = currentX + textWidth + 5;

        doc.rect(boxX, yCenter - 3, boxSize, boxSize);

        if (isSelected) {
            doc.setFont("helvetica", "bold").setFontSize(8);

            doc.text(
                "X",
                boxX + 1.2,
                yCenter,
            );
        }

        currentX = boxX + boxSize + spacing;
    });
    return y + opcionesAltura;
};

// Bloque de firmas + vigencia
const drawSignatureSection = (doc, datos = {}, y) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const tablaFinX = tablaInicioX + tablaAncho; // 195

    // ── Dimensiones ───────────────────────────────────────────────────────────
    // Columna izquierda: ocupa ~55% del ancho total
    const colIzqW = 90;   // Médico Cert. y Empresa Solic.
    const labelW = 35;   // ancho del sub-label dentro de cada bloque
    const bloqueAltMed = 28;   // alto Médico Certificador
    const bloqueAltEmp = 28;   // alto Empresa Solicitante

    // Columna derecha: ocupa el resto, pegada al borde derecho de la tabla
    const gap = 5;    // espacio entre columna izq y der
    const colDerX = tablaInicioX + colIzqW + gap;
    const colDerW = tablaFinX - colDerX;   // llega justo al borde derecho
    const labelWDer = 28;   // ancho sub-label en Firma / Huella
    const bloqueAltFir = 28;   // alto Firma del Trabajador
    const bloqueAltHue = 28;   // alto Huella digital

    const vigenciaH = 8;    // alto fila Vigencia

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.setTextColor(0, 0, 0);

    let firmaTrabajadorUrl = null;
    let huellaTrabajadorUrl = null;
    let firmaMedicoUrl = null;

    if (datos.digitalizacion && datos.digitalizacion.length > 0) {

        const firmaData = datos.digitalizacion.find(
            item => item.nombreDigitalizacion === "FIRMAP"
        );

        const huellaData = datos.digitalizacion.find(
            item => item.nombreDigitalizacion === "HUELLA"
        );

        const firmaMedicoData = datos.digitalizacion.find(
            item => item.nombreDigitalizacion === "SELLOFIRMA"
        );

        if (firmaData?.url) {
            firmaTrabajadorUrl = firmaData.url;
        }

        if (huellaData?.url) {
            huellaTrabajadorUrl = huellaData.url;
        }

        if (firmaMedicoData?.url) {
            firmaMedicoUrl = firmaMedicoData.url;
        }
    }

    // ── BLOQUE MÉDICO CERTIFICADOR ────────────────────────────────────────────
    const yMed = y;
    doc.rect(tablaInicioX, yMed, colIzqW, bloqueAltMed);
    doc.line(tablaInicioX + labelW, yMed, tablaInicioX + labelW, yMed + bloqueAltMed);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Médico Certificador", tablaInicioX + 2, yMed + 5);
    if (datos.nombreMedico) {
        doc.setFontSize(7);
        doc.text(datos.nombreMedico, tablaInicioX + labelW + 2, yMed + 10);
    }

    if (firmaMedicoUrl) {
        try {
            const imgWidth = 40;
            const imgHeight = 18;

            const x = tablaInicioX + labelW + 5;
            const yFirma = yMed + 3;

            doc.addImage(
                firmaMedicoUrl,
                "PNG",
                x,
                yFirma,
                imgWidth,
                imgHeight
            );

        } catch (error) {
            console.log("Error cargando firma médico:", error);
        }
    }

    // ── BLOQUE EMPRESA SOLICITANTE / RUC ─────────────────────────────────────
    const yEmp = yMed + bloqueAltMed;
    doc.rect(tablaInicioX, yEmp, colIzqW, bloqueAltEmp);
    doc.line(tablaInicioX + labelW, yEmp, tablaInicioX + labelW, yEmp + bloqueAltEmp);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Empresa Solicitante", tablaInicioX + 2, yEmp + 5);
    if (datos.empresa) {
        doc.setFontSize(7);
        const anchoTexto = colIzqW - labelW - 4;
        const maxLineas = 6;

        // divide automáticamente en líneas
        const textoEmpresa = doc.splitTextToSize(
            datos.empresa,
            anchoTexto
        ).slice(0, maxLineas);;

        // dibuja multilinea
        doc.text(
            textoEmpresa,
            tablaInicioX + labelW + 2,
            yEmp + 7
        );
    }

    doc.text("RUC", tablaInicioX + 2, yEmp + 21);
    if (datos.rucEmpresa) {
        doc.setFontSize(7);
        doc.text(String(datos.rucEmpresa), tablaInicioX + labelW + 2, yEmp + 20 );
    }

    // ── BLOQUE FIRMA DEL TRABAJADOR (columna derecha, fila superior) ──────────
    const yFir = y;
    doc.rect(colDerX, yFir, colDerW, bloqueAltFir);
    doc.line(colDerX + labelWDer, yFir, colDerX + labelWDer, yFir + bloqueAltFir);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Firma del", colDerX + 2, yFir + 5);
    doc.text("Trabajador", colDerX + 2, yFir + 11);


    if (firmaTrabajadorUrl) {
        try {

            const imgWidth = 32;
            const imgHeight = 18;

            const x = colDerX + labelWDer + 5;
            const yFirma = yFir + 4;

            doc.addImage(
                firmaTrabajadorUrl,
                "PNG",
                x,
                yFirma,
                imgWidth,
                imgHeight
            );

        } catch (error) {
            console.log("Error cargando firma trabajador:", error);
        }
    }

    // ── BLOQUE HUELLA DIGITAL (columna derecha, fila inferior) ───────────────
    // Se alinea con el bloque Empresa: empieza en yEmp, mismo colDerX y colDerW
    const yHue = yEmp;
    doc.rect(colDerX, yHue, colDerW, bloqueAltHue);
    doc.line(colDerX + labelWDer, yHue, colDerX + labelWDer, yHue + bloqueAltHue);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Huella digital", colDerX + 2, yHue + 5);

    if (huellaTrabajadorUrl) {
        try {

            const imgWidth = 15;
            const imgHeight = 20;

            const x = colDerX + labelWDer + 12;
            const yHuella = yHue + 3;

            doc.addImage(
                huellaTrabajadorUrl,
                "PNG",
                x,
                yHuella,
                imgWidth,
                imgHeight
            );

        } catch (error) {
            console.log("Error cargando huella:", error);
        }
    }

    // ── FILA VIGENCIA ─────────────────────────────────────────────────────────
    const yVig = yEmp + bloqueAltEmp;
    const vigY = yVig + vigenciaH / 2 + 1.5;


    const vigenciaDesde = toDDMMYYYY(datos.fechaExamen || '');
    const vigenciaHasta = toDDMMYYYY(datos.fechaExpiracion || '');

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Vigencia: Del", tablaInicioX, vigY);
    const textoDelW = doc.getTextWidth("Vigencia: Del");

    // Línea DESDE — más larga que antes
    const lineDesdeX1 = tablaInicioX + textoDelW + 2;
    const lineDesdeX2 = lineDesdeX1 + 40;
    doc.setLineWidth(0.3);
    doc.line(lineDesdeX1, vigY + 0.5, lineDesdeX2, vigY + 0.5);
    if (vigenciaDesde) doc.text(vigenciaDesde, lineDesdeX1 + 2, vigY);

    // "Hasta"
    const hastaX = lineDesdeX2 + 5;
    doc.text("Hasta", hastaX, vigY);
    const textoHastaW = doc.getTextWidth("Hasta");

    // Línea HASTA — llega hasta ~mitad de la página
    const lineHastaX1 = hastaX + textoHastaW + 2;
    const lineHastaX2 = lineHastaX1 + 55;
    doc.line(lineHastaX1, vigY + 0.5, lineHastaX2, vigY + 0.5);
    if (vigenciaHasta) doc.text(vigenciaHasta, lineHastaX1 + 2, vigY);

    return yVig + vigenciaH + 4;
};

export default async function CertificadoRiesgoElectrico(datos = {}, docExistente = null) {
    const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();

    // 1) Header
    await drawHeader(doc, datos);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Pag. 01", pageW - 30, 10);

    // 2) Título
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("CERTIFICADO DE RIESGO ELÉCTRICO", pageW / 2, 32, { align: "center" });

    // 3) Datos del paciente
    let y = drawPatientData(doc, datos);
    y += 2;

    // 4) Tabla de items
    y = drawItems(doc, datos, y);
    y += 2;

    // 5) Aprobación del certificado
    y = drawApprovalSection(doc, datos, y);
    y += 3;

    // 6) Firmas + Vigencia
    y = drawSignatureSection(doc, datos, y);

    // 7) Footer
    footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

    if (docExistente) {
        return doc;
    } else {
        imprimir(doc);
    }
}

function imprimir(doc) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}