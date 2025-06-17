import React, { useEffect, useState } from "react";

const ArtistSelector = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/top-artist-json", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setArtists(data);
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
        setError("Something went wrong!");
      }
    };
    fetchArtists();
  }, []);

  const toggleArtist = (artist, index) => {
    const artistId = artist.name + index;
    const isSelected = selectedArtists.some(a => a.id === artistId);
    
    if (isSelected) {
      setSelectedArtists(selectedArtists.filter(a => a.id !== artistId));
    } else if (selectedArtists.length < 5) {
      setSelectedArtists([...selectedArtists, { ...artist, id: artistId }]);
    }
  };

  const createPlaylist = () => {
    console.log("Creating playlist with:", selectedArtists);
    alert(`Creating playlist with ${selectedArtists.length} selected artists!`);
  };

  const isSelected = (artist, index) => {
    const artistId = artist.name + index;
    return selectedArtists.some(a => a.id === artistId);
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#0f0f0f",
      color: "#ffffff"
    }}>
      {/* Subtle grid pattern */}
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

      <div style={{ 
        position: "relative",
        zIndex: 2,
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "3rem"
        }}>
          <h2 style={{ 
            fontSize: "2.5rem", 
            margin: "0 0 1rem 0",
            color: "#ffffff",
            fontWeight: "800",
            letterSpacing: "-0.02em"
          }}>
            🎵 Your Top Artists
          </h2>
          
          <p style={{ 
            color: "#888888", 
            fontSize: "1.1rem", 
            marginBottom: "2rem",
            fontWeight: "400"
          }}>
            Select artists to build your playlist
          </p>
          
          {/* Progress Bar */}
          <div style={{ 
            width: "300px", 
            margin: "0 auto",
            backgroundColor: "#262626",
            borderRadius: "6px",
            height: "8px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${(selectedArtists.length / 5) * 100}%`,
              height: "100%",
              backgroundColor: selectedArtists.length === 5 ? "#22c55e" : "#3b82f6",
              borderRadius: "6px",
              transition: "all 0.3s ease"
            }} />
          </div>
          
          <p style={{ 
            color: "#666666", 
            fontSize: "0.9rem", 
            marginTop: "0.5rem",
            fontWeight: "500"
          }}>
            {selectedArtists.length}/5 selected
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ 
            color: "#ef4444", 
            textAlign: "center", 
            padding: "1rem",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #262626"
          }}>
            {error}
          </div>
        )}

        {/* Artists Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          {artists.map((artist, index) => (
            <div
              key={index}
              onClick={() => toggleArtist(artist, index)}
              style={{
                backgroundColor: isSelected(artist, index) ? "#1a1a1a" : "#111111",
                border: isSelected(artist, index) ? "2px solid #3b82f6" : "1px solid #262626",
                borderRadius: "12px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                transform: isSelected(artist, index) ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isSelected(artist, index) 
                  ? "0 8px 25px rgba(59, 130, 246, 0.2)" 
                  : "0 4px 12px rgba(0,0,0,0.3)",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                if (!isSelected(artist, index)) {
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected(artist, index)) {
                  e.currentTarget.style.backgroundColor = "#111111";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {/* Selection indicator */}
              {isSelected(artist, index) && (
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  ✓
                </div>
              )}
              
              <div style={{ marginBottom: "1rem" }}>
                <img
                  src={artist.image}
                  alt={artist.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
              </div>
              
              <h4 style={{ 
                margin: "0 0 0.5rem 0", 
                fontSize: "1.2rem",
                color: "#ffffff",
                fontWeight: "700"
              }}>
                {artist.name}
              </h4>
              
              <p style={{ 
                fontSize: "0.9rem", 
                color: "#888888",
                margin: "0",
                lineHeight: "1.4"
              }}>
                {artist.genres.length ? artist.genres.join(", ") : "No genres listed"}
              </p>
            </div>
          ))}
        </div>

        {/* Create Playlist Button */}
        {selectedArtists.length > 0 && (
          <div style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000
          }}>
            <button
              onClick={createPlaylist}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#2563eb";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#3b82f6";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Create Playlist ({selectedArtists.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistSelector;