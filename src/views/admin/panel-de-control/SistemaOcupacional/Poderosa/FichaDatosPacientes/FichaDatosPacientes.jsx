import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputsBooleanRadioGroup,
    InputsRadioGroup, SectionFieldset
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaDatosPacientes";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "ficha_datos_pacientes";
const today = getToday();

export default function FichaDatosPacientes() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        norden: "",
        id: null,
        fechaIngreso: today,
        tipoTrabajador: "",

        empresa: "",
        cargo: "",

        nombres: "",
        apellidos: "",

        apellidoPaterno: "",
        apellidoMaterno: "",

        distritoNacimiento: "",
        provinciaNacimiento: "",
        departamentoNacimiento: "",
        // Datos personales
        dni: "",
        lmNo: "",
        autogenerado: "",
        estadoCivil: "",
        afpSnp: "",
        estatura: "",
        licConducirNo: "",
        cusspNo: "",
        peso: "",
        // Domicilio
        direccionDomicilio: "",
        distritoDomicilio: "",
        provinciaDomicilio: "",
        departamentoDomicilio: "",
        referenciaDomiciliaria: "",

        telefono1: "",
        telefono2: "",
        tipoVivienda: "",
        email: "",
        radioFrec: "",
        celular: "",
        numeroCuentaAhorro: "",
        banco: "",

        // Composición Familiar
        idfamiliarPadre: null, familiarPadreNombre: "-", familiarPadreVive: "-", familiarPadreFechaNac: "", familiarPadreEdad: "-", familiarPadreDni: "-", familiarPadreGrado: "-", familiarPadreAutogenerado: "-",
        idfamiliarMadre: null, familiarMadreNombre: "-", familiarMadreVive: "-", familiarMadreFechaNac: "", familiarMadreEdad: "-", familiarMadreDni: "-", familiarMadreGrado: "-", familiarMadreAutogenerado: "-",
        idfamiliarMadre: null, familiarConvivienteNombre: "-", familiarConvivienteVive: "-", familiarConvivienteFechaNac: "", familiarConvivienteEdad: "-", familiarConvivienteDni: "-", familiarConvivienteGrado: "-", familiarConvivienteAutogenerado: "-",
        idfamiliarEsposa: null, familiarEsposaNombre: "-", familiarEsposaVive: "-", familiarEsposaFechaNac: "", familiarEsposaEdad: "-", familiarEsposaDni: "-", familiarEsposaGrado: "-", familiarEsposaAutogenerado: "-",
        idfamiliarHijo1: null, familiarHijo1Nombre: "-", familiarHijo1Vive: "-", familiarHijo1FechaNac: "", familiarHijo1Edad: "-", familiarHijo1Dni: "-", familiarHijo1Grado: "-", familiarHijo1Autogenerado: "-",
        idfamiliarHijo2: null, familiarHijo2Nombre: "-", familiarHijo2Vive: "-", familiarHijo2FechaNac: "", familiarHijo2Edad: "-", familiarHijo2Dni: "-", familiarHijo2Grado: "-", familiarHijo2Autogenerado: "-",
        idfamiliarHijo3: null, familiarHijo3Nombre: "-", familiarHijo3Vive: "-", familiarHijo3FechaNac: "", familiarHijo3Edad: "-", familiarHijo3Dni: "-", familiarHijo3Grado: "-", familiarHijo3Autogenerado: "-",
        idfamiliarHijo4: null, familiarHijo4Nombre: "-", familiarHijo4Vive: "-", familiarHijo4FechaNac: "", familiarHijo4Edad: "-", familiarHijo4Dni: "-", familiarHijo4Grado: "-", familiarHijo4Autogenerado: "-",
        idfamiliarHijo5: null, familiarHijo5Nombre: "-", familiarHijo5Vive: "-", familiarHijo5FechaNac: "", familiarHijo5Edad: "-", familiarHijo5Dni: "-", familiarHijo5Grado: "-", familiarHijo5Autogenerado: "-",

        // Emergencia
        emergenciaNombres: "",
        emergenciaParentesco: "",
        emergenciaTelefono: "",
        emergenciaDomicilio: "",
        emergenciaOtraReferencia: "",

        // Instrucción Adquirida
        instruccionPrimariaCentro: "-", instruccionPrimariaInicio: "", instruccionPrimariaTermino: "", instruccionPrimariaGrado: "-",
        instruccionSecundariaCentro: "-", instruccionSecundariaInicio: "", instruccionSecundariaTermino: "", instruccionSecundariaGrado: "-",
        instruccionTecnicaCentro: "-", instruccionTecnicaInicio: "", instruccionTecnicaTermino: "", instruccionTecnicaGrado: "-",
        instruccionSuperiorCentro: "-", instruccionSuperiorInicio: "", instruccionSuperiorTermino: "", instruccionSuperiorGrado: "-",
        instruccionOtrosCentro: "-", instruccionOtrosInicio: "", instruccionOtrosTermino: "", instruccionOtrosGrado: "-",

        // Capacitación (input temporal)
        capacitacionTitulo: "",
        capacitacionCentro: "",
        capacitacionFechaInicio: "",
        capacitacionFechaTermino: "",
        capacitacionGrado: "",
        // Experiencia Laboral (input temporal)
        experienciaNombre: "",
        experienciaTelefono: "",
        experienciaCargo: "",
        experienciaFechaInicio: "",
        experienciaFechaTermino: "",
        experienciaMotivo: "",
        // Referencias Personales (input temporal)
        referenciaNombres: "",
        referenciaCentro: "",
        referenciaCargo: "",
        referenciaTelefono: "",
        referenciaDireccion: "",

        // Condiciones Laborales
        sueldoJornal: "",
        sistemaTrabajo: "",
        transporteTerrestre: "",
        transporteAereo: "",
        viaticos: "",
        viaticosValor: "",
        alimentacionContrata: "",

        //Pre-Evaluación
        grupoSanguineo: "",
        aptitudAltura18: undefined,
        aptitud: undefined,
    };

    // Estado para listas dinámicas
    const [capacitaciones, setCapacitaciones] = useState([]);
    const [experiencias, setExperiencias] = useState([]);
    const [referencias, setReferencias] = useState([]);

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
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

    // Funciones para Capacitación
    const agregarCapacitacion = () => {
        if (form.capacitacionTitulo) {
            setCapacitaciones([...capacitaciones, {
                titulo: form.capacitacionTitulo,
                centro: form.capacitacionCentro,
                fechaInicio: form.capacitacionFechaInicio,
                fechaTermino: form.capacitacionFechaTermino,
                grado: form.capacitacionGrado,
            }]);
            setForm({
                ...form,
                capacitacionTitulo: "",
                capacitacionCentro: "",
                capacitacionFechaInicio: "",
                capacitacionFechaTermino: "",
                capacitacionGrado: "",
            });
        }
    };

    const eliminarCapacitacion = (index) => {
        setCapacitaciones(capacitaciones.filter((_, i) => i !== index));
    };

    // Funciones para Experiencia Laboral
    const agregarExperiencia = () => {
        if (form.experienciaNombre) {
            setExperiencias([...experiencias, {
                nombre: form.experienciaNombre,
                telefono: form.experienciaTelefono,
                cargo: form.experienciaCargo,
                fechaInicio: form.experienciaFechaInicio,
                fechaTermino: form.experienciaFechaTermino,
                motivo: form.experienciaMotivo,
            }]);
            setForm({
                ...form,
                experienciaNombre: "",
                experienciaTelefono: "",
                experienciaCargo: "",
                experienciaFechaInicio: "",
                experienciaFechaTermino: "",
                experienciaMotivo: "",
            });
        }
    };

    const eliminarExperiencia = (index) => {
        setExperiencias(experiencias.filter((_, i) => i !== index));
    };

    // Funciones para Referencias Personales
    const agregarReferencia = () => {
        if (form.referenciaNombres) {
            setReferencias([...referencias, {
                nombres: form.referenciaNombres,
                centro: form.referenciaCentro,
                cargo: form.referenciaCargo,
                telefono: form.referenciaTelefono,
                direccion: form.referenciaDireccion,
            }]);
            setForm({
                ...form,
                referenciaNombres: "",
                referenciaCentro: "",
                referenciaCargo: "",
                referenciaTelefono: "",
                referenciaDireccion: "",
            });
        }
    };

    const eliminarReferencia = (index) => {
        setReferencias(referencias.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
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
                    onChange={handleChangeSimple}
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
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-2 py-1"></th>
                                <th className="border border-gray-300 px-2 py-1">Apellidos y Nombres</th>
                                <th className="border border-gray-300 px-2 py-1">Vive? Si o No</th>
                                <th className="border border-gray-300 px-2 py-1">Fecha Nacimiento</th>
                                <th className="border border-gray-300 px-2 py-1">Edad</th>
                                <th className="border border-gray-300 px-2 py-1">DNI</th>
                                <th className="border border-gray-300 px-2 py-1">Grado Instruc.</th>
                                <th className="border border-gray-300 px-2 py-1">Autogenerado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-2 py-1 font-semibold">Padre</td>
                                <td><InputTextOneLine name="familiarPadreNombre" value={form.familiarPadreNombre ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarPadreVive" value={form.familiarPadreVive ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="familiarPadreFechaNac" value={form.familiarPadreFechaNac ?? "-"} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="familiarPadreEdad" value={form.familiarPadreEdad ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarPadreDni" value={form.familiarPadreDni ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarPadreGrado" value={form.familiarPadreGrado ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarPadreAutogenerado" value={form.familiarPadreAutogenerado ?? "-"} onChange={handleChange} /></td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-2 py-1 font-semibold">Madre</td>
                                <td><InputTextOneLine name="familiarMadreNombre" value={form.familiarMadreNombre ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarMadreVive" value={form.familiarMadreVive ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="familiarMadreFechaNac" value={form.familiarMadreFechaNac ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="familiarMadreEdad" value={form.familiarMadreEdad ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarMadreDni" value={form.familiarMadreDni ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarMadreGrado" value={form.familiarMadreGrado ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarMadreAutogenerado" value={form.familiarMadreAutogenerado ?? "-"} onChange={handleChange} /></td>
                            </tr>

                            <tr>
                                <td className="border border-gray-300 px-2 py-1 font-semibold">Conviviente</td>
                                <td><InputTextOneLine name="familiarConvivienteNombre" value={form.familiarConvivienteNombre ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarConvivienteVive" value={form.familiarConvivienteVive ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="familiarConvivienteFechaNac" value={form.familiarConvivienteFechaNac ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="familiarConvivienteEdad" value={form.familiarConvivienteEdad ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarConvivienteDni" value={form.familiarConvivienteDni ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarConvivienteGrado" value={form.familiarConvivienteGrado ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarConvivienteAutogenerado" value={form.familiarConvivienteAutogenerado ?? "-"} onChange={handleChange} /></td>
                            </tr>

                            <tr>
                                <td className="border border-gray-300 px-2 py-1 font-semibold">Esposa</td>
                                <td><InputTextOneLine name="familiarEsposaNombre" value={form.familiarEsposaNombre ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarEsposaVive" value={form.familiarEsposaVive ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="familiarEsposaFechaNac" value={form.familiarEsposaFechaNac ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="familiarEsposaEdad" value={form.familiarEsposaEdad ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarEsposaDni" value={form.familiarEsposaDni ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarEsposaGrado" value={form.familiarEsposaGrado ?? "-"} onChange={handleChange} /></td>
                                <td><InputTextOneLine name="familiarEsposaAutogenerado" value={form.familiarEsposaAutogenerado ?? "-"} onChange={handleChange} /></td>
                            </tr>

                            {[1, 2, 3, 4, 5].map((num) => (
                                <tr key={num}>
                                    <td className="border border-gray-300 px-2 py-1 font-semibold">Hijo</td>
                                    <td><InputTextOneLine name={`familiarHijo${num}Nombre`} value={form[`familiarHijo${num}Nombre`] ?? "-"} onChange={handleChange} /></td>
                                    <td><InputTextOneLine name={`familiarHijo${num}Vive`} value={form[`familiarHijo${num}Vive`] ?? "-"} onChange={handleChange} /></td>
                                    <td><InputTextOneLine type="date" name={`familiarHijo${num}FechaNac`} value={form[`familiarHijo${num}FechaNac`] ?? ""} onChange={handleChangeSimple} /></td>
                                    <td><InputTextOneLine name={`familiarHijo${num}Edad`} value={form[`familiarHijo${num}Edad`] ?? "-"} onChange={handleChange} /></td>
                                    <td><InputTextOneLine name={`familiarHijo${num}Dni`} value={form[`familiarHijo${num}Dni`] ?? "-"} onChange={handleChange} /></td>
                                    <td><InputTextOneLine name={`familiarHijo${num}Grado`} value={form[`familiarHijo${num}Grado`] ?? "-"} onChange={handleChange} /></td>
                                    <td><InputTextOneLine name={`familiarHijo${num}Autogenerado`} value={form[`familiarHijo${num}Autogenerado`] ?? "-"} onChange={handleChange} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN EMERGENCIA ===== */}
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

            {/* ===== SECCIÓN: INSTRUCCIÓN ADQUIRIDA ===== */}
            <SectionFieldset legend="Instrucción Adquirida">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 ">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-2 py-1">Instrucción</th>
                                <th className="border border-gray-300 px-2 py-1">Centro de Estudios</th>
                                <th className="border border-gray-300 px-2 py-1">Fecha Inicio</th>
                                <th className="border border-gray-300 px-2 py-1">Fecha Termino</th>
                                <th className="border border-gray-300 px-2 py-1">Grado Obtenido</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-2 py-1">Primaria</td>
                                <td><InputTextOneLine name="instruccionPrimariaCentro" value={form.instruccionPrimariaCentro ?? ""} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="instruccionPrimariaInicio" value={form.instruccionPrimariaInicio ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine type="date" name="instruccionPrimariaTermino" value={form.instruccionPrimariaTermino ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="instruccionPrimariaGrado" value={form.instruccionPrimariaGrado ?? ""} onChange={handleChange} /></td>
                            </tr>

                            <tr>
                                <td className="border border-gray-300 px-2 py-1">Secundaria</td>
                                <td><InputTextOneLine name="instruccionSecundariaCentro" value={form.instruccionSecundariaCentro ?? ""} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="instruccionSecundariaInicio" value={form.instruccionSecundariaInicio ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine type="date" name="instruccionSecundariaTermino" value={form.instruccionSecundariaTermino ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="instruccionSecundariaGrado" value={form.instruccionSecundariaGrado ?? ""} onChange={handleChange} /></td>
                            </tr>

                            <tr>
                                <td className="border border-gray-300 px-2 py-1">Técnica</td>
                                <td><InputTextOneLine name="instruccionTecnicaCentro" value={form.instruccionTecnicaCentro ?? ""} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="instruccionTecnicaInicio" value={form.instruccionTecnicaInicio ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine type="date" name="instruccionTecnicaTermino" value={form.instruccionTecnicaTermino ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="instruccionTecnicaGrado" value={form.instruccionTecnicaGrado ?? ""} onChange={handleChange} /></td>
                            </tr>

                            <tr>
                                <td className="border border-gray-300 px-2 py-1">Superior</td>
                                <td><InputTextOneLine name="instruccionSuperiorCentro" value={form.instruccionSuperiorCentro ?? ""} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="instruccionSuperiorInicio" value={form.instruccionSuperiorInicio ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine type="date" name="instruccionSuperiorTermino" value={form.instruccionSuperiorTermino ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="instruccionSuperiorGrado" value={form.instruccionSuperiorGrado ?? ""} onChange={handleChange} /></td>
                            </tr>

                            <tr>
                                <td className="border border-gray-300 px-2 py-1">Otros</td>
                                <td><InputTextOneLine name="instruccionOtrosCentro" value={form.instruccionOtrosCentro ?? ""} onChange={handleChange} /></td>
                                <td><InputTextOneLine type="date" name="instruccionOtrosInicio" value={form.instruccionOtrosInicio ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine type="date" name="instruccionOtrosTermino" value={form.instruccionOtrosTermino ?? ""} onChange={handleChangeSimple} /></td>
                                <td><InputTextOneLine name="instruccionOtrosGrado" value={form.instruccionOtrosGrado ?? ""} onChange={handleChange} /></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: CAPACITACIÓN ===== */}
            <SectionFieldset legend="Capacitación">
                <div className="grid grid-cols-5 gap-2 mb-3 items-end">
                    <InputTextOneLine
                        label="Titulo Capacitación"
                        name="capacitacionTitulo"
                        value={form.capacitacionTitulo}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Centro de Estudios"
                        name="capacitacionCentro"
                        value={form.capacitacionCentro}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Fecha Inicio"
                        name="capacitacionFechaInicio"
                        type="date"
                        value={form.capacitacionFechaInicio}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Fecha Término"
                        name="capacitacionFechaTermino"
                        type="date"
                        value={form.capacitacionFechaTermino}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Grado Obtenido :</label>
                        <div className="flex gap-2">
                            <input
                                name="capacitacionGrado"
                                value={form.capacitacionGrado ?? ""}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                            <button
                                type="button"
                                onClick={agregarCapacitacion}
                                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded flex-shrink-0 flex items-center justify-center"
                                title="Agregar capacitación"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Tabla de capacitaciones agregadas */}
                {capacitaciones.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 ">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-1">Titulo</th>
                                    <th className="border border-gray-300 px-2 py-1">Centro de Estudios</th>
                                    <th className="border border-gray-300 px-2 py-1">Fecha Inicio</th>
                                    <th className="border border-gray-300 px-2 py-1">Fecha Término</th>
                                    <th className="border border-gray-300 px-2 py-1">Grado Obtenido</th>
                                    <th className="border border-gray-300 px-2 py-1">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capacitaciones.map((cap, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-2 py-1">{cap.titulo}</td>
                                        <td className="border border-gray-300 px-2 py-1">{cap.centro}</td>
                                        <td className="border border-gray-300 px-2 py-1">{cap.fechaInicio}</td>
                                        <td className="border border-gray-300 px-2 py-1">{cap.fechaTermino}</td>
                                        <td className="border border-gray-300 px-2 py-1">{cap.grado}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-center">
                                            <button
                                                type="button"
                                                onClick={() => eliminarCapacitacion(index)}
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

            {/* ===== SECCIÓN: EXPERIENCIA LABORAL ===== */}
            <SectionFieldset legend="Experiencia Laboral (Comenzar por último empleo)">
                <div className="grid grid-cols-6 gap-2 mb-3 items-end">
                    <InputTextOneLine
                        label="Nombre de la Empresa"
                        name="experienciaNombre"
                        value={form.experienciaNombre}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Teléfono"
                        name="experienciaTelefono"
                        value={form.experienciaTelefono}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Cargo Desempeñado"
                        name="experienciaCargo"
                        value={form.experienciaCargo}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Fecha Inicio"
                        name="experienciaFechaInicio"
                        type="date"
                        value={form.experienciaFechaInicio}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Fecha Término"
                        name="experienciaFechaTermino"
                        type="date"
                        value={form.experienciaFechaTermino}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Motivo de Salida :</label>
                        <div className="flex gap-2">
                            <input
                                name="experienciaMotivo"
                                value={form.experienciaMotivo ?? ""}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                            <button
                                type="button"
                                onClick={agregarExperiencia}
                                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded flex-shrink-0 flex items-center justify-center"
                                title="Agregar experiencia"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Tabla de experiencias agregadas */}
                {experiencias.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 ">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-1">Nombre de la Empresa</th>
                                    <th className="border border-gray-300 px-2 py-1">Teléfono</th>
                                    <th className="border border-gray-300 px-2 py-1">Cargo Desempeñado</th>
                                    <th className="border border-gray-300 px-2 py-1">Fecha Inicio</th>
                                    <th className="border border-gray-300 px-2 py-1">Fecha Término</th>
                                    <th className="border border-gray-300 px-2 py-1">Motivo de Salida</th>
                                    <th className="border border-gray-300 px-2 py-1">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experiencias.map((exp, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-2 py-1">{exp.nombre}</td>
                                        <td className="border border-gray-300 px-2 py-1">{exp.telefono}</td>
                                        <td className="border border-gray-300 px-2 py-1">{exp.cargo}</td>
                                        <td className="border border-gray-300 px-2 py-1">{exp.fechaInicio}</td>
                                        <td className="border border-gray-300 px-2 py-1">{exp.fechaTermino}</td>
                                        <td className="border border-gray-300 px-2 py-1">{exp.motivo}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-center">
                                            <button
                                                type="button"
                                                onClick={() => eliminarExperiencia(index)}
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

            {/* ===== SECCIÓN: REFERENCIAS PERSONALES ===== */}
            <SectionFieldset legend="Referencias Personales">
                <div className="grid grid-cols-5 gap-2 mb-3 items-end">
                    <InputTextOneLine
                        label="Apellidos y Nombres"
                        name="referenciaNombres"
                        value={form.referenciaNombres}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Centro de Trabajo"
                        name="referenciaCentro"
                        value={form.referenciaCentro}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Cargo"
                        name="referenciaCargo"
                        value={form.referenciaCargo}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <InputTextOneLine
                        label="Telefono"
                        name="referenciaTelefono"
                        value={form.referenciaTelefono}
                        onChange={handleChange}
                        labelOnTop
                    />
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Dirección :</label>
                        <div className="flex gap-2">
                            <input
                                name="referenciaDireccion"
                                value={form.referenciaDireccion ?? ""}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                            <button
                                type="button"
                                onClick={agregarReferencia}
                                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded flex-shrink-0 flex items-center justify-center"
                                title="Agregar referencia"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Tabla de referencias agregadas */}
                {referencias.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 ">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-1">Apellidos y Nombres</th>
                                    <th className="border border-gray-300 px-2 py-1">Centro de Trabajo</th>
                                    <th className="border border-gray-300 px-2 py-1">Cargo</th>
                                    <th className="border border-gray-300 px-2 py-1">Telefono</th>
                                    <th className="border border-gray-300 px-2 py-1">Dirección</th>
                                    <th className="border border-gray-300 px-2 py-1">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referencias.map((ref, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-2 py-1">{ref.nombres}</td>
                                        <td className="border border-gray-300 px-2 py-1">{ref.centro}</td>
                                        <td className="border border-gray-300 px-2 py-1">{ref.cargo}</td>
                                        <td className="border border-gray-300 px-2 py-1">{ref.telefono}</td>
                                        <td className="border border-gray-300 px-2 py-1">{ref.direccion}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-center">
                                            <button
                                                type="button"
                                                onClick={() => eliminarReferencia(index)}
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

            {/* ===== SECCIÓN: CONDICIONES LABORALES ===== */}
            <SectionFieldset legend="Condiciones Laborales, a cuenta de la Ctta.">
                <div className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
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

                    </div>
                    <div className="space-y-3">
                        <InputsRadioGroup
                            label="Transporte Terrestre"
                            name="transporteTerrestre"
                            value={form.transporteTerrestre}
                            labelWidth="100px"
                            disabled
                            options={[{ value: "SI", label: "SI" }, { value: "NO", label: "NO" }]}
                        />
                        <InputsRadioGroup
                            label="Transporte Aéreo"
                            name="transporteAereo"
                            value={form.transporteAereo}
                            disabled
                            options={[{ value: "SI", label: "SI" }, { value: "NO", label: "NO" }]}
                            labelWidth="100px"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-x-4">
                            <InputsRadioGroup
                                label="Viáticos"
                                name="viaticos"
                                value={form.viaticos}
                                disabled
                                labelWidth="100px"
                                options={[{ value: "SI", label: "SI" }, { value: "NO", label: "NO" }]}
                            />
                            <InputTextOneLine
                                name="viaticosValor"
                                value={form.viaticosValor ?? ""}
                                className="w-full"
                                disabled
                            />
                        </div>
                        <InputTextOneLine
                            label="Alimentación A cta. Contrata"
                            name="alimentacionContrata"
                            value={form.alimentacionContrata}
                            disabled
                            labelWidth="100px"
                        />
                    </div>
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Pre-Evaluación" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Grupo Sanguíneo"
                    name="grupoSanguineo"
                    value={form.grupoSanguineo}
                    disabled
                    labelWidth="100px"
                />
                <InputsBooleanRadioGroup
                    label="Aptitud Altura 1.8"
                    name="aptitudAltura18"
                    value={form.aptitudAltura18}
                    trueLabel="Apto"
                    falseLabel="No Apto"
                    disabled
                    labelWidth="120px"
                />
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    name="aptitud"
                    value={form.aptitud}
                    trueLabel="Apto"
                    falseLabel="No Apto"
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* BOTONES DE ACCIÓN */}
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