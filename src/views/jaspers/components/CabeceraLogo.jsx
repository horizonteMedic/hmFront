import { compressImage } from "../../utils/helpers";

const CabeceraLogo = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = datos.yOffset || 10;

  // Control interno para mostrar/ocultar logo
  const mostrarLogo = true; // Cambiar a false para ocultar el logo globalmente

  // Función para determinar si mostrar el logo
  const debeMostrarLogo = () => {
    // Si el control interno está desactivado, no mostrar
    if (!mostrarLogo) {
      return false;
    }

    // Si tiene membrete (hoja ya impresa), no mostrar logo
    if (datos.tieneMembrete || datos.conMembrete || datos.hojaMembretada) {
      return false;
    }

    // Si explícitamente se dice que no mostrar logo
    if (datos.mostrarLogo === false) {
      return false;
    }

    // Por defecto, mostrar el logo
    return true;
  };

  // Solo mostrar logo si la función lo permite
  if (debeMostrarLogo()) {
    const img = "/img/logo-color.webp";
    const imgCompressed = await compressImage(img);
    doc.addImage(imgCompressed, "WEBP", margin, yOffset, 55, 18);

    // Devuelve la posición Y final para continuar el contenido
    return yOffset + 35;
  } else {
    // Si no se muestra logo, devolver posición inicial
    return yOffset;
  }
};

export default CabeceraLogo;
