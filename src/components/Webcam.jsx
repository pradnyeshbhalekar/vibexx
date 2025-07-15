import React, { useCallback, useRef, useState, useEffect } from "react";
import { Camera, ArrowLeft, Loader2, AlertCircle, Smile } from "lucide-react";

const WebcamCapture = ({ setShowWebcam, moodOptions }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [changeMood, setChangeMood] = useState(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    startWebcam();
    return () => stopWebcam();
  }, []);

  const startWebcam = async () => {
    try {
      setError(null);
      setPermissionDenied(false);
      setWebcamReady(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          setWebcamReady(true);
        };
      }
    } catch (err) {
      console.error("Webcam error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError("Camera access denied. Please allow camera access and refresh the page.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found. Please ensure your device has a camera.");
      } else {
        setError("Failed to access camera. Please check your browser settings.");
      }
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setWebcamReady(false);
  };

  const capture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    setLoading(true);
    setMood(null);
    setError(null);

    try {
      setTimeout(() => {
        const mockMoods = ['Happy', 'Sad', 'Neutral', 'Angry'];
        const randomMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];
        const randomScore = 0.7 + (Math.random() * 0.3);
        
        setMood({ 
          emotion: randomMood, 
          score: randomScore 
        });
        setVisibleModal(true);
        setLoading(false);
      }, 2000);

      const res = await fetch("http://127.0.0.1:5000/detectmood/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
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
      setLoading(false);
    
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server error occurred");
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
    
    console.log("Mood confirmed:", finalMood);
    window.location.href = `http://127.0.0.1:5000/login?mood=${encodeURIComponent(finalMood)}`;
    closeModal();
  };

  return (
    <section className={`min-h-[calc(100vh-5rem)] flex items-center justify-center px-8 transition-all duration-1000 ease-out ${
      webcamReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      <div className="max-w-4xl w-full text-center">
        <div className="mb-10">
          <h2 className="text-5xl font-bold mb-6 text-white" data-cursor="text">Mood Detection</h2>
          <p className="text-gray-400 text-xl" data-cursor="text">Position yourself in good lighting and look directly at the camera</p>
        </div>

        <div className="rounded-3xl p-10 mb-10 border border-white/20 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30">
          <div className="flex justify-center mb-6 relative">
            {!webcamReady && !error && (
              <div className="w-[640px] h-[480px] rounded-2xl flex items-center justify-center border-2 border-dashed border-white/20 bg-gray-900/30">
                <div className="text-center text-gray-500">
                  <Loader2 size={48} className="mb-4 animate-spin mx-auto" />
                  <p className="text-xl">Starting camera...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="w-[640px] h-[480px] rounded-2xl flex items-center justify-center border-2 border-dashed border-red-500/30 bg-red-900/10">
                <div className="text-center text-gray-400">
                  <AlertCircle size={48} className="mb-4 mx-auto text-red-400" />
                  <p className="text-xl">Camera Error</p>
                  <p className="text-base mt-2">{permissionDenied ? "Access denied" : "Unable to start camera"}</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-[640px] h-[480px] rounded-2xl bg-black object-cover transition-all duration-700 ease-out ${
                webcamReady ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={capture}
            disabled={loading || !webcamReady}
            className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-bold flex items-center gap-3 transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 ${
              (loading || !webcamReady) ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:shadow-lg hover:shadow-blue-500/25'
            }`} data-cursor="pointer"
          >
            {loading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera size={22} />
                Analyze mood
              </>
            )}
          </button>
          <button
            onClick={() => setShowWebcam(false)}
            className="text-white border px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:-translate-y-1" style={{ borderColor: '#ffffff20' }} data-cursor="pointer"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {error && (
          <div className="mt-6 border rounded-2xl p-4 text-gray-400 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-white/20">
            <strong>Error:</strong> {error}
            {permissionDenied && (
              <div className="mt-2 text-sm">
                <p>To fix this:</p>
                <ul className="text-left mt-2 space-y-1">
                  <li>• Click the camera icon in your browser's address bar</li>
                  <li>• Select "Allow" for camera access</li>
                  <li>• Refresh the page and try again</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {visibleModal && mood && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="rounded-3xl shadow-2xl max-w-lg w-full p-10 border animate-in slide-in-from-bottom-4 duration-500 scale-in-95" style={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20' }}>
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border animate-bounce" style={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20' }}>
                  {(() => {
                    const selectedMood = moodOptions.find(m => m.name === (changeMood || mood.emotion));
                    const IconComponent = selectedMood?.icon || Smile;
                    return <IconComponent size={36} style={{ color: selectedMood?.color || "#666" }} className="animate-pulse" />;
                  })()}
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 animate-pulse" data-cursor="text">Mood detected</h3>
                <p className="text-2xl text-gray-300 font-semibold mb-2" data-cursor="text">{changeMood || mood.emotion}</p>
                {mood.score && (
                  <p className="text-base text-gray-400">{Math.round(mood.score * 100)}% confidence</p>
                )}
              </div>
              <div className="mb-10">
                <p className="text-gray-400 mb-6 text-center text-lg" data-cursor="text">Not quite right? Select your current mood:</p>
                <div className="grid grid-cols-2 gap-4">
                  {moodOptions.map((option, index) => {
                    const isSelected = changeMood === option.name;
                    return (
                      <button
                        key={option.name}
                        onClick={() => setChangeMood(option.name)}
                        className={`p-5 rounded-xl border transition-all duration-300 text-center hover:scale-105 hover:-translate-y-1 ${
                          isSelected ? 'border-2 scale-105 shadow-lg' : 'border hover:border-blue-500'
                        }`} style={{ backgroundColor: '#0a0a0a', borderColor: isSelected ? option.color : '#ffffff20', animationDelay: `${index * 100}ms` }} data-cursor="button"
                      >
                        <option.icon size={24} color={option.color} className={`mx-auto mb-3 transition-all duration-300 ${isSelected ? 'animate-bounce' : 'hover:scale-110' }`} />
                        <p className="text-base font-semibold text-white">{option.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 text-white border px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
                  style={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20' }} data-cursor="pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMood}
                  className="flex-1 text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:opacity-90 hover:scale-105 hover:-translate-y-1"
                  style={{ backgroundColor: '#3B81F6' }} data-cursor="pointer"
                >
                  Connect Spotify
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WebcamCapture;