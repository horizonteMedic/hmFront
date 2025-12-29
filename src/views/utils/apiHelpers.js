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

export function getFetch(url, token) {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
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