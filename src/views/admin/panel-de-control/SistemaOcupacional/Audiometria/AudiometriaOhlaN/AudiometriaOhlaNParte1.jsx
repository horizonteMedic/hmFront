import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import {
  getInfoTabla,
  Loading,
  GetInfoServicio,
  GetInfoServicioFicha,
  PrintHojaR,
} from "../AudiometriaOhla/controllerAudiometriaOhla";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import CIE10List from "../../../../../components/reusableComponents/CIE10List";

const tabla = "audiometria_po";
const frecuencias = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];

export default function AudiometriaOhlaNParte1({
  token,
  selectedSede,
  form,
  setForm,
  setFormFicha,
  handleClearFicha,
  handleClear,
  dataTabla,
  setDataTabla,
}) {
  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleCheckBox = (name) => {
    setForm((f) => ({
      ...f,
      [name]: !f[name],
    }));
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const getNextArrayItem = (pre = "", current, post = "", array, next = "") => {
    const index = array.indexOf(current);
    if (index === -1 || index === array.length - 1) {
      return next;
    }
    return `${pre}${array[index + 1]}${post}`;
  };

  const realizarCalculoDiagnostico = (prom, prom1, cont, cont1) => {
    let textoDiagnostico = "";
    if (prom >= -10 && prom <= 25) {
      if (prom1 > 90) {
        if (cont1 == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO IZQUIERDO";
        }
      } else if (prom1 > 70 && prom1 <= 90) {
        if (cont1 == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 > 55 && prom1 <= 70) {
        if (cont1 == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 > 40 && prom1 <= 55) {
        if (cont1 == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO IZQUIERDO";
        }
      } else if (prom1 > 25 && prom1 <= 40) {
        textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO IZQUIERDO";
      } else if (prom1 >= -10 && prom1 <= 25) {
        textoDiagnostico = "NORMAL";
      }
    } else if (prom >= 26 && prom <= 40) {
      if (prom1 >= 90) {
        if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 71 && prom1 <= 90) {
        if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 56 && prom1 <= 70) {
        if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 41 && prom1 <= 55) {
        if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 26 && prom1 <= 40) {
        textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL BILATERAL LEVE";
      } else if (prom1 >= -10 && prom1 <= 25) {
        textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO";
      }
    } else if (prom >= 41 && prom <= 55) {
      if (prom1 >= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO ";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 71 && prom1 <= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 56 && prom1 <= 70) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO MODERADA Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 41 && prom1 <= 55) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL BILATERAL MODERADA";
        }
      } else if (prom1 >= 26 && prom1 <= 40) {
        if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        }
      } else if (prom1 >= -10 && prom1 <= 25) {
        if (cont == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA OIDO DERECHO";
        }
      }
    } else if (prom >= 56 && prom <= 70) {
      if (prom1 >= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 71 && prom1 <= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 56 && prom1 <= 70) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL BILATERAL MODERADA-SEVERA";
        }
      } else if (prom1 >= 41 && prom1 <= 55) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 26 && prom1 <= 40) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        }
      } else if (prom1 >= -10 && prom1 <= 25) {
        if (cont == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL MODERADA-SEVERA OIDO DERECHO";
        }
      }
    } else if (prom >= 71 && prom <= 90) {
      if (prom1 >= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 71 && prom1 <= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL BILATERAL SEVERA";
        }
      } else if (prom1 >= 56 && prom1 <= 70) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 41 && prom1 <= 55) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 26 && prom1 <= 40) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        }
      } else if (prom1 >= -10 && prom1 <= 25) {
        if (cont == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO";
        } else {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL SEVERA OIDO DERECHO";
        }
      }
    } else if (prom >= 90) {
      if (prom1 >= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y PROFUNDA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL BILATERAL PROFUNDA";
        }
      } else if (prom1 >= 71 && prom1 <= 90) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 56 && prom1 <= 70) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y MODERADA-SEVERA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 41 && prom1 <= 55) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        } else if (cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        }
      } else if (prom1 >= 26 && prom1 <= 40) {
        if (cont == 1 && cont1 == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y OIDO IZQUIERDO";
        } else if (cont == 1) {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO Y MODERADA OIDO IZQUIERDO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO Y LEVE OIDO IZQUIERDO";
        }
      } else if (prom1 >= -10 && prom1 <= 25) {
        if (cont == 1) {
          textoDiagnostico = "- HIPOACUSIA NEUROSENSORIAL LEVE OIDO DERECHO";
        } else {
          textoDiagnostico =
            "- HIPOACUSIA NEUROSENSORIAL PROFUNDA OIDO DERECHO";
        }
      }
    }
    return textoDiagnostico;
  };

  const calcularPerdidaGlobal = () => {
    const toNumber = (v) => parseFloat(v) || 0;

    let {
      od_500,
      od_1000,
      od_2000,
      od_4000,
      oi_500,
      oi_1000,
      oi_2000,
      oi_4000,
    } = form;

    let od500 = toNumber(od_500),
      od1000 = toNumber(od_1000),
      od2000 = toNumber(od_2000),
      od4000 = toNumber(od_4000),
      oi500 = toNumber(oi_500),
      oi1000 = toNumber(oi_1000),
      oi2000 = toNumber(oi_2000),
      oi4000 = toNumber(oi_4000);

    let cod500 = 0,
      coi500 = 0,
      cod1000 = 0,
      coi1000 = 0,
      cod2000 = 0,
      coi2000 = 0,
      cod4000 = 0,
      coi4000 = 0;

    if (od500 == 10) cod500 = 20;
    if (od500 == 15) cod500 = 50;
    if (od500 == 20) cod500 = 110;
    if (od500 == 25) cod500 = 180;
    if (od500 == 30) cod500 = 260;
    if (od500 == 35) cod500 = 370;
    if (od500 == 40) cod500 = 490;
    if (od500 == 45) cod500 = 630;
    if (od500 == 50) cod500 = 790;
    if (od500 == 55) cod500 = 960;
    if (od500 == 60) cod500 = 1130;
    if (od500 == 65) cod500 = 1280;
    if (od500 == 70) cod500 = 1380;
    if (od500 == 75) cod500 = 1460;
    if (od500 == 80) cod500 = 1480;
    if (od500 == 85) cod500 = 1490;
    if (od500 == 90 || od500 == 95) cod500 = 1500;
    if (oi500 == 10) coi500 = 20;
    if (oi500 == 15) coi500 = 50;
    if (oi500 == 20) coi500 = 110;
    if (oi500 == 25) coi500 = 180;
    if (oi500 == 30) coi500 = 260;
    if (oi500 == 35) coi500 = 370;
    if (oi500 == 40) coi500 = 490;
    if (oi500 == 45) coi500 = 630;
    if (oi500 == 50) coi500 = 790;
    if (oi500 == 55) coi500 = 960;
    if (oi500 == 60) coi500 = 1130;
    if (oi500 == 65) coi500 = 1280;
    if (oi500 == 70) coi500 = 1380;
    if (oi500 == 75) coi500 = 1460;
    if (oi500 == 80) coi500 = 1480;
    if (oi500 == 85) coi500 = 1490;
    if (oi500 == 90 || od500 == 95) coi500 = 1500;
    if (od1000 == 10) cod1000 = 30;
    if (od1000 == 15) cod1000 = 90;
    if (od1000 == 20) cod1000 = 210;
    if (od1000 == 25) cod1000 = 360;
    if (od1000 == 30) cod1000 = 540;
    if (od1000 == 35) cod1000 = 770;
    if (od1000 == 40) cod1000 = 1020;
    if (od1000 == 45) cod1000 = 1300;
    if (od1000 == 50) cod1000 = 1570;
    if (od1000 == 55) cod1000 = 1900;
    if (od1000 == 60) cod1000 = 2150;
    if (od1000 == 65) cod1000 = 2350;
    if (od1000 == 70) cod1000 = 2550;
    if (od1000 == 75) cod1000 = 2720;
    if (od1000 == 80) cod1000 = 2880;
    if (od1000 == 85) cod1000 = 2980;
    if (od1000 == 90) cod1000 = 2990;
    if (od1000 == 95) cod1000 = 3000;
    if (oi1000 == 10) coi1000 = 30;
    if (oi1000 == 15) coi1000 = 90;
    if (oi1000 == 20) coi1000 = 210;
    if (oi1000 == 25) coi1000 = 360;
    if (oi1000 == 30) coi1000 = 540;
    if (oi1000 == 35) coi1000 = 770;
    if (oi1000 == 40) coi1000 = 1020;
    if (oi1000 == 45) coi1000 = 1300;
    if (oi1000 == 50) coi1000 = 1570;
    if (oi1000 == 55) coi1000 = 1900;
    if (oi1000 == 60) coi1000 = 2150;
    if (oi1000 == 65) coi1000 = 2350;
    if (oi1000 == 70) coi1000 = 2550;
    if (oi1000 == 75) coi1000 = 2720;
    if (oi1000 == 80) coi1000 = 2880;
    if (oi1000 == 85) coi1000 = 2980;
    if (oi1000 == 90) coi1000 = 2990;
    if (oi1000 == 95) coi1000 = 3000;
    if (od2000 == 10) cod2000 = 40;
    if (od2000 == 15) cod2000 = 130;
    if (od2000 == 20) cod2000 = 290;
    if (od2000 == 25) cod2000 = 490;
    if (od2000 == 30) cod2000 = 730;
    if (od2000 == 35) cod2000 = 980;
    if (od2000 == 40) cod2000 = 1290;
    if (od2000 == 45) cod2000 = 1730;
    if (od2000 == 50) cod2000 = 2240;
    if (od2000 == 55) cod2000 = 2570;
    if (od2000 == 60) cod2000 = 2800;
    if (od2000 == 65) cod2000 = 3020;
    if (od2000 == 70) cod2000 = 3220;
    if (od2000 == 75) cod2000 = 3400;
    if (od2000 == 80) cod2000 = 3580;
    if (od2000 == 85) cod2000 = 3750;
    if (od2000 == 90) cod2000 = 3920;
    if (od2000 == 95) cod2000 = 4000;
    if (oi2000 == 10) coi2000 = 40;
    if (oi2000 == 15) coi2000 = 130;
    if (oi2000 == 20) coi2000 = 290;
    if (oi2000 == 25) coi2000 = 490;
    if (oi2000 == 30) coi2000 = 730;
    if (oi2000 == 35) coi2000 = 980;
    if (oi2000 == 40) coi2000 = 1290;
    if (oi2000 == 45) coi2000 = 1730;
    if (oi2000 == 50) coi2000 = 2240;
    if (oi2000 == 55) coi2000 = 2570;
    if (oi2000 == 60) coi2000 = 2800;
    if (oi2000 == 65) coi2000 = 3020;
    if (oi2000 == 70) coi2000 = 3220;
    if (oi2000 == 75) coi2000 = 3400;
    if (oi2000 == 80) coi2000 = 3580;
    if (oi2000 == 85) coi2000 = 3750;
    if (oi2000 == 90) coi2000 = 3920;
    if (oi2000 == 95) coi2000 = 4000;
    if (od4000 == 10) cod4000 = 10;
    if (od4000 == 15) cod4000 = 30;
    if (od4000 == 20) cod4000 = 90;
    if (od4000 == 25) cod4000 = 170;
    if (od4000 == 30) cod4000 = 270;
    if (od4000 == 35) cod4000 = 380;
    if (od4000 == 40) cod4000 = 500;
    if (od4000 == 45) cod4000 = 640;
    if (od4000 == 50) cod4000 = 800;
    if (od4000 == 55) cod4000 = 970;
    if (od4000 == 60) cod4000 = 1120;
    if (od4000 == 65) cod4000 = 1250;
    if (od4000 == 70) cod4000 = 1350;
    if (od4000 == 75) cod4000 = 1420;
    if (od4000 == 80) cod4000 = 1460;
    if (od4000 == 85) cod4000 = 1480;
    if (od4000 == 90) cod4000 = 1490;
    if (od4000 == 95) cod4000 = 1500;
    if (oi4000 == 10) coi4000 = 10;
    if (oi4000 == 15) coi4000 = 30;
    if (oi4000 == 20) coi4000 = 90;
    if (oi4000 == 25) coi4000 = 170;
    if (oi4000 == 30) coi4000 = 270;
    if (oi4000 == 35) coi4000 = 380;
    if (oi4000 == 40) coi4000 = 500;
    if (oi4000 == 45) coi4000 = 640;
    if (oi4000 == 50) coi4000 = 800;
    if (oi4000 == 55) coi4000 = 970;
    if (oi4000 == 60) coi4000 = 1120;
    if (oi4000 == 65) coi4000 = 1250;
    if (oi4000 == 70) coi4000 = 1350;
    if (oi4000 == 75) coi4000 = 1420;
    if (oi4000 == 80) coi4000 = 1460;
    if (oi4000 == 85) coi4000 = 1480;
    if (oi4000 == 90) coi4000 = 1490;
    if (oi4000 == 95) coi4000 = 1500;

    let may = 0,
      may1 = 0,
      men = 0,
      men1 = 0,
      pe = 0,
      mo = 0,
      res = 0;
    if (cod500 >= cod1000 && cod500 >= cod2000 && cod500 >= cod4000) {
      may = cod500;
    } else if (cod1000 >= cod500 && cod1000 >= cod2000 && cod1000 >= cod4000) {
      may = cod1000;
    } else if (cod2000 >= cod500 && cod2000 >= cod1000 && cod2000 >= cod4000) {
      may = cod2000;
    } else if (cod4000 >= cod500 && cod4000 >= cod1000 && cod4000 >= cod2000) {
      may = cod4000;
    }
    if (cod500 <= cod1000 && cod500 <= cod2000 && cod500 <= cod4000) {
      men = cod500;
    } else if (cod1000 <= cod500 && cod1000 <= cod2000 && cod1000 <= cod4000) {
      men = cod1000;
    } else if (cod2000 <= cod500 && cod2000 <= cod1000 && cod2000 <= cod4000) {
      men = cod2000;
    } else if (cod4000 <= cod500 && cod4000 <= cod1000 && cod4000 <= cod2000) {
      men = cod4000;
    }
    if (coi500 >= oi1000 && coi500 >= oi2000 && coi500 >= oi4000) {
      may1 = coi500;
    } else if (coi1000 >= coi500 && coi1000 >= coi2000 && coi1000 >= coi4000) {
      may1 = coi1000;
    } else if (coi2000 >= coi500 && coi2000 >= oi1000 && coi2000 >= coi4000) {
      may1 = coi2000;
    } else if (coi4000 >= coi500 && coi4000 >= oi1000 && coi4000 >= oi2000) {
      may1 = coi4000;
    }
    if (coi500 <= oi1000 && coi500 <= oi2000 && coi500 <= oi4000) {
      men1 = coi500;
    } else if (coi1000 <= coi500 && coi1000 <= coi2000 && coi1000 <= coi4000) {
      men1 = coi1000;
    } else if (coi2000 <= coi500 && coi2000 <= oi1000 && coi2000 <= coi4000) {
      men1 = coi2000;
    } else if (coi4000 <= coi500 && coi4000 <= oi1000 && coi4000 <= oi2000) {
      men1 = coi4000;
    }
    if (may > may1) {
      mo = may * 5;
    } else if (may1 > may) {
      mo = may1 * 5;
    } else mo = may * 5;

    if (men < men1) {
      pe = men * 1;
    } else if (men1 < men) {
      pe = men1 * 1;
    } else pe = men * 1;
    res = (mo + pe) / 600;

    return res;
  };

  const calcularOidos = () => {
    const odValues = [
      form.od_500,
      form.od_1000,
      form.od_2000,
      form.od_3000,
      form.od_4000,
      form.od_6000,
      form.od_8000,
    ]
      .map((v) => parseFloat(v) || 0)
      .filter((v) => v >= 25);

    let odPromedio = Math.round((
      odValues.reduce((acc, val) => acc + val, 0) /
      (odValues.length === 0 ? 1 : odValues.length)
    ).toFixed(2));

    const oiValues = [
      form.oi_500,
      form.oi_1000,
      form.oi_2000,
      form.oi_3000,
      form.oi_4000,
      form.oi_6000,
      form.oi_8000,
    ]
      .map((v) => parseFloat(v) || 0)
      .filter((v) => v > 25);

    let oiPromedio = Math.round((
      oiValues.reduce((acc, val) => acc + val, 0) /
      (oiValues.length === 0 ? 1 : oiValues.length)
    ).toFixed(2));

    const diagnosticoGenerado = realizarCalculoDiagnostico(
      odPromedio,
      oiPromedio,
      odValues.length,
      oiValues.length
    );

    setForm((prev) => ({
      ...prev,
      diagnostico: diagnosticoGenerado,
      diagnosticoCie10: diagnosticoGenerado ? diagnosticoGenerado.includes("HIPOACUSIA") ? "CIE 10: H90.5 - HIPOACUSIA NEUROSENSORIAL, SIN OTRA ESPECIFICACIÓN" : "" : "",
      perdida_global: calcularPerdidaGlobal(),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_3fr] gap-6 items-stretch">
      {/* Lado izquierdo: audiometría aérea/ósea */}
      <div className="space-y-4">
        <div className="flex flex-wrap justify-end gap-4 pr-2">
          <InputCheckbox
            label="No Paso Examen"
            name="no_paso_Examen"
            checked={form.no_paso_Examen}
            onChange={() => {
              setForm((prevForm) => {
                const newValue = !prevForm.no_paso_Examen;
                return {
                  ...prevForm,
                  no_paso_Examen: newValue,
                  od_500: newValue ? "N/A" : "",
                  od_1000: newValue ? "N/A" : "",
                  od_2000: newValue ? "N/A" : "",
                  od_3000: newValue ? "N/A" : "",
                  od_4000: newValue ? "N/A" : "",
                  od_6000: newValue ? "N/A" : "",
                  od_8000: newValue ? "N/A" : "",

                  oi_500: newValue ? "N/A" : "",
                  oi_1000: newValue ? "N/A" : "",
                  oi_2000: newValue ? "N/A" : "",
                  oi_3000: newValue ? "N/A" : "",
                  oi_4000: newValue ? "N/A" : "",
                  oi_6000: newValue ? "N/A" : "",
                  oi_8000: newValue ? "N/A" : "",
                  diagnostico: newValue ? "NO SE REALIZO AUDIOMETRIA" : "",
                };
              });
            }}
          />
          <InputCheckbox
            label="Activar Gráfico"
            name="activar_grafico"
            checked={form.activar_grafico}
            onChange={() => toggleCheckBox("activar_grafico")}
          />
        </div>

        {/* Audiometría Aérea */}
        <SectionFieldset legend="Audiometría Aérea" className="space-y-3">
          <SectionFieldset legend="Oído Derecho" className="grid grid-cols-8 gap-1 text-center font-semibold">
            <div className="flex flex-col items-start gap-2">
              <p>hz</p>
              <p>dB (A)</p>
            </div>
            {frecuencias.map((hz) => (
              <div key={hz}>
                <p>{hz}</p>
                <InputTextOneLine
                  name={`od_${hz}`}
                  value={form[`od_${hz}`]}
                  onChange={handleChangeNumber}
                  inputClassName="text-center"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      document
                        .getElementsByName(
                          `${getNextArrayItem("od_", hz, "", frecuencias, "oi_500")}`
                        )?.[0]
                        ?.focus();
                    }
                  }}
                />
              </div>
            ))}
          </SectionFieldset>

          <SectionFieldset legend="Oído Izquierdo" className="grid grid-cols-8 gap-1 text-center font-semibold">
            <div className="flex flex-col items-start gap-2">
              <p>hz</p>
              <p>dB (A)</p>
            </div>
            {frecuencias.map((hz) => (
              <div key={hz}>
                <p>{hz}</p>
                <InputTextOneLine
                  name={`oi_${hz}`}
                  value={form[`oi_${hz}`]}
                  onChange={handleChangeNumber}
                  inputClassName="text-center"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (hz === "8000") {
                        calcularOidos();
                        return;
                      }
                      document
                        .getElementsByName(
                          `${getNextArrayItem("oi_", hz, "", frecuencias, "")}`
                        )?.[0]
                        ?.focus();
                    }
                  }}
                />
              </div>
            ))}
          </SectionFieldset>
        </SectionFieldset>

        {/* Audiometría Ósea */}
        <SectionFieldset
          legend="Audiometría Ósea"
          className="space-y-3"
        >
          <div className="flex justify-end">
            <InputCheckbox
              label="Llenar"
              name="llenar_osea"
              checked={form.llenar_osea}
              onChange={(e) => {
                setForm((prevForm) => {
                  const newValue = !prevForm.llenar_osea;
                  return {
                    ...prevForm,
                    llenar_osea: newValue,

                    od_o_500: newValue ? "-" : "",
                    od_o_1000: newValue ? "-" : "",
                    od_o_2000: newValue ? "-" : "",
                    od_o_3000: newValue ? "-" : "",
                    od_o_4000: newValue ? "-" : "",
                    od_o_6000: newValue ? "-" : "",
                    od_o_8000: newValue ? "-" : "",

                    oi_o_500: newValue ? "-" : "",
                    oi_o_1000: newValue ? "-" : "",
                    oi_o_2000: newValue ? "-" : "",
                    oi_o_3000: newValue ? "-" : "",
                    oi_o_4000: newValue ? "-" : "",
                    oi_o_6000: newValue ? "-" : "",
                    oi_o_8000: newValue ? "-" : "",
                  };
                });
              }}
            />
          </div>
          <SectionFieldset legend="Oído Derecho" className="grid grid-cols-8 gap-1 text-center font-semibold">
            <div className="flex flex-col items-start gap-2">
              <p>hz</p>
              <p>dB (A)</p>
            </div>
            {frecuencias.map((hz) => (
              <div key={`od_o_${hz}`}>
                <p>{hz}</p>
                <InputTextOneLine
                  name={`od_o_${hz}`}
                  value={form[`od_o_${hz}`]}
                  onChange={handleChangeNumber}
                  inputClassName="text-center"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      document
                        .getElementsByName(
                          `${getNextArrayItem("od_o_", hz, "", frecuencias, "oi_o_500")}`
                        )?.[0]
                        ?.focus();
                    }
                  }}
                />
              </div>
            ))}
          </SectionFieldset>
          <SectionFieldset legend="Oído Izquierdo" className="grid grid-cols-8 gap-1 text-center font-semibold">
            <div className="flex flex-col items-start gap-2">
              <p>hz</p>
              <p>dB (A)</p>
            </div>
            {frecuencias.map((hz) => (
              <div key={`oi_o_${hz}`}>
                <p>{hz}</p>
                <InputTextOneLine
                  name={`oi_o_${hz}`}
                  value={form[`oi_o_${hz}`]}
                  onChange={handleChangeNumber}
                  inputClassName="text-center"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      document
                        .getElementsByName(
                          `${getNextArrayItem("oi_o_", hz, "", frecuencias, "")}`
                        )?.[0]
                        ?.focus();
                    }
                  }}
                />
              </div>
            ))}
          </SectionFieldset>
        </SectionFieldset>

        <div className="flex justify-end pr-2">
          <InputCheckbox
            label="Asignar Especialista"
            name="asignar_especialista"
            checked={form.asignar_especialista}
            onChange={() => toggleCheckBox("asignar_especialista")}
          />
        </div>

        <SectionFieldset legend="Diagnóstico" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <InputTextOneLine
              label="% pérdida global"
              name="perdida_global"
              value={form.perdida_global}
              disabled
              labelWidth="140px"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => calcularOidos()}
              className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2 shrink-0"
            >
              <FontAwesomeIcon icon={faStethoscope} /> Diagnosticar
            </button>
          </div>

          <InputTextArea
            label="Diagnóstico"
            name="diagnostico"
            value={form.diagnostico}
            onChange={handleChange}
            rows={3}
          />

          <div className="bg-green-200 p-3 rounded-xl">
            <CIE10List
              value={form.diagnosticoCie10}
              fieldName="diagnosticoCie10"
              label="Diagnóstico CIE10"
              token={token}
              setForm={setForm}
            />
          </div>
        </SectionFieldset>
      </div>

      {/* Lado derecho: búsqueda de registros (misma altura que el lado izquierdo) */}
      <div className="flex flex-col gap-4 min-h-0">
        <SectionFieldset legend="Buscar Registros" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputTextOneLine
            label="Nombres"
            name="nombres_search"
            value={form.nombres_search}
            onKeyUp={(e) => {
              if (e.key === "Enter") obtenerInfoTabla();
            }}
            onChange={(e) => {
              const { name, value } = e.target;
              setForm((f) => ({ ...f, [name]: value, codigo_search: "" }));
            }}
            labelWidth="90px"
          />
          <InputTextOneLine
            label="Código"
            name="codigo_search"
            value={form.codigo_search}
            onKeyUp={(e) => {
              if (e.key === "Enter") obtenerInfoTabla();
            }}
            onChange={(e) => {
              const { name, value } = e.target;
              setForm((f) => ({ ...f, [name]: value, nombres_search: "" }));
            }}
            labelWidth="90px"
          />
        </SectionFieldset>

        <SectionFieldset
          legend="Registros"
          fieldsetClassName="flex-1  flex flex-col"
          className="flex-1 max-h-[700px] flex flex-col"
        >
          <Table
            data={dataTabla}
            tabla={tabla}
            set={setForm}
            token={token}
            clean={handleClear}
            setFicha={setFormFicha}
            cleanFicha={handleClearFicha}
            mostrarGrafico={form.activar_grafico}
            firmaExtra={form.asignar_especialista}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}

function Table({
  data,
  tabla,
  set,
  token,
  clean,
  setFicha,
  cleanFicha,
  mostrarGrafico,
  firmaExtra,
}) {
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: "Confirmar impresión",
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla, mostrarGrafico, firmaExtra);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading("Importando Datos");
    GetInfoServicio(nro, tabla, set, token);
    cleanFicha();
    GetInfoServicioFicha(nro, "ficha_audiologica", setFicha, token, () => {});
  }

  return (
    <div className="overflow-y-auto flex-1 min-h-[300px] ">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left text-base">Cod.</th>
            <th className="border px-2 py-1 text-left text-base">N° Orden</th>
            <th className="border px-2 py-1 text-left text-base">Nombres</th>
            <th className="border px-2 py-1 text-left text-base">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-[#233245] hover:text-white cursor-pointer text-base"
                onClick={() => clicktable(row.norden)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handlePrintConfirm(row.norden);
                }}
              >
                <td className="border px-2 py-1 font-bold">{row.codAu}</td>
                <td className="border px-2 py-1">{row.norden}</td>
                <td className="border px-2 py-1">{row.nombres}</td>
                <td className="border px-2 py-1">{row.fechaAu}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500 text-base">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
