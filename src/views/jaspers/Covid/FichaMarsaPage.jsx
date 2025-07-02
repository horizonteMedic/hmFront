import React from "react";
import pcualitativaantigenoMarsa from "./pcualitativaantigenoMarsa";

export default function FichaMarsaPage() {
  const handleGeneratePDF = () => {
    pcualitativaantigenoMarsa({
      nombre: "Juan Perez",
      edad: 35,
      dni: "12345678",
      fecha_examen: "2024-06-01",
      cbomarca: "MarcaX",
      chkigm_reactivo: true,
      apto: true,
      txtobservaciones: "Sin síntomas",
      txtvrigm: "Negativo: 0.0 - 0.04 mIU/mL\nPositivo: >= 0.04 mIU/mL",
      // ...otros campos necesarios
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Generar Ficha Marsa</h2>
      <button onClick={handleGeneratePDF}>Generar PDF</button>
    </div>
  );
} 