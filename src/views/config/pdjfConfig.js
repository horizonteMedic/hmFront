// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// export default pdfjsLib;



//segundo intento
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js";

export default pdfjsLib;