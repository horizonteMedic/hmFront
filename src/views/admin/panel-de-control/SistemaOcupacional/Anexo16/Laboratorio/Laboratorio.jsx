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
                        Hematologia-BQ-ECO
                    </h4>
                    <div className="space-y-2 grid grid-cols-2 gap-x-4 flex-1">
                        <InputTextOneLine
                            label="Leucocitos"
                            name="temperaleucocitosHematologiatura"
                            value={form.leucocitosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Hematies"
                            name="hematiesHematologia"
                            value={form.hematiesHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Plaquetas"
                            name="plaquetasHematologia"
                            value={form.plaquetasHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Neutrofilos"
                            name="neutrofilosHematologia"
                            value={form.neutrofilosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Abastonados"
                            name="abastonadosHematologia"
                            value={form.abastonadosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Segmentados"
                            name="segmentadosHematologia"
                            value={form.segmentadosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Monocitos"
                            name="monocitosHematologia"
                            value={form.monocitosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Eosinofilos"
                            name="eosinofilosHematologia"
                            value={form.eosinofilosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Basofilos"
                            name="basofilosHematologia"
                            value={form.basofilosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Linfocitos"
                            name="linfocitosHematologia"
                            value={form.linfocitosHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="VIH"
                            name="vihHematologia"
                            value={form.vihHematologia}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="RPR"
                            name="rprHematologia"
                            value={form.rprHematologia}
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
                                name="colesterolAnalisisBioquimico_txtcolesterol"
                                value={form.colesterolAnalisisBioquimico_txtcolesterol}
                                labelWidth="100px"
                                disabled
                            />
                            <InputTextOneLine
                                label="L.D.L Colesterol"
                                name="ldlcolesterolAnalisisBioquimico_txtldlcolesterol"
                                value={form.ldlcolesterolAnalisisBioquimico_txtldlcolesterol}
                                labelWidth="100px"
                                disabled
                            />
                            <InputTextOneLine
                                label="H.D.L Colesterol"
                                name="hdlcolesterolAnalisisBioquimico_txthdlcolesterol"
                                value={form.hdlcolesterolAnalisisBioquimico_txthdlcolesterol}
                                labelWidth="100px"
                                disabled
                            />
                            <InputTextOneLine
                                label="V.L.D.L Colesterol"
                                name="vldlcolesterolAnalisisBioquimico_txtvldlcolesterol"
                                value={form.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol}
                                labelWidth="100px"
                                disabled
                            />
                            <InputTextOneLine
                                label="Triglicéridos"
                                name="trigliseridosAnalisisBioquimico_txttrigliseridos"
                                value={form.trigliseridosAnalisisBioquimico_txttrigliseridos}
                                labelWidth="100px"
                                disabled
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
                            name="creatininaPerfilRenal"
                            value={form.creatininaPerfilRenal}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Urea Sérica"
                            name="ureaSericaPerfilRenal"
                            value={form.ureaSericaPerfilRenal}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Acido Urico Sérico"
                            name="acidoUricoSericoPerfilRenal"
                            value={form.acidoUricoSericoPerfilRenal}
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
                            name="fosfatasaAlcalinaPerfilHepatico"
                            value={form.fosfatasaAlcalinaPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Bilirrubina Directa"
                            name="bilirrubinaDirectaPerfilHepatico"
                            value={form.bilirrubinaDirectaPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="GGT"
                            name="ggtPerfilHepatico"
                            value={form.ggtPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Bilirrubina Indirecta"
                            name="bilirrubinaIndirectaPerfilHepatico"
                            value={form.bilirrubinaIndirectaPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="TGP"
                            name="tgpPerfilHepatico"
                            value={form.tgpPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Proteínas Totales"
                            name="proteinaTotalesPerfilHepatico"
                            value={form.proteinaTotalesPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="TGO"
                            name="tgoPerfilHepatico"
                            value={form.tgoPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Albumina"
                            name="albuminaPerfilHepatico"
                            value={form.albuminaPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Bilirrubina Total"
                            name="bilirrubinaTotalPerfilHepatico"
                            value={form.bilirrubinaTotalPerfilHepatico}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Globulina Sérica"
                            name="globulinaSericaPerfilHepatico"
                            value={form.globulinaSericaPerfilHepatico}
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
                                name="resultadoGonadotropina"
                                value={form.resultadoGonadotropina}
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
                            name="rprHematologia"
                            value={form.rprHematologia}
                            disabled
                            labelWidth="100px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

