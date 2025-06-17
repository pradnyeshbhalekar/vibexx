'use client';

import SelectArtist from '../components/ArtistSelector';

export default function SelectArtistPage({ searchParams = {} }) {
  const mood = searchParams.mood || 'happy'; // Default to 'happy' if no mood provided

  const handleArtistsSelected = (data) => {
    // Redirect to results page with playlist URL
    window.location.href = `/results?playlist_url=${encodeURIComponent(data.playlist_url)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SelectArtist mood={mood} onArtistsSelected={handleArtistsSelected} />
    </div>
  );
}