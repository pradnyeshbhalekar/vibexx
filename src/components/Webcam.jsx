"use client";
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import {
  faFaceFrown,
  faSmile,
  faMeh,
  faAngry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Webcamera = () => {
  const webcamRef = useRef(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [changeMood, setChangeMood] = useState(null);

  const capture = useCallback(async () => {
    const imgSrc = webcamRef.current.getScreenshot();
    if (imgSrc) {
      setLoading(true);
      setMood(null);
      setError(null);

      try {
        const res = await fetch("http://127.0.0.1:5000/detectmood/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imgSrc }),
        });

        const data = await res.json();

        if (data.emotion) {
          setMood({ emotion: data.emotion, score: data.score });
          setVisibleModal(true);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Unknown error occurred");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Server error occurred");
      }

      setLoading(false);
    }
  }, []);

  const closeModal = () => {
    setVisibleModal(false);
    setChangeMood(null);
  };

  const handleConfirmMood = async () => {
    const finalMood = changeMood || mood?.emotion;
    if (!finalMood) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/savemood/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: finalMood }),
      });

      const result = await res.json();
      console.log("Saved mood:", result);
      closeModal();
    } catch (err) {
      console.error("Error saving mood:", err);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <Webcam
        ref={webcamRef}
        className="rounded-2xl"
        audio={false}
        height={720}
        width={1280}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <button
        onClick={capture}
        className="p-5 mt-4 rounded-xl text-2xl text-center bg-white text-black hover:bg-gray-700 hover:text-white transition-colors duration-600"
      >
        {loading ? "Detecting..." : "Detect Mood"}
      </button>

      {/* Modal */}
      {visibleModal && mood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-400 w-[40%] h-auto p-8 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Detected Mood</h2>
            <p className="text-xl mb-2">
              {changeMood || mood.emotion} 
            </p>
            <h4 className="font-semibold mb-4">
              Wrong mood? Pick one manually:
            </h4>

            <div className="flex flex-row gap-4 items-center justify-center">
              <button onClick={() => setChangeMood("Sad")}>
                <FontAwesomeIcon
                  icon={faFaceFrown}
                  size="3x"
                  className="hover:text-blue-400"
                />
              </button>
              <button onClick={() => setChangeMood("Happy")}>
                <FontAwesomeIcon
                  icon={faSmile}
                  size="3x"
                  className="hover:text-blue-400"
                />
              </button>
              <button onClick={() => setChangeMood("Neutral")}>
                <FontAwesomeIcon
                  icon={faMeh}
                  size="3x"
                  className="hover:text-blue-400"
                />
              </button>
              <button onClick={() => setChangeMood("Angry")}>
                <FontAwesomeIcon
                  icon={faAngry}
                  size="3x"
                  className="hover:text-blue-400"
                />
              </button>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmMood}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Mood
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 font-medium">Error: {error}</div>
      )}
    </div>
  );
};

export default Webcamera;
