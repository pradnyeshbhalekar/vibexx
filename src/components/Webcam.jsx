"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { 
  Camera, 
  Music, 
  Brain, 
  Headphones, 
  TrendingUp, 
  ArrowLeft,
  Loader2,
  Smile,
  Frown,
  Meh,
  Angry,
  AlertCircle
} from "lucide-react";

const MoodDetectorLanding = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [changeMood, setChangeMood] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamReady, setWebcamReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Start webcam when component mounts and showWebcam is true
  useEffect(() => {
    if (showWebcam) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [showWebcam]);

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

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    setLoading(true);
    setMood(null);
    setError(null);

    try {
      // Simulate mood detection for demo purposes
      // In a real app, you would send this to your backend
      setTimeout(() => {
        const mockMoods = ['Happy', 'Sad', 'Neutral', 'Angry'];
        const randomMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];
        const randomScore = 0.7 + (Math.random() * 0.3); // 70-100% confidence
        
        setMood({ 
          emotion: randomMood, 
          score: randomScore 
        });
        setVisibleModal(true);
        setLoading(false);
      }, 2000);

      // Uncomment and modify this section for real API integration:
      /*
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
      */
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
    window.location.href = "http://127.0.0.1:5000/login";
    // Handle Spotify login here
    closeModal();
  };

  const moodOptions = [
    { name: "Sad", icon: Frown, color: "#3b82f6" },
    { name: "Happy", icon: Smile, color: "#10b981" },
    { name: "Neutral", icon: Meh, color: "#6b7280" },
    { name: "Angry", icon: Angry, color: "#ef4444" },
  ];

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#0f0f0f",
      color: "#ffffff",
      position: "relative"
    }}>
      {/* Subtle background pattern */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        opacity: "0.3",
        zIndex: 1
      }} />

      {/* Header */}
      <header style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "rgba(26, 26, 26, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #262626"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#3b82f6",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Music size={18} color="white" />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: "700" }}>Moodify</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <a href="#how-it-works" style={{ 
              color: "#888", 
              textDecoration: "none", 
              fontWeight: "500",
              transition: "color 0.2s ease"
            }}>
              How it works
            </a>
            <button style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}>
              Sign in
            </button>
          </div>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 2 }}>
        {!showWebcam ? (
          <>
            {/* Hero Section */}
            <section style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "5rem 2rem",
              textAlign: "center"
            }}>
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  lineHeight: "1.1",
                  background: "linear-gradient(135deg, #ffffff 0%, #888888 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Music that matches<br />your mood
                </h1>
                <p style={{
                  fontSize: "1.25rem",
                  color: "#888",
                  marginBottom: "2.5rem",
                  lineHeight: "1.6"
                }}>
                  Advanced emotion recognition technology analyzes your facial expressions 
                  to curate the perfect playlist for how you're feeling right now.
                </p>
                <button
                  onClick={() => setShowWebcam(true)}
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#2563eb";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#3b82f6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <Camera size={20} />
                  Start mood detection
                </button>
              </div>
            </section>

            {/* Features */}
            <section style={{
              backgroundColor: "#111111",
              padding: "5rem 2rem",
              borderTop: "1px solid #262626",
              borderBottom: "1px solid #262626"
            }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "3rem"
                }}>
                  {[
                    {
                      icon: Brain,
                      title: "AI-Powered Analysis",
                      desc: "Our machine learning algorithms analyze micro-expressions and facial patterns to accurately determine your emotional state."
                    },
                    {
                      icon: Headphones,
                      title: "Curated Playlists",
                      desc: "Each mood is paired with carefully selected tracks that complement and enhance your current emotional experience."
                    },
                    {
                      icon: TrendingUp,
                      title: "Personalized Experience",
                      desc: "The system learns from your preferences over time to provide increasingly accurate and personalized music recommendations."
                    }
                  ].map((feature, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      <div style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "#1a1a1a",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem auto",
                        border: "1px solid #262626"
                      }}>
                        <feature.icon size={28} color="#888" />
                      </div>
                      <h3 style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        marginBottom: "1rem",
                        color: "#ffffff"
                      }}>
                        {feature.title}
                      </h3>
                      <p style={{
                        color: "#888",
                        lineHeight: "1.6"
                      }}>
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" style={{ padding: "5rem 2rem" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                  <h2 style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: "#ffffff"
                  }}>
                    How it works
                  </h2>
                  <p style={{ color: "#888", fontSize: "1.1rem" }}>
                    Simple, fast, and accurate mood detection in four steps
                  </p>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "2rem"
                }}>
                  {[
                    { step: "01", title: "Capture", desc: "Take a photo using your device camera" },
                    { step: "02", title: "Analyze", desc: "AI processes your facial expressions" },
                    { step: "03", title: "Confirm", desc: "Review and adjust the detected mood" },
                    { step: "04", title: "Listen", desc: "Enjoy your personalized playlist" }
                  ].map((item, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                        color: "#666",
                        marginBottom: "1rem"
                      }}>
                        {item.step}
                      </div>
                      <h4 style={{
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        marginBottom: "0.75rem",
                        color: "#ffffff"
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ color: "#888" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section style={{
            minHeight: "calc(100vh - 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}>
            <div style={{
              maxWidth: "800px",
              width: "100%",
              textAlign: "center"
            }}>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  color: "#ffffff"
                }}>
                  Mood Detection
                </h2>
                <p style={{
                  color: "#888",
                  fontSize: "1.1rem"
                }}>
                  Position yourself in good lighting and look directly at the camera
                </p>
              </div>

              <div style={{
                backgroundColor: "#111111",
                borderRadius: "20px",
                padding: "2rem",
                marginBottom: "2rem",
                border: "1px solid #262626"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  position: "relative"
                }}>
                  {!webcamReady && !error && (
                    <div style={{
                      width: "640px",
                      height: "480px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #262626"
                    }}>
                      <div style={{ textAlign: "center", color: "#666" }}>
                        <Loader2 size={48} style={{ 
                          marginBottom: "1rem",
                          animation: "spin 1s linear infinite"
                        }} />
                        <p>Starting camera...</p>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div style={{
                      width: "640px",
                      height: "480px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #ef4444"
                    }}>
                      <div style={{ textAlign: "center", color: "#ef4444" }}>
                        <AlertCircle size={48} style={{ marginBottom: "1rem" }} />
                        <p>Camera Error</p>
                        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                          {permissionDenied ? "Access denied" : "Unable to start camera"}
                        </p>
                      </div>
                    </div>
                  )}

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: "640px",
                      height: "480px",
                      borderRadius: "12px",
                      backgroundColor: "#000",
                      objectFit: "cover",
                      display: webcamReady ? "block" : "none"
                    }}
                  />
                  
                  <canvas
                    ref={canvasRef}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem"
              }}>
                <button
                  onClick={capture}
                  disabled={loading || !webcamReady}
                  style={{
                    backgroundColor: (loading || !webcamReady) ? "#4b5563" : "#3b82f6",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: (loading || !webcamReady) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.2s ease",
                    opacity: (loading || !webcamReady) ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera size={20} />
                      Analyze mood
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowWebcam(false)}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "1px solid #262626",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#262626";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#1a1a1a";
                  }}
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              </div>

              {error && (
                <div style={{
                  marginTop: "1.5rem",
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #ef4444",
                  borderRadius: "12px",
                  padding: "1rem",
                  color: "#ef4444"
                }}>
                  <strong>Error:</strong> {error}
                  {permissionDenied && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                      <p>To fix this:</p>
                      <ul style={{ textAlign: "left", marginTop: "0.5rem" }}>
                        <li>Click the camera icon in your browser's address bar</li>
                        <li>Select "Allow" for camera access</li>
                        <li>Refresh the page and try again</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {visibleModal && mood && (
        <div style={{
          position: "fixed",
          inset: "0",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "1rem",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "20px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            maxWidth: "500px",
            width: "100%",
            padding: "2.5rem",
            border: "1px solid #262626",
            animation: "slideUp 0.3s ease"
          }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#111111",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem auto",
                border: "1px solid #262626"
              }}>
                {(() => {
                  const selectedMood = moodOptions.find(m => m.name === (changeMood || mood.emotion));
                  const IconComponent = selectedMood?.icon || Smile;
                  return <IconComponent size={36} color={selectedMood?.color || "#888"} />;
                })()}
              </div>
              <h3 style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "0.75rem"
              }}>
                Mood detected
              </h3>
              <p style={{
                fontSize: "1.5rem",
                color: "#888",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}>
                {changeMood || mood.emotion}
              </p>
              {mood.score && (
                <p style={{
                  fontSize: "1rem",
                  color: "#666"
                }}>
                  {Math.round(mood.score * 100)}% confidence
                </p>
              )}
            </div>

            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{
                color: "#888",
                marginBottom: "1.5rem",
                textAlign: "center",
                fontSize: "1.1rem"
              }}>
                Not quite right? Select your current mood:
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem"
              }}>
                {moodOptions.map((option) => {
                  const isSelected = changeMood === option.name;
                  return (
                    <button
                      key={option.name}
                      onClick={() => setChangeMood(option.name)}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "12px",
                        border: isSelected ? `2px solid ${option.color}` : "1px solid #262626",
                        backgroundColor: isSelected ? "#111111" : "#0f0f0f",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "center"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = "#111111";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = "#0f0f0f";
                        }
                      }}
                    >
                      <option.icon size={24} color={option.color} style={{ marginBottom: "0.75rem" }} />
                      <p style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#ffffff",
                        margin: "0"
                      }}>
                        {option.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "1rem"
            }}>
              <button
                onClick={closeModal}
                style={{
                  flex: "1",
                  backgroundColor: "#111111",
                  color: "#ffffff",
                  border: "1px solid #262626",
                  padding: "1rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#111111";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMood}
                style={{
                  flex: "1",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "1rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#3b82f6";
                }}
              >
                Connect Spotify
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MoodDetectorLanding;