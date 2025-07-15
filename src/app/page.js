"use client";
import React, { useState, useEffect } from "react";
import WebcamCapture from "../components/Webcam";
import CustomCursor from "../components/CustomCursor";
import { Music, Headphones, TrendingUp, Smile, Frown, Meh, Angry, Camera } from "lucide-react";
import "../styles/animation.css";

const MoodDetectorLanding = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  // Initialize page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const moodOptions = [
    { name: "Sad", icon: Frown, color: "#6b7280" },
    { name: "Happy", icon: Smile, color: "#10b981" },
    { name: "Neutral", icon: Meh, color: "#6b7280" },
    { name: "Angry", icon: Angry, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <CustomCursor />
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-[1]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full transition-all duration-1000 ease-out ${
              pageLoaded ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              width: `${15 + i * 8}px`,
              height: `${15 + i * 8}px`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#8B5CF6' : '#06B6D4'
              }40, transparent 70%)`,
              left: `${5 + i * 12}%`,
              top: `${5 + i * 10}%`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <div 
          className={`w-full h-full transition-opacity duration-2000 ease-out ${
            pageLoaded ? 'opacity-10' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, #1f2937 1px, transparent 1px),
              radial-gradient(circle at 75px 75px, #374151 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px, 100px 100px",
            backgroundPosition: "0 0, 50px 50px"
          }} 
        />
      </div>

      {/* Header */}
      <header className={`relative z-10 backdrop-blur-xl border-b border-white/10 transition-all duration-1000 ease-out ${
        pageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`} style={{ backgroundColor: 'rgba(10, 10, 10, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <img src="/logo/vibexlogo.svg" alt="Vibexx Logo" className=" " />
            </div>
          </div>
          <div className={`flex items-center gap-8 transition-all duration-1000 delay-700 ease-out ${
            pageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-all duration-300 font-medium hover:scale-105 transform" data-cursor="pointer">
              How it works
            </a>
            <a href="#moods" className="text-gray-400 hover:text-white transition-all duration-300 font-medium hover:scale-105 transform" data-cursor="pointer">
              Moods
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-2">
        {!showWebcam ? (
          <>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 py-24 text-center">
              <div className="max-w-4xl mx-auto">
                <h1 className={`text-7xl font-black mb-8 leading-tight bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent transition-all duration-1500 delay-300 ease-out ${
                  pageLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
                }`} data-cursor="text">
                  Music that matches<br />your mood
                </h1>
                <p className={`text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto transition-all duration-1500 delay-500 ease-out ${
                  pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`} data-cursor="text">
                  Smart emotion recognition technology analyzes your facial expressions 
                  to curate the perfect playlist for how you're feeling right now.
                </p>
                <button
                  onClick={() => setShowWebcam(true)}
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-bold inline-flex items-center gap-3 transition-all duration-1500 delay-700 ease-out shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 hover:scale-105 ${
                    pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`} data-cursor="pointer"
                >
                  <Camera size={22} />
                  Start mood detection
                </button>
              </div>
            </section>

            {/* Features */}
            <section className={`py-24 border-t border-white/10 transition-all duration-2000 delay-1000 ease-out ${
              pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)' }}>
              <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {[
                    {
                      icon: Music,
                      title: "Smart Analysis",
                      desc: "Advanced technology analyzes facial patterns and expressions to accurately determine your current emotional state."
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
                    <div 
                      key={index} 
                      className={`text-center transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-3 ${
                        pageLoaded ? 'animate-fade-in-up' : 'opacity-0'
                      }`} style={{ animationDelay: `${1200 + index * 200}ms` }}
                    >
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-110" data-cursor="pointer">
                        <feature.icon size={32} className="text-gray-300 hover:text-blue-400 transition-colors duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold mb-6 text-white" data-cursor="text">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-lg" data-cursor="text">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className={`py-24 transition-all duration-2000 delay-1500 ease-out ${
              pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20">
                  <h2 className="text-5xl font-bold mb-6 text-white" data-cursor="text">How it works</h2>
                  <p className="text-gray-400 text-xl" data-cursor="text">Simple, fast, and accurate mood detection in four steps</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  {[
                    { step: "01", title: "Capture", desc: "Take a photo using your device camera" },
                    { step: "02", title: "Analyze", desc: "Technology processes your facial expressions" },
                    { step: "03", title: "Confirm", desc: "Review and adjust the detected mood" },
                    { step: "04", title: "Listen", desc: "Enjoy your personalized playlist" }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className={`text-center transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-2 ${
                        pageLoaded ? 'animate-fade-in-scale' : 'opacity-0'
                      }`} style={{ animationDelay: `${2000 + index * 150}ms` }}
                    >
                      <div className="text-xl font-mono text-blue-400 mb-6 transition-all duration-500 hover:text-blue-300 hover:scale-110">{item.step}</div>
                      <h4 className="text-xl font-bold mb-4 text-white hover:text-blue-300 transition-colors duration-300" data-cursor="text">{item.title}</h4>
                      <p className="text-gray-400 text-lg" data-cursor="text">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Mood Categories */}
            <section id="moods" className={`py-24 border-t border-white/10 transition-all duration-2000 delay-2000 ease-out ${
              pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)' }}>
              <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20">
                  <h2 className="text-5xl font-bold mb-6 text-white" data-cursor="text">Explore Different Moods</h2>
                  <p className="text-gray-400 text-xl" data-cursor="text">Each mood unlocks a unique musical journey</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {[
                    {
                      mood: "Happy",
                      icon: Smile,
                      color: "#10b981",
                      description: "Upbeat tracks to amplify your joy",
                      genres: ["Pop", "Dance", "Feel-good Rock"]
                    },
                    {
                      mood: "Sad",
                      icon: Frown,
                      color: "#6b7280",
                      description: "Reflective music for contemplative moments",
                      genres: ["Indie", "Alternative", "Acoustic"]
                    },
                    {
                      mood: "Neutral",
                      icon: Meh,
                      color: "#6b7280",
                      description: "Balanced vibes for everyday listening",
                      genres: ["Chill", "Lo-fi", "Ambient"]
                    },
                    {
                      mood: "Angry",
                      icon: Angry,
                      color: "#ef4444",
                      description: "Intense beats to channel your energy",
                      genres: ["Rock", "Metal", "Electronic"]
                    }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className={`rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm hover:border-gray-400/50 transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-2xl ${
                        pageLoaded ? 'animate-fade-in-scale' : 'opacity-0'
                      }`} style={{ animationDelay: `${2500 + index * 100}ms` }} data-cursor="pointer"
                    >
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 hover:scale-110 bg-gradient-to-br from-gray-800/50 to-gray-700/30" style={{ boxShadow: `0 0 30px ${item.color}20` }}>
                        <item.icon size={36} style={{ color: item.color }} className="transition-all duration-300 hover:scale-110" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-white text-center hover:text-blue-300 transition-colors duration-300" data-cursor="text">{item.mood}</h3>
                      <p className="text-gray-400 text-center mb-6 text-base" data-cursor="text">{item.description}</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {item.genres.map((genre, i) => (
                          <span 
                            key={i} 
                            className="text-gray-300 px-4 py-2 rounded-full text-sm border border-white/20 bg-gray-800/50 hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300 hover:scale-105" data-cursor="pointer"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <WebcamCapture 
            setShowWebcam={setShowWebcam} 
            moodOptions={moodOptions}
          />
        )}
      </main>
    </div>
  );
};

export default MoodDetectorLanding;