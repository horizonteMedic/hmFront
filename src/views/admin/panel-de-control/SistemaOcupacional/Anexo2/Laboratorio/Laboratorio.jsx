import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    InputCheckbox,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Laboratorio({
    form,
    handleChange,
    handleRadioButton,
    handleCheckBoxChange,
    setForm,
}) {
    return (
        <div className="p-4" style={{ fontSize: "10px" }}>
            {/* Primera fila - 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
                {/* Información Triaje */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        Información Triaje
                    </h4>
                    <div className="space-y-2 grid grid-cols-2 gap-x-4 flex-1">
                        <InputTextOneLine
                            label="Temp. (°C)"
                            name="temperatura"
                            value={form.temperatura}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Cintura (cm)"
                            name="cintura"
                            value={form.cintura}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Cadera (cm)"
                            name="cadera"
                            value={form.cadera}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="ICC"
                            name="icc"
                            value={form.icc}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="F. Respiratoria (min)"
                            name="frecuenciaRespiratoria"
                            value={form.frecuenciaRespiratoria}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="F. Cardiaca (min)"
                            name="frecuenciaCardiaca"
                            value={form.frecuenciaCardiaca}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Sat. O2 (%)"
                            name="saturacionO2"
                            value={form.saturacionO2}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Sistólica (min)"
                            name="presionSistolica"
                            value={form.presionSistolica}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Diastólica (min)"
                            name="presionDiastolica"
                            value={form.presionDiastolica}
                            disabled
                            labelWidth="100px"
                        />
                    </div>
                </div>

                {/* P. Lipídico */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        P. Lipídico
                    </h4>
                    <div className="space-y-3 ">
                        <div className="space-y-2">
                            <InputTextOneLine
                                label="Colesterol Total"
                                name="colesterolTotal"
                                value={form.colesterolTotal}
                                labelWidth="100px"
                                disabled
                                className={form.colesterolRed ? "text-red-600" : ""}
                            />
                            <InputTextOneLine
                                label="L.D.L Colesterol"
                                name="LDLColesterol"
                                value={form.LDLColesterol}
                                labelWidth="100px"
                                disabled
                                className={form.ldlRed ? "text-red-600" : ""}
                            />
                            <InputTextOneLine
                                label="H.D.L Colesterol"
                                name="HDLColesterol"
                                value={form.HDLColesterol}
                                labelWidth="100px"
                                disabled
                                className={form.hdlRed ? "text-red-600" : ""}
                            />
                            <InputTextOneLine
                                label="V.L.D.L Colesterol"
                                name="VLDLColesterol"
                                value={form.VLDLColesterol}
                                labelWidth="100px"
                                disabled
                                className={form.vldlRed ? "text-red-600" : ""}
                            />
                            <InputTextOneLine
                                label="Triglicéridos"
                                name="trigliceridos"
                                value={form.trigliceridos}
                                labelWidth="100px"
                                disabled
                                className={form.trigliceridosRed ? "text-red-600" : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* P. Renal */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        P. Renal
                    </h4>
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Creatinina Sérica"
                            name="temperatura"
                            value={form.temperatura}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Urea Sérica"
                            name="cintura"
                            value={form.cintura}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Acido Urico Sérico"
                            name="cadera"
                            value={form.cadera}
                            disabled
                            labelWidth="100px"
                        />

                    </div>
                </div>
            </div>

            {/* Segunda fila - 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
                {/* Perfil Hepatico */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        P. Hepático
                    </h4>
                    <div className="space-y-2 grid grid-cols-2 gap-x-4 flex-1">
                        <InputTextOneLine
                            label="Fosfatasa Alcalina"
                            name="temperatura"
                            value={form.temperatura}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Bilirrubina Directa"
                            name="cintura"
                            value={form.cintura}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="GGT"
                            name="cadera"
                            value={form.cadera}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Bilirrubina Indirecta"
                            name="icc"
                            value={form.icc}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="TGP"
                            name="frecuenciaRespiratoria"
                            value={form.frecuenciaRespiratoria}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Proteínas Totales"
                            name="frecuenciaCardiaca"
                            value={form.frecuenciaCardiaca}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="TGO"
                            name="saturacionO2"
                            value={form.saturacionO2}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Albumina"
                            name="presionSistolica"
                            value={form.presionSistolica}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Bilirrubina Total"
                            name="presionDiastolica"
                            value={form.presionDiastolica}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Globulina Sérica"
                            name="presionDiastolica"
                            value={form.presionDiastolica}
                            disabled
                            labelWidth="100px"
                        />
                    </div>
                </div>

                {/* Gonadotropinas */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        Gonadotropina
                    </h4>
                    <div className="space-y-3 ">
                        <div className="space-y-2">
                            <InputTextOneLine
                                label="Resultado"
                                name="colesterolTotal"
                                value={form.colesterolTotal}
                                labelWidth="100px"
                                disabled
                                className={form.colesterolRed ? "text-red-600" : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* RPR */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        RPR
                    </h4>
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="RPR"
                            name="temperatura"
                            value={form.temperatura}
                            disabled
                            labelWidth="100px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

