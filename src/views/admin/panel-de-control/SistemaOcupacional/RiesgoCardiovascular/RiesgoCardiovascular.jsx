import { useEffect, useMemo } from "react";
import { InputTextOneLine, InputsBooleanRadioGroup, SectionFieldset } from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import { getToday } from "../../../../utils/helpers";
import { useSessionData } from "../../../../hooks/useSessionData";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerRiesgoCardiovascular";
import BotonesAccion from "../../../../components/templates/BotonesAccion";

const tabla = "riesgo_cardiovascular";

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

const ageGroupKey = (age) => {
    if (age >= 30 && age <= 34) return "30-34";
    if (age >= 35 && age <= 39) return "35-39";
    if (age >= 40 && age <= 44) return "40-44";
    if (age >= 45 && age <= 49) return "45-49";
    if (age >= 50 && age <= 54) return "50-54";
    if (age >= 55 && age <= 59) return "55-59";
    if (age >= 60 && age <= 64) return "60-64";
    if (age >= 65 && age <= 69) return "65-69";
    if (age >= 70 && age <= 74) return "70-74";
    return null;
};

const getAgePointsChol = (sexo, age) => {
    const group = ageGroupKey(age);
    if (!group) return null;
    const table = sexo === "MASCULINO"
        ? { "30-34": -1, "35-39": 0, "40-44": 1, "45-49": 2, "50-54": 3, "55-59": 4, "60-64": 5, "65-69": 6, "70-74": 7 }
        : { "30-34": -9, "35-39": -4, "40-44": 0, "45-49": 3, "50-54": 6, "55-59": 7, "60-64": 8, "65-69": 8, "70-74": 8 };
    return table[group];
};

const getTotalCholPoints = (sexo, totalChol) => {
    const tc = totalChol;
    if (sexo === "MASCULINO") {
        if (tc < 160) return -3;
        if (tc <= 199) return 0;
        if (tc <= 239) return 1;
        if (tc <= 279) return 2;
        return 3;
    }
    if (tc < 160) return -2;
    if (tc <= 199) return 0;
    if (tc <= 239) return 1;
    if (tc <= 279) return 1;
    return 3;
};

const getLdlPoints = (sexo, ldl) => {
    const v = ldl;
    if (sexo === "MASCULINO") {
        if (v < 100) return -3;
        if (v <= 129) return 0;
        if (v <= 159) return 0;
        if (v <= 189) return 1;
        return 2;
    }
    if (v < 100) return -2;
    if (v <= 129) return 0;
    if (v <= 159) return 0;
    if (v <= 189) return 2;
    return 3;
};

const getHdlPointsChol = (sexo, hdl) => {
    const v = hdl;
    if (sexo === "MASCULINO") {
        if (v < 35) return 2;
        if (v <= 44) return 1;
        if (v <= 49) return 0;
        if (v <= 59) return 0;
        return -2;
    }
    if (v < 35) return 5;
    if (v <= 44) return 2;
    if (v <= 49) return 1;
    if (v <= 59) return 0;
    return -3;
};

const bpRank = (sist, diast) => {
    const s = sist;
    const d = diast;
    const rankS = s < 120 ? 0 : s <= 129 ? 1 : s <= 139 ? 2 : s <= 159 ? 3 : 4;
    const rankD = d < 80 ? 0 : d <= 84 ? 1 : d <= 89 ? 2 : d <= 99 ? 3 : 4;
    return Math.max(rankS, rankD);
};

const getBpPointsChol = (sexo, sist, diast) => {
    const r = bpRank(sist, diast);
    if (sexo === "MASCULINO") {
        return [0, 0, 1, 2, 3][r];
    }
    return [-3, 0, 0, 2, 3][r];
};

const getDiabetesPointsChol = (sexo, diabetes) => {
    if (!diabetes) return 0;
    return sexo === "MASCULINO" ? 2 : 4;
};

const getSmokerPointsChol = (smoker) => (smoker ? 2 : 0);

const riskFromPointsChol = (sexo, points) => {
    if (sexo === "MASCULINO") {
        if (points <= -1) return { display: "2", numeric: 2 };
        const map = {
            0: 3,
            1: 3,
            2: 4,
            3: 5,
            4: 7,
            5: 8,
            6: 10,
            7: 13,
            8: 16,
            9: 20,
            10: 25,
            11: 31,
            12: 37,
            13: 45,
        };
        if (points >= 14) return { display: "≥ 53", numeric: 53 };
        return { display: String(map[points] ?? 0), numeric: map[points] ?? 0 };
    }

    if (points <= -2) return { display: "1", numeric: 1 };
    const map = {
        "-1": 2,
        0: 2,
        1: 2,
        2: 3,
        3: 3,
        4: 4,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
        9: 8,
        10: 10,
        11: 11,
        12: 13,
        13: 15,
        14: 18,
        15: 20,
        16: 24,
    };
    if (points >= 17) return { display: "≥ 27", numeric: 27 };
    return { display: String(map[String(points)] ?? 0), numeric: map[String(points)] ?? 0 };
};

const riskFromPointsLdl = (sexo, points) => {
    if (sexo === "MASCULINO") {
        if (points <= -3) return { display: "1", numeric: 1 };
        if (points === -2) return { display: "2", numeric: 2 };
        if (points === -1) return { display: "2", numeric: 2 };
        const map = {
            0: 3,
            1: 4,
            2: 4,
            3: 6,
            4: 7,
            5: 9,
            6: 11,
            7: 14,
            8: 18,
            9: 22,
            10: 27,
            11: 33,
            12: 40,
            13: 47,
        };
        if (points >= 14) return { display: "≥ 56", numeric: 56 };
        return { display: String(map[points] ?? 0), numeric: map[points] ?? 0 };
    }

    if (points <= -2) return { display: "1", numeric: 1 };
    const map = {
        "-1": 2,
        0: 2,
        1: 2,
        2: 3,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 11,
        11: 13,
        12: 15,
        13: 17,
        14: 20,
        15: 24,
        16: 27,
    };
    if (points >= 17) return { display: "≥ 32", numeric: 32 };
    return { display: String(map[String(points)] ?? 0), numeric: map[String(points)] ?? 0 };
};

const comparativeRisk = (sexo, age) => {
    const group = ageGroupKey(age);
    if (!group) return null;
    if (sexo === "MASCULINO") {
        const avg = { "30-34": "3", "35-39": "5", "40-44": "7", "45-49": "11", "50-54": "14", "55-59": "16", "60-64": "21", "65-69": "25", "70-74": "30" };
        const avgHard = { "30-34": "1", "35-39": "4", "40-44": "4", "45-49": "8", "50-54": "10", "55-59": "13", "60-64": "20", "65-69": "22", "70-74": "25" };
        const low = { "30-34": "2", "35-39": "3", "40-44": "4", "45-49": "4", "50-54": "6", "55-59": "7", "60-64": "9", "65-69": "11", "70-74": "14" };
        return { avg: avg[group], avgHard: avgHard[group], low: low[group] };
    }
    const avg = { "30-34": "<1", "35-39": "<1", "40-44": "2", "45-49": "5", "50-54": "8", "55-59": "12", "60-64": "12", "65-69": "13", "70-74": "14" };
    const avgHard = { "30-34": "<1", "35-39": "<1", "40-44": "1", "45-49": "2", "50-54": "3", "55-59": "7", "60-64": "8", "65-69": "8", "70-74": "11" };
    const low = { "30-34": "<1", "35-39": "1", "40-44": "2", "45-49": "3", "50-54": "5", "55-59": "7", "60-64": "8", "65-69": "8", "70-74": "8" };
    return { avg: avg[group], avgHard: avgHard[group], low: low[group] };
};


export default function RiesgoCardiovascular() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        id: null,
        fecha: today,
        nombreExamen: "",

        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",


        diabetes: null,
        fuma: null,
        tensionSistolica: "",
        tensionDiastolica: "",
        colesterolTotal: "",
        colesterolHdl: "",
        trigliceridos: "",
        colesterolLdl: "",
        riesgoEventoCoronario10: "",
        riesgoPromedioEventoCoronario10: "",
        riesgoIdealEventoCoronario10: "",
        riesgoPromedioEventoCoronarioSevero10: "",
        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const { form, setForm, handleChangeSimple, handleChangeNumberDecimals, handleRadioButtonBoolean, handleClear, handleClearnotO, handlePrintDefault } = useForm(initialFormState, {
        storageKey: "riesgo_cardiovascular",
    });

    useEffect(() => {
        if (!form.sexo) return;
        if (form.sexo === "MASCULINO" || form.sexo === "FEMENINO") return;
        setForm((prev) => ({ ...prev, sexo: "" }));
    }, [form.sexo, setForm]);

    const calculo = useMemo(() => {
        const edad = Number(form.edad);
        const sexo = form.sexo;
        const diabetes = form.diabetes === true;
        const fuma = form.fuma === true;
        const sist = Number(form.tensionSistolica);
        const diast = Number(form.tensionDiastolica);
        const tc = Number(form.colesterolTotal);
        const hdl = Number(form.colesterolHdl);
        const ldl = Number(form.colesterolLdl);
        const hasLdl = form.colesterolLdl !== "" && Number.isFinite(ldl);

        const missing =
            !Number.isFinite(edad) ||
            (sexo !== "MASCULINO" && sexo !== "FEMENINO") ||
            form.diabetes === null ||
            form.fuma === null ||
            !Number.isFinite(sist) ||
            !Number.isFinite(diast) ||
            !Number.isFinite(tc) ||
            !Number.isFinite(hdl) ||
            form.edad === "" ||
            form.tensionSistolica === "" ||
            form.tensionDiastolica === "" ||
            form.colesterolTotal === "" ||
            form.colesterolHdl === "";

        if (missing) return { ready: false, error: "" };

        if (edad < 30 || edad > 74) {
            return { ready: false, error: "RIESGO CARDIOVASCULAR SEGUN FRAMINGHAM: NO CUANTIFICABLE POR LIMITE DE EDAD." };
        }

        const sistClamped = clampNumber(sist, 80, 250);
        const diastClamped = clampNumber(diast, 40, 150);
        const tcClamped = clampNumber(tc, 100, 400);
        const hdlClamped = clampNumber(hdl, 10, 100);
        const ldlClamped = hasLdl ? clampNumber(ldl, 50, 300) : null;

        const pointsAge = getAgePointsChol(sexo, edad);
        const pointsLipids = hasLdl ? getLdlPoints(sexo, ldlClamped) : getTotalCholPoints(sexo, tcClamped);
        const pointsHdl = getHdlPointsChol(sexo, hdlClamped);
        const pointsBp = getBpPointsChol(sexo, sistClamped, diastClamped);
        const pointsDm = getDiabetesPointsChol(sexo, diabetes);
        const pointsSmk = getSmokerPointsChol(fuma);
        const totalPoints = pointsAge + pointsLipids + pointsHdl + pointsBp + pointsDm + pointsSmk;

        const risk = hasLdl ? riskFromPointsLdl(sexo, totalPoints) : riskFromPointsChol(sexo, totalPoints);
        const comp = comparativeRisk(sexo, edad);

        if (!comp) return { ready: false, error: "El cálculo aplica a personas de 30 a 74 años." };

        return {
            ready: true,
            totalPoints,
            risk,
            comparative: comp,
            usedValues: {
                sist: sistClamped,
                diast: diastClamped,
                tc: tcClamped,
                hdl: hdlClamped,
                ldl: ldlClamped,
            },
        };
    }, [form]);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const sexoLabel = form.sexo === "MASCULINO" || form.sexo === "FEMENINO" ? form.sexo : "";
    const riesgoEventoCoronario10 = calculo.ready ? `${calculo.risk.display} %` : "";
    const riesgoPromedioEventoCoronario10 = calculo.ready ? `${calculo.comparative.avg} %` : "";
    const riesgoIdealEventoCoronario10 = calculo.ready ? `${calculo.comparative.low} %` : "";
    const riesgoPromedioEventoCoronarioSevero10 = calculo.ready ? `${calculo.comparative.avgHard} %` : "";

    useEffect(() => {
        setForm((prev) => {
            if (
                prev.riesgoEventoCoronario10 === riesgoEventoCoronario10 &&
                prev.riesgoPromedioEventoCoronario10 === riesgoPromedioEventoCoronario10 &&
                prev.riesgoIdealEventoCoronario10 === riesgoIdealEventoCoronario10 &&
                prev.riesgoPromedioEventoCoronarioSevero10 === riesgoPromedioEventoCoronarioSevero10
            ) {
                return prev;
            }
            return {
                ...prev,
                riesgoEventoCoronario10,
                riesgoPromedioEventoCoronario10,
                riesgoIdealEventoCoronario10,
                riesgoPromedioEventoCoronarioSevero10,
            };
        });
    }, [riesgoEventoCoronario10, riesgoIdealEventoCoronario10, riesgoPromedioEventoCoronario10, riesgoPromedioEventoCoronarioSevero10, setForm]);

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />
            <SectionFieldset legend="Factores de riesgo (requeridos)" className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <InputsBooleanRadioGroup
                    name="diabetes"
                    value={form.diabetes}
                    disabled
                    trueLabel="Sí"
                    falseLabel="No"
                    label="Diabetes"
                    labelWidth="140px"
                />

                <InputsBooleanRadioGroup
                    name="fuma"
                    value={form.fuma}
                    disabled
                    trueLabel="Sí"
                    falseLabel="No"
                    label="Fuma"
                    labelWidth="140px"
                />
            </SectionFieldset>

            <div className="grid 2xl:grid-cols-2 gap-x-4 gap-y-3">
                <SectionFieldset
                    legend="Perfil de lípidos (solo en mg/dl)"
                    className="grid grid-cols-1 gap-3"
                >
                    <div className="flex items-center gap-3">
                        <InputTextOneLine
                            label="Colesterol total"
                            name="colesterolTotal"
                            value={form.colesterolTotal}
                            disabled
                            labelWidth="220px"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            70 - 1200 mg/dl
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <InputTextOneLine
                            label="Colesterol HDL"
                            name="colesterolHdl"
                            value={form.colesterolHdl}
                            disabled
                            labelWidth="220px"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            20 - 150 mg/dl
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <InputTextOneLine
                            label="Triglicéridos"
                            name="trigliceridos"
                            value={form.trigliceridos}
                            disabled
                            labelWidth="220px"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            25 - 1200 mg/dl
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <InputTextOneLine
                            label="Colesterol LDL"
                            name="colesterolLdl"
                            value={form.colesterolLdl}
                            disabled
                            labelWidth="220px"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            6 - 540 mg/dl
                        </span>
                    </div>
                </SectionFieldset>

                <SectionFieldset
                    legend="Presión / tensión arterial (solo en mm de Hg)"
                    className="grid grid-cols-1 gap-3"
                >
                    <div className="flex items-center gap-3">
                        <InputTextOneLine
                            label="Sistólica o máxima"
                            name="tensionSistolica"
                            value={form.tensionSistolica}
                            disabled
                            labelWidth="220px"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            60 - 300 mm de Hg
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <InputTextOneLine
                            label="Diastólica o mínima"
                            name="tensionDiastolica"
                            value={form.tensionDiastolica}
                            disabled
                            labelWidth="220px"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            40 - 150 mm de Hg
                        </span>
                    </div>
                </SectionFieldset>
            </div>


            <SectionFieldset legend="Resultado" className="space-y-3">
                {calculo.error ? (<p className="text-red-600 font-semibold">{calculo.error}</p>) :
                    (<div className="space-y-2">
                        <div className="grid grid-cols-1  gap-3">
                            <InputTextOneLine
                                label="Su riesgo de evento coronario a 10 años es de un"
                                name="riesgoEventoCoronario10"
                                value={form.riesgoEventoCoronario10}
                                disabled
                                labelWidth="350px"
                            />
                            <InputTextOneLine
                                label="El riesgo promedio de evento coronario a 10 años es de un"
                                name="riesgoPromedioEventoCoronario10"
                                value={form.riesgoPromedioEventoCoronario10}
                                disabled
                                labelWidth="350px"
                            />
                            <InputTextOneLine
                                label="El riesgo ideal de evento coronario a 10 años es de un"
                                name="riesgoIdealEventoCoronario10"
                                value={form.riesgoIdealEventoCoronario10}
                                disabled
                                labelWidth="350px"
                            />
                            <InputTextOneLine
                                label="El riesgo promedio de evento coronario severo a 10 años es de un"
                                name="riesgoPromedioEventoCoronarioSevero10"
                                value={form.riesgoPromedioEventoCoronarioSevero10}
                                disabled
                                labelWidth="350px"
                            />
                        </div>
                    </div>)
                }
            </SectionFieldset>
            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}
