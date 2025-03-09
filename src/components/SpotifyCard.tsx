import React from 'react';
import { Music2, Palette } from 'lucide-react';

interface SpotifyCardProps {
  spotify: {
    song: string;
    artist: string;
    album_art_url: string;
    timestamps: {
      start: number;
      end: number;
    };
  } | null;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

const themes = {
  dark: {
    bg: 'bg-zinc-800/50',
    text: 'text-white',
    subtext: 'text-zinc-400',
    accent: 'bg-green-500'
  },
  purple: {
    bg: 'bg-purple-900/50',
    text: 'text-purple-50',
    subtext: 'text-purple-200',
    accent: 'bg-purple-500'
  },
  blue: {
    bg: 'bg-blue-900/50',
    text: 'text-blue-50',
    subtext: 'text-blue-200',
    accent: 'bg-blue-500'
  },
  green: {
    bg: 'bg-emerald-900/50',
    text: 'text-emerald-50',
    subtext: 'text-emerald-200',
    accent: 'bg-emerald-500'
  },
  red: {
    bg: 'bg-red-900/50',
    text: 'text-red-50',
    subtext: 'text-red-200',
    accent: 'bg-red-500'
  },
  orange: {
    bg: 'bg-orange-900/50',
    text: 'text-orange-50',
    subtext: 'text-orange-200',
    accent: 'bg-orange-500'
  }
};

export function SpotifyCard({ spotify, currentTheme, setCurrentTheme }: SpotifyCardProps) {
  const [progress, setProgress] = React.useState(0);
  const [showThemes, setShowThemes] = React.useState(false);

  React.useEffect(() => {
    if (!spotify) return;

    const calculateProgress = () => {
      const start = spotify.timestamps.start;
      const end = spotify.timestamps.end;
      const now = Date.now();
      const total = end - start;
      const current = now - start;
      const percentage = Math.min((current / total) * 100, 100);
      setProgress(percentage);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 1000);

    return () => clearInterval(interval);
  }, [spotify]);

  const theme = themes[currentTheme as keyof typeof themes];

  if (!spotify) {
    return (
      <div className={`flex items-center gap-4 p-4 rounded-lg ${theme.bg}`}>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-black/20">
          <Music2 className={`w-6 h-6 ${theme.subtext}`} />
        </div>
        <p className={theme.subtext}>
          Não está ouvindo nada no momento
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${theme.bg} rounded-lg p-4`}>
      <div className="relative">
        <button
          onClick={() => setShowThemes(!showThemes)}
          className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-black/20 transition-colors"
        >
          <Palette className={`w-4 h-4 ${theme.subtext}`} />
        </button>
        
        {showThemes && (
          <div className="theme-selector">
            {Object.entries(themes).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => {
                  setCurrentTheme(name);
                  setShowThemes(false);
                }}
                className={`theme-option ${colors.bg}`}
                style={{ border: currentTheme === name ? '2px solid white' : 'none' }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <img
          src={spotify.album_art_url}
          alt={spotify.song}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${theme.text}`}>
            {spotify.song}
          </h3>
          <p className={`text-sm truncate ${theme.subtext}`}>
            by {spotify.artist}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
          <div 
            className={`h-full ${theme.accent} rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-zinc-400">
          <span>{formatTime((Date.now() - spotify.timestamps.start) / 1000)}</span>
          <span>{formatTime((spotify.timestamps.end - spotify.timestamps.start) / 1000)}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}