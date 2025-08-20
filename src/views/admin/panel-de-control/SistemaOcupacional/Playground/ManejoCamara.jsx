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
        <Webcam setCapturedImage={setCapturedImage} type="portrait" />
        {capturedImage && <img src={capturedImage} alt="Captured" />}
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
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              setCapturedImage(imageSrc);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Capture photo
          </button>
        )}
      </ReactWebCam>
    </div>
  );
}
