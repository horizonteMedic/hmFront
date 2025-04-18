import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import Swal from 'sweetalert2';

const SignerContext = createContext();

const signer = 
{ 
  firstName: "John",
  lastName:  "Smith"
};

const NewPad = ({close}) => {
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

   useEffect(() => {
    // When the form is first drawn call the bodyOnLoad() function to initialise the SigCaptX session
    window.bodyOnLoad(document.getElementById("txtDisplay"), document.getElementById("chkShowSigText"), document.getElementById("Restore"));
  }, []);

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
                    <h1 className="font-bold text-lg">Tomar Firma</h1>
                </div>
                
                <div className="p-6 bg-gray-100">
                {/* Contenedor de dos columnas */}
                    <div className='flex items-center justify-center w-auto h-auto mt-3 '>
                        <div id='imageBox' ref={imageBox} className='p-0 m-0 w-[500px] h-[400px] border-2 border-indigo-900'></div>
                    </div>
                    

                    <div className='flex items-start justify-center w-full pt-6'>
                        <div className='flex justify-around w-full'>
                            <button onClick={(e) => {e.preventDefault(),window.aboutBox()}}  className='azul-btn px-5 py-2 rounded-lg'>Licencia</button>
                            <button onClick={(e) => {e.preventDefault(), window.clearSignature()}}  className='azul-btn px-5 py-2 rounded-lg'>Limpiar</button>
                            <button onClick={(e) => {download(e)}} className='azul-btn px-5 py-2 rounded-lg'>Guardar</button>
                            <button onClick={(e) => {e.preventDefault(),window.capture("jhon", "Cabrera", imageBox.current, txtSignature.current, chkSigText.current, chkB64.current)}}  className={`azul-btn px-5 py-2 rounded-lg `}>Iniciar</button>
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
            {/*Cossas necesarioas pero no debo mostrar */}
            <textarea className='hidden' cols="125" rows="15" id="txtDisplay" ref={txtDisplay}></textarea>
            <input className='hidden' type="checkbox" id="chkShowSigText" onChange={() => setRestoreButtonState(chkValue)} ref={chkSigText} />
            <input className='hidden' type="checkbox" id="chkShowSigText" onChange={() => setRestoreButtonState(chkValue)} ref={chkSigText} />
            <input className='hidden' type="checkbox" id="chkUseB64Image" ref={chkB64}/>Use base-64 signature image

        </div>
        
        </>
    )
}

export default NewPad