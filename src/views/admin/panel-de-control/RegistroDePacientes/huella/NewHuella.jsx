import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

var currentFormat = Fingerprint.SampleFormat.PngImage;

class FingerprintSdkTest {
  constructor() {
    this.acquisitionStarted = false;
    this.operationToRestart = null;
    this.sdk = new Fingerprint.WebApi();
    this.sdk.onSamplesAcquired = (s) => {
        this.sampleAcquired(s);
      };
  }

  startCapture(setAcquisitionStarted,readers) {
    setAcquisitionStarted(true); // Actualizar el estado en React
    this.sdk.startAcquisition(currentFormat, readers).then(() => {
      Swal.fire("Captura iniciada", "Listo para escanear huellas", "success");
    }).catch((error) => {
      setAcquisitionStarted(false); // Revertir estado si falla
      Swal.fire("Error", error.message, "error");
    });
  }

  stopCapture(setAcquisitionStarted) {
    setAcquisitionStarted(false);

    this.sdk.stopAcquisition().then(() => {
      Swal.fire("Captura detenida", "", "info");
    }).catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
  }

  sampleAcquired(s) {
    if (currentFormat === Fingerprint.SampleFormat.PngImage) {
      const samples = JSON.parse(s.samples);
      const imageSrc = `data:image/png;base64,${Fingerprint.b64UrlTo64(samples[0])}`;
  
      // Procesar la imagen en un canvas
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
  
        // Obtener y procesar los píxeles
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]; // Red
          const g = data[i + 1]; // Green
          const b = data[i + 2]; // Blue
  
          // Detectar fondo gris claro y hacerlo transparente
          if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0; // Hacer el píxel transparente
          }
        }
  
        // Actualizar el canvas con la imagen procesada
        ctx.putImageData(imageData, 0, 0);
  
        // Mostrar la imagen procesada en el div
        const imageDiv = document.getElementById("imagendiv");
        if (imageDiv) {
          imageDiv.innerHTML = ""; // Limpiar contenido previo
          const processedImage = canvas.toDataURL(); // Convertir canvas a URL
          const imageElement = document.createElement("img");
          imageElement.src = processedImage;
          imageElement.alt = "Huella Capturada Procesada";
          imageElement.className = "w-full h-full object-contain";
          imageDiv.appendChild(imageElement);
        }
      };
      image.src = imageSrc; // Cargar la imagen
    } else {
      Swal.fire("Error", "Formato de huella no soportado", "error");
    }
  }
}

const NewHuella = ({close}) => {
    const [readers, setReaders] = useState('');
    const [calidad, setCalidad] = useState('Buena')
    const [sdkTestInstance] = useState(new FingerprintSdkTest());
    const [acquisitionStarted, setAcquisitionStarted] = useState(false);

    useEffect(() => {
        // Obtener lista de huelleros
        const sdkInstance = new Fingerprint.WebApi();
        sdkInstance.enumerateDevices()
          .then((devices) => {
            if (devices.length === 0) {
                Swal.fire('Error', 'Conecte el Huellero', 'error')
                close()
            } else {
                setReaders(devices[0]);
            }
          })
          .catch((error) => {
            Swal.fire('Error', 'Error al encontrar el dispositivo', 'error')
            close()
          });
    },[])

    const start = (e) => {
        e.preventDefault();
        if (!acquisitionStarted) {
          sdkTestInstance.startCapture(setAcquisitionStarted, readers);
        } else {
          Swal.fire("Captura en curso", "Ya está capturando", "info");
        }
      };

    const stop =(e) => {
        e.preventDefault()
        sdkTestInstance.stopCapture(setAcquisitionStarted)
    }

    const onClear = (e) => {
        e.preventDefault()
        const vDiv = document.getElementById("imagendiv");
        if (vDiv) {
        vDiv.innerHTML = ""; // Limpiar contenido previo
        }
        localStorage.removeItem("imageSrc");
        localStorage.removeItem("wsq");
        localStorage.removeItem("raw");
        localStorage.removeItem("intermediate");
    }

    const download = (e) => {
        e.preventDefault()
        const imageElement = document.querySelector("#imagendiv img");
        if (!imageElement || !imageElement.src.startsWith("data:image")) {
            Swal.fire('Error', 'Primero realice el escaneo','error')
            return;
        }

        const link = document.createElement("a");
        link.href = imageElement.src; // Base64 source
        link.download = "Escaner.png"; // Nombre del archivo
        link.click();
    };

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
                    <h1 className="font-bold text-lg">Tomar Huella</h1>
                </div>
                
                <div className="p-6 bg-gray-100">
                {/* Contenedor de dos columnas */}
                    <div className='flex items-center justify-center'>
                        <div className='flex flex-row border-2 p-3 items-center border-black justify-center text-center'>
                            <h1>Calidad del Escaner: </h1>
                            <input className='text-center ml-4' type="text" value={calidad} disabled />
                        </div>
                    </div>
                    {acquisitionStarted && <div className='flex items-center justify-center my-3'>
                        <h1 className='text-red-600 text-xl'>Listo para Escanear</h1>
                    </div>}
                    <div className='flex items-center justify-center w-auto h-auto mt-3 '>
                        <div id='imagendiv' className='p-0 m-0 w-[500px] h-[400px] border-2 border-indigo-900'></div>
                    </div>
                    <div className='flex items-start justify-center w-full pt-6'>
                        <div className='flex justify-around w-full'>
                            <button onClick={(e) => {onClear(e)}} className='azul-btn px-5 py-2 rounded-lg'>Limpiar</button>
                            <button onClick={(e) => {download(e)}} className='azul-btn px-5 py-2 rounded-lg'>Guardar</button>
                            <button disabled={acquisitionStarted} onClick={(e) => {start(e)}} className={`azul-btn px-5 py-2 rounded-lg ${acquisitionStarted && 'opacity-65'}`}>Iniciar</button>
                            <button disabled={!acquisitionStarted} onClick={(e) => {stop(e)}} className={`azul-btn px-5 py-2 rounded-lg ${!acquisitionStarted && 'opacity-65'}`}>Detener</button>
                        </div>
                    </div>
                
                    {/* Botón de guardar */}
                    <div className="flex justify-end mt-4">
                        <button  className="bg-[#fc6b03] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Guardar datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default NewHuella