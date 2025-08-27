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
    return fetch(URLAzure + url, options).then(res => res.json()).then(response => response)
}
