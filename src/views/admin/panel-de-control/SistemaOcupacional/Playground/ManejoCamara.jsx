import {
  faCamera,
  faPlay,
  faRefresh,
  faSave,
  faStop,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ReactWebCam from "react-webcam";

const aspectRatios = {
  landscape: {
    width: 1920,
    height: 1080,
  },
  portrait: {
    height: 450,
    width: 280,
  },
};

export default function ManejoCamara() {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95%] md:max-w-[80%]">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#233245] text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Captura de Fotografía del Paciente
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm">Presione ESC para cerrar</span>
                <button
                  // onClick={close}
                  className="text-white hover:text-gray-300 transition-colors text-xl"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Fingerprint Display */}
              <div className="flex justify-center mb-6">
                <div className="flex justify-center mb-6 relative w-[210px] h-[337.5px]">
                  {/* Imagen capturada */}
                  <div
                    className={`${
                      capturedImage ? "block" : "hidden"
                    } absolute inset-0 flex flex-col items-center`}
                  >
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-[210px] h-[337.5px] object-cover border rounded-lg"
                    />
                    <button
                      className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 mt-4"
                      onClick={() => setCapturedImage(null)}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                      <span>Volver a Intentar</span>
                    </button>
                  </div>

                  {/* Webcam siempre montada */}
                  <div
                    className={`${
                      capturedImage ? "hidden" : "block"
                    } absolute inset-0 flex justify-center items-center mt-[54px]`}
                  >
                    <Webcam
                      setCapturedImage={setCapturedImage}
                      type="portrait"
                    />
                  </div>
                </div>
              </div>

              {/* Control Buttons */}

              {/* Save Button */}
              <div
                className={`${
                  capturedImage ? "block" : "opacity-0"
                } flex justify-end`}
              >
                <button
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                  disabled={!capturedImage}
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Guardar Fotografía</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Webcam({ setCapturedImage, type = "landscape" }) {
  return (
    <div className="webcam">
      <ReactWebCam
        mirrored
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        videoConstraints={{
          facingMode: "user",
          ...aspectRatios[type],
        }}
        className="border rounded-lg"
      >
        {({ getScreenshot }) => (
          <div className="flex justify-center gap-4 my-4">
            <button
              className={`px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 `}
              onClick={() => {
                const imageSrc = getScreenshot();
                setCapturedImage(imageSrc);
              }}
            >
              <FontAwesomeIcon icon={faCamera} />
              <span>Tomar Fotografía</span>
            </button>
          </div>
        )}
      </ReactWebCam>
    </div>
  );
}
