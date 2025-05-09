import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Submit } from '../model/Submit';
import { getFetch } from '../../getFetch/getFetch';


const NewHuellaFut = ({close,DNI, Huella,setHuella}) => {
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
            console.log(res)
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
          console.log(url)
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
          lfd: lfdRef.current.checked ? "yes" : "no",
          invert: invertRef.current.checked ? "yes" : "no",
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
        <>
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="mx-auto bg-white rounded-lg shadow-lg w-[900px] relative">
                {/* Botón para cerrar y leyenda */}
                <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
                    <span className="text-white text-sm">Presione ESC o X para cerrar</span>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                        onClick={close}
                        style={{fontSize:'15px'}}
                    />
                </div>
                
                {/* Encabezado */}
                <div className="bg-[#233245] text-white text-center p-4 rounded-t-lg shadow-sm">
                    <h1 className="font-bold text-xl">Tomar Huella Futronic</h1>
                </div>
                
                <div className="p-6 bg-gray-100">
                    {/* Contenedor de estado */}
                    <div className='flex items-center justify-center mb-4'>
                        <div className='flex flex-row border-2 p-4 items-center border-black justify-center text-center bg-white rounded-lg shadow-sm'>
                            <h1 style={{ color: statusColor }} className="text-lg font-medium">{statusMsg}</h1>
                        </div>
                    </div>

                    {acquisitionStarted && (
                        <div className='flex items-center justify-center my-3'>
                            <h1 className='text-red-600 text-xl font-semibold'>Listo para Escanear</h1>
                        </div>
                    )}

                    {/* Contenedor de la huella */}
                    <div className='flex items-center justify-center w-auto h-auto mt-3'>
                        {Huellaview?.id === 1 && Huellaview?.url && (
                            <img
                                src={Huellaview.url}
                                alt="Huella digital"
                                className="w-[320px] h-[480px] object-contain border-2 border-indigo-900 rounded-lg shadow-md"
                            />
                        )}
                        <div id='imagendiv' className={`p-0 m-0 w-[320px] h-[480px] border-2 border-indigo-900 rounded-lg shadow-md ${Huellaview?.id === 1 ? 'hidden' : ''}`}></div>
                    </div>

                    {/* Botones de control */}
                    <div className='flex items-start justify-center w-full pt-6'>
                        <div className='flex justify-around w-full max-w-md'>
                            <button 
                                onClick={(e) => {e.preventDefault(),startCapturing()}} 
                                className={`azul-btn px-6 py-2 rounded-lg ${acquisitionStarted ? 'opacity-65' : ''} hover:bg-blue-700 transition-colors`}
                            >
                                Iniciar
                            </button>
                            <button 
                                onClick={(e) => {e.preventDefault(),StopCapturing()}} 
                                className='azul-btn px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                            >
                                Detener
                            </button>
                        </div>
                    </div>
                
                    {/* Botón de guardar */}
                    <div className="flex justify-end mt-6">
                        <button 
                            onClick={SubmitHuella} 
                            className="bg-[#fc6b03] text-white font-bold py-2 px-6 rounded-lg transition duration-300 hover:bg-[#e05e00]"
                        >
                            Guardar Huella
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default NewHuellaFut