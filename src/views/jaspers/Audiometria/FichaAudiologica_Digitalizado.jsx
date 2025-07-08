import jsPDF from 'jspdf';
import header_FichaAudiologica_Digitalizado from './headers/header_FichaAudiologica_Digitalizado';

/**
 * Genera PDF de FICHA AUDIOLÓGICA
 * @param {object} datos - Datos del paciente y evaluación
 * @returns {jsPDF} Documento PDF generado
 */
const FichaAudiologica_Digitalizado = (datos = {}) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = 12;

  // 1) HEADER con datos del paciente
  header_FichaAudiologica_Digitalizado(doc, datos);
  
  // Espacio después del header
  y = 65;

  // 2) CONTENIDO DEL CUERPO
  // Aquí irá el contenido específico de la Ficha Audiológica
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("CONTENIDO DE LA FICHA AUDIOLÓGICA", pageW / 2, y, { align: "center" });
  
  y += 15;
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Este es el contenido base de la Ficha Audiológica.", margin, y);
  doc.text("Aquí se agregarán las secciones específicas según el formato institucional.", margin, y + 8);

  return doc;
};

export default FichaAudiologica_Digitalizado; 