// Catálogo de patologías personales (clave que viaja al backend + etiqueta). Lo usan Antecedentes Patológicos
// (para registrarlas) y las Historias Clínicas asistenciales (para mostrar las que no tienen como ítem fijo).
// Enfermedades a marcar (Antecedentes Patológicos Personales)
export const ENFERMEDADES = [
    ["accidentes", "Accidentes"],
    ["acv", "ACV (Acc. Cerebro Vascular)"],
    ["alergias", "Alergias"],
    ["amigdalitisCronica", "Amigdalitis crónica"],
    ["amputacion", "Amputación"],
    ["anemia", "Anemia"],
    ["arritmiasCardiacas", "Arritmias cardiacas"],
    ["asma", "Asma"],
    ["bocio", "Bocio"],
    ["bronconeumonia", "Bronconeumonía"],
    ["bronquitisRepeticion", "Bronquitis a repetición"],
    ["cariesGingivitis", "Caries o gingivitis"],
    ["colecistitis", "Colecistitis"],
    ["columna", "Columna"],
    ["convulsiones", "Convulsiones"],
    ["dengue", "Dengue"],
    ["depresion", "Depresión"], 
    ["dermatitis", "Dermatitis"],
    ["diabetes", "Diabetes"],
    ["discopatias", "Discopatías"],
    ["dislipidemia", "Dislipidemia"],
    ["disenteria", "Disentería"],
    ["enfCorazon", "Enfermedades del corazón"],
    ["enfOculares", "Enf. Oculares"],
    ["enfPiel", "Enf de la Piel"],
    ["enfPsiquiatricas", "Enf Psiquiátricas"],
    ["enfPulmonares", "Enf Pulmonares"],
    ["enfReumatica", "Enf Reumática"],
    ["epilepsiaConvulsiones", "Epilepsia o convulsiones"],
    ["ets", "ETS"],
    ["faringitisCronica", "Faringitis crónica"],
    ["fiebreMalta", "Fiebre malta"],
    ["fiebreReumatica", "Fiebre Reumática"],
    ["fiebreTifoidea", "Fiebre tifoidea"],
    ["fobias", "Fobias"],
    ["forunculosis", "Forunculosis"],
    ["fracturas", "Fracturas"],
    ["gastritisCronica", "Gastritis crónica"],
    ["glaucoma", "Glaucoma"],
    ["gonorrea", "Gonorrea"],
    ["gota", "Gota"],
    ["hemorroides", "Hemorroides"],
    ["hepatitis", "Hepatitis"],
    ["hernias", "Hernias"],
    ["hipertensionArterial", "Hipertensión Arterial"],
    ["hospitalizacionUlt3Anios", "Hospitalización Últ 3 años"],
    ["ima", "IMA (Infarto agudo al miocardio)"],
    ["infUrinariasRepetidas", "Inf. Urinarias repetidas"],
    ["insuficienciaCardiaca", "Insuficiencia Cardíaca"],
    ["insuficienciaCoronariaCronica", "Insuficiencia Coronaria Crónica"],
    ["insuficienciaRenalCronica", "Insuficiencia Renal Crónica"],
    ["intervQuirurgica", "Interv. Quirúrgica"],
    ["intoxicaciones", "Intoxicaciones"],
    ["its", "ITS"],
    ["litiasisUrinaria", "Litiasis Urinaria"],
    ["meningitis", "Meningitis"],
    ["migrana", "Migraña"],
    ["neoplasias", "Neoplasias"],
    ["neuritisRepeticion", "Neuritis a Repetición"],
    ["obesidad", "Obesidad"],
    ["onicomicosis", "Onicomicosis"],
    ["osteoporosis", "Osteoporosis"],
    ["osteoartrosis", "Osteoartrosis"],
    ["otitisMedia", "Otitis Media"],
    ["paludismoMalaria", "Paludismo o malaria"],
    ["parasitosisIntestinal", "Parasitosis Intestinal"],
    ["parotiditis", "Parotiditis"],
    ["pleuresia", "Pleuresia"],
    ["plumbismo", "Plumbismo"],
    ["poliomielitis", "Poliomielitis"],
    ["portadorMarcapaso", "Portador de Marcapaso"],
    ["presionAltaBaja", "Presión alta o baja"],
    ["protesisCardiacasValvulares", "Prótesis Cardiacas Valvulares"],
    ["quemaduras", "Quemaduras"],
    ["resfriosFrecuentes", "Resfríos frecuentes"],
    ["reumatismoRepeticion", "Reumatismo a repetición"],
    ["riesgoOcupacional", "Riesgo Ocupacional"],
    ["sarampion", "Sarampión"],
    ["sifilis", "Sífilis"],
    ["silicosis", "Silicosis"],
    ["sinusitisCronica", "Sinusitis crónica"],
    ["sordera", "Sordera"],
    ["tbc", "TBC"],
    ["tendinitis", "Tendinitis"],
    ["tifoidea", "Tifoidea"],
    ["tosConvulsiva", "Tos convulsiva"],
    ["transfusionSanguinea", "Transfusión Sanguínea"],
    ["trastornosNerviosos", "Trastornos Nerviosos"],
    ["traumatismoEncefalocraneano", "Traumatismo encefalocraneano"],
    ["tuberculosis", "Tuberculosis"],
    ["tumoresQuistes", "Tumores - quistes"],
    ["ulceraPeptica", "Ulcera péptica"],
    ["varicela", "Varicela"],
    ["varices", "Várices"],
    ["varicocele", "Varicocele"],
    ["vertigos", "Vértigos"],
    ["vih", "VIH"],
    ["enfMusculoesqueleticas", "Enfermedades Musculoesqueléticas"],
];

// Enfermedades que, además del checkbox, piden especificar (checkbox, label, campo de detalle).
// Igual que "Reacción adversa a medicamentos", se muestran fuera de la grilla con su input.
export const ENFERMEDADES_CON_DETALLE = [
    ["cancer", "Cáncer", "tipoCancer"],
    ["mordeduraAnimales", "Mordedura de Animales", "descripcionMordedura"],
];

const normalizar = (texto) =>
    String(texto ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

const ETIQUETAS = new Map([...ENFERMEDADES, ...ENFERMEDADES_CON_DETALLE].map(([clave, etiqueta]) => [clave, etiqueta]));
// El backend entrega claves, pero se tolera que llegue la etiqueta (o con otra grafía).
const CLAVE_POR_TEXTO = new Map(
    [...ETIQUETAS].flatMap(([clave, etiqueta]) => [
        [normalizar(clave), clave],
        [normalizar(etiqueta), clave],
    ])
);
const CAMPO_DETALLE = Object.fromEntries(ENFERMEDADES_CON_DETALLE.map(([clave, , campo]) => [clave, campo]));

const textoDe = (valor) => String(valor ?? "").trim();

/**
 * Patologías de un paciente que el formulario que las muestra NO tiene como ítem propio, ya redactadas
 * para mostrar ("Cáncer: PULMÓN", "Otras patologías: ...").
 *
 * @param {string[]} marcadas  Claves del registro de Antecedentes Patológicos (`personales`).
 * @param {string[]} cubiertas Claves que el formulario ya muestra como ítems fijos (se omiten).
 * @param {object}   detalles  { tipoCancer, descripcionMordedura, otrasPatologias } del mismo registro.
 */
export const patologiasAdicionales = (marcadas = [], cubiertas = [], detalles = {}) => {
    const claves = new Set((marcadas ?? []).map((m) => CLAVE_POR_TEXTO.get(normalizar(m)) ?? m));
    // Cáncer / Mordedura también cuentan si solo llega su detalle.
    Object.entries(CAMPO_DETALLE).forEach(([clave, campo]) => {
        if (textoDe(detalles[campo])) claves.add(clave);
    });

    const omitidas = new Set(cubiertas);
    const items = [...claves]
        .filter((clave) => !omitidas.has(clave))
        .map((clave) => {
            const detalle = textoDe(detalles[CAMPO_DETALLE[clave]]);
            const etiqueta = ETIQUETAS.get(clave) ?? clave;
            return detalle ? `${etiqueta}: ${detalle}` : etiqueta;
        });

    const otras = textoDe(detalles.otrasPatologias);
    return otras ? [...items, `Otras patologías: ${otras}`] : items;
};
