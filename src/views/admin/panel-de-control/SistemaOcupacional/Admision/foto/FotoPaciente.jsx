import { faTimes, faCamera, faSave, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Submit } from '../model/Submit';

const MAX_WIDTH = 800; // se reduce la foto para no enviar archivos enormes

// `subir(base64)` permite que otro módulo (p. ej. asistencial) registre la foto en su propio endpoint;
// por defecto se guarda como archivo de empleado, igual que antes.
const FotoPaciente = ({
    close, DNI, Foto, setFoto,
    subir = (base64) => Submit({ dni: DNI, tipoA: 'FOTO_PACIENTE', nombre: 'FotoPaciente.png', base64 })
}) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [devices, setDevices] = useState([]);
    const [deviceId, setDeviceId] = useState('');
    const [statusMsg, setStatusMsg] = useState('Iniciando cámara...');
    const [statusColor, setStatusColor] = useState('blue');
    const [captured, setCaptured] = useState('');       // dataURL de la foto tomada
    const savedUrl = Foto?.id === 1 && Foto?.url ? Foto.url : '';   // foto ya guardada
    const [showSaved, setShowSaved] = useState(!!savedUrl);          // por defecto se muestra la guardada

    const setStatus = (text, color = 'blue') => {
        setStatusMsg(text);
        setStatusColor(color);
    };

    const stopStream = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    };

    const startCamera = async (id) => {
        stopStream();
        if (!navigator.mediaDevices?.getUserMedia) {
            return setStatus('Este navegador no soporta acceso a la cámara (requiere HTTPS o localhost)', 'red');
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: id ? { deviceId: { exact: id } } : true,
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;

            // Las etiquetas de dispositivos solo están disponibles tras conceder el permiso
            const all = await navigator.mediaDevices.enumerateDevices();
            setDevices(all.filter(d => d.kind === 'videoinput'));
            setDeviceId(stream.getVideoTracks()[0]?.getSettings().deviceId || id || '');
            setStatus('Cámara lista. Presione "Tomar foto"', 'blue');
        } catch (err) {
            const msg = err.name === 'NotAllowedError'
                ? 'Permiso de cámara denegado'
                : err.name === 'NotFoundError' || err.name === 'OverconstrainedError'
                    ? 'No se encontró esa cámara'
                    : err.name === 'NotReadableError'
                        ? 'La cámara no se pudo abrir (puede estar en uso por otra aplicación o no ser una cámara de video normal)'
                        : `No se pudo iniciar la cámara (${err.name})`;
            setStatus(msg, 'red');
            // el selector debe seguir disponible aunque esta cámara falle, para poder probar otra
            if (devices.length === 0) {
                navigator.mediaDevices.enumerateDevices()
                    .then(all => setDevices(all.filter(d => d.kind === 'videoinput')))
                    .catch(() => { });
            }
        }
    };

    // close llega como función inline: se guarda en ref para no reiniciar la cámara en cada render del padre
    const closeRef = useRef(close);
    closeRef.current = close;

    useEffect(() => {
        startCamera();
        const handleEsc = (event) => {
            if (event.key === 'Escape') closeRef.current();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
            stopStream();
        };
    }, []);

    const takePhoto = (e) => {
        e.preventDefault();
        const video = videoRef.current;
        if (!video || !video.videoWidth) {
            return Swal.fire('Error', 'La cámara aún no está lista', 'error');
        }
        const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        setCaptured(canvas.toDataURL('image/png'));
        setStatus('Foto capturada. Puede guardarla o repetirla', 'green');
    };

    const retake = (e) => {
        e.preventDefault();
        setCaptured('');
        setShowSaved(false);
        setStatus('Cámara lista. Presione "Tomar foto"', 'blue');
    };

    // vuelve a mostrar la foto que ya estaba guardada
    const backToSaved = (e) => {
        e.preventDefault();
        setCaptured('');
        setShowSaved(true);
        setStatus('Este paciente ya tiene una foto guardada', 'blue');
    };

    const SubmitFoto = () => {
        if (!captured) {
            return Swal.fire('Error', showSaved ? 'La foto guardada no ha cambiado. Tome otra foto para reemplazarla' : 'Primero tome la foto', 'error');
        }
        Swal.fire({
            title: 'Validando Datos',
            text: 'Espere por favor...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });
        subir(captured.substring(captured.indexOf(',') + 1))
            .then((res) => {
                if (res.id) {
                    Swal.fire('Exito', `${res.mensaje}`, 'success');
                    setFoto(captured);
                    close();
                } else {
                    Swal.fire('Error', 'Ocurrio un error al registrar la foto', 'error');
                }
            })
            .catch(() => Swal.fire('Error', 'Ocurrio un error al registrar la foto', 'error'));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#233245] text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Captura de Fotografía</h2>
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
                    <div className="mb-4">
                        <div className={`p-3 rounded-lg text-center ${statusColor === 'red' ? 'bg-red-100 text-red-700' : statusColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            <p className="font-medium">{statusMsg}</p>
                        </div>
                    </div>

                    {devices.length > 1 && (
                        <div className="flex items-center gap-2 mb-4">
                            <label className="text-sm">Cámara:</label>
                            <select
                                value={deviceId}
                                onChange={(e) => {
                                    // se fija el valor ya, para que el selector refleje la cámara elegida aunque falle
                                    setDeviceId(e.target.value);
                                    setCaptured('');
                                    setShowSaved(false);
                                    setStatus('Iniciando cámara...');
                                    startCamera(e.target.value);
                                }}
                                className="border border-gray-300 px-2 py-1 rounded-md bg-slate-100 w-full"
                            >
                                {devices.map((d, i) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label || `Cámara ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Preview */}
                    <div className="flex justify-center mb-6">
                        <div className="w-[500px] h-[375px] border-2 border-indigo-900 rounded-lg shadow-md bg-gray-50 overflow-hidden flex items-center justify-center">
                            {captured && (
                                <img src={captured} alt="Foto capturada" className="w-full h-full object-contain" />
                            )}
                            {showSaved && (
                                <img src={savedUrl} alt="Foto del paciente" className="w-full h-full object-contain" />
                            )}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-contain ${captured || showSaved ? 'hidden' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4 mb-6">
                        {captured ? (
                            <button
                                onClick={retake}
                                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faRedo} />
                                <span>Repetir</span>
                            </button>
                        ) : showSaved ? (
                            <button
                                onClick={retake}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faCamera} />
                                <span>Tomar otra foto</span>
                            </button>
                        ) : (
                            <button
                                onClick={takePhoto}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faCamera} />
                                <span>Tomar foto</span>
                            </button>
                        )}
                        {savedUrl && !showSaved && (
                            <button
                                onClick={backToSaved}
                                className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                                <span>Ver foto guardada</span>
                            </button>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={SubmitFoto}
                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            <span>Guardar Foto</span>
                        </button>
                    </div>
                </div>

                {/* Button Legend */}
                <div className="mt-4 p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white">
                                <FontAwesomeIcon icon={faCamera} />
                            </span>
                            <span>Tomar foto: Captura la imagen de la cámara</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-600 text-white">
                                <FontAwesomeIcon icon={faRedo} />
                            </span>
                            <span>Repetir: Descarta y vuelve a la cámara</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-600 text-white">
                                <FontAwesomeIcon icon={faSave} />
                            </span>
                            <span>Guardar: Almacena la foto</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FotoPaciente;
