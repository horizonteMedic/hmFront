import { useMemo } from "react";
import { InputTextOneLine, InputsBooleanRadioGroup, SectionFieldset } from "../../../../components/reusableComponents/ResusableComponents";
import { SelectField } from "../../../../components/reusableComponents/InputSelect";
import { useForm } from "../../../../hooks/useForm";

const sexoOptions = [
    { value: "M", label: "Varón" },
    { value: "F", label: "Mujer" },
];

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
    const table = sexo === "M"
        ? { "30-34": -1, "35-39": 0, "40-44": 1, "45-49": 2, "50-54": 3, "55-59": 4, "60-64": 5, "65-69": 6, "70-74": 7 }
        : { "30-34": -9, "35-39": -4, "40-44": 0, "45-49": 3, "50-54": 6, "55-59": 7, "60-64": 8, "65-69": 8, "70-74": 8 };
    return table[group];
};

const getTotalCholPoints = (sexo, totalChol) => {
    const tc = totalChol;
    if (sexo === "M") {
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
    if (sexo === "M") {
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
    return 2;
};

const getHdlPointsChol = (sexo, hdl) => {
    const v = hdl;
    if (sexo === "M") {
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
    if (sexo === "M") {
        return [0, 0, 1, 2, 3][r];
    }
    return [-3, 0, 0, 2, 3][r];
};

const getDiabetesPointsChol = (sexo, diabetes) => {
    if (!diabetes) return 0;
    return sexo === "M" ? 2 : 4;
};

const getSmokerPointsChol = (smoker) => (smoker ? 2 : 0);

const riskFromPointsChol = (sexo, points) => {
    if (sexo === "M") {
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
        if (points >= 14) return { display: "≥53", numeric: 53 };
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
    if (points >= 17) return { display: "≥27", numeric: 27 };
    return { display: String(map[String(points)] ?? 0), numeric: map[String(points)] ?? 0 };
};

const riskFromPointsLdl = (sexo, points) => {
    if (sexo === "M") {
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
        if (points >= 14) return { display: "≥56", numeric: 56 };
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
    if (points >= 17) return { display: "≥32", numeric: 32 };
    return { display: String(map[String(points)] ?? 0), numeric: map[String(points)] ?? 0 };
};

const comparativeRisk = (sexo, age) => {
    const group = ageGroupKey(age);
    if (!group) return null;
    if (sexo === "M") {
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
    const initialFormState = {
        edad: "",
        sexo: "",
        diabetes: null,
        fuma: null,
        tensionSistolica: "",
        tensionDiastolica: "",
        colesterolTotal: "",
        colesterolHdl: "",
        trigliceridos: "",
        colesterolLdl: "",
    };

    const { form, handleChangeSimple, handleChangeNumberDecimals, handleRadioButtonBoolean, handleClear } = useForm(initialFormState, {
        storageKey: "riesgo_cardiovascular",
    });

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
            !sexo ||
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
            return { ready: false, error: "El cálculo aplica a personas de 30 a 74 años." };
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

    const sexoLabel = form.sexo === "M" ? "varón" : form.sexo === "F" ? "mujer" : "";

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <div className="w-full flex justify-center items-center">
                <h2 className="text-2xl font-bold text-[#233245]">Riesgo cardiovascular</h2>
            </div>

            <SectionFieldset legend="Factores de riesgo (requeridos)" className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="Edad"
                    name="edad"
                    type="number"
                    value={form.edad}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="140px"
                />

                <SelectField
                    label="Sexo"
                    name="sexo"
                    value={form.sexo}
                    onChange={handleChangeSimple}
                    options={sexoOptions}
                    placeholder="Elija..."
                />

                <InputsBooleanRadioGroup
                    name="diabetes"
                    value={form.diabetes}
                    onChange={handleRadioButtonBoolean}
                    trueLabel="Sí"
                    falseLabel="No"
                    label="Diabetes"
                    labelWidth="140px"
                />

                <InputsBooleanRadioGroup
                    name="fuma"
                    value={form.fuma}
                    onChange={handleRadioButtonBoolean}
                    trueLabel="Sí"
                    falseLabel="No"
                    label="Fuma"
                    labelWidth="140px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Presión / tensión arterial (solo en mm de Hg)" className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="Sistólica o máxima"
                    name="tensionSistolica"
                    type="number"
                    value={form.tensionSistolica}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="170px"
                />
                <InputTextOneLine
                    label="Diastólica o mínima"
                    name="tensionDiastolica"
                    type="number"
                    value={form.tensionDiastolica}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="170px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Perfil de lípidos (solo en mg/dl)" className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="Colesterol total"
                    name="colesterolTotal"
                    type="number"
                    value={form.colesterolTotal}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="170px"
                />
                <InputTextOneLine
                    label="Colesterol HDL"
                    name="colesterolHdl"
                    type="number"
                    value={form.colesterolHdl}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="170px"
                />
                <InputTextOneLine
                    label="Triglicéridos"
                    name="trigliceridos"
                    type="number"
                    value={form.trigliceridos}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="170px"
                />
                <InputTextOneLine
                    label="Colesterol LDL"
                    name="colesterolLdl"
                    type="number"
                    value={form.colesterolLdl}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="170px"
                />
            </SectionFieldset>

            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={handleClear}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                >
                    Limpiar
                </button>
            </div>

            <SectionFieldset legend="Resultado" className="space-y-3">
                {calculo.error ? <p className="text-red-600 font-semibold">{calculo.error}</p> : null}

                <div className="space-y-1">
                    <p>
                        Edad: {form.edad ? `${form.edad} años` : "-"} {sexoLabel ? `Sexo: ${sexoLabel}` : ""}
                    </p>
                    <p>
                        Tensión arterial:{" "}
                        {form.tensionSistolica && form.tensionDiastolica
                            ? `${form.tensionSistolica}/${form.tensionDiastolica} milímetros de mercurio (mmHg)`
                            : "-"}{" "}
                        Diabetes: {form.diabetes === null ? "-" : form.diabetes ? "sí" : "no"} Fuma: {form.fuma === null ? "-" : form.fuma ? "sí" : "no"}
                    </p>
                    <p>
                        Colesterol total: {form.colesterolTotal ? `${form.colesterolTotal} mg/dl` : "-"} Colesterol HDL (ligado a lipoproteínas de alta densidad):{" "}
                        {form.colesterolHdl ? `${form.colesterolHdl} mg/dl` : "-"}
                    </p>
                    <p>
                        Colesterol LDL (Ligado a lipoproteínas de baja densidad): {form.colesterolLdl ? `${form.colesterolLdl} mg/dl` : "-"} Triglicéridos:{" "}
                        {form.trigliceridos ? `${form.trigliceridos} mg/dl` : "-"}.
                    </p>
                </div>

                {calculo.ready ? (
                    <div className="space-y-1">
                        <p className="font-semibold">Datos calculados</p>
                        <p>Su riesgo de evento coronario a 10 años es de un: {calculo.risk.display} %</p>
                        <p className="font-semibold">Para su misma edad y sexo</p>
                        <p>El riesgo promedio de evento coronario a 10 años es de un: {calculo.comparative.avg} %</p>
                        <p>El riesgo ideal de evento coronario a 10 años es de un: {calculo.comparative.low} %</p>
                        <p>El riesgo promedio de evento coronario severo a 10 años es de un: {calculo.comparative.avgHard} %</p>
                    </div>
                ) : null}
            </SectionFieldset>
        </div>
    );
}
