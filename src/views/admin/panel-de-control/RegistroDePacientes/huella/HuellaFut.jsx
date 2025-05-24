import { faTimes, faTrashAlt, faPlay, faStop, faSave, faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Submit } from '../model/Submit';
import { getFetch } from '../../getFetch/getFetch';

const NewHuellaFut = ({close, DNI, Huella, setHuella}) => {
    const SERVER_URL = "http://127.0.0.1:15270/fpoperation";
    const [statusMsg, setStatusMsg] = useState("");
    const [statusColor, setStatusColor] = useState("blue");
    const [operationId, setOperationId] = useState(null);
    const [imageLink, setImageLink] = useState(null);
    const [wsqLink, setWsqLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [Huellaview, setHuellaview] = useState(Huella)
    const [loopCapturing, setLoopCapturing] = useState(false);
    const loopCapturingRef = useRef(false);
    
    const lfdRef = useRef(null);
    const invertRef = useRef(null);

    const [acquisitionStarted, setAcquisitionStarted] = useState(false);
    const [base64, setBase64] = useState("")
    
    useEffect(() => {
        checkConnection();
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                close();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [close]);

    const setStatus = (text, color = "blue") => {
        setStatusMsg(text);
        setStatusColor(color);
    };

    const checkConnection = () => {
        fetch(SERVER_URL)
          .then((res) => {
            if (res.ok) {
              setStatus("Presione el botón para capturar huella", "blue");
            } else {
              setStatus("Servidor Futronic no responde", "red");
            }
          })
          .catch(() => {
            setStatus("Servidor Futronic no responde", "red");
          });
      };


    const download = (e) => {
        e.preventDefault()
        const canvas = document.querySelector("#imagendiv canvas");
        if (!canvas ) {
            Swal.fire('Error', 'Primero realice el escaneo','error')
            return;
        }
      
        // Convertimos el canvas en blob y lo descargamos
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "huella.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, "image/png");
        
    };

    const beginCapture = (loop =true) => {
        if (!loopCapturingRef.current) return;
        const data = {
          operation: "capture",
          lfd: lfdRef.current?.checked ? "yes" : "no",
          invert: invertRef.current?.checked ? "yes" : "no",
        };
    
        setLoading(true);
        setStatus("Iniciando captura...");
    
        fetch(SERVER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((opDsc) => {
            if (opDsc.state === "init") {
              setOperationId(opDsc.id);
              pollOperationState(opDsc.id);
            }
          })
          .catch(() => {
            setStatus("Error al iniciar operación", "red");
            setLoading(false);
          });
      };

    const setLoop = (value) => {
        loopCapturingRef.current = value;
        setLoopCapturing(value)
    }

    const startCapturing = () => {
        if (!loopCapturing) {
            setHuellaview({id:0,url:''})
            setLoop(true);
            beginCapture(); // lanza la primera captura
        }
    };

    const StopCapturing = () => {
        if (loopCapturing) {
            setLoop(false);
            setStatus("Captura Detenida.");; // lanza la primera captura
        }
    };

    
    
    const pollOperationState = (opId) => {
      if (!loopCapturingRef.current) return;
      fetch(`${SERVER_URL}/${opId}`)
        .then((res) => res.json())
        .then((opDsc) => {
          if (opDsc.state === "done") {
            setLoading(false);
            if (opDsc.status === "success") {
              setStatus(`Captura exitosa (NFIQ: ${opDsc.nfiq})`, "green");
              setImageLink(`${SERVER_URL}/${opDsc.id}/image`);
              setWsqLink(`${SERVER_URL}/${opDsc.id}/+0.75+wsq`);
              drawFingerprint(`${SERVER_URL}/${opDsc.id}/image`, opDsc.devwidth, opDsc.devheight);
              if (loopCapturingRef.current) {
                  setTimeout(() => beginCapture(true), 1500); // pequeña pausa entre capturas
                }
            } else {
              setStatus(`Error: ${opDsc.errorstr}`, "red");
            }
          } else if (opDsc.state === "inprogress") {
            if (opDsc.fingercmd === "puton") setStatus("Coloque el dedo en el lector");
            if (opDsc.fingercmd === "takeoff") setStatus("Retire el dedo del lector");
  
            setTimeout(() => pollOperationState(opDsc.id), 1000);
          } else if (opDsc.state === "init") {
              // Esperamos 1 segundo y volvemos a preguntar el estado
              setTimeout(() => pollOperationState(opDsc.id), 1000);
            }
        })
        .catch(() => {
          setStatus("Error consultando operación", "red");
          setLoading(false);
        });
    };
  
    const drawFingerprint = (url, width, height) => {
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const byteArray = new Uint8Array(buffer);
    
          // Eliminar canvas anterior si existe
          const existingCanvas = document.getElementById("fingerprintCanvas");
          if (existingCanvas) {
            existingCanvas.remove();
          }
    
          // Crear nuevo canvas
          const canvas = document.createElement("canvas");
          canvas.id = "fingerprintCanvas"; // ID único
          canvas.width = width;
          canvas.height = height;
    
          const ctx = canvas.getContext("2d");
          const imgData = ctx.createImageData(width, height);
    
          for (let i = 0; i < byteArray.length; i++) {
            const val = byteArray[i];
            imgData.data[4 * i + 0] = val;
            imgData.data[4 * i + 1] = val;
            imgData.data[4 * i + 2] = val;
            imgData.data[4 * i + 3] = 255;
          }
    
          ctx.putImageData(imgData, 0, 0);
    
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
    
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
    
            if (r < 30 && g < 30 && b < 30) {
              data[i + 3] = 0;
            }
          }
    
          ctx.putImageData(imageData, 0, 0);
    
          const imageDiv = document.getElementById("imagendiv");
          imageDiv.appendChild(canvas);
    
          const base64Image = convertCanvasToBase64(canvas);
          setBase64(base64Image);
        });
    };

    const convertCanvasToBase64 = (canvas) => {
      return canvas.toDataURL("image/png");
    };

    const SubmitHuella = () => {
      
      if (!base64) return Swal.fire('Error','Coloca una Huella','error')
        Swal.fire({
          title: 'Validando Datos',
          text: 'Espere por favor...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      const base64WithoutHeader = base64.substring(base64.indexOf(',') + 1);
      const datos = {
        dni: DNI,
        tipoA: "HUELLA",
        nombre: "HuellaPaciente.png",
        base64: base64WithoutHeader
      }
      Submit(datos)
      .then((res) => {
        if (res.id) {
          Swal.fire('Exito',`${res.mensaje}`,'success') 
          setHuella()
          close()
        } else {
          Swal.fire('Error','Ocurrio un error al registrar la heulla','error')
        }
      })
    }

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#233245] text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Captura de Huella Digital</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm">Presione ESC para cerrar</span>
                        <button 
                            onClick={close}
                            className="text-white hover:text-gray-300 transition-colors text-xl"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Status Message */}
                    <div className="mb-4">
                        <div className={`p-3 rounded-lg text-center ${statusColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            <p className="font-medium">{statusMsg}</p>
                        </div>
                    </div>

                    {/* Fingerprint Display */}
                    <div className="flex justify-center mb-6">
                        {Huellaview?.id === 1 && Huellaview?.url ? (
                            <img
                                src={Huellaview.url}
                                alt="Huella digital"
                                className="w-[320px] h-[480px] object-contain border-2 border-indigo-900 rounded-lg shadow-md"
                            />
                        ) : (
                            <div 
                                id='imagendiv' 
                                className="w-[320px] h-[480px] border-2 border-indigo-900 rounded-lg shadow-md bg-gray-50 flex items-center justify-center"
                            >
                            </div>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4 mb-6">
                        <button 
                            onClick={(e) => {e.preventDefault(); startCapturing()}} 
                            className={`px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Iniciar Captura</span>
                        </button>
                        <button 
                            onClick={(e) => {e.preventDefault(); StopCapturing()}} 
                            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faStop} />
                            <span>Detener</span>
                        </button>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button 
                            onClick={SubmitHuella}
                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            <span>Guardar Huella</span>
                        </button>
                    </div>
                </div>

                {/* Button Legend */}
                <div className="mt-4 p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white">
                                <FontAwesomeIcon icon={faPlay} />
                            </span>
                            <span>Iniciar: Comienza la captura de huella</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-600 text-white">
                                <FontAwesomeIcon icon={faStop} />
                            </span>
                            <span>Detener: Finaliza la captura actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-600 text-white">
                                <FontAwesomeIcon icon={faSave} />
                            </span>
                            <span>Guardar: Almacena la huella capturada</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewHuellaFut;