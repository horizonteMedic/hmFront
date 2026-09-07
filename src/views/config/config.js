//Este archivo sirve para poder cambiar de rutas para las apis
// main https://hmintegracion.azurewebsites.net
// desarrollo https://testbackendhm.azurewebsites.net
export const esProduccion = false

export const URLAzure = esProduccion ? 'https://hmintegracion.azurewebsites.net' : "https://testbackendhm.azurewebsites.net"
export const URLAPIREST = 'http://go.server.net.pe:3000/api/v2'
export const TokenURL = 'horizontemedic_dtcm9'

