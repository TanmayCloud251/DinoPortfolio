import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * DinoPortfolio.tsx
 * A single-file React portfolio themed after the Chrome Dinosaur game.
 * Updated: Dino moves horizontally across the screen based on section progress.
 */

// --- TYPES ---
interface DinoSVGProps {
  frame: number;
  color: string;
  size?: number;
}

interface CloudSVGProps {
  color: string;
}

// --- SOUND EFFECTS (Web Audio API) ---
const useAudio = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx.current = new AudioContextClass();
      }
    }
  };

  const playStep = useCallback(() => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.current.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.current.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.05);
  }, []);

  const playClear = useCallback(() => {
    if (!audioCtx.current) return;
    const now = audioCtx.current.currentTime;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(880, now + 0.05);
    osc.frequency.setValueAtTime(1100, now + 0.05);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(now + 0.15);
  }, []);

  return { initAudio, playStep, playClear };
};

// --- SVG COMPONENTS ---

const DinoSVG: React.FC<DinoSVGProps> = ({ frame, color, size = 60 }) => {
  const pixels: [number, number, number, number, string?][] = [
    [15,0,7,1], [14,1,9,1], [13,2,10,1], [13,3,2,1], [16,3,7,1], [13,4,10,1],
    [13,5,6,1], [13,6,4,1],
    [15,2,1,1, 'white'],
    [0,7,2,1], [0,8,3,1], [0,9,4,1], [0,10,5,1], [0,11,6,1], [0,12,7,1],
    [1,13,8,1], [2,14,9,1], [3,15,10,1], [4,16,11,1], [5,17,11,1], [6,18,10,1],
    [7,19,9,1], [8,20,8,1],
    [13,11,2,1],
  ];

  const legs: [number, number, number, number, string?][] = frame === 1 ? [
    [10,21,2,1], [10,22,2,1], [10,23,2,1], [11,24,2,1],
    [13,21,2,1], [13,22,2,1], [13,23,2,1], [14,24,2,1]
  ] : frame === 2 ? [
    [10,21,2,1], [10,22,2,1], [12,23,2,1],
    [14,21,2,1], [14,22,2,1], [14,23,2,1], [15,24,2,1]
  ] : [
    [10,21,2,1], [10,22,2,1], [10,23,2,1], [11,24,2,1],
    [13,21,2,1], [13,22,2,1], [15,23,2,1]
  ];

  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 22 26" style={{ imageRendering: 'pixelated' }}>
      {[...pixels, ...legs].map(([x, y, w, h, c], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={c || color} />
      ))}
    </svg>
  );
};

const CloudSVG: React.FC<CloudSVGProps> = ({ color }) => (
  <svg width="46" height="14" viewBox="0 0 46 14" style={{ opacity: 0.6 }}>
    <rect x="15" y="0" width="10" height="2" fill={color} />
    <rect x="10" y="2" width="20" height="2" fill={color} />
    <rect x="5" y="4" width="30" height="2" fill={color} />
    <rect x="0" y="6" width="46" height="2" fill={color} />
    <rect x="0" y="8" width="46" height="2" fill={color} />
    <rect x="0" y="10" width="46" height="2" fill={color} />
  </svg>
);

// --- MAIN COMPONENT ---

const DinoPortfolio: React.FC = () => {
  const [section, setSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dinoFrame, setDinoFrame] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isMuted, setIsMuted] = useState(false);
  const { initAudio, playStep, playClear } = useAudio();

  const sections = [
    { title: 'WELCOME', id: '0000' },
    { title: 'ABOUT', id: '0001' },
    { title: 'SKILLS', id: '0002' },
    { title: 'PROJECTS', id: '0003' },
    { title: 'CONTACT', id: '0004' },
    { title: 'COMPLETE', id: '0005' }
  ];

  const currentBiome = section >= 2 && section <= 4 ? 2 : 0;
  const isDark = currentBiome >= 2;
  const theme = {
    bg: isDark ? '#202124' : '#ffffff',
    text: isDark ? '#e8e8e8' : '#535353',
    dino: isDark ? '#cccccc' : '#535353',
    cloud: 'rgba(83,83,83,0.12)'
  };

  // Dino Running Animation
  useEffect(() => {
    if (!isTransitioning) {
      setDinoFrame(1);
      return;
    }
    const interval = setInterval(() => {
      setDinoFrame(f => (f === 2 ? 3 : 2));
      if (!isMuted) playStep();
    }, 120);
    return () => clearInterval(interval);
  }, [isTransitioning, isMuted, playStep]);

  const handleNavigate = useCallback((dir: number) => {
    if (isTransitioning) return;
    initAudio();
    
    const nextSection = section + dir;
    if (nextSection < 0 || nextSection >= sections.length) return;

    setDirection(dir);
    setIsTransitioning(true);

    setTimeout(() => {
      setSection(nextSection);
      if (!isMuted) playClear();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }, 800); // Duration matches CSS transition
  }, [section, isTransitioning, isMuted, playClear, initAudio, sections.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') handleNavigate(1);
      if (e.code === 'ArrowLeft') handleNavigate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate]);

  // Position calculation: section 0 is at 50px, section N-1 is at 80% + 50px
  const dinoLeft = `calc(50px + ${(section / (sections.length - 1)) * 80}%)`;
  const formattedScore = `${String(section).padStart(2, '0')}.00`;

  return (
    <div style={{
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Press Start 2P', monospace",
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      transition: 'background-color 0.5s',
      userSelect: 'none'
    }} onClick={(e) => {
      const { clientX, currentTarget } = e;
      handleNavigate(clientX > currentTarget.clientWidth / 2 ? 1 : -1);
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        @keyframes cloudMove {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100px); }
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .pixel-chip { border: 2px solid ${theme.text}; padding: 8px 12px; margin: 4px; font-size: 10px; display: inline-block; }
        .pixel-card { border: 2px solid ${theme.text}; padding: 16px; margin-bottom: 12px; cursor: pointer; transition: opacity 0.2s; }
        .pixel-card:hover { opacity: 0.7; }
        .pixel-btn { border: 2px solid ${theme.text}; padding: 12px 24px; cursor: pointer; font-family: inherit; background: transparent; color: inherit; margin: 8px; font-size: 12px; }
        .pixel-btn:hover { opacity: 0.7; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.text}; }
      `}</style>

      {/* --- SKY --- */}
      <div style={{ position: 'absolute', top: '15%', width: '100%', height: '100px', pointerEvents: 'none' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: `${i * 30}px`,
            left: 0,
            animation: `cloudMove ${20 + i * 10}s linear infinite`,
            animationDelay: `-${i * 5}s`
          }}>
            <CloudSVG color={theme.text} />
          </div>
        ))}
      </div>

      {/* --- HUD --- */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '14px', textAlign: 'right' }}>
        <div style={{ opacity: 0.6, fontSize: '10px', marginBottom: '4px' }}>HI 05.00</div>
        <div>{formattedScore}</div>
        <div style={{ marginTop: '10px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}>
          {isMuted ? '🔇' : '🔊'}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(560px, 88vw)',
        height: 'calc(80% - 100px)',
        overflowY: 'auto',
        padding: '20px',
        textAlign: 'center',
        zIndex: 10,
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {section === 0 && (
          <div style={{ marginTop: '40px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>WELCOME</h1>
            <p style={{ fontSize: '14px', lineHeight: '2' }}>[YOUR NAME]</p>
            <p style={{ fontSize: '10px', marginTop: '40px', animation: 'blink 1s infinite' }}>CLICK LEFT / RIGHT TO NAVIGATE</p>
          </div>
        )}

        {section === 1 && (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>ABOUT</h2>
            <p style={{ fontSize: '12px', lineHeight: '1.6' }}>
              I am a developer based in [City]. I enjoy building web applications, experimenting with AI, and creating unique user experiences.
            </p>
          </div>
        )}

        {section === 2 && (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>SKILLS</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Python', 'C++', 'Git', 'Tailwind', 'Docker'].map(s => (
                <div key={s} className="pixel-chip">{s}</div>
              ))}
            </div>
          </div>
        )}

        {section === 3 && (
          <div style={{ width: '100%' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>PROJECTS</h2>
            <div className="pixel-card">
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>PROJECT ALPHA</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Short description of the project.</div>
            </div>
            <div className="pixel-card">
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>PROJECT BETA</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Another cool project here.</div>
            </div>
          </div>
        )}

        {section === 4 && (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>CONTACT</h2>
            <div style={{ textAlign: 'left', fontSize: '12px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ opacity: 0.6, fontSize: '10px', marginBottom: '4px' }}>EMAIL</div>
                <a href="mailto:hello@example.com" style={{ color: 'inherit', textDecoration: 'none' }}>hello@example.com</a>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ opacity: 0.6, fontSize: '10px', marginBottom: '4px' }}>GITHUB</div>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>github.com/username</a>
              </div>
            </div>
          </div>
        )}

        {section === 5 && (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>GAME COMPLETED</h2>
            <button className="pixel-btn">DOWNLOAD RESUME</button>
            <button className="pixel-btn" onClick={(e) => { e.stopPropagation(); setSection(0); }}>PLAY AGAIN</button>
          </div>
        )}
      </div>

      {/* --- GAME AREA --- */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        width: '100%',
        height: '100px',
        pointerEvents: 'none'
      }}>
        {/* GROUND */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          width: '100%',
          height: '3px',
          backgroundColor: theme.text
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          height: '2px',
          backgroundImage: `linear-gradient(to right, ${theme.text} 2px, transparent 2px)`,
          backgroundSize: '20px 2px'
        }} />

        {/* DINO */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: dinoLeft,
          transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `scaleX(${direction})`,
          zIndex: 5
        }}>
          <DinoSVG frame={isTransitioning ? dinoFrame : 1} color={theme.dino} size={60} />
        </div>
      </div>
    </div>
  );
};

export default DinoPortfolio;
