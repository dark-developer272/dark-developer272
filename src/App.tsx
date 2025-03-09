import React from 'react';
import useSWR from 'swr';
import { FaDiscord, FaSpotify, FaInstagram, FaGithub } from 'react-icons/fa';
import { Code, Palette } from 'lucide-react'; 
import type { LanyardResponse } from './types/lanyard';
import { SpotifyCard } from './components/SpotifyCard';
import { StatusDot } from './components/StatusDot';

const DISCORD_ID = '1307592716435193879';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function App() {
  const { data } = useSWR<LanyardResponse>(
    `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
    fetcher,
    { refreshInterval: 1000 }
  );
  const [showProtection, setShowProtection] = React.useState(true);
  const [currentTheme, setCurrentTheme] = React.useState<string>('dark');
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [showThemes, setShowThemes] = React.useState(false); 

  const discordStatus = data?.data.discord_status || 'offline';
  const spotify = data?.data.spotify;
  const textRef = React.useRef<HTMLSpanElement>(null);

  // Efeito de digitação
  React.useEffect(() => {
    const text = "roubado";
    const container = textRef.current;
    if (!container) return;

    setTimeout(() => {
      let index = 0;
      let isDeleting = false;

      const typeNextChar = () => {
        if (!isDeleting && index < text.length) {
          container.textContent = text.substring(0, index + 1);
          index++;
          setTimeout(typeNextChar, 150);
        } else if (isDeleting && index > 0) {
          container.textContent = text.substring(0, index - 1);
          index--;
          setTimeout(typeNextChar, 100);
        } else {
          isDeleting = !isDeleting;
          setTimeout(typeNextChar, isDeleting ? 1200 : 600);
        }
      };

      typeNextChar();
    }, 100); 
  }, []);

  // Efeito de perspectiva
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  if (showProtection) {
    return (
      <div className="screen-protection" onClick={() => setShowProtection(false)}>
        <span className="screen-protection-text">Click Here</span>
      </div>
    );
  }

  const themes = {
    dark: {
      bg: 'bg-zinc-800/50',
      cardBg: 'bg-zinc-800/50',
      text: 'text-white',
      subtext: 'text-zinc-400'
    },
    purple: {
      bg: 'bg-purple-900/50',
      cardBg: 'bg-purple-900/50',
      text: 'text-purple-50',
      subtext: 'text-purple-200'
    },
    blue: {
      bg: 'bg-blue-900/50',
      cardBg: 'bg-blue-900/50',
      text: 'text-blue-50',
      subtext: 'text-blue-200'
    },
    green: {
      bg: 'bg-emerald-900/50',
      cardBg: 'bg-emerald-900/50',
      text: 'text-emerald-50',
      subtext: 'text-emerald-200'
    },
    red: {
      bg: 'bg-red-900/50',
      cardBg: 'bg-red-900/50',
      text: 'text-red-50',
      subtext: 'text-red-200'
    },
    orange: {
      bg: 'bg-orange-900/50',
      cardBg: 'bg-orange-900/50',
      text: 'text-orange-50',
      subtext: 'text-orange-200'
    }
  };

  const theme = themes[currentTheme as keyof typeof themes];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      
      <button
        onClick={() => setShowThemes(!showThemes)}
        className="fixed top-4 right-4 p-2 rounded-full hover:bg-black/20 transition-colors"
      >
        <Palette className={`w-6 h-6 ${theme.subtext}`} />
      </button>
      {showThemes && (
        <div className="fixed top-16 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 z-50">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(themes).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => {
                  setCurrentTheme(name);
                  setShowThemes(false);
                }}
                className={`w-8 h-8 rounded-full ${colors.bg}`}
                style={{ border: currentTheme === name ? '2px solid white' : 'none' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card principal */}
      <div
        className={`${theme.bg} p-8 rounded-2xl max-w-md w-full backdrop-blur-sm perspective-card`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
          boxShadow: `${-rotation.y * 2}px ${rotation.x * 2}px 20px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data?.data.discord_user?.avatar}`}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <StatusDot status={discordStatus} />
          </div>
          
          <h1 className={`text-2xl font-bold mt-4 typing-effect ${theme.text}`}>
            <span ref={textRef} className="text"></span>
          </h1>
          <div className={`${theme.cardBg} px-3 py-1 rounded-full text-sm ${theme.subtext} mt-2`}>
            <div className="flex items-center justify-center gap-2">
              <Code className="w-4 h-4" /> 
              <code>dev by maldasnamente</code>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full mt-6">
            <a
              href="https://discord.com/users/1307592716435193879"
              target="_blank"
              rel="noopener noreferrer"
              className={`social-card flex items-center justify-center gap-2 ${theme.cardBg} p-3 rounded-lg ${theme.text}`}
            >
              <FaDiscord size={20} />
              <span>discord</span>
            </a>
            <a
              href="https://open.spotify.com/user/31k53qr6r2hzjqykzqvxvqxadozi"
              target="_blank"
              rel="noopener noreferrer"
              className={`social-card flex items-center justify-center gap-2 ${theme.cardBg} p-3 rounded-lg ${theme.text}`}
            >
              <FaSpotify size={20} />
              <span>spotify</span>
            </a>
            <a
              href="https://instagram.com/maldasnamente"
              target="_blank"
              rel="noopener noreferrer"
              className={`social-card flex items-center justify-center gap-2 ${theme.cardBg} p-3 rounded-lg ${theme.text}`}
            >
              <FaInstagram size={20} />
              <span>instagram</span>
            </a>
            <a
              href="https://github.com/maldasnamente"
              target="_blank"
              rel="noopener noreferrer"
              className={`social-card flex items-center justify-center gap-2 ${theme.cardBg} p-3 rounded-lg ${theme.text}`}
            >
              <FaGithub size={20} />
              <span>github</span>
            </a>
          </div>

          <div className="w-full mt-6">
            <SpotifyCard spotify={spotify} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;