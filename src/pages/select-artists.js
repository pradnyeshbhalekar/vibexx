'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomCursor from '../components/CustomCursor';
import '../styles/animation.css';

const ArtistSelector = ({ mood = 'Happy', onArtistsSelected = () => {} }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [error, setError] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    console.log('Mood prop:', mood); // Log mood prop
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('http://127.0.0.1:5000/top-artist-json', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else if (Array.isArray(data)) {
          setArtists(data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError(
          err.message.includes('fetch')
            ? 'Cannot connect to server. Ensure backend is running on http://127.0.0.1:5000'
            : err.message.includes('404')
            ? 'Endpoint not found. Check /top-artist-json'
            : `Failed to fetch artists: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const toggleArtist = (artist) => {
    const isSelected = selectedArtists.some((a) => a.id === artist.id);
    if (isSelected) {
      setSelectedArtists(selectedArtists.filter((a) => a.id !== artist.id));
    } else if (selectedArtists.length < 5) {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const createPlaylist = async () => {
    if (selectedArtists.length === 0) {
      setError('Please select at least one artist');
      return;
    }
    if (!['Happy', 'Sad', 'Angry', 'Neutral'].includes(mood)) {
      setError('Invalid mood selected');
      return;
    }
    try {
      setCreatingPlaylist(true);
      setError('');
      const payload = {
        mood,
        artists: selectedArtists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
      };
      console.log('Sending payload:', payload); // Log payload
      const response = await axios.post(
        'http://127.0.0.1:5000/user-top',
        payload,
        { withCredentials: true }
      );
      const data = response.data;
      console.log('Response data:', data); // Log response
      if (data.playlist_url && data.matched) {
        setPlaylistData(data);
        setShowPreview(true);
        onArtistsSelected({ playlist_url: data.playlist_url, matched: data.matched });
        window.location.href = `/results?playlist_url=${encodeURIComponent(data.playlist_url)}`;
      } else {
        setError(data.error || 'Failed to create playlist');
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      console.log('AxiosError details:', err.response?.data, err.response?.status);
      setError(
        err.response
          ? `Server error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`
          : err.request
          ? 'Cannot connect to server. Ensure backend is running.'
          : `Failed to create playlist: ${err.message}`
      );
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const isSelected = (artist) => selectedArtists.some((a) => a.id === artist.id);

  const retryFetch = () => {
    setError('');
    setLoading(true);
    setArtists([]);
    setSelectedArtists([]);
    window.location.reload();
  };

  const closePreview = () => {
    setShowPreview(false);
    setPlaylistData(null);
    setSelectedArtists([]);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white relative overflow-hidden">
      <CustomCursor />
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a1a_1px,transparent_1px)] bg-[length:50px_50px] opacity-30 z-10" />
      <div className="relative z-20 max-w-7xl mx-auto p-6">
        <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4" data-cursor="text">Your Top Artists</h2>
          <p className="text-lg text-gray-400 mb-6" data-cursor="text">
            Select up to 5 artists for your {mood} playlist
          </p>
          <div className="w-72 mx-auto bg-[#262626] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                selectedArtists.length === 5 ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${(selectedArtists.length / 5) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2" data-cursor="text">{selectedArtists.length}/5 selected</p>
        </div>
        {error && (
          <div className="bg-[#1a1a1a] text-red-400 text-center p-6 rounded-lg border border-red-500/20 mb-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="mb-4" data-cursor="text">{error}</p>
            <button
              onClick={retryFetch}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" data-cursor="pointer"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-[#111111] border border-[#262626] rounded-xl p-4 animate-pulse"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="w-full h-48 bg-[#1a1a1a] rounded-lg mb-4" />
                <div className="h-5 bg-[#1a1a1a] rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : artists.length === 0 && !error ? (
          <div className="text-center py-12 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <p className="text-xl text-gray-400 mb-4" data-cursor="text">No artists found</p>
            <p className="text-gray-500" data-cursor="text">Listen to music on Spotify recently?</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
            {artists.map((artist, index) => (
              <div
                key={artist.id}
                onClick={() => toggleArtist(artist)}
                className={`bg-[#111111] border ${
                  isSelected(artist) ? 'border-green-500' : 'border-[#262626]'
                } rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[#1a1a1a] hover:-translate-y-1 ${
                  isSelected(artist)
                    ? 'shadow-[0_8px_25px_rgba(33,197,93,0.2)] -translate-y-1'
                    : 'shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                } relative animate-fade-in-scale`}
                style={{ animationDelay: `${600 + index * 100}ms` }}
                data-cursor="pointer"
              >
                {isSelected(artist) && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) =>
                    (e.target.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTI3LjYxNCA1MCAxNTAgNzIuMzg1OCAxNTAgMTAwQzE1MCAxMjcuNjE0IDEyNy42MTQgMTUwIDEwMCAxNTBDNzIuMzg1OCAxNTAgNTAgMTI3LjYxNCA1MCAxMDBDNTAgNzIuMzg1OCA3Mi4zODU4IDUwIDEwMCA1MFoiIGZpbGw9IiM0MzQzNDMiLz4KPC9zdmc+')
                  }
                />
                <h4 className="text-lg font-bold text-center mb-2" data-cursor="text">{artist.name}</h4>
                <p className="text-sm text-gray-400 text-center capitalize" data-cursor="text">
                  {artist.genres && artist.genres.length ? artist.genres.join(', ') : 'No genres listed'}
                </p>
              </div>
            ))}
          </div>
        )}
        {selectedArtists.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <button
              onClick={createPlaylist}
              disabled={creatingPlaylist}
              className={`flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-[0_4px_12px_rgba(33,197,93,0.3)] transition-all duration-200 ${
                creatingPlaylist ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-600 hover:-translate-y-1'
              }`}
              data-cursor="pointer"
            >
              {creatingPlaylist ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating Playlist...
                </>
              ) : (
                <>Create Playlist ({selectedArtists.length})</>
              )}
            </button>
          </div>
        )}
        {showPreview && playlistData && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
              <h3 className="text-2xl font-bold mb-4" data-cursor="text">Your {mood} Playlist</h3>
              <p className="text-gray-400 mb-6" data-cursor="text">Preview your playlist with {playlistData.matched.length} tracks:</p>
              <ul className="space-y-4 mb-6">
                {playlistData.matched.map((track, index) => (
                  <li key={track.spotify_uri} className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${300 + index * 100}ms` }}>
                    <span className="text-gray-500 text-sm" data-cursor="text">{index + 1}.</span>
                    <div>
                      <p className="font-semibold" data-cursor="text">{track.title}</p>
                      <p className="text-sm text-gray-400" data-cursor="text">{track.artist}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between gap-4">
                <a
                  href={playlistData.playlist_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition-colors" data-cursor="pointer"
                >
                  Open in Spotify
                </a>
                <button
                  onClick={closePreview}
                  className="flex-1 px-4 py-2 bg-[#262626] text-white rounded-lg hover:bg-[#333333] transition-colors" data-cursor="pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistSelector;