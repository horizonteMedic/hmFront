export const EXAMENES_CONFIG = [
    {
        column: 1,
        legend: "EXAMEN OCUPACIONAL",
        items: [
            { label: "Triaje", name: "triaje", tabla: "triaje" },
            { label: "Informe Psicológico", name: "psicologia", tabla: "informe_psicologico" },
            { label: "Ex. Rx Sanguíneos", name: "exRxSanguineos", tabla: "ex_radiograficos_sanguineos" },
            { label: "Ficha Ant. Patológicos", name: "fichaAntPatologicos", tabla: "antecedentes_patologicos" },
            { label: "Hist. Ocupacional", name: "histOcupacional", tabla: "historia_oc_info" },
            { label: "Cuestionario Nórdico", name: "cuestionarioNordico", tabla: "cuestionario_nordico" },
            { label: "Ev. Musculo Esquelética", name: "evMusculoEsqueletica", tabla: "evaluacion_musculo_esqueletica" },
            { label: "Actitud Med. Ocupacional", name: "actitudMedOcupacional", tabla: "aptitud_medico_ocupacional_agro" },
            { label: "Uso de Respiradores", name: "usoRespiradores", tabla: "b_uso_respiradores" },
            { label: "Anexo 16-A", name: "anexo16A", tabla: "anexo16a" },
            { label: "Muestra de Sangre", name: "consentimientoDosaje", tabla: "consent_Muestra_Sangre" },
            { label: "Anexo 16", name: "anexo16", tabla: "anexo7c" },
            { label: "Ficha Interconsulta", name: "interconsulta", tabla: "interconsulta" },
            { label: "Ficha S.A.S", name: "fichaSAS", tabla: "ficha_sas" },
            { label: "Test Fat. Somnolencia", name: "testFatSomnolencia", tabla: "test_fatiga_somnolencia" },
            { label: "Anexo 2", name: "fMedicaAnexo2", tabla: "anexo_agroindustrial" },
            { label: "Cert. Trab. Altura (Barrik)", name: "certTrabAlturaBarrik", tabla: "b_certificado_altura" },
            { label: "Cert. Medico Ocupacinal", name: "fAptitudMedOcup", tabla: "certificado_aptitud_medico_ocupacional" },
            { label: "Ev. Musc. Esquelético Boroo.", name: "evMuscEsqueletico", tabla: "evaluacion_musculo_esqueletica2021" },
            { label: "Ficha Conducción de Vehiculos", name: "certConduccVehiculos", tabla: "b_certificado_conduccion" },
            { label: "Antecedentes Enfermedades Altura", name: "AnteceEnfeAltura", tabla: "antece_enfermedades_altura" },
            { label: "Cert. Altura Basico 1.8", name: "certTrabajoAltura", tabla: "certificacion_medica_altura" },

            {
                title: "EXAMENES PODEROSA",
                items: [
                    { label: "Certificado Altura Poderosa", name: "CertAlturaPoderosa", tabla: "certificado_altura_poderosa" },
                    { label: "Certificado Aptitud Poderosa", name: "CertAptitudPoderosa", tabla: "aptitud_altura_poderosa" },
                    { label: "Aptitud Licencia Interna", name: "AptitudLicencia", tabla: "aptitud_licencia_conduciri" },
                    { label: "Hoja Consulta Externa", name: "HojaConsultaEx", tabla: "hoja_consulta_externa" },
                    { label: "Cert. Manipuladores de Alimentos", name: "CertManpAlimentos", tabla: "certificado_manipuladores_barrick" },
                    { label: "Aptitud Herramientas Manuales", name: "AptiHerramientas", tabla: "certificado_aptitud_herramientas_manuales" },

                    { label: "Ficha Datos Pacientes", name: "FichaDatosPacientes", tabla: "ficha_datos_paciente" },
                    { label: "Cert. Aptitud Brigadista", name: "CertAptiBrigadista", tabla: "certificado_aptitud_brigadista" },
                    { label: "Direccion Mina", name: "DireccionMina", tabla: "ministerio_energia_minas" },
                    { label: "Hoja de Ruta EMO", name: "HojaRutaEMO", tabla: "hoja_ruta_emo" },
                ]
            },
        ],
    },
    {
        column: 1,
        legend: "CONSENTIMIENTOS ADMISION",
        items: [
            //{ label: "F. Médica", name: "fMedica" },
            { label: "Const. Informado", name: "ConstInformado", tabla: "consentimientoInformado" },
            { label: "Const. Buena Salud", name: "ConstBuenaSalud", tabla: "consentimientobuenasalud" },
            { label: "Sintomatico Respiratorio", name: "CONSENT_SINTOMATICO", tabla: "CONSENT_SINTOMATICO" },
            { label: "Evaluacion Medica", name: "CONSENT_INFORMADO_MEDICA", tabla: "CONSENT_INFORMADO_MEDICA" },
            { label: "Recepcion Examen Medico", name: "CONSENT_RECOM_MEDIC", tabla: "CONSENT_RECOM_MEDIC" },
            { label: "Declaracion Antecedentes Personales", name: "DECLA_JURA_ANTECE_PERSON_FAM", tabla: "DECLA_JURA_ANTECE_PERSON_FAM" },
            { label: "Declaracion Aptitud Medico O.", name: "DECLA_INFO_APTITUD_MO", tabla: "DECLA_INFO_APTITUD_MO" },
            { label: "Const. Brigadista", name: "ConstBrigadista", tabla: "consta_brigadista" },
            { label: "Conformidad EMO ", name: "ConformidadEmo", tabla: "conformidad_emo" },
        ],
    },
    {
        column: 2,
        legend: "LABORATORIO CLINICO",
        items: [
            { label: "Lab. Clínico", name: "labClinico", tabla: "lab_clinico" },
            { label: "Hemograma", name: "Hemograma", tabla: "hemograma_autom" },
            { label: "Hemoglobina", name: "Hemoglobina", tabla: "lab_clinico_hemoglobina" },
            //titulo Analisis Bioquimicos
            {
                title: "Análisis Bioquímicos",
                items: [
                    { label: "Perfil Lipidico", name: "PerfilLipidico", tabla: "analisis_bioquimicos" },
                    { label: "Perfil Renal", name: "PerfilRenal", tabla: "l_bioquimica" },
                    { label: "Acido Urico", name: "AcidoUrico", tabla: "ac_bioquimica2022" },
                    { label: "Perfil Hepatico", name: "PerfilHepatico", tabla: "perfil_hepatico" },
                    { label: "Riesgo Coronario", name: "RiesgoCoronario", tabla: "riesgocoronario" },
                    { label: "Tolerancia a la Glucosa", name: "ToleranciaGlucosa", tabla: "glucosatolerancia" },
                    { label: "Glucosa Basal", name: "GlucosaBasal", tabla: "analisis_bioquimicos_glucosa_basal" },
                    { label: "PCR-Ultrasensible", name: "PCRUltrasensible", tabla: "pcr_ultrasensible" },
                ]
            },

            //Inmunologia
            {
                title: "Inmunologia",
                items: [
                    { label: "Gonadotropina", name: "Gonadotropina", tabla: "lgonadotropina" },
                    { label: "BK - KOH", name: "BKKOH", tabla: "microbiologia" },
                    { label: "BK - KOH Directo", name: "BKKOH", tabla: "koh" },
                    { label: "Aglutinaciones", name: "Aglutinaciones", tabla: "inmunologia" },
                    { label: "Hepatitis", name: "Hepatitis", tabla: "lhepatitis" },
                    { label: "VDRL", name: "VDRL", tabla: "inmunologia_vdrl" },
                    { label: "VIH", name: "VIH", tabla: "vih" },
                    { label: "Thevenon", name: "Thevenon", tabla: "vih" },
                ]
            },

            //Toxicologia
            {
                title: "Toxicologia",
                items: [
                    { label: "Toxicologia-Panel 2D", name: "Panel2D", tabla: "panel2d" },
                    { label: "Toxicologia-Panel 3D", name: "Panel3D", tabla: "panel3d" },
                    { label: "Toxicologia-Panel 4D", name: "Panel4D", tabla: "panel4d" },
                    { label: "Toxicologia-Panel 5D", name: "Panel5D", tabla: "toxicologia" },
                    { label: "Toxicologia-Panel 10D", name: "Panel10D", tabla: "panel10d" },
                    { label: "Etanol saliva", name: "EtanolSaliva", tabla: "etanol_saliva" },
                ]
            },

            //Manipuladores
            {
                title: "MANIPULADORES",
                items: [
                    { label: "Coprocultivo", name: "Coprocultivo", tabla: "ac_coprocultivo" },
                    { label: "Coproparasitológico", name: "Coproparasitológico", tabla: "ac_coproparasitologico" },
                    { label: "Examen orina", name: "ExamenOrina", tabla: "lab_clinico_examen_orina" },
                ]
            },

            //Pruebas Covid
            {
                title: "Pruebas Covid",
                items: [
                    { label: "Prueba Cualitativa Antígenos", name: "PruebaAntigenos", tabla: "examen_inmunologico" },
                ]
            },

            //Consentimientos
            {
                title: "Consentimientos",
                items: [
                    { label: "Const - Panel 2D", name: "Consentimiento2d", tabla: "con_panel2D" },
                    { label: "Const - Panel 3D", name: "Consentimiento3d", tabla: "con_panel3D" },
                    { label: "Const - Panel 4D", name: "Consentimiento4d", tabla: "con_panel4D" },
                    { label: "Const - Panel 5D", name: "Consentimiento5d", tabla: "con_panel5D" },
                    { label: "Const - Panel 10D", name: "Consentimiento10d", tabla: "con_panel10D" },
                    { label: "Const - Marihuana", name: "ConsentimientoMari", tabla: "consent_marihuana" },
                    { label: "Consentimiento Boro", name: "ConsentimientoBoro", tabla: "consent_boro" },
                ]
            },
        ],
    },
    {
        column: 3,
        legend: "AUDIOMETRIA",
        items: [
            { label: "Audiometría Simple", name: "audiometria_2023", tabla: "audiometria_2023" }, //falta B.
            { label: "Audiometría OHLA", name: "audiometria", tabla: "audiometria_po" },
            { label: "Cuest. Audiometría", name: "cuestAudiometria", tabla: "cuestionario_audiometria" },
        ],
    },
    {
        column: 3,
        legend: "ODONTOLOGIA",
        items: [
            { label: "Odontograma", name: "odontograma", tabla: "odontograma" },
        ],
    },
    {
        column: 3,
        legend: "RAYOS X",
        items: [
            { label: "Rx. Torax P.A", name: "rxTorax", tabla: "radiografia_torax" },
            { label: "RX. Columna", name: "radiografia", tabla: "radiografia" },
            { label: "Cuestionario Mujeres", name: "CuestMujeres", tabla: "consentimiento_rayosx" },//FALTA EXISTENCIA B
            { label: "OIT", name: "fichaOIT", tabla: "oit" },
        ],
    },
    {
        column: 3,
        legend: "OFTALMOLOGIA",
        items: [
            { label: "Ficha Oftalmologica", name: "oftalmologia", tabla: "oftalmologia" },
            { label: "Oftalmología", name: "evalOftalmologica", tabla: "oftalmologia2021" },
        ],
    },
    {
        column: 3,
        legend: "ELECTROCARDIOGRAMA",
        items: [
            { label: "Electrocardiograma", name: "electrocardiograma", tabla: "informe_electrocardiograma" },
        ],
    },
    {
        column: 3,
        legend: "ESPIROMETRIA",
        items: [
            { label: "Espirometría", name: "espirometria", tabla: "funcion_abs" },
        ],
    },
    {
        column: 3,
        legend: "OTROS FORMATOS",
        items: [
            { label: "Cuest. Calidad Sueño", name: "cuestCalidadSueno", tabla: "calidad_sueño" },
            { label: "Cert. Manipuladores", name: "certManipuladores", tabla: "certificado_manipuladores_barrick" },
            { label: "Perímetro Torácico", name: "perimetroToraxico", tabla: "perimetro_toracico" },
        ],
    },
    {
        column: 3,
        legend: "FICHAS SIN RESTRICCIÓN",
        items: [
            //{ label: "F. Médica", name: "fMedica" },
            { label: "F. Aptitud Anexo 2", name: "fAptitudAnexo2", tabla: "aptitud_medico_ocupacional_agro" },
        ],
    },
    {
        column: 3,
        legend: "PSICOLOGIA",
        items: [
            //{ label: "F. Médica", name: "fMedica" },
            { label: "Informe Fobias", name: "Fobias", tabla: "fobias" },
            { label: "Aversion al Riesgo", name: "AversionRiesgo", tabla: "aversionalriesgo" },
            { label: "Formato Altura Psicologica", name: "AlturaPsico", tabla: "psicologiafobias" },
            { label: "Trastorno Personalidad", name: "TrastornoPersonalidad", tabla: "trastornos_personalidad" },
            { label: "Informe Conductores", name: "InformeConduc", tabla: "infor_conductores" },
            { label: "Alto Riesgo", name: "AltoRiesgo", tabla: "alto_riesgo" },
            { label: "Trabajos Especificos", name: "TrabajosEspeci", tabla: "especificos" },
            { label: "Cuestionario Berlin", name: "CuestionarioBer", tabla: "cuestionario_berlin" },
            { label: "Examen Complementario", name: "ExamComp", tabla: "exam_complementarios" },
            { label: "Brigadista", name: "Brigadista", tabla: "psi_brigadistas" },
            { label: "Bomba Electrico", name: "BombaElec", tabla: "bombaelectrica" },
            { label: "Informe Psicolaboral", name: "InformePsico", tabla: "informe_psicolaboral" },
            { label: "Informe Riesgo Psicosocial", name: "InformeRiesgoPsico", tabla: "informe_riesgos_psicosociales" },
            { label: "Informe Burnout", name: "InformeBurnout", tabla: "informe_burnout" },
            { label: "Informe Psicologico Adeco", name: "InformePsicoAdeco", tabla: "informe_psicologico_estres" },
            { label: "Psicologia Espacios Confinados", name: "PsicoEspaciosConfi", tabla: "psicologia_espacios_confinados" },
        ],
    },

];