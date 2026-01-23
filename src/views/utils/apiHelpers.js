import Swal from 'sweetalert2';
import { URLAzure } from '../config/config';

export function SubmitData(body, url, token) {
    const urlCompleta = `${URLAzure}${url}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
    return fetch(urlCompleta, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}

export async function SubmitDataManejo(body, url, token) {
    const res = await fetch(`${URLAzure}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    const data = await res.json();

    if (data.codigo === 201) {
        return data;
    }
    validacionError(data.resultado);
    return null;
}

function validacionError(resultado) {
    const { id, mensaje, detalle, codigo } = resultado || {};

    Swal.fire({
        icon: "error",
        title: mensaje ? `${mensaje}${id ? ` (${id})` : ""}` : "Error",
        html: `
                <div style="text-align:left">
                    ${codigo ? `<p><strong>Código:</strong> ${codigo}</p>` : ""}
                    ${detalle ? `<p><strong>Detalle:</strong> ${detalle}</p>` : ""}
                </div>
            `,
        confirmButtonText: "Entendido",
    });
}

export function getFetch(url, token, signal) {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    if (signal) {
        options.signal = signal;
    }
    return fetch(URLAzure + url, options).then(res => {
        if (!res.ok) {
            // Si la respuesta no es OK (404, 500, etc.), retornar un objeto con error
            return { error: true, status: res.status, statusText: res.statusText };
        }
        // Solo parsear JSON si hay contenido
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        // Si no es JSON, retornar texto o un objeto vacío
        return res.text().then(text => {
            try {
                return text ? JSON.parse(text) : {};
            } catch {
                return { error: true, message: text || 'Respuesta vacía' };
            }
        });
    }).then(response => response)
}

export async function getFetchManejo(url, token) {
    const res = await fetch(URLAzure + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    // if (!res.ok && res.status !== 404) {
    //     throw new Error(`HTTP ${res.status}`);
    // }

    if (res.status >= 500) {
        throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.codigo === 200) {
        return data.resultado;
    }

    validacionError(data.resultado);
    return null;
}

export function updateData(body, url, token) {
    const urlCompleta = `${URLAzure}${url}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
    return fetch(urlCompleta, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}

export function deleteData(url, token) {
    const urlCompleta = `${URLAzure}${url}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(urlCompleta, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}