import {
    InputTextOneLine,
} from "../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
// import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerBrigadista";
import { DatosPersonalesLaborales, TablaTemplate } from "../../../../components/templates/Templates";
import { useState } from "react";
import { searchByNorden } from "./controllerSeguimientoClinico";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const tabla = "";

export default function SeguimientoClinico() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",
        esApto: undefined,

        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",
        historialOrdenes: []
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);

    const handleSave = () => {
        // SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            searchByNorden(form.norden, setForm, token);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            // PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    return (
        <div className="px-4 max-w-[90%] xl:max-w-[90%] mx-auto grid gap-x-4 lg:grid-cols-2 ">
            <div className="space-y-3">
                <SectionFieldset legend="Información del Paciente" className="grid grid-cols-2 gap-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumberDecimals}
                        onKeyUp={handleSearch}
                        labelWidth="120px"
                    />
                </SectionFieldset>
                <DatosPersonalesLaborales form={form} laborales={false} minSizePrincipal={"3xl"} />
                <div className="flex-1">
                    <Table data={form.historialOrdenes} />
                </div>
            </div>

        </div>
    );
}

function Table({ data }) {
    const columns = [
        {
            label: "N° Orden",
            accessor: "nroOrden",
            width: "120px",
            render: (row) => <span className="font-bold">{row.nroOrden}</span>,
        },
        {
            label: "Empresa",
            accessor: "empresa",
        },
        {
            label: "Contrata",
            accessor: "contrata",
        },
        {
            label: "Fecha",
            accessor: "fechaApertura",
            render: (row) => formatearFechaCorta(row.fechaApertura),
        },
        {
            label: "Aptitud",
            accessor: "aptitud",
        },
    ];

    return (
        <TablaTemplate
            columns={columns}
            data={data}
            height={300}
            onRowClick={(row) => { }}
            onRowRightClick={(row) => { }}
        />

    );
}
