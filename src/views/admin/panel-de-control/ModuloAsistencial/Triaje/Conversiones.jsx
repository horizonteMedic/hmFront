import Swal from "sweetalert2"

export const Convert = async (event, triaje, set, s) => {
    if (!triaje.talla) {
        return
    }

    if (event.key === 'Enter') {
        if (triaje.talla < 130 || triaje.talla > 280) {
            set(d => ({ ...d, talla: '' }))
            await s.fire('Error', 'No se permite este dato', 'error')
            return
        }
        const Triajeconvert = triaje.talla / 100;
        set(d => ({ ...d, talla: Triajeconvert.toFixed(2) }))
        document.getElementById('peso')?.focus();
    }
}

export const GetIMC = async (event, triaje, set, s) => {
    if (!triaje.talla || !triaje.peso) {
        return
    }
    if (event.key === 'Enter') {
        if (triaje.peso < 40 || triaje.peso > 150) {
            set(d => ({ ...d, peso: '' }))
            await s.fire('Error', 'No se permite este dato', 'error')
            return
        }
        const IMC = triaje.peso / (triaje.talla * triaje.talla);
        const imc = IMC.toFixed(2)
        // El diagnóstico de IMC depende solo de talla y peso: se registra al calcularlo.
        const clasificacion = ClasificarIMC(imc)
        set(d => ({
            ...d,
            imc,
            ...(clasificacion && { diagnostico: (d.diagnostico || '') + `- INDICE DE MASA CORPORAL: ${clasificacion}.` + "\n" }),
        }))
        // Cintura, cadera y perímetro de cuello están bloqueados: se salta a temperatura.
        document.getElementById('temperatura')?.focus();
    }
}

const ClasificarIMC = (imc) => {
    if (imc < 18.5) return 'BAJO DE PESO'
    if (imc < 25) return 'NORMAL'
    if (imc < 30) return 'SOBREPESO'
    if (imc < 35) return 'OBESIDAD I'
    if (imc < 40) return 'OBESIDAD II'
    return 'OBESIDAD III'
}

// Cintura es opcional: vacía solo pasa al siguiente campo.
export const GetCintura = async (event, triaje, set, s) => {
    if (event.key === 'Enter') {
        if (triaje.cintura && (triaje.cintura < 45 || triaje.cintura > 180)) {
            set(d => ({ ...d, cintura: '' }))
            await s.fire('Error', 'No se permite este dato', 'error')
            return
        }
        document.getElementById('cadera')?.focus();
    }
}

// Cadera es opcional; el ICC solo se calcula si hay cintura y cadera, si no queda vacío.
export const GetICC = async (event, triaje, set) => {
    if (event.key === 'Enter') {
        if (triaje.cadera && (triaje.cadera < 70 || triaje.cadera > 180)) {
            set(d => ({ ...d, cadera: '' }))
            await Swal.fire('Error', 'No se permite este dato', 'error')
            return
        }
        if (triaje.cintura && triaje.cadera) {
            const icc = triaje.cintura / triaje.cadera
            set(d => ({ ...d, icc: icc.toFixed(2) }))
        } else {
            set(d => ({ ...d, icc: '' }))
        }
        document.getElementById('temperatura')?.focus();
    }
}

export const GetCC = async (event, triaje, set) => {
    if (!triaje.temperatura) {
        return
    }
    if (event.key === 'Enter') {
        const Temperatura = triaje.temperatura
        if (Temperatura <= 16) {
            set(d => ({ ...d, temperatura: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        if (Temperatura >= 17 && Temperatura <= 28) {
            set(d => ({ ...d, temperatura: '' }))
            await Swal.fire('HIPOTERMIA PROFUNDA', 'Ingrese otro dato por favor.', 'error')
            return
        } else if (Temperatura >= 29 && Temperatura <= 35) {
            set(d => ({ ...d, temperatura: '' }))
            await Swal.fire('HIPOTERMIA LIGERA', 'Ingrese otro dato por favor.', 'error')
            return
        } else if (Temperatura >= 36 && Temperatura <= 37.4) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- TEMPERATURA: NORMAL.' + "\n" }))
        } else if (Temperatura >= 37.5 && Temperatura <= 37.9) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- TEMPERATURA: FEBRICULA.' + "\n" }))
        } else if (Temperatura >= 38 && Temperatura <= 38.9) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- TEMPERATURA: FIEBRE.' + "\n" }))
        } else if (Temperatura >= 39 && Temperatura <= 39.9) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- TEMPERATURA: FIEBRE ALTA.' + "\n" }))
        } else if (Temperatura >= 40 && Temperatura <= 41.5) {
            set(d => ({ ...d, temperatura: '' }))
            await Swal.fire('FIEBRE MUY ALTA', 'Ingrese otro dato por favor.', 'error')
            return
        } else if (Temperatura > 42) {
            set(d => ({ ...d, temperatura: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        const icc = triaje.icc
        const sexo = 'M'
        // Sin ICC (cintura o cadera vacías) no hay diagnóstico de cintura-cadera
        if (icc && sexo === 'M') {
            if (icc >= 0.78 && icc < 0.95) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: NORMAL.' + "\n" }))

            } else if (icc >= 0.95) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: OBESIDAD ABDOMIO VISCERAL.' + "\n" }))
            }
        }
        if (icc && sexo === 'F') {
            if (icc >= 0.71 && icc < 0.86) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: NORMAL.' + "\n" }))

            } else if (icc >= 0.86) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- INDICE DE CINTURA CADERA: OBESIDAD ABDOMIO VISCERAL.' + "\n" }))
            }
        }
        document.getElementById('fCardiaca')?.focus();
    }
}

export const GetFC = async (event, triaje, set) => {
    if (!triaje.fCardiaca) {
        return
    }
    if (event.key === 'Enter') {
        // if (triaje.fCardiaca < 60 || triaje.fCardiaca > 100) {
        //     set(d => ({ ...d, fCardiaca: '' }))
        //     await Swal.fire('Error','No se permite este dato','error')
        //     return
        // }
        if (triaje.fCardiaca <= 39) {
            set(d => ({ ...d, fCardiaca: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        const frecuencia = triaje.fCardiaca
        if (frecuencia >= 40 && frecuencia <= 49) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA CARDIACA: BRADICARDIA.' + "\n" }))
        } else if (frecuencia >= 50 && frecuencia <= 99) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA CARDIACA: NORMAL.' + "\n" }))
        } else if (frecuencia >= 100 && frecuencia <= 250) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA CARDIACA: TAQUICARDIA.' + "\n" }))
        } else if (frecuencia > 250) {
            set(d => ({ ...d, fCardiaca: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        document.getElementById('sat02')?.focus();
    }
}

// Perímetro de cuello es opcional: vacío solo pasa al siguiente campo, sin diagnóstico.
export const GetCuello = async (event, triaje, set) => {
    if (event.key === 'Enter') {
        if (!triaje.perimetroCuello) {
            document.getElementById('sistolica')?.focus();
            return
        }
        if (triaje.perimetroCuello < 30 || triaje.perimetroCuello > 55) {
            set(d => ({ ...d, perimetroCuello: '' }))
            await Swal.fire('Error', 'No se permite este dato', 'error')
            return
        }
        const sexo = "M"
        const cuello = triaje.perimetroCuello
        if (sexo === 'M') {
            if (cuello < 43.2) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: NORMAL.' + "\n" }))
            } else {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: ANORMAL.' + "\n" }))
            }
        }
        if (sexo === 'F') {
            if (cuello < 40.6) {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: NORMAL.' + "\n" }))
            } else {
                set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- CIRCUNFERENCIA DE CUELLO: ANORMAL.' + "\n" }))
            }
        }
        document.getElementById('sistolica')?.focus();
    }
}

export const GetSistolica = async (event, triaje, set) => {
    if (event.key === 'Enter') {
        const Sistolica = triaje.sistolica
        const Diastolica = triaje.diastolica
        if (Sistolica == 0) {
            set(d => ({ ...d, sistolica: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        if (Sistolica < 90) {
            set(d => ({ ...d, sistolica: '' }))
            await Swal.fire('HIPOTENSION', 'Ingrese otro dato por favor.', 'error')
            return
        } else if (Sistolica >= 90 && Sistolica <= 129 && Diastolica >= 60 && Diastolica <= 80) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: NORMAL.' + "\n" }))
        } else if (Sistolica >= 130 && Sistolica <= 139 && Diastolica >= 85 && Diastolica <= 89) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: NORMAL ALTA.' + "\n" }))
        } else if (Sistolica >= 140 && Sistolica <= 159 && Diastolica >= 90 && Diastolica <= 99) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HIPERTENSION ARTERIAL GRADO 1.' + "\n" }))
        } else if (Sistolica >= 160 && Sistolica <= 179 && Diastolica >= 100 && Diastolica <= 109) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HIPERTENSION ARTERIAL GRADO 2.' + "\n" }))
        } else if (Sistolica >= 180 && Sistolica <= 249 && Diastolica >= 110 && Diastolica <= 149) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HIPERTENSION ARTERIAL GRADO 3.' + "\n" }))
        } else if (Sistolica >= 250) {
            set(d => ({ ...d, sistolica: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }

        document.getElementById('diastolica')?.focus();
    }
}

export const GetPA = async (event, triaje, set) => {
    if (!triaje.sistolica || !triaje.diastolica) {
        return
    }
    if (event.key === 'Enter') {
        const Sistolica = triaje.sistolica
        const Diastolica = triaje.diastolica
        if (Diastolica == 0) {
            set(d => ({ ...d, diastolica: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        if (Diastolica < 60) {
            set(d => ({ ...d, diastolica: '' }))
            await Swal.fire('HIPOTENSION', 'Ingrese otro dato por favor.', 'error')
            return
        } else if (Sistolica >= 90 && Sistolica <= 129 && Diastolica >= 60 && Diastolica <= 80) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: NORMAL.' + "\n" }))
        } else if (Sistolica >= 130 && Sistolica <= 139 && Diastolica >= 85 && Diastolica <= 89) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: NORMAL ALTA.' + "\n" }))
        } else if (Sistolica >= 140 && Sistolica <= 159 && Diastolica >= 90 && Diastolica <= 99) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HIPERTENSION ARTERIAL GRADO 1.' + "\n" }))
        } else if (Sistolica >= 160 && Sistolica <= 179 && Diastolica >= 100 && Diastolica <= 109) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HIPERTENSION ARTERIAL GRADO 2.' + "\n" }))
        } else if (Sistolica >= 180 && Sistolica <= 249 && Diastolica >= 110 && Diastolica <= 149) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- PRESION ARTERIAL: HIPERTENSION ARTERIAL GRADO 3.' + "\n" }))
        } else if (Diastolica >= 150) {
            set(d => ({ ...d, sistolica: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        document.getElementById('fRespiratoria')?.focus();
    }
}

// Grado de hipoxia ajustado a ~3500 msnm; null si la saturación es normal (>= 90%).
// Los umbrales son continuos para cubrir valores con decimales (p. ej. 89.5 = leve).
export const GetHipoxiaLaArena = (saturacion) => {
    if (saturacion < 80) return 'HIPOXIA SEVERA'
    if (saturacion < 85) return 'HIPOXIA MODERADA'
    if (saturacion < 90) return 'HIPOXIA LEVE'
    return null
}

export const GetSat = async (event, triaje, set) => {
    if (!triaje.sat02) {
        return
    }
    if (event.key === 'Enter') {
        const Saturacion = triaje.sat02
        if (Saturacion == 0) {
            set(d => ({ ...d, sat02: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        // Criterio de altura (~3500 msnm): normal desde 90%; por debajo se acepta el valor y el
        // diagnóstico indica el grado de hipoxia (severa < 80, moderada 80-84, leve 85-89).
        const hipoxia = GetHipoxiaLaArena(Saturacion)
        if (hipoxia) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + `- SATURACIÓN DE OXIGENO: ${hipoxia}.` + "\n" }))
        } else if (Saturacion >= 90 && Saturacion <= 100) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- SATURACIÓN DE OXIGENO: NORMAL.' + "\n" }))
        } else if (Saturacion >= 101) {
            set(d => ({ ...d, sat02: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }

        document.getElementById('sistolica')?.focus();
    }
}

export const GetFRespira = async (event, triaje, set) => {
    if (event.key === 'Enter') {
        const Frecuencia = triaje.fRespiratoria
        if (Frecuencia == 0) {
            set(d => ({ ...d, fRespiratoria: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }
        if (Frecuencia <= 13) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA RESPIRATORIA: BRADIPNEA.' + "\n" }))
        } else if (Frecuencia >= 14 && Frecuencia <= 20) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA RESPIRATORIA: NORMAL.' + "\n" }))
        } else if (Frecuencia >= 21 && Frecuencia <= 50) {
            set(d => ({ ...d, diagnostico: (d.diagnostico || '') + '- FRECUENCIA RESPIRATORIA: TAQUIPNEA.' + "\n" }))
        } else if (Frecuencia > 50) {
            set(d => ({ ...d, fRespiratoria: '' }))
            await Swal.fire('Valor Absurdo', 'Ingrese otro dato por favor.', 'error')
            return
        }


        document.getElementById('registrarTR')?.focus();
    }
}
