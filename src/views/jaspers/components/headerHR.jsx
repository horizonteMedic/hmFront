
const headerHR = (doc,datos) => {
    doc.setFontSize(13)
    doc.text("CORPORACION PERUANA DE CENTROS MEDICOS S.A.C.",40,8)
    doc.text(`HOJA DE RUTA ${datos.examen || ""}`,50,15)
    doc.setFontSize(8)
    doc.text(`TIPO EX: ${datos.examen || '___'}`,30,24)
    doc.text(`Fecha: ${datos.fecha || '___'}                                            HORA: ${datos.hora || '___'}`,90,24)
    doc.text(`N° DE ORDEN: ${datos.orden || '___'}`,170,24)
    doc.text(`NOMBRES Y APELLIDOS: ${datos.nombres || '___'}`,10,31)
    doc.text(`EMP. CONTRATISTA: ${datos.contrata || '___'}`,110,31)
    doc.text(`Sede: ${datos.nombreSede || '___'}`,160,38)
    doc.text(`EMPRESA: ${datos.empresa || '___'}`,25,38)
    doc.text(`EDAD: ${datos.edad || '___'}`,130,38)
    doc.text(`CARGO: ${datos.cargo || '___'}`,25,45)
    doc.text(`DNI: ${datos.dni || '___'}`,110,45)
    doc.text(`G. SANGUINEO: ${datos.gruposan || '___'}`,160,45)
    return
}

export default headerHR

