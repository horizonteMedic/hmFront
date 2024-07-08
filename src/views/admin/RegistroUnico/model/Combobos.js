import { URLAzure } from "../../../config/config";

export function ComboboxNivelE(token) {
        console.log(token)
        return fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Nivel de Estudios`,{
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            })
        .then(res => {
            console.log(res)
            if (!res.ok) {
                return res
        }  return res.json()
    })
        .then(response => response)

}

export function ComboboxProfesion(token) {
    console.log(token)
    return fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Profesion o Ocupacion`,{
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${token}`
        },
        })
    .then(res => {
        console.log(res)
        if (!res.ok) {
            return res
    }  return res.json()
})
    .then(response => response)

}

export function ComboboxDepartamento(token) {
    console.log(token)
    return fetch(`${URLAzure}/api/v01/ct/departamento`,{
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${token}`
        },
        })
    .then(res => {
        console.log(res)
        if (!res.ok) {
            return res
    }  return res.json()
})
    .then(response => response)

}

export function ComboboxProvincia(token) {
    console.log(token)
    return fetch(`${URLAzure}/api/v01/ct/provincia`,{
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${token}`
        },
        })
    .then(res => {
        console.log(res)
        if (!res.ok) {
            return res
    }  return res.json()
})
    .then(response => response)

}

export function ComboboxDistrito(token) {
    console.log(token)
    return fetch(`${URLAzure}/api/v01/ct/distrito`,{
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${token}`
        },
        })
    .then(res => {
        console.log(res)
        if (!res.ok) {
            return res
    }  return res.json()
})
    .then(response => response)

}