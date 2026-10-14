import { useEffect, useState } from "react";
import jsPDF from "jspdf";

// Utilidades para probar los reportes del módulo asistencial en la ruta /fichapi (simulador de jaspers):
// imágenes de firma, huella y sello dibujadas en un canvas, y un visor que genera el PDF y lo muestra
// dentro de la página.

const imagenDePrueba = (ancho, alto, dibujar) => {
  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, ancho, alto);
  ctx.strokeStyle = "#1a2a8c";
  ctx.fillStyle = "#1a2a8c";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  dibujar(ctx, ancho, alto);
  return canvas.toDataURL("image/png");
};

export const firmaDePrueba = () =>
  imagenDePrueba(300, 200, (ctx) => {
    ctx.beginPath();
    ctx.moveTo(30, 130);
    ctx.bezierCurveTo(60, 20, 90, 20, 100, 110);
    ctx.bezierCurveTo(110, 170, 140, 40, 170, 100);
    ctx.bezierCurveTo(190, 140, 230, 60, 270, 90);
    ctx.stroke();
  });

export const huellaDePrueba = () =>
  imagenDePrueba(120, 200, (ctx, w, h) => {
    ctx.fillStyle = "#4a3f8f";
    for (let r = 8; r < 50; r += 6) {
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, r, r * 1.6, 0, Math.PI * 0.15, Math.PI * 1.85);
      ctx.stroke();
    }
  });

export const selloDePrueba = (medico, cmp) =>
  imagenDePrueba(400, 200, (ctx, w) => {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 50);
    ctx.bezierCurveTo(100, -10, 150, 110, 200, 40);
    ctx.stroke();
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(medico, w / 2, 120);
    ctx.font = "20px Arial";
    ctx.fillText("Médico Ocupacional", w / 2, 150);
    ctx.fillText(`CMP ${cmp}`, w / 2, 178);
  });

// Genera el PDF con `generar(doc)` (el reporte recibe el documento y lo devuelve) y lo muestra en un iframe.
export function VisorPdfPrueba({ titulo, generar }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let cancelado = false;
    let urlBlob = "";
    (async () => {
      const doc = await generar(new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" }));
      if (cancelado) return;
      urlBlob = URL.createObjectURL(doc.output("blob"));
      setUrl(urlBlob);
    })();
    return () => {
      cancelado = true;
      if (urlBlob) URL.revokeObjectURL(urlBlob);
    };
  }, []);

  return <iframe title={titulo} src={url} style={{ width: "100%", height: "calc(100vh - 110px)", border: 0 }} />;
}
