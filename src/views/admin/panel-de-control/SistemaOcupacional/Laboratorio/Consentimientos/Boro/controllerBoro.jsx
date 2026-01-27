import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch';
import { SubmitInfoLaboratioExBoro } from '../Controller/model';
import { GetInfoPacDefault, LoadingDefault, VerifyTRDefault } from '../../../../../../utils/functionUtils';

const tabla = 'consent_Boro';

export const VerifyTR = async (nro, token, setForm, selectedSede) => {
  await VerifyTRDefault(
    nro,
    tabla,
    token,
    setForm,
    selectedSede,
    async () => {
      const res = await GetInfoPacDefault(nro, token, selectedSede);
      if (res) {
        setForm(prev => ({
          ...prev,
          ...res,
          nombres: res.nombresApellidos || '',
        }));
      }
    },
    async () => {
      await GetInfoServicio(nro, token, setForm);
    }
  );
};

export const GetInfoServicio = async (nro, token, setForm) => {
  LoadingDefault('Obteniendo datos');
  try {
    const res = await getFetch(
      `/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${nro}&nameConset=${tabla}`,
      token
    );
    if (res.norden) {
      Swal.fire(
        "Alerta",
        "Este paciente ya cuenta con registros de Consentimiento Boro",
        "warning"
      );
      setForm(prev => ({
        ...prev,
        ...res,
        enfermedad: { key: res.antBoroAlgunaEnfermedad, cual: res.critCualAlgunaEnfermedad ? res.critCualAlgunaEnfermedad : '' },
        medicamento: { key: res.antBoroAlgunMedicamento, cual: res.critCualAlgunMedicamento ? res.critCualAlgunMedicamento : '' },
        matecoca: { key: res.antBoroConsumenMateCoca, fecha: res.critFechaConsumoMateCoca },
        chaccha: { key: res.masticaHojaCoca, fecha: res.fechaConsumoHojaCoca },
        tratamiento: {
          key: res.antBoroTratQuirugODental, cual: res.critCualTratQuirugODental ? res.critCualTratQuirugODental : '',
          cuando: res.critCuandoTratQuirugODental ? res.critCuandoTratQuirugODental : '', donde: res.critDondeTratQuirugODental ? res.critDondeTratQuirugODental : ''
        },
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
      }));
    } else {
      Swal.fire('Error', 'Ocurrio un error al traer los datos', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Ocurrio un error al traer los datos', 'error');
  } finally {
    Swal.close();
  }
};

export const SubmitDataService = async (form, token, userlogued, limpiar) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos', 'error');
    return;
  }
  LoadingDefault('Registrando Datos');
  try {
    const res = await SubmitInfoLaboratioExBoro(form, token, userlogued);
    if (res.norden) {
      Swal.fire({
        title: 'Exito',
        text: `Se completo el Registro Correctamente,\n¿Desea imprimir?`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        limpiar();
        if (result.isConfirmed) {
          PrintHojaR(form, token);
        }
      });
    } else {
      Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
  }
};

export const PrintHojaR = async (form, token) => {
  LoadingDefault('Cargando Formato a Imprimir');
  try {
    const res = await getFetch(
      `/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${form.norden}&nameConset=${tabla}`,
      token
    );
    if (res.norden) {
      const nombre = res.nameJasper;
      const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
      const modulo = await jasperModules[`../../../../../../jaspers/Consentimientos/${nombre}.jsx`]();
      if (typeof modulo.default === 'function') {
        modulo.default(res);
      } else {
        console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
      }
    }
  } catch (error) {
    console.error("Error al obtener el consentimiento:", error);
    Swal.fire({
      icon: "error",
      title: "N° Orden no existente",
      text: "Por favor, ingrese un N° Orden válido.",
    });
  } finally {
    Swal.close();
  }
};

