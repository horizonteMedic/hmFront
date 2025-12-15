import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaDatosPacientes";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "";
const today = getToday();

export default function FichaDatosPacientes() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // ===== Información general =====
        norden: "",
        codigoFicha: null,
        fechaIngreso: today,
        nombreExamen: "",
        empresa: "",
        cargo: "",
        codigoActividad: "",
        zona: "",
        codigoDpto: "",
        tipoTrabajador: "",
        nombres: "",
        apellidos: "",
        // ===== Nacimiento =====
        fechaNacimiento: "",
        diaNacimiento: "",
        mesNacimiento: "",
        anioNacimiento: "",
        distritoNacimiento: "",
        provinciaNacimiento: "",
        departamentoNacimiento: "",
        // ===== Datos personales =====
        dni: "",
        lmNo: "",
        autogenerado: "",
        estadoCivil: "",
        afpSnp: "",
        estatura: "",
        licConducirNo: "",
        cusspNo: "",
        peso: "",
        // ===== Domicilio =====
        direccionDomicilio: "",
        distritoDomicilio: "",
        provinciaDomicilio: "",
        departamentoDomicilio: "",
        referenciaDomiciliaria: "",
        telefono1: "",
        tipoVivienda: "",
        telefono2: "",
        email: "",
        radioFrec: "",
        celular: "",
        numeroCuentaAhorro: "",
        banco: "",
        // ===== Emergencia =====
        emergenciaNombres: "",
        emergenciaParentesco: "",
        emergenciaTelefono: "",
        emergenciaDomicilio: "",
        emergenciaOtraReferencia: "",
        // ===== Composición Familiar (inputs temporales) =====
        familiarParentesco: "",
        familiarNombres: "",
        familiarVive: "",
        familiarFechaNac: "",
        familiarEdad: "",
        familiarDni: "",
        familiarGrado: "",
        familiarAutogenerado: "",
        // ===== Condiciones Laborales =====
        sueldoJornal: "",
        sistemaTrabajo: "",
        grupoSanguineo: "",
        transporteTerrestre: "",
        transporteAereo: "",
        viaticos: "",
        viaticosValor: "",
        alimentacionContrata: "",

        apto18: "",
        aptitud: "",
    };

    // Estado para listas dinámicas
    const [familiares, setFamiliares] = useState([]);

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "fichaDatosPacientesPoderosa" });

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const tipoViviendaOptions = [
        { value: "PROPIA", label: "Propia" },
        { value: "ALQUILADA", label: "Alquilada" },
        { value: "OTROS", label: "Otros" },
    ];

    const tipoTrabajadorOptions = [
        { value: "EMPLEADO", label: "Empleado" },
        { value: "OBRERO", label: "Obrero" },
    ];


    // Funciones para Composición Familiar
    const agregarFamiliar = () => {
        if (form.familiarParentesco && form.familiarNombres) {
            setFamiliares([
                ...familiares,
                {
                    parentesco: form.familiarParentesco,
                    nombres: form.familiarNombres,
                    vive: form.familiarVive,
                    fechaNac: form.familiarFechaNac,
                    edad: form.familiarEdad,
                    dni: form.familiarDni,
                    grado: form.familiarGrado,
                    autogenerado: form.familiarAutogenerado,
                },
            ]);
            setForm({
                ...form,
                familiarParentesco: "",
                familiarNombres: "",
                familiarVive: "",
                familiarFechaNac: "",
                familiarEdad: "",
                familiarDni: "",
                familiarGrado: "",
                familiarAutogenerado: "",
            });
        }
    };

    const eliminarFamiliar = (index) => {
        setFamiliares(familiares.filter((_, i) => i !== index));
    };

    return (
        <div className=" space-y-3 p-4">
            {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
            <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha de Ingreso"
                    name="fechaIngreso"
                    type="date"
                    value={form.fechaIngreso}
                    onChange={handleChange}
                    labelWidth="120px"
                />
                <InputsRadioGroup
                    label="Tipo de Trabajador"
                    name="tipoTrabajador"
                    labelWidth="120px"
                    value={form.tipoTrabajador}
                    onChange={handleRadioButton}
                    options={tipoTrabajadorOptions}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Empresa"
                    name="empresa"
                    value={form.empresa}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Cargo"
                    name="cargo"
                    value={form.cargo}
                    onChange={handleChange}
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS PERSONALES Y DOMICILIO ===== */}
            <SectionFieldset legend="Datos Personales">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Nombres"
                            name="nombres"
                            value={form.nombres}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Apellidos"
                            name="apellidos"
                            value={form.apellidos}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Fecha Nacimiento"
                            name="fechaNacimiento"
                            value={form.fechaNacimiento}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Distrito de Nacimiento"
                            name="distritoNacimiento"
                            value={form.distritoNacimiento}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Provincia de Nacimiento"
                            name="provinciaNacimiento"
                            value={form.provinciaNacimiento}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Departamento de Nacimiento"
                            name="departamentoNacimiento"
                            value={form.departamentoNacimiento}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                    </div>
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="DNI / C.Ext Nº"
                            name="dni"
                            value={form.dni}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="L.M. No."
                            name="lmNo"
                            value={form.lmNo}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Autogenerado"
                            name="autogenerado"
                            value={form.autogenerado}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Estado Civil"
                            name="estadoCivil"
                            value={form.estadoCivil}
                            disabled
                            labelWidth="120px"
                        />
                        <div className="grid grid-cols-2 gap-x-4">
                            <InputTextOneLine
                                label="AFP/SNP"
                                name="afpSnp"
                                value={form.afpSnp}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Estatura"
                                name="estatura"
                                value={form.estatura}
                                disabled
                                labelWidth="120px"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                            <InputTextOneLine
                                label="Lic.Conducir"
                                name="licConducirNo"
                                value={form.licConducirNo}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="CUSSP No."
                                name="cusspNo"
                                value={form.cusspNo}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                        </div>
                        <InputTextOneLine
                            label="Peso"
                            name="peso"
                            value={form.peso}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                </div>
                {/* Dirección del Domicilio */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Dirección"
                            name="direccionDomicilio"
                            value={form.direccionDomicilio}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Distrito"
                            name="distritoDomicilio"
                            value={form.distritoDomicilio}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Provincia"
                            name="provinciaDomicilio"
                            value={form.provinciaDomicilio}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Departamento"
                            name="departamentoDomicilio"
                            value={form.departamentoDomicilio}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Referencia"
                            name="referenciaDomiciliaria"
                            value={form.referenciaDomiciliaria}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                    </div>
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Teléfono 1"
                            name="telefono1"
                            value={form.telefono1}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Teléfono 2"
                            name="telefono2"
                            value={form.telefono2}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputsRadioGroup
                            label="Tipo Vivienda"
                            name="tipoVivienda"
                            value={form.tipoVivienda}
                            onChange={handleRadioButton}
                            options={tipoViviendaOptions}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="E-mail"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <div className="grid grid-cols-2 gap-x-4">
                            <InputTextOneLine
                                label="Radio Frec."
                                name="radioFrec"
                                value={form.radioFrec}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Celular"
                                name="celular"
                                value={form.celular}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                            <InputTextOneLine
                                label="Nº Cuenta"
                                name="numeroCuentaAhorro"
                                value={form.numeroCuentaAhorro}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Banco"
                                name="banco"
                                value={form.banco}
                                onChange={handleChange}
                                labelWidth="120px"
                            />
                        </div>
                    </div>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: COMPOSICIÓN FAMILIAR ===== */}
            <SectionFieldset legend="Composición Familiar">
                <div className="grid grid-cols-8 gap-2 mb-3 items-end">
                    <InputTextOneLine
                        label="Parentesco"
                        name="familiarParentesco"
                        value={form.familiarParentesco}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Apellidos y Nombres"
                        name="familiarNombres"
                        value={form.familiarNombres}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Vive? Si o No"
                        name="familiarVive"
                        value={form.familiarVive}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Fecha Nacimiento"
                        name="familiarFechaNac"
                        type="date"
                        value={form.familiarFechaNac}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Edad"
                        name="familiarEdad"
                        value={form.familiarEdad}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="DNI Part. Nac."
                        name="familiarDni"
                        value={form.familiarDni}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Grado Instruc."
                        name="familiarGrado"
                        value={form.familiarGrado}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Autogenerado :</label>
                        <div className="flex gap-2">
                            <input
                                name="familiarAutogenerado"
                                value={form.familiarAutogenerado ?? ""}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                            <button
                                type="button"
                                onClick={agregarFamiliar}
                                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded flex-shrink-0 flex items-center justify-center"
                                title="Agregar familiar"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                        </div>
                    </div>
                </div>

                {familiares.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 ">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-1">Parentesco</th>
                                    <th className="border border-gray-300 px-2 py-1">Apellidos y Nombres</th>
                                    <th className="border border-gray-300 px-2 py-1">Vive? Si o No</th>
                                    <th className="border border-gray-300 px-2 py-1">Fecha Nacimiento</th>
                                    <th className="border border-gray-300 px-2 py-1">Edad</th>
                                    <th className="border border-gray-300 px-2 py-1">DNI Part. Nac.</th>
                                    <th className="border border-gray-300 px-2 py-1">Grado Instruc.</th>
                                    <th className="border border-gray-300 px-2 py-1">Autogenerado</th>
                                    <th className="border border-gray-300 px-2 py-1">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {familiares.map((fam, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-2 py-1">{fam.parentesco}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.nombres}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.vive}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.fechaNac}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.edad}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.dni}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.grado}</td>
                                        <td className="border border-gray-300 px-2 py-1">{fam.autogenerado}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-center">
                                            <button
                                                type="button"
                                                onClick={() => eliminarFamiliar(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionFieldset>

            {/* ===== SECCIÓN: EMERGENCIA ===== */}
            <SectionFieldset legend="En Caso de Emergencia Notificar A" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Apellidos y Nombres"
                        name="emergenciaNombres"
                        value={form.emergenciaNombres}
                        onChange={handleChange}
                        labelWidth="150px"
                    />
                    <InputTextOneLine
                        label="Parentesco"
                        name="emergenciaParentesco"
                        value={form.emergenciaParentesco}
                        onChange={handleChange}
                        labelWidth="150px"
                    />
                    <InputTextOneLine
                        label="Domicilio"
                        name="emergenciaDomicilio"
                        value={form.emergenciaDomicilio}
                        onChange={handleChange}
                        labelWidth="150px"
                    />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Teléfono"
                        name="emergenciaTelefono"
                        value={form.emergenciaTelefono}
                        onChange={handleChange}
                        labelWidth="150px"
                    />
                    <InputTextOneLine
                        label="Otra Referencia"
                        name="emergenciaOtraReferencia"
                        value={form.emergenciaOtraReferencia}
                        onChange={handleChange}
                        labelWidth="150px"
                    />
                </div>
            </SectionFieldset>


            {/* ===== SECCIÓN: CONDICIONES LABORALES ===== */}
            <SectionFieldset legend="Condiciones Laborales, a cuenta de la Ctta.">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Sueldo/Jornal"
                            name="sueldoJornal"
                            value={form.sueldoJornal}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Sistema Trabajo"
                            name="sistemaTrabajo"
                            value={form.sistemaTrabajo}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="G.Sang."
                            name="grupoSanguineo"
                            value={form.grupoSanguineo}
                            disabled
                            labelWidth="100px"
                        />
                    </div>
                    <div className="space-y-3">
                        <InputsBooleanRadioGroup
                            label="Transporte Terrestre"
                            name="transporteTerrestre"
                            value={form.transporteTerrestre}
                            labelWidth="140px"
                            disabled
                        />
                        <InputsBooleanRadioGroup
                            label="Transporte Aéreo"
                            name="transporteAereo"
                            labelWidth="140px"
                            value={form.transporteAereo}
                            disabled
                        />
                        <InputsRadioGroup
                            label="Apto Altura 1.8"
                            name="apto18"
                            value={form.apto18}
                            labelWidth="140px"
                            disabled
                            options={[
                                { label: "SI", value: "SI" },
                                { label: "NO", value: "NO" },
                            ]}
                        />
                        <InputsRadioGroup
                            label="Aptitud"
                            name="aptitud"
                            value={form.aptitud}
                            labelWidth="140px"
                            disabled
                            options={[
                                { label: "APTO", value: "APTO" },
                                { label: "NO APTO", value: "NO APTO" },
                                { label: "APTO CON RESTRICCIÓN", value: "APTO CON RESTRICCIÓN" },
                            ]}
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <InputsBooleanRadioGroup
                                name="viaticos"
                                label="Viáticos"
                                value={form.viaticos}
                                labelWidth="140px"
                                disabled
                            />
                            <InputTextOneLine
                                name="viaticosValor"
                                value={form.viaticosValor}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <InputTextOneLine
                            label="Alimentación A cta. Contrata"
                            name="alimentacionContrata"
                            value={form.alimentacionContrata}
                            disabled
                            labelWidth="140px"
                        />
                    </div>
                </div>
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
