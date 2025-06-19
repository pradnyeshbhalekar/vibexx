'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function Results() {
  const searchParams = useSearchParams();
  const playlistUrl = searchParams.get('playlist_url');
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      if (!playlistUrl) {
        setError('No playlist URL provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        // Extract playlist ID from URL (e.g., https://open.spotify.com/playlist/45jL3crAMlaGKbOdBHyXxA)
        const playlistId = playlistUrl.split('/playlist/')[1]?.split('?')[0];
        if (!playlistId) {
          throw new Error('Invalid playlist URL');
        }

        // Fetch playlist details from backend
        const response = await axios.get(`http://127.0.0.1:5000/playlist/${playlistId}`, {
          withCredentials: true,
        });
        const data = response.data;
        if (data.error) {
          throw new Error(data.error);
        }
        setPlaylistData(data);
      } catch (err) {
        console.error('Error fetching playlist details:', err);
        setError(
          err.response
            ? `Server error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`
            : err.message.includes('fetch') || err.message.includes('NetworkError')
            ? 'Cannot connect to server. Ensure backend is running on http://127.0.0.1:5000'
            : `Failed to fetch playlist: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylistDetails();
  }, [playlistUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white relative overflow-x-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a1a_1px,transparent_1px)] bg-[length:60px_60px] opacity-20 z-10" />

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-green-500/10 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
            Your Playlist
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Preview your custom Spotify playlist and start listening
          </p>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 text-red-300 text-center p-8 rounded-2xl mb-8 backdrop-blur-sm">
            <div className="inline-block p-3 bg-red-500/20 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Enhanced Loading State */}
        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-gray-800/50 rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-700/50 rounded-lg w-3/4 mb-3" />
                  <div className="h-4 bg-gray-700/30 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-3 text-gray-400">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Loading your playlist...</span>
              </div>
            </div>
          </div>
        ) : !playlistData ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">No playlist data available</h2>
            <p className="text-gray-400 mb-8">Something went wrong while loading your playlist.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Artist Selection
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Enhanced Playlist Preview */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Playlist Preview</h3>
                  <p className="text-gray-400 text-lg">
                    {playlistData.tracks?.length || 0} carefully selected tracks
                  </p>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <ul className="space-y-3">
                  {playlistData.tracks?.map((track, index) => (
                    <li key={track.spotify_uri} className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-all duration-200 group">
                      <span className="text-green-400 font-semibold text-lg min-w-[2rem] text-center">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-lg truncate group-hover:text-green-400 transition-colors">
                          {track.title}
                        </p>
                        <p className="text-gray-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#1f1f1f]/80 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Listen?</h3>
                <p className="text-gray-300 mb-8">Open your playlist in Spotify or create another one</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href={playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-green-500/25 min-w-[200px] justify-center"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Open in Spotify
                  </a>
                  
                  <Link
                    href="/"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px] justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Another Playlist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}