import { URLAzure } from '../../../../../../config/config'

export function getMedicamentos(token) {
  const url = `${URLAzure}/api/medicamentos`
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return fetch(url, options).then(res => res.json()).then(response => response)
}

export function getMedicamentoDetalle(id, token) {
  const url = `${URLAzure}/api/medicamentos/${id}`
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return fetch(url, options).then(res => res.json()).then(response => response)
}

export function crearMedicamento(nombre, presentacion, laboratorio, marca, unidadMedida, stockMinimo, token) {
  const data = {
    nombre: nombre,
    presentacion: presentacion,
    laboratorio: laboratorio,
    marca: marca,
    unidadMedida: unidadMedida,
    stockMinimo: stockMinimo
  };

  const url = `${URLAzure}/api/medicamentos`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }
  return fetch(url, options).then(res => res.json()).then(response => response)
}

export function editarMedicamento(id, nombre, presentacion, laboratorio, marca, unidadMedida, stockMinimo, token) {
  const data = {
    nombre: nombre,
    presentacion: presentacion,
    laboratorio: laboratorio,
    marca: marca,
    unidadMedida: unidadMedida,
    stockMinimo: stockMinimo
  };

  const url = `${URLAzure}/api/medicamentos/${id}`
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }
  return fetch(url, options).then(res => res.json()).then(response => response)
}

export function registrarIngresoMedicamento(medicamentoId, cantidad, lote, fechaVencimiento, usuarioRegistro, motivo, token) {
  const data = {
    cantidad: cantidad,
    lote: lote,
    fechaVencimiento: fechaVencimiento,
    usuarioRegistro: usuarioRegistro,
    motivo: motivo
  };

  const url = `${URLAzure}/api/inventario/medicamentos/${medicamentoId}/ingresos`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }
  return fetch(url, options).then(res => res.json()).then(response => response)
}
