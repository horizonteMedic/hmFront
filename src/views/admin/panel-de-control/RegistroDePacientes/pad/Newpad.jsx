import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrashAlt, faPlay, faEraser, faSave, faSignature } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import Swal from 'sweetalert2';
import { Submit } from '../model/Submit';

const SignerContext = createContext();

const signer = 
{ 
  firstName: "John",
  lastName:  "Smith"
};

const NewPad = ({close, DNI, Firma, setFirma}) => {
   const [device, setDevice] = useState(null);
   const signatory = useContext(SignerContext);

    const btnRestore = useRef();
    const chkB64 = useRef();
    const chkSigText = useRef();
    const firstName = useRef("");
    const lastName = useRef("");
    const imageBox = useRef();
    const txtSignature = useRef();
    const txtDisplay = useRef();
    const [chkValue, setChecked] = useState(false);
    const [base64, setBase64] = useState("")
    const [FirmaView, setFirmaView] = useState(Firma)



    // Agregar efecto para manejar la tecla ESC
    useEffect(() => {
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

    const download = (e) => {
        e.preventDefault();
        const imageElement = document.querySelector("#imageBox img");
        
        if (!imageElement || !imageElement.src.startsWith("data:image")) {
            Swal.fire("Error", "Primero realice la firma", "error");
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageElement.src;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            // Dibujar la imagen en el canvas
            ctx.drawImage(img, 0, 0);

            // Obtener los datos de los píxeles
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Recorremos todos los píxeles y eliminamos el fondo blanco
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Si el píxel es casi blanco, lo hacemos transparente
                if (r > 200 && g > 200 && b > 200) {
                    data[i + 3] = 0; // Alpha = 0 (transparente)
                }
            }

            // Volvemos a colocar los datos procesados en el canvas
            ctx.putImageData(imageData, 0, 0);

            // Crear el enlace de descarga con transparencia
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "Firma.png";
            link.click();
        };
    };

    const Convertbase64 = () => {
        return new Promise((resolve, reject) => {
          const imageElement = document.querySelector(`#imageBox img`);
      
          if (!imageElement) {
            Swal.fire("Error", "No se encontró la imagen", "error");
            return reject("No se encontró la imagen");
          }
      
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imageElement.src;
      
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
      
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
      
            const base64Image = canvas.toDataURL("image/png");
            resolve(base64Image); // <-- devolvemos el base64
          };
      
          img.onerror = () => {
            Swal.fire("Error", "No se pudo cargar la imagen para convertirla", "error");
            reject("Error al cargar la imagen");
          };
        });
      };

    const SubmitFirma = async () => {
        
        try {
            const base64 = await Convertbase64(); // Esperamos el resultado
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
              tipoA: "FIRMAP",
              nombre: "FirmaPaciente.png",
              base64: base64WithoutHeader
            };
        
            Submit(datos)
              .then((res) => {
                if (res.id) {
                  Swal.fire('Exito',`${res.mensaje}`,'success')
                  setFirma()
                  close()
                } else {
                  Swal.fire('Error',`Error al registrar la firma`,'error')
                }
              });
          } catch (error) {
            console.error("Error al convertir imagen:", error);
          }
    }
   
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#233245] text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Captura de Firma Digital</h2>
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
                    {/* Signature Display */}
                    <div className="flex justify-center mb-6">
                        {FirmaView?.id === 1 && FirmaView?.url ? (
                            <img
                                src={FirmaView.url}
                                alt="Firma digital"
                                className="w-[400px] h-[300px] object-contain border-2 border-indigo-900 rounded-lg shadow-md"
                            />
                        ) : (
                            <div 
                                id='imageBox' 
                                ref={imageBox} 
                                className="w-[400px] h-[300px] border-2 border-indigo-900 rounded-lg shadow-md bg-gray-50 flex items-center justify-center"
                            >
                                <p className="text-gray-400">Área de firma</p>
                            </div>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4 mb-6">
                        <button 
                            onClick={(e) => {e.preventDefault(); window.clearSignature()}}  
                            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faEraser} />
                            <span>Limpiar</span>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                window.capture("jhon", "Cabrera", imageBox.current, txtSignature.current, chkSigText.current, chkB64.current);
                                setFirmaView({id:0,url:''});
                            }}  
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Iniciar</span>
                        </button>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button 
                            onClick={SubmitFirma}  
                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            <span>Guardar Firma</span>
                        </button>
                    </div>
                </div>

                {/* Button Legend */}
                <div className="mt-4 p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-600 text-white">
                                <FontAwesomeIcon icon={faEraser} />
                            </span>
                            <span>Limpiar: Borra la firma actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white">
                                <FontAwesomeIcon icon={faPlay} />
                            </span>
                            <span>Iniciar: Comienza la captura de firma</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-600 text-white">
                                <FontAwesomeIcon icon={faSave} />
                            </span>
                            <span>Guardar: Almacena la firma capturada</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Elements */}
            <textarea className='hidden' cols="125" rows="15" id="txtDisplay" ref={txtDisplay}></textarea>
            <input className='hidden' type="checkbox" id="chkShowSigText" onChange={() => setRestoreButtonState(chkValue)} ref={chkSigText} />
            <input className='hidden' type="checkbox" id="chkUseB64Image" ref={chkB64}/>
        </div>
    );
};

export default NewPad;