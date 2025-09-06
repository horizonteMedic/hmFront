import jsPDF from "jspdf";
import headerAnexo2 from "./Headers/Header_Anexo2.jsx";

export default function Anexo2(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 0; // Sin márgenes
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba para los campos de Anexo2
  const datosPrueba = {
    // === INFORMACIÓN GENERAL ===
    numeroOrden: "96639",
    tipoEvaluacion: {
      preOcupacional: false,
      anual: true,
      retiro: false,
      otros: false
    },
    fechaExamen: "05/08/2025",
    lugarExamen: {
      departamento: "La Libertad",
      provincia: "Trujillo",
      distrito: "Trujillo"
    },
    
    // === DATOS DE LA EMPRESA ===
    datosEmpresa: {
      contrata: "MINERA FALCON S.A.C.",
      empresa: "CIA MINERA PODEROSA S A",
      actividadEconomica: "Explotación de minerales",
      lugarTrabajo: "Interior mina"
    },
    
    // === UBICACIÓN Y PUESTO ===
    ubicacion: {
      departamento: "La Libertad",
      provincia: "Trujillo", 
      distrito: "Trujillo"
    },
    puestoPostula: "Operador de maquinaria pesada",
    
    // === II. FILIACIÓN DEL TRABAJADOR ===
    filiacionTrabajador: {
      nombresApellidos: "Juan Carlos Pérez García",
      fechaNacimiento: "15/03/1985",
      edad: "39",
      domicilioFiscal: "Av. Principal 123, Urbanización Los Olivos",
      dni: "12345678",
      ubicacion: {
        departamento: "La Libertad",
        provincia: "Trujillo",
        distrito: "Trujillo"
      },
      residenciaLugarTrabajo: {
        si: true,
        no: false
      },
      tiempoResidencia: "5 años",
      seguros: {
        essalud: true,
        eps: true,
        otro1: true,
        sctr: true,
        otro2: true
      },
      contacto: {
        correoElectronico: "juan.perez@email.com",
        telefono: "987654321",
        gradoInstruccion: "Técnico Superior"
      },
      estadoCivil: "Casado",
      totalHijos: "2",
      dependientes: "3"
    },
    
    // === III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
    antecedentesPatologicos: {
      // Condiciones médicas - Columna 1 (Izquierda)
      alergias: { si: true, no: true },
      asma: { si: true, no: true },
      bronquitis: { si: true, no: true },
      quemaduras: { si: true, no: true },
      cirugias: { si: true, no: true },
      
      // Condiciones médicas - Columna 2 (Centro)
      tbc: { si: true, no: true },
      its: { si: true, no: true },
      convulsiones: { si: true, no: true },
      neoplasia: { si: true, no: true },
      intoxicaciones: { si: true, no: true },
      
      // Condiciones médicas - Columna 3 (Derecha)
      hepatitis: { si: true, no: true },
      tifoidea: { si: true, no: true },
      hta: { si: true, no: true },
      diabetes: { si: true, no: true },
      otros: { si: true, no: true },
      
      // Hábitos Nocivos
      habitosNocivos: {
        alcohol: { si: true, no: true, tipo: "Ocasional", cantidad: "2-3 veces por mes" },
        tabaco: { si: true, no: true, tipo: "Texto muestra", cantidad: "Cantidad de muestra" },
        drogas: { si: true, no: true, tipo: "Texto muestra", cantidad: "Cantidad de muestra" },
        medicamento: { si: true, no: true, tipo: "Antihipertensivos", cantidad: "Diario" }
      }
    },
    
    // === IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
    antecedentesFamiliares: {
      padre: "Diabetes, Hipertensión",
      madre: "Asma, Alergias",
      hermanos: "Ninguno",
      esposa: "María García",
      hijosVivos: "2",
      numeroHijos: "2"
    },
    
    // === ABSENTISMO ===
    absentismo: {
      lesionesMusculares: {
        asociadoTrabajo: { si: true, no: true },
        año: "2023",
        diasDescanso: "15"
      },
      lesionActualizada: {
        asociadoTrabajo: { si: true, no: true },
        año: "2024",
        diasDescanso: "5"
      }
    },
    
    // === V. EVALUACIÓN MÉDICA ===
    evaluacionMedica: {
      anamnesis: "Paciente refiere dolor lumbar intermitente desde hace 6 meses, relacionado con actividades laborales. No antecedentes de traumatismos recientes.",
      examenClinico: {
        talla: "1.75",
        peso: "80",
        imc: "26.1",
        pulso: "72",
        frecuenciaRespiratoria: "16",
        frecuenciaCardiaca: "72",
        presionArterial: "120/80",
        temperatura: "36.5",
        otros: "Sin hallazgos patológicos relevantes"
      },
      // === EXAMEN FÍSICO ===
      ectoscopia: "Paciente en buen estado general, consciente, orientado, colaborador. Presenta buen estado nutricional, sin signos de deshidratación. ",
      estadoMental: "Consciente, orientado en tiempo, espacio y persona. Sin alteraciones del estado de ánimo aparente. Colaborador durante la entrevista, con lenguaje fluido y coherente.",
      examenFisico: {
        piel: "Tegumento íntegro, sin lesiones visibles, de coloración normal. No se observan manchas, lunares atípicos o lesiones sospechosas. ",
        cabello: "Cabello normal, sin alopecia patológica. Presenta buena densidad y distribución. No se observan signos de caspa excesiva"
      }
    }
  };


  // Datos reales (mapeo desde data)
  const datosReales = {
    // === INFORMACIÓN GENERAL ===
    numeroOrden: data.numeroOrden ?? "",
    tipoEvaluacion: {
      preOcupacional: data.tipoEvaluacionPreOcupacional ?? false,
      anual: data.tipoEvaluacionAnual ?? false,
      retiro: data.tipoEvaluacionRetiro ?? false,
      otros: data.tipoEvaluacionOtros ?? false
    },
    fechaExamen: data.fechaExamen ?? "",
    lugarExamen: {
      departamento: data.lugarExamenDepartamento ?? "",
      provincia: data.lugarExamenProvincia ?? "",
      distrito: data.lugarExamenDistrito ?? ""
    },
    
    // === DATOS DE LA EMPRESA ===
    datosEmpresa: {
      contrata: data.contrata ?? "",
      empresa: data.empresa ?? "",
      actividadEconomica: data.actividadEconomica ?? "",
      lugarTrabajo: data.lugarTrabajo ?? ""
    },
    
    // === UBICACIÓN Y PUESTO ===
    ubicacion: {
      departamento: data.ubicacionDepartamento ?? "",
      provincia: data.ubicacionProvincia ?? "",
      distrito: data.ubicacionDistrito ?? ""
    },
    puestoPostula: data.puestoPostula ?? "",
    
    // === II. FILIACIÓN DEL TRABAJADOR ===
    filiacionTrabajador: {
      nombresApellidos: data.nombresApellidos ?? "",
      fechaNacimiento: data.fechaNacimiento ?? "",
      edad: data.edad ?? "",
      domicilioFiscal: data.domicilioFiscal ?? "",
      dni: data.dni ?? "",
      ubicacion: {
        departamento: data.filiacionDepartamento ?? "",
        provincia: data.filiacionProvincia ?? "",
        distrito: data.filiacionDistrito ?? ""
      },
      residenciaLugarTrabajo: {
        si: data.residenciaLugarTrabajoSi ?? false,
        no: data.residenciaLugarTrabajoNo ?? false
      },
      tiempoResidencia: data.tiempoResidencia ?? "",
      seguros: {
        essalud: data.essalud ?? false,
        eps: data.eps ?? false,
        otro1: data.otroSeguro1 ?? false,
        sctr: data.sctr ?? false,
        otro2: data.otroSeguro2 ?? false
      },
      contacto: {
        correoElectronico: data.correoElectronico ?? "",
        telefono: data.telefono ?? "",
        gradoInstruccion: data.gradoInstruccion ?? ""
      },
      estadoCivil: data.estadoCivil ?? "",
      totalHijos: data.totalHijos ?? "",
      dependientes: data.dependientes ?? ""
    },
    
    // === III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
    antecedentesPatologicos: {
      // Condiciones médicas - Columna 1 (Izquierda)
      alergias: { si: data.alergiasSi ?? false, no: data.alergiasNo ?? false },
      asma: { si: data.asmaSi ?? false, no: data.asmaNo ?? false },
      bronquitis: { si: data.bronquitisSi ?? false, no: data.bronquitisNo ?? false },
      quemaduras: { si: data.quemadurasSi ?? false, no: data.quemadurasNo ?? false },
      cirugias: { si: data.cirugiasSi ?? false, no: data.cirugiasNo ?? false },
      
      // Condiciones médicas - Columna 2 (Centro)
      tbc: { si: data.tbcSi ?? false, no: data.tbcNo ?? false },
      its: { si: data.itsSi ?? false, no: data.itsNo ?? false },
      convulsiones: { si: data.convulsionesSi ?? false, no: data.convulsionesNo ?? false },
      neoplasia: { si: data.neoplasiaSi ?? false, no: data.neoplasiaNo ?? false },
      intoxicaciones: { si: data.intoxicacionesSi ?? false, no: data.intoxicacionesNo ?? false },
      
      // Condiciones médicas - Columna 3 (Derecha)
      hepatitis: { si: data.hepatitisSi ?? false, no: data.hepatitisNo ?? false },
      tifoidea: { si: data.tifoideaSi ?? false, no: data.tifoideaNo ?? false },
      hta: { si: data.htaSi ?? false, no: data.htaNo ?? false },
      diabetes: { si: data.diabetesSi ?? false, no: data.diabetesNo ?? false },
      otros: { si: data.otrosSi ?? false, no: data.otrosNo ?? false },
      
      // Hábitos Nocivos
      habitosNocivos: {
        alcohol: { si: data.alcoholSi ?? false, no: data.alcoholNo ?? false, tipo: data.alcoholTipo ?? "", cantidad: data.alcoholCantidad ?? "" },
        tabaco: { si: data.tabacoSi ?? false, no: data.tabacoNo ?? false, tipo: data.tabacoTipo ?? "", cantidad: data.tabacoCantidad ?? "" },
        drogas: { si: data.drogasSi ?? false, no: data.drogasNo ?? false, tipo: data.drogasTipo ?? "", cantidad: data.drogasCantidad ?? "" },
        medicamento: { si: data.medicamentoSi ?? false, no: data.medicamentoNo ?? false, tipo: data.medicamentoTipo ?? "", cantidad: data.medicamentoCantidad ?? "" }
      }
    },
    
    // === IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
    antecedentesFamiliares: {
      padre: data.padre ?? "",
      madre: data.madre ?? "",
      hermanos: data.hermanos ?? "",
      esposa: data.esposa ?? "",
      hijosVivos: data.hijosVivos ?? "",
      numeroHijos: data.numeroHijos ?? ""
    },
    
    // === ABSENTISMO ===
    absentismo: {
      lesionesMusculares: {
        asociadoTrabajo: { si: data.lesionesMuscularesSi ?? false, no: data.lesionesMuscularesNo ?? false },
        año: data.lesionesMuscularesAno ?? "",
        diasDescanso: data.lesionesMuscularesDias ?? ""
      },
      lesionActualizada: {
        asociadoTrabajo: { si: data.lesionActualizadaSi ?? false, no: data.lesionActualizadaNo ?? false },
        año: data.lesionActualizadaAno ?? "",
        diasDescanso: data.lesionActualizadaDias ?? ""
      }
    },
    
    // === V. EVALUACIÓN MÉDICA ===
    evaluacionMedica: {
      anamnesis: data.anamnesis ?? "",
      examenClinico: {
        talla: data.talla ?? "",
        peso: data.peso ?? "",
        imc: data.imc ?? "",
        pulso: data.pulso ?? "",
        frecuenciaRespiratoria: data.frecuenciaRespiratoria ?? "",
        frecuenciaCardiaca: data.frecuenciaCardiaca ?? "",
        presionArterial: data.presionArterial ?? "",
        temperatura: data.temperatura ?? "",
        otros: data.otros ?? ""
      },
      // === EXAMEN FÍSICO ===
      ectoscopia: data.ectoscopia ?? "",
      estadoMental: data.estadoMental ?? "",
      examenFisico: {
        piel: data.examenFisicoPiel ?? "",
        cabello: data.examenFisicoCabello ?? ""
      }
    }
  };

  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerAnexo2(doc, data, 1);

  // === 1) Imagen de fondo para Anexo2 ===
  const fondoImg = "/img/Anexo2/Pag1_anexo2.png";
  
  // Usar todo el ancho del documento pero no toda la altura
  const imgWidth = pageW; // Todo el ancho disponible
  const imgHeight = pageH * 0.9; // 90% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba
  const xOffset = 0;
  const yOffset = pageH - imgHeight - 8; // Subido 5 puntos hacia arriba

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de Anexo2 no disponible", margin, yOffset + 10);
  }

  // === 2) CAMPOS DE DATOS PERSONALIZABLES ===
  doc.setFont("helvetica", "bold").setFontSize(10);

  // === SECCIÓN: INFORMACIÓN GENERAL ===
  // Número de Orden
  const xNumeroOrden = 25; // Posición X para número de orden
  const yNumeroOrden = 26; // Posición Y para número de orden (subido 5 puntos)
  
  // Tipo de Evaluación - Posiciones X para checkboxes
  const xTipoPreOcupacional = 78.5; // Posición X para PRE-OCUPACIONAL
  const yTipoPreOcupacional = 31.2; // Posición Y para PRE-OCUPACIONAL (subido 5 puntos)
  
  const xTipoAnual = 110; // Posición X para ANUAL
  const yTipoAnual = 31.2; // Posición Y para ANUAL (subido 5 puntos)

  const xTipoRetiro = 145.5; // Posición X para RETIRO
  const yTipoRetiro = 31.2; // Posición Y para RETIRO (subido 5 puntos)

  const xTipoOtros = 179.3; // Posición X para OTROS
  const yTipoOtros = 31.2; // Posición Y para OTROS (subido 5 puntos)
  
  // Fecha de Examen
  const xFechaExamen = 135; // Posición X para fecha de examen
  const yFechaExamen = 26; // Posición Y para fecha de examen (subido 5 puntos)
  
  // Lugar de Examen
  const xLugarDepartamento = 57; // Posición X para departamento
  const yLugarDepartamento = 36.2; // Posición Y para departamento
  const xLugarProvincia = 119; // Posición X para provincia
  const yLugarProvincia = 36.2; // Posición Y para provincia
  const xLugarDistrito = 175; // Posición X para distrito
  const yLugarDistrito = 36.2; // Posición Y para distrito

  // Información General
  // Número de Orden
  if (datosFinales.numeroOrden) {
    doc.setFont("helvetica", "normal").setFontSize(13);
    doc.text(datosFinales.numeroOrden, xNumeroOrden, yNumeroOrden);
  }
  
  // Tipo de Evaluación - Checkboxes
  if (datosFinales.tipoEvaluacion) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);
    
    if (datosFinales.tipoEvaluacion.preOcupacional) {
      doc.text("X", xTipoPreOcupacional, yTipoPreOcupacional);
    }
    if (datosFinales.tipoEvaluacion.anual) {
      doc.text("X", xTipoAnual, yTipoAnual);
    }
    if (datosFinales.tipoEvaluacion.retiro) {
      doc.text("X", xTipoRetiro, yTipoRetiro);
    }
    if (datosFinales.tipoEvaluacion.otros) {
      doc.text("X", xTipoOtros, yTipoOtros);
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Fecha de Examen
  if (datosFinales.fechaExamen) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text(datosFinales.fechaExamen, xFechaExamen, yFechaExamen);
  }
  
  // Lugar de Examen
  if (datosFinales.lugarExamen) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    if (datosFinales.lugarExamen.departamento) {
      doc.text(datosFinales.lugarExamen.departamento, xLugarDepartamento, yLugarDepartamento);
    }
    if (datosFinales.lugarExamen.provincia) {
      doc.text(datosFinales.lugarExamen.provincia, xLugarProvincia, yLugarProvincia);
    }
    if (datosFinales.lugarExamen.distrito) {
      doc.text(datosFinales.lugarExamen.distrito, xLugarDistrito, yLugarDistrito);
    }
  }

  // === SECCIÓN: I. DATOS DE LA EMPRESA ===
  // Posiciones para datos de la empresa
  const xContrata = 25; // Posición X para contrata
  const yContrata = 47; // Posición Y para contrata
  const xEmpresa = 25; // Posición X para empresa
  const yEmpresa = 52; // Posición Y para empresa
  const xActividadEconomica = 35; // Posición X para actividad económica
  const yActividadEconomica = 57; // Posición Y para actividad económica
  const xLugarTrabajo = 35; // Posición X para lugar de trabajo
  const yLugarTrabajo = 62; // Posición Y para lugar de trabajo

  // Datos de la Empresa
  if (datosFinales.datosEmpresa) {
    const empresa = datosFinales.datosEmpresa;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Contrata
    if (empresa.contrata) {
      doc.text(empresa.contrata, xContrata, yContrata);
    }
    
    // Empresa
    if (empresa.empresa) {
      doc.text(empresa.empresa, xEmpresa, yEmpresa);
    }
    
    // Actividad Económica
    if (empresa.actividadEconomica) {
      doc.text(empresa.actividadEconomica, xActividadEconomica, yActividadEconomica);
    }
    
    // Lugar de trabajo
    if (empresa.lugarTrabajo) {
      doc.text(empresa.lugarTrabajo, xLugarTrabajo, yLugarTrabajo);
    }
  }

  // === SECCIÓN: UBICACIÓN Y PUESTO ===
  // Posiciones para ubicación
  const xUbicacionDepartamento = 57; // Posición X para departamento
  const yUbicacionDepartamento = 68; // Posición Y para departamento
  const xUbicacionProvincia = 119; // Posición X para provincia
  const yUbicacionProvincia = 68; // Posición Y para provincia
  const xUbicacionDistrito = 175; // Posición X para distrito
  const yUbicacionDistrito = 68; // Posición Y para distrito
  
  // Posición para puesto a que postula
  const xPuestoPostula = 69; // Posición X para puesto a que postula
  const yPuestoPostula = 73; // Posición Y para puesto a que postula

  // Ubicación
  if (datosFinales.ubicacion) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    if (datosFinales.ubicacion.departamento) {
      doc.text(datosFinales.ubicacion.departamento, xUbicacionDepartamento, yUbicacionDepartamento);
    }
    if (datosFinales.ubicacion.provincia) {
      doc.text(datosFinales.ubicacion.provincia, xUbicacionProvincia, yUbicacionProvincia);
    }
    if (datosFinales.ubicacion.distrito) {
      doc.text(datosFinales.ubicacion.distrito, xUbicacionDistrito, yUbicacionDistrito);
    }
  }
  
  // Puesto a que postula - Solo si es PRE-OCUPACIONAL
  if (datosFinales.tipoEvaluacion?.preOcupacional && datosFinales.puestoPostula) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.puestoPostula, xPuestoPostula, yPuestoPostula);
  }

  // === SECCIÓN: II. FILIACIÓN DEL TRABAJADOR ===
  if (datosFinales.filiacionTrabajador) {
    const filiacion = datosFinales.filiacionTrabajador;
    
    // Posiciones para filiación del trabajador
    const xNombresApellidos = 35;
    const yNombresApellidos = 84.2;
    const xFechaNacimiento = 128;
    const yFechaNacimiento = 84.2;
    const xEdad = 173;
    const yEdad = 84.2;
    
    const xDomicilioFiscal = 32;
    const yDomicilioFiscal = 89.7;
    const xDni = 173;
    const yDni = 89.7;
    
    const xUbicacionDept = 57;
    const yUbicacionDept = 95;
    const xUbicacionProv = 119;
    const yUbicacionProv = 95;
    const xUbicacionDist = 175;
    const yUbicacionDist = 95;
    
    const xResidenciaSi = 81;
    const yResidenciaSi = 100.5;
    const xResidenciaNo = 106.3;
    const yResidenciaNo = 100.5;
    const xTiempoResidencia = 160;
    const yTiempoResidencia = 100.2;
    
    const xEssalud = 38;
    const yEssalud = 105.8;
    const xEps = 75;
    const yEps = 105.8;
    const xOtro1 = 115;
    const yOtro1 = 105.8;
    const xSctr = 155;
    const ySctr = 105.8;
    const xOtro2 = 195;
    const yOtro2 = 105.8;
    
    const xCorreo = 35;
    const yCorreo = 110.5;
    const xTelefono = 108;
    const yTelefono = 110.5;
    const xGradoInstruccion = 165;
    const yGradoInstruccion = 110.5;
    
    const xEstadoCivil = 25;
    const yEstadoCivil = 115.8;
    const xTotalHijos = 90;
    const yTotalHijos = 115.8;
    const xDependientes =  170;
    const yDependientes = 115.8;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Nombres y Apellidos
    if (filiacion.nombresApellidos) {
      doc.text(filiacion.nombresApellidos, xNombresApellidos, yNombresApellidos);
    }
    
    // Fecha de Nacimiento
    if (filiacion.fechaNacimiento) {
      doc.text(filiacion.fechaNacimiento, xFechaNacimiento, yFechaNacimiento);
    }
    
    // Edad
    if (filiacion.edad) {
      doc.text(`${filiacion.edad} Años`, xEdad, yEdad);
    }
    
    // Domicilio Fiscal
    if (filiacion.domicilioFiscal) {
      doc.text(filiacion.domicilioFiscal, xDomicilioFiscal, yDomicilioFiscal);
    }
    
    // DNI
    if (filiacion.dni) {
      doc.text(filiacion.dni, xDni, yDni);
    }
    
    // Ubicación
    if (filiacion.ubicacion) {
      if (filiacion.ubicacion.departamento) {
        doc.text(filiacion.ubicacion.departamento, xUbicacionDept, yUbicacionDept);
      }
      if (filiacion.ubicacion.provincia) {
        doc.text(filiacion.ubicacion.provincia, xUbicacionProv, yUbicacionProv);
      }
      if (filiacion.ubicacion.distrito) {
        doc.text(filiacion.ubicacion.distrito, xUbicacionDist, yUbicacionDist);
      }
    }
    
    // Residencia en el lugar de trabajo - Checkboxes
    if (filiacion.residenciaLugarTrabajo) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);
      
      if (filiacion.residenciaLugarTrabajo.si) {
        doc.text("X", xResidenciaSi, yResidenciaSi);
      }
      if (filiacion.residenciaLugarTrabajo.no) {
        doc.text("X", xResidenciaNo, yResidenciaNo);
      }
      
      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(10);
    }
    
    // Tiempo de residencia
    if (filiacion.tiempoResidencia) {
      doc.text(filiacion.tiempoResidencia, xTiempoResidencia, yTiempoResidencia);
    }
    
    // Seguros - Checkboxes
    if (filiacion.seguros) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);
      
      if (filiacion.seguros.essalud) {
        doc.text("X", xEssalud, yEssalud);
      }
      if (filiacion.seguros.eps) {
        doc.text("X", xEps, yEps);
      }
      if (filiacion.seguros.otro1) {
        doc.text("X", xOtro1, yOtro1);
      }
      if (filiacion.seguros.sctr) {
        doc.text("X", xSctr, ySctr);
      }
      if (filiacion.seguros.otro2) {
        doc.text("X", xOtro2, yOtro2);
      }
      
      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(10);
    }
    
    // Contacto
    if (filiacion.contacto) {
      if (filiacion.contacto.correoElectronico) {
        doc.text(filiacion.contacto.correoElectronico, xCorreo, yCorreo);
      }
      if (filiacion.contacto.telefono) {
        doc.text(filiacion.contacto.telefono, xTelefono, yTelefono);
      }
      if (filiacion.contacto.gradoInstruccion) {
        doc.text(filiacion.contacto.gradoInstruccion, xGradoInstruccion, yGradoInstruccion);
      }
    }
    
    // Estado Civil
    if (filiacion.estadoCivil) {
      doc.text(filiacion.estadoCivil, xEstadoCivil, yEstadoCivil);
    }
    
    // Total de hijos
    if (filiacion.totalHijos) {
      doc.text(filiacion.totalHijos, xTotalHijos, yTotalHijos);
    }
    
    // Dependientes
    if (filiacion.dependientes) {
      doc.text(filiacion.dependientes, xDependientes, yDependientes);
    }
  }

  // === SECCIÓN: III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
  if (datosFinales.antecedentesPatologicos) {
    const antecedentes = datosFinales.antecedentesPatologicos;
    
    // Posiciones para condiciones médicas - Columna 1 (Izquierda)
    const xAlergiasSi = 32;
    const yAlergiasSi = 132.8;
    const xAlergiasNo = 37.5;
    const yAlergiasNo = 132.8;
    
    const xAsmaSi = 32;
    const yAsmaSi = 138;
    const xAsmaNo = 37.5;
    const yAsmaNo = 138;
    
    const xBronquitisSi = 32;
    const yBronquitisSi = 143.2;
    const xBronquitisNo = 37.5;
    const yBronquitisNo = 143.2;
    
    const xQuemadurasSi = 32;
    const yQuemadurasSi = 148.4;
    const xQuemadurasNo = 37.5;
    const yQuemadurasNo = 148.4;
    
    const xCirugiasSi = 32;
    const yCirugiasSi = 153.6;
    const xCirugiasNo = 37.5;
    const yCirugiasNo = 153.6;
    
    // Posiciones para condiciones médicas - Columna 2 (Centro)
    const xTbcSi = 93.8;
    const yTbcSi = 132.8;
    const xTbcNo = 98.8;
    const yTbcNo = 132.8;
    
    const xItsSi = 93.8;
    const yItsSi = 138;
    const xItsNo = 98.8;
    const yItsNo = 138;
    
    const xConvulsionesSi = 93.8;
    const yConvulsionesSi = 143.2;
    const xConvulsionesNo = 98.8;
    const yConvulsionesNo = 143.2;
    
    const xNeoplasiaSi = 93.8;
    const yNeoplasiaSi = 148.4;
    const xNeoplasiaNo = 98.80;
    const yNeoplasiaNo = 148.4;
    
    const xIntoxicacionesSi = 93.8;
    const yIntoxicacionesSi = 153.6;
    const xIntoxicacionesNo = 98.8;
    const yIntoxicacionesNo = 153.6;
    
    // Posiciones para condiciones médicas - Columna 3 (Derecha)
    const xHepatitisSi = 156.5;
    const yHepatitisSi = 132.8;
    const xHepatitisNo = 161.8;
    const yHepatitisNo = 132.8;
    
    const xTifoideaSi = 156.5;
    const yTifoideaSi = 138;
    const xTifoideaNo = 161.8;
    const yTifoideaNo = 138;
    
    const xHtaSi = 156.5;
    const yHtaSi = 143.2;
    const xHtaNo = 161.8;
    const yHtaNo = 143.2;
    
    const xDiabetesSi = 156.5;
    const yDiabetesSi = 148.4;
    const xDiabetesNo = 161.8;
    const yDiabetesNo = 148.4;
    
    const xOtrosSi = 156.5;
    const yOtrosSi = 153.6;
    const xOtrosNo = 161.8;
    const yOtrosNo = 153.6;
    
    // Posiciones para Hábitos Nocivos
    // Alcohol
    const xAlcoholSi = 32;
    const yAlcoholSi = 164.4;
    const xAlcoholNo = 37.5;
    const yAlcoholNo = 164.4;

    const xAlcoholTipo = 46;
    const yAlcoholTipo = 164.2;

    const xAlcoholCantidad = 108;
    const yAlcoholCantidad = 164.2;
    
    // Tabaco
    const xTabacoSi = 32;
    const yTabacoSi = 169.8;
    const xTabacoNo = 37.5;
    const yTabacoNo = 169.8;

    const xTabacoTipo = 46;
    const yTabacoTipo = 169.6;

    const xTabacoCantidad = 108;
    const yTabacoCantidad = 169.6;
    
    // Drogas
    const xDrogasSi = 32;
    const yDrogasSi = 175.2;
    const xDrogasNo = 37.5;
    const yDrogasNo = 175.2;

    const xDrogasTipo = 46;
    const yDrogasTipo = 175;

    const xDrogasCantidad = 108;
    const yDrogasCantidad = 175;
    
    // Medicamento
    const xMedicamentoSi = 32;
    const yMedicamentoSi = 180.6;
    const xMedicamentoNo = 37.5;
    const yMedicamentoNo = 180.6;
    
    const xMedicamentoTipo = 46;
    const yMedicamentoTipo = 180.4;

    const xMedicamentoCantidad = 108;
    const yMedicamentoCantidad = 180.4;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Función para renderizar checkboxes SI/NO
    const renderCheckbox = (condicion, xSi, ySi, xNo, yNo) => {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);
      
      if (condicion.si) {
        doc.text("X", xSi, ySi);
      }
      if (condicion.no) {
        doc.text("X", xNo, yNo);
      }
      
      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(10);
    };
    
    // Condiciones médicas - Columna 1 (Izquierda)
    renderCheckbox(antecedentes.alergias, xAlergiasSi, yAlergiasSi, xAlergiasNo, yAlergiasNo);
    renderCheckbox(antecedentes.asma, xAsmaSi, yAsmaSi, xAsmaNo, yAsmaNo);
    renderCheckbox(antecedentes.bronquitis, xBronquitisSi, yBronquitisSi, xBronquitisNo, yBronquitisNo);
    renderCheckbox(antecedentes.quemaduras, xQuemadurasSi, yQuemadurasSi, xQuemadurasNo, yQuemadurasNo);
    renderCheckbox(antecedentes.cirugias, xCirugiasSi, yCirugiasSi, xCirugiasNo, yCirugiasNo);
    
    // Condiciones médicas - Columna 2 (Centro)
    renderCheckbox(antecedentes.tbc, xTbcSi, yTbcSi, xTbcNo, yTbcNo);
    renderCheckbox(antecedentes.its, xItsSi, yItsSi, xItsNo, yItsNo);
    renderCheckbox(antecedentes.convulsiones, xConvulsionesSi, yConvulsionesSi, xConvulsionesNo, yConvulsionesNo);
    renderCheckbox(antecedentes.neoplasia, xNeoplasiaSi, yNeoplasiaSi, xNeoplasiaNo, yNeoplasiaNo);
    renderCheckbox(antecedentes.intoxicaciones, xIntoxicacionesSi, yIntoxicacionesSi, xIntoxicacionesNo, yIntoxicacionesNo);
    
    // Condiciones médicas - Columna 3 (Derecha)
    renderCheckbox(antecedentes.hepatitis, xHepatitisSi, yHepatitisSi, xHepatitisNo, yHepatitisNo);
    renderCheckbox(antecedentes.tifoidea, xTifoideaSi, yTifoideaSi, xTifoideaNo, yTifoideaNo);
    renderCheckbox(antecedentes.hta, xHtaSi, yHtaSi, xHtaNo, yHtaNo);
    renderCheckbox(antecedentes.diabetes, xDiabetesSi, yDiabetesSi, xDiabetesNo, yDiabetesNo);
    renderCheckbox(antecedentes.otros, xOtrosSi, yOtrosSi, xOtrosNo, yOtrosNo);
    
    // Hábitos Nocivos
    if (antecedentes.habitosNocivos) {
      // Alcohol - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.alcohol) {
        renderCheckbox(antecedentes.habitosNocivos.alcohol, xAlcoholSi, yAlcoholSi, xAlcoholNo, yAlcoholNo);
        if (antecedentes.habitosNocivos.alcohol.tipo) {
          doc.text(antecedentes.habitosNocivos.alcohol.tipo, xAlcoholTipo, yAlcoholTipo);
        }
        if (antecedentes.habitosNocivos.alcohol.cantidad) {
          doc.text(antecedentes.habitosNocivos.alcohol.cantidad, xAlcoholCantidad, yAlcoholCantidad);
        }
      }
      
      // Tabaco - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.tabaco) {
        renderCheckbox(antecedentes.habitosNocivos.tabaco, xTabacoSi, yTabacoSi, xTabacoNo, yTabacoNo);
        if (antecedentes.habitosNocivos.tabaco.tipo) {
          doc.text(antecedentes.habitosNocivos.tabaco.tipo, xTabacoTipo, yTabacoTipo);
        }
        if (antecedentes.habitosNocivos.tabaco.cantidad) {
          doc.text(antecedentes.habitosNocivos.tabaco.cantidad, xTabacoCantidad, yTabacoCantidad);
        }
      }
      
      // Drogas - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.drogas) {
        renderCheckbox(antecedentes.habitosNocivos.drogas, xDrogasSi, yDrogasSi, xDrogasNo, yDrogasNo);
        if (antecedentes.habitosNocivos.drogas.tipo) {
          doc.text(antecedentes.habitosNocivos.drogas.tipo, xDrogasTipo, yDrogasTipo);
        }
        if (antecedentes.habitosNocivos.drogas.cantidad) {
          doc.text(antecedentes.habitosNocivos.drogas.cantidad, xDrogasCantidad, yDrogasCantidad);
        }
      }
      
      // Medicamento - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.medicamento) {
        renderCheckbox(antecedentes.habitosNocivos.medicamento, xMedicamentoSi, yMedicamentoSi, xMedicamentoNo, yMedicamentoNo);
        if (antecedentes.habitosNocivos.medicamento.tipo) {
          doc.text(antecedentes.habitosNocivos.medicamento.tipo, xMedicamentoTipo, yMedicamentoTipo);
        }
        if (antecedentes.habitosNocivos.medicamento.cantidad) {
          doc.text(antecedentes.habitosNocivos.medicamento.cantidad, xMedicamentoCantidad, yMedicamentoCantidad);
        }
      }
    }
  }

  // === SECCIÓN: IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
  if (datosFinales.antecedentesFamiliares) {
    const familia = datosFinales.antecedentesFamiliares;
    
    // Posiciones para antecedentes familiares
    const xPadre = 25;
    const yPadre = 190;

    const xMadre = 100;
    const yMadre = 190;

    const xHermanos = 170;
    const yHermanos = 190;
    
    const xEsposa = 25;
    const yEsposa = 196;

    const xHijosVivos = 100;
    const yHijosVivos = 196;

    const xNumeroHijos = 170;
    const yNumeroHijos = 196;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Padre
    if (familia.padre) {
      doc.text(familia.padre, xPadre, yPadre);
    }
    
    // Madre
    if (familia.madre) {
      doc.text(familia.madre, xMadre, yMadre);
    }
    
    // Hermanos
    if (familia.hermanos) {
      doc.text(familia.hermanos, xHermanos, yHermanos);
    }
    
    // Esposa
    if (familia.esposa) {
      doc.text(familia.esposa, xEsposa, yEsposa);
    }
    
    // Hijos vivos
    if (familia.hijosVivos) {
      doc.text(familia.hijosVivos, xHijosVivos, yHijosVivos);
    }
    
    // Número de hijos
    if (familia.numeroHijos) {
      doc.text(familia.numeroHijos, xNumeroHijos, yNumeroHijos);
    }
  }

  // === SECCIÓN: ABSENTISMO ===
  if (datosFinales.absentismo) {
    const absentismo = datosFinales.absentismo;
    
    // Posiciones para absentismo
    const xLesionesMuscularesSi = 107.8;
    const yLesionesMuscularesSi = 214.6;

    const xLesionesMuscularesNo = 126;
    const yLesionesMuscularesNo =  214.6;
    
    const xLesionesMuscularesAno = 143;
    const yLesionesMuscularesAno =  214.6;
    
    const xLesionesMuscularesDias = 181.5;
    const yLesionesMuscularesDias =  214.6;
    
    const xLesionActualizadaSi = 107.8;
    const yLesionActualizadaSi = 220;

    const xLesionActualizadaNo = 126;
    const yLesionActualizadaNo = 220;

    const xLesionActualizadaAno = 143;
    const yLesionActualizadaAno = 220;

    const xLesionActualizadaDias = 181.5;
    const yLesionActualizadaDias = 220;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Lesiones Musculares
    if (absentismo.lesionesMusculares) {
      const lesion = absentismo.lesionesMusculares;
      
      // Checkbox SI/NO
      if (lesion.asociadoTrabajo) {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(12);
        
        if (lesion.asociadoTrabajo.si) {
          doc.text("X", xLesionesMuscularesSi, yLesionesMuscularesSi);
        }
        if (lesion.asociadoTrabajo.no) {
          doc.text("X", xLesionesMuscularesNo, yLesionesMuscularesNo);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
        doc.setFont("helvetica", "normal").setFontSize(10);
      }
      
      // Año
      if (lesion.año) {
        doc.text(lesion.año, xLesionesMuscularesAno, yLesionesMuscularesAno);
      }
      
      // Días de descanso
      if (lesion.diasDescanso) {
        doc.text(lesion.diasDescanso, xLesionesMuscularesDias, yLesionesMuscularesDias, { align: "center" });
      }
    }
    
    // Lesión Actualizada
    if (absentismo.lesionActualizada) {
      const lesion = absentismo.lesionActualizada;
      
      // Checkbox SI/NO
      if (lesion.asociadoTrabajo) {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(12);
        
        if (lesion.asociadoTrabajo.si) {
          doc.text("X", xLesionActualizadaSi, yLesionActualizadaSi);
        }
        if (lesion.asociadoTrabajo.no) {
          doc.text("X", xLesionActualizadaNo, yLesionActualizadaNo);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
        doc.setFont("helvetica", "normal").setFontSize(10);
      }
      
      // Año
      if (lesion.año) {
        doc.text(lesion.año, xLesionActualizadaAno, yLesionActualizadaAno);
      }
      
      // Días de descanso
      if (lesion.diasDescanso) {
        doc.text(lesion.diasDescanso, xLesionActualizadaDias, yLesionActualizadaDias, { align: "center" });
      }
    }
  }

  // === SECCIÓN: V. EVALUACIÓN MÉDICA ===
  if (datosFinales.evaluacionMedica) {
    const evaluacion = datosFinales.evaluacionMedica;
    
    // Posiciones para evaluación médica
    const xAnamnesis = 25;
    const yAnamnesis = 230.5;
    
    // Examen clínico - Fila 1
    const xTalla = 48;
    const yTalla = 239;
    const xPeso = 95;
    const yPeso = 239;
    const xImc = 135;
    const yImc = 239;
    const xPulso = 180;
    const yPulso = 239;
    
    // Examen clínico - Fila 2
    const xFrecuenciaRespiratoria = 48;
    const yFrecuenciaRespiratoria = 244.3;
    const xFrecuenciaCardiaca = 95;
    const yFrecuenciaCardiaca = 244.3;
    const xPresionArterial = 135;
    const yPresionArterial = 244.3;
    const xTemperatura = 189;
    const yTemperatura = 244.3;
    
    // Examen clínico - Fila 3
    const xOtros = 48;
    const yOtros = 249.5;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Anamnesis
    if (evaluacion.anamnesis) {
      doc.text(evaluacion.anamnesis, xAnamnesis, yAnamnesis, { maxWidth: 170 });
    }
    
    // Examen clínico
    if (evaluacion.examenClinico) {
      const examen = evaluacion.examenClinico;
      
      // Fila 1
      if (examen.talla) {
        doc.text(examen.talla, xTalla, yTalla);
      }
      if (examen.peso) {
        doc.text(examen.peso, xPeso, yPeso);
      }
      if (examen.imc) {
        doc.text(examen.imc, xImc, yImc);
      }
      if (examen.pulso) {
        doc.text(examen.pulso, xPulso, yPulso);
      }
      
      // Fila 2
      if (examen.frecuenciaRespiratoria) {
        doc.text(examen.frecuenciaRespiratoria, xFrecuenciaRespiratoria, yFrecuenciaRespiratoria);
      }
      if (examen.frecuenciaCardiaca) {
        doc.text(examen.frecuenciaCardiaca, xFrecuenciaCardiaca, yFrecuenciaCardiaca);
      }
      if (examen.presionArterial) {
        doc.text(examen.presionArterial, xPresionArterial, yPresionArterial);
      }
      if (examen.temperatura) {
        doc.text(examen.temperatura, xTemperatura, yTemperatura);
      }
      
      // Fila 3
      if (examen.otros) {
        doc.text(examen.otros, xOtros, yOtros);
      }
    }
  }

  // === SECCIÓN: EXAMEN FÍSICO ===
  if (datosFinales.evaluacionMedica) {
    const evaluacion = datosFinales.evaluacionMedica;
    
    // Posiciones para Ectoscopía y Estado Mental
    const xEctoscopia = 25;
    const yEctoscopia = 255;
    const xEstadoMental = 28;
    const yEstadoMental = 262.3;
    
    // Posiciones para la tabla de Examen Físico (solo para referencia, no se usan)
    
    // Posiciones para los hallazgos (los textos "Piel:", "Cabello:" ya están en la imagen)
    const xPielHallazgos = 37;
    const yPielHallazgos = 282;
    
    const xCabelloHallazgos = 37;
    const yCabelloHallazgos = 287;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Ectoscopía
    if (evaluacion.ectoscopia) {
      doc.text(evaluacion.ectoscopia, xEctoscopia, yEctoscopia, { maxWidth: 170 });
    }
    
    // Estado Mental
    if (evaluacion.estadoMental) {
      doc.text(evaluacion.estadoMental, xEstadoMental, yEstadoMental, { maxWidth: 170 });
    }
    
    // Solo renderizar los hallazgos (los textos "Piel:", "Cabello:" ya están en la imagen)
    doc.setFont("helvetica", "normal").setFontSize(10);
    
    // Hallazgos de Piel
    if (evaluacion.examenFisico?.piel) {
      doc.text(evaluacion.examenFisico.piel, xPielHallazgos, yPielHallazgos, { maxWidth: 170 });
    }
    
    // Hallazgos de Cabello
    if (evaluacion.examenFisico?.cabello) {
      doc.text(evaluacion.examenFisico.cabello, xCabelloHallazgos, yCabelloHallazgos, { maxWidth: 170 });
    }
  }

  // === SECCIÓN: FIRMAS ===
  const firmasAPintar = [
    { 
      nombre: "FIRMAP", x: 21, y: 350, maxw: 50 
    },
    { 
      nombre: "HUELLA", x: 80, y: 350, maxw: 20 
    },
    { 
      nombre: "SELLOFIRMA", x: 120, y: 350, maxw: 50 
    }
  ];
  
  // Validar que data.informacionSede exista antes de acceder a sus propiedades
  const digitalizacion = data?.informacionSede?.digitalizacion || [];
  agregarFirmas(doc, digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
  });
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;
      img.onload = () => {
        const sigH = 35; // alto máximo
        const maxW = maxw; // ancho máximo como parámetro
        const baseX = x;
        const baseY = y;

        let imgW = img.width;
        let imgH = img.height;

        // Escala proporcional en base a ancho y alto máximos
        const scale = Math.min(maxW / imgW, sigH / imgH, 1);
        imgW *= scale;
        imgH *= scale;

        // Ahora el ancho se adapta
        const sigW = imgW;

        // Centrar la imagen
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;

        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}
