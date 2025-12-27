import { URLAzure } from "../../../config/config"

export const getFetch = (url, token) => {
    
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
   
    return fetch(URLAzure+url,options).then(res => {
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
