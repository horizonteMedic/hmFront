import Swal from "sweetalert2"

export const Convert = async (event,triaje,set,s) => {
    if (!triaje.talla) {
        return
    }
    
    if (event.key === 'Enter') {
        if (triaje.talla < 130 || triaje.talla > 280) {
            set(d => ({ ...d, talla: '' }))
            await s.fire('Error','No se permite este dato','error')
            return
        }
        const Triajeconvert = triaje.talla / 100;
        set(d => ({ ...d, talla: Triajeconvert.toFixed(2) }))
        document.getElementById('peso')?.focus();
    }
}

export const GetIMC = async (event,triaje,set,s) => {
    if (!triaje.talla || !triaje.peso) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.peso < 40 || triaje.peso > 150) {
            set(d => ({ ...d, peso: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const IMC = triaje.peso / (triaje.talla * triaje.talla);
        set(d => ({ ...d, imc: IMC.toFixed(2) }))
        document.getElementById('cintura')?.focus();
    }
}

export const GetCintura = async (event,triaje,set,s) => {
    if (!triaje.cintura || !triaje.imc) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.cintura < 45 || triaje.cintura > 180) {
            set(d => ({ ...d, cintura: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const imc = triaje.imc
        if (imc < 18.5) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE MASA CORPORAL: BAJO DE PESO.'+"\n" }))
        } else if (imc >= 18.5 && imc < 25) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE MASA CORPORAL: NORMAL.'+"\n" }))
        } else if (imc >= 25 && imc < 30) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE MASA CORPORAL: SOBREPESO.'+"\n" }))
        } else if (imc >= 30 && imc < 35) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE MASA CORPORAL: OBESIDAD I.'+"\n" }))
        } else if (imc >= 35 && imc < 40) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE MASA CORPORAL: OBESIDAD II.'+"\n" }))
        } else {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE MASA CORPORAL: OBESIDAD III.'+"\n" }))
        }
        document.getElementById('cadera')?.focus();
    }
}

export const GetICC = async (event,triaje,set) => {
    if (!triaje.cintura || !triaje.cadera) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.cadera < 70 || triaje.cadera > 180) {
            set(d => ({ ...d, cadera: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const icc = triaje.cintura / triaje.cadera
        set(d => ({...d, icc: icc.toFixed(2)}))
        document.getElementById('temperatura')?.focus();
    }
}

export const GetCC = async (event,triaje,set) => {
    if (!triaje.icc) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.temperatura < 35 || triaje.temperatura > 38) {
            set(d => ({ ...d, temperatura: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const icc = triaje.icc
        const sexo = 'M'
        if (sexo === 'M') {
            if (icc >= 0.78 && icc < 0.95) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: NORMAL.'+"\n" }))

            } else if (icc >= 0.95) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: OBESIDAD ABDOMIO VISCERAL.'+"\n" }))
            }
        }
        if (sexo === 'F') {
            if (icc >= 0.71 && icc < 0.86) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: NORMAL.'+"\n" }))

            } else if (icc >= 0.86) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: OBESIDAD ABDOMIO VISCERAL.'+"\n" }))
            }
        }
        document.getElementById('fCardiaca')?.focus();
    }
}

export const GetFC = async (event,triaje,set) => {
    if (!triaje.fCardiaca) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.fCardiaca < 60 || triaje.fCardiaca > 100) {
            set(d => ({ ...d, fCardiaca: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const frecuencia = triaje.fCardiaca
        if (frecuencia > 100) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA CARDIACA: TAQUICARDIA.'+"\n" }))
        } else if (frecuencia < 60) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA CARDIACA: BRAQUICARDIA.'+"\n" }))
        } else {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA CARDIACA: NORMAL.'+"\n" }))
        }
        document.getElementById('sat02')?.focus();
    }
}

export const GetCuello = async (event,triaje,set) => {
    if (!triaje.perimetroCuello) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.perimetroCuello < 30 || triaje.perimetroCuello > 55) {
            set(d => ({ ...d, perimetroCuello: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const sexo = "M"
        const cuello = triaje.perimetroCuello
        if (sexo === 'M') {
            if (cuello < 43.2) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: NORMAL.'+"\n" }))
            } else {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: ANORMAL.'+"\n" }))
            }
        }
        if (sexo === 'F') {
            if (cuello < 40.6) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: NORMAL.'+"\n" }))
            } else {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: ANORMAL.'+"\n" }))
            }
        }
        document.getElementById('sistolica')?.focus();
    }
}

export const GetSistolica = async (event,triaje,set) => {
    if (event.key === 'Enter') {
        if (triaje.sistolica < 90) {
            set(d => ({ ...d, sistolica: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        document.getElementById('diastolica')?.focus();
    }
}

export const GetPA = async (event,triaje,set) => {
    if (!triaje.sistolica || !triaje.diastolica) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.diastolica < 60) {
            set(d => ({ ...d, diastolica: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        const sistolica = triaje.sistolica
        const diastolica = triaje.diastolica
        if (sistolica < 120 && diastolica < 80) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: NORMAL.'+"\n" }))
        } else if ((sistolica >= 120 && sistolica < 140) && (diastolica >= 80 && diastolica <= 90)) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: PREHIPERTENSION.'+"\n" }))
        } else if ((sistolica >= 120 && sistolica < 140) && (diastolica >= 80 && diastolica <= 90)) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HTA-1.'+"\n" }))
        } else if ((sistolica >= 120 && sistolica < 140) && (diastolica >= 80 && diastolica <= 90)) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HTA-2.'+"\n" }))
        }
        document.getElementById('fRespiratoria')?.focus();
    }
}

export const GetSat = async (event,triaje,set) => {
    if (!triaje.sat02) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.sat02 < 92 || triaje.sat02 > 100) {
            set(d => ({ ...d, sat02: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        document.getElementById('perimetroCuello')?.focus();
    }
}

export const GetFRespira = async (event,triaje,set) => {
    if (event.key === 'Enter') {
        if (triaje.fRespiratoria < 12 || triaje.fRespiratoria > 20) {
            set(d => ({ ...d, fRespiratoria: '' }))
            await Swal.fire('Error','No se permite este dato','error')
            return
        }
        document.getElementById('registrarTR')?.focus();
    }
}
