import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Submit } from '../model/Submit';
import { getFetch } from '../../getFetch/getFetch';


const NewHuellaFut = ({close,DNI, Huella}) => {
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
      }, []);

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
          // Creamos el canvas dinámicamente
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          const imgData = ctx.createImageData(width, height);

          for (let i = 0; i < byteArray.length; i++) {
            const val = byteArray[i];
            imgData.data[4 * i + 0] = val; // R
            imgData.data[4 * i + 1] = val; // G
            imgData.data[4 * i + 2] = val; // B
            imgData.data[4 * i + 3] = 255; // A
          }
    
          ctx.putImageData(imgData, 0, 0);
    
          // Aplicamos transparencia a los píxeles oscuros
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
    
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
    
            // Si el píxel es negro o casi negro, lo hacemos transparente
            if (r < 30 && g < 30 && b < 30) {
              data[i + 3] = 0; // alpha = 0
            }
          }
    
          ctx.putImageData(imageData, 0, 0);

          // Insertamos el canvas dentro del div
          const imageDiv = document.getElementById("imagendiv");
          imageDiv.innerHTML = ""; // Limpiamos cualquier contenido previo
          imageDiv.appendChild(canvas);
          const base64Image = convertCanvasToBase64(canvas);
          setBase64(base64Image)
          console.log(base64Image)
        });
    };

    const convertCanvasToBase64 = (canvas) => {
      return canvas.toDataURL("image/png");
    };

    const SubmitHuella = () => {
      const base64WithoutHeader = base64.substring(base64.indexOf(',') + 1);
      const datos = {
        dni: DNI,
        tipoA: "HUELLA",
        nombre: "HuellaPaciente.png",
        base64: base64WithoutHeader
      }
      Submit(datos)
      .then((res) => {
        console.log(res)
      })
    }

    return(
        <>
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="mx-auto bg-white rounded-lg shadow-lg w-[900px] relative">
                {/* Botón para cerrar */}
                <FontAwesomeIcon
                icon={faTimes}
                className="absolute top-0 right-3 m-3 cursor-pointer text-white"
                onClick={close}
                style={{fontSize:'15px'}}
                />
                
                {/* Encabezado */}
                <div className="bg-[#233245] text-white text-center p-3 rounded-t-lg shadow-sm">
                    <h1 className="font-bold text-lg">Tomar Huella Futronic</h1>
                </div>
                
                <div className="p-6 bg-gray-100">
                {/* Contenedor de dos columnas */}
                    <div className='flex items-center justify-center'>
                        <div className='flex flex-row border-2 p-3 items-center border-black justify-center text-center'>
                            <h1 style={{ color: statusColor }}>{statusMsg}</h1>
                        </div>
                    </div>
                    {acquisitionStarted && <div className='flex items-center justify-center my-3'>
                        <h1 className='text-red-600 text-xl'>Listo para Escanear</h1>
                    </div>}
                    <div style={{ marginTop: 10, display: "none" }}>
                        <label>
                        <input type="checkbox" ref={lfdRef} /> LFD (detección de dedo falso)
                        </label>
                        <label style={{ marginLeft: 20 }}>
                        <input type="checkbox" ref={invertRef} /> Invertir imagen
                        </label>
                    </div>
                    <div className='flex items-center justify-center w-auto h-auto mt-3 '>
                      {Huellaview?.id === 1 && Huellaview?.url && (
                        <img
                          src={Huellaview.url}
                          alt="Huella digital"
                          className="w-[320px] h-[480px] object-contain border-2 border-indigo-900"
                        />
                      )}
                        <div id='imagendiv' className={`p-0 m-0 w-[320px] h-[480px] border-2 border-indigo-900 ${Huellaview?.id === 1 ? 'hidden' : ''}`}></div>
                    </div>
                    <div style={{ marginTop: 10, display: "none" }}>
                        {imageLink && (
                        <a href={imageLink} download="image.jpg">
                            Descargar imagen RAW
                        </a>
                        )}
                        <br />
                        {wsqLink && (
                        <a href={wsqLink} download="image.jpg">
                            Descargar imagen WSQ
                        </a>
                        )}
                    </div>
                    <div className='flex items-start justify-center w-full pt-6'>
                        <div className='flex justify-around w-full'>
                            <button onClick={(e) => {download(e)}} className='azul-btn px-5 py-2 rounded-lg'>Descargar</button>
                            <button onClick={(e) => {e.preventDefault(),startCapturing()}} className={`azul-btn px-5 py-2 rounded-lg ${acquisitionStarted && 'opacity-65'}`}>Iniciar</button>
                            <button onClick={(e) => {e.preventDefault(),StopCapturing()}} className={`azul-btn px-5 py-2 rounded-lg `}>Detener</button>
                        </div>
                    </div>
                
                    {/* Botón de guardar */}
                    <div className="flex justify-end mt-4">
                        <button onClick={SubmitHuella} className="bg-[#fc6b03] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
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