// src/components/registration.jsx
'use client';

export default function LoginComponent({ mood }) {
  const handleLogin = () => {
    // Clear any stale session data
    // localStorage.removeItem('spotify_auth');

    window.location.href = `http://127.0.0.1:5000/login`;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
    >
      Connect to Spotify
    </button>
  );
}