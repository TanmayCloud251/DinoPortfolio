import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * DinoPortfolio.tsx
 * A single-file React portfolio themed after the Chrome Dinosaur game.
 * Personalized for Tanmay Mishra - Full Stack Developer.
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
  const [direction, setDirection] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const { initAudio, playStep, playClear } = useAudio();

  const sections = [
    { title: 'WELCOME', id: '0000' },
    { title: 'IDENTITY', id: '0001' },
    { title: 'ABOUT', id: '0002' },
    { title: 'SKILLS', id: '0003' },
    { title: 'PROJECTS', id: '0004' },
    { title: 'MUSIC', id: '0005' },
    { title: 'CONTACT', id: '0006' },
    { title: 'COMPLETE', id: '0007' }
  ];

  const currentBiome = section >= 3 && section <= 6 ? 2 : 0;
  const isDark = currentBiome >= 2;
  const theme = {
    bg: isDark ? '#202124' : '#ffffff',
    text: isDark ? '#e8e8e8' : '#535353',
    dino: isDark ? '#cccccc' : '#535353',
    cloud: 'rgba(83,83,83,0.12)'
  };

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
    }, 800);
  }, [section, isTransitioning, isMuted, playClear, initAudio, sections.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') handleNavigate(1);
      if (e.code === 'ArrowLeft') handleNavigate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate]);

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
        @keyframes wave {
          0%, 100% { height: 5px; }
          50% { height: 30px; }
        }
        .pixel-chip { border: 2px solid ${theme.text}; padding: 4px 6px; margin: 2px; font-size: 6px; display: inline-block; }
        .pixel-card { border: 2px solid ${theme.text}; padding: 10px; cursor: pointer; transition: opacity 0.2s; text-align: left; width: 100%; box-sizing: border-box; }
        .pixel-card:hover { opacity: 0.7; }
        .pixel-btn { border: 2px solid ${theme.text}; padding: 12px 24px; cursor: pointer; font-family: inherit; background: transparent; color: inherit; margin: 8px; font-size: 10px; }
        .pixel-btn:hover { opacity: 0.7; }
        .music-bar { width: 4px; background: ${theme.text}; margin: 0 2px; display: inline-block; animation: wave 1s ease-in-out infinite; }
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.text}; }
        @media (max-width: 600px) {
          .grid-layout { grid-template-columns: 1fr; gap: 10px; }
          .pixel-chip { font-size: 5px; }
        }
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

      {/* --- AUDIO TOGGLE --- */}
      <div 
        style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer', zIndex: 100, padding: '8px', border: `2px solid ${theme.text}` }}
        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
      >
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="2" y="6" width="4" height="8" fill={theme.text} />
            <rect x="6" y="4" width="4" height="12" fill={theme.text} />
            <rect x="10" y="2" width="4" height="16" fill={theme.text} />
            <rect x="14" y="8" width="2" height="4" fill={theme.text} />
            <rect x="16" y="6" width="2" height="2" fill={theme.text} />
            <rect x="16" y="12" width="2" height="2" fill={theme.text} />
            {/* Cross */}
            <rect x="14" y="14" width="6" height="2" fill={theme.bg} transform="rotate(45 17 15)" />
            <rect x="14" y="14" width="6" height="2" fill={theme.text} transform="rotate(-45 17 15)" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="2" y="6" width="4" height="8" fill={theme.text} />
            <rect x="6" y="4" width="4" height="12" fill={theme.text} />
            <rect x="10" y="2" width="4" height="16" fill={theme.text} />
            <rect x="16" y="8" width="2" height="4" fill={theme.text} />
            <rect x="18" y="6" width="2" height="8" fill={theme.text} />
          </svg>
        )}
      </div>

      {/* --- HUD --- */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '12px', textAlign: 'right', zIndex: 100 }}>
        <div style={{ opacity: 0.6, fontSize: '8px', marginBottom: '4px' }}>HI 07.00</div>
        <div>{formattedScore}</div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(720px, 94vw)',
        height: 'calc(80% - 100px)',
        overflowY: 'auto',
        padding: '10px',
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
            <h1 style={{ fontSize: '28px', marginBottom: '30px', color: theme.text }}>WELCOME</h1>
            <p style={{ fontSize: '10px', marginTop: '40px', animation: 'blink 1.5s infinite' }}>CLICK LEFT / RIGHT TO NAVIGATE</p>
          </div>
        )}

        {section === 1 && (
          <div style={{ marginTop: '20px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: theme.text }}>TANMAY MISHRA</h1>
            <h2 style={{ fontSize: '14px', marginBottom: '30px', opacity: 0.8, color: theme.text }}>FULL STACK DEV</h2>
            <p style={{ fontSize: '10px', maxWidth: '400px', lineHeight: '1.8', margin: '0 auto' }}>
              I build scalable web applications, AI-powered tools, and developer-friendly experiences.
            </p>
          </div>
        )}

        {section === 2 && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '15px', color: theme.text }}>ABOUT ME</h2>
            <p style={{ fontSize: '10px', lineHeight: '1.8', textAlign: 'left', marginBottom: '15px' }}>
              I am a B.Tech Information Technology student pursuing Software Engineering internships. 
              I enjoy building full-stack applications, backend systems, and AI products.
            </p>
            <p style={{ fontSize: '10px', lineHeight: '1.8', textAlign: 'left', opacity: 0.9 }}>
              Experience: Backend & DevOps Engineering Intern. 
              Worked with Node.js, Docker, Nginx, and Linux to build scalable services and REST APIs.
            </p>
          </div>
        )}

        {section === 3 && (
          <div style={{ width: '100%' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '20px', color: theme.text }}>SKILLS</h2>
            <div className="grid-layout">
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '8px', opacity: 0.6, marginBottom: '8px' }}>LANGUAGE</div>
                {['JavaScript', 'Python', 'C++', 'SQL'].map(s => <span key={s} className="pixel-chip">{s}</span>)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '8px', opacity: 0.6, marginBottom: '8px' }}>FRONTEND</div>
                {['React.js', 'Next.js', 'Tailwind', 'HTML', 'CSS'].map(s => <span key={s} className="pixel-chip">{s}</span>)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '8px', opacity: 0.6, marginBottom: '8px' }}>BACKEND</div>
                {['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Appwrite'].map(s => <span key={s} className="pixel-chip">{s}</span>)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '8px', opacity: 0.6, marginBottom: '8px' }}>DEVOPS</div>
                {['Docker', 'Nginx', 'Linux', 'Git', 'Cron Jobs'].map(s => <span key={s} className="pixel-chip">{s}</span>)}
              </div>
            </div>
          </div>
        )}

        {section === 4 && (
          <div style={{ width: '100%' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '20px', color: theme.text }}>PROJECTS</h2>
            <div className="grid-layout">
              <div className="pixel-card" onClick={() => window.open('https://sangwari.netlify.app/', '_blank')}>
                <div style={{ fontSize: '10px', marginBottom: '5px' }}>Sangwari</div>
                <div style={{ fontSize: '7px', lineHeight: '1.3', marginBottom: '5px' }}>A multilingual AI chatbot focused on Chhattisgarhi language.</div>
                <div style={{ fontSize: '6px', opacity: 0.7 }}>Voice Conv · AI · Theme</div>
              </div>
              <div className="pixel-card" onClick={() => window.open('https://rescan.netlify.app/', '_blank')}>
                <div style={{ fontSize: '10px', marginBottom: '5px' }}>RESCAN</div>
                <div style={{ fontSize: '7px', lineHeight: '1.3', marginBottom: '5px' }}>An ATS-style resume analyzer.</div>
                <div style={{ fontSize: '6px', opacity: 0.7 }}>React · Gemini · NLP</div>
              </div>
              <div className="pixel-card" onClick={() => window.open('https://video-tube-frontend-sepia.vercel.app/', '_blank')}>
                <div style={{ fontSize: '10px', marginBottom: '5px' }}>VIDEOTUBE</div>
                <div style={{ fontSize: '7px', lineHeight: '1.3', marginBottom: '5px' }}>A full-stack YouTube-inspired video streaming platform.</div>
                <div style={{ fontSize: '6px', opacity: 0.7 }}>React · Node · MongoDB</div>
              </div>
              <div className="pixel-card" onClick={() => window.open('https://mega-blog-indol.vercel.app/', '_blank')}>
                <div style={{ fontSize: '10px', marginBottom: '5px' }}>MEGA BLOG</div>
                <div style={{ fontSize: '7px', lineHeight: '1.3', marginBottom: '5px' }}>Modern blog. Full CRUD & Appwrite.</div>
                <div style={{ fontSize: '6px', opacity: 0.7 }}>React · Appwrite · Tailwind</div>
              </div>
            </div>
          </div>
        )}

        {section === 5 && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '20px', color: theme.text }}>BEYOND CODE</h2>
            <p style={{ fontSize: '10px', lineHeight: '1.8', marginBottom: '20px' }}>
              I am also a singer and guitarist who regularly performs at college events. 
              I have performed guitar on DD Chhattisgarh television!
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '40px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="music-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${10 + Math.random() * 20}px` }} />
              ))}
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginLeft: '10px', flexShrink: 0 }}>
                {/* Pixel Art Guitar */}
                <rect x="18" y="2" width="4" height="6" fill={theme.text} />
                <rect x="16" y="8" width="4" height="2" fill={theme.text} />
                <rect x="14" y="10" width="4" height="2" fill={theme.text} />
                <rect x="12" y="12" width="4" height="2" fill={theme.text} />
                <rect x="10" y="14" width="4" height="2" fill={theme.text} />
                <rect x="6" y="12" width="6" height="10" fill={theme.text} />
                <rect x="4" y="14" width="2" height="6" fill={theme.text} />
                <rect x="8" y="16" width="2" height="2" fill={theme.bg} />
                <rect x="18" y="4" width="2" height="2" fill={theme.bg} />
              </svg>
            </div>
          </div>
        )}

        {section === 6 && (
          <div style={{ width: '100%' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '20px', color: theme.text }}>CONTACT</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="14" viewBox="0 0 18 14" style={{ marginRight: '12px', flexShrink: 0 }}>
                  <rect x="0" y="0" width="18" height="2" fill={theme.text} />
                  <rect x="0" y="12" width="18" height="2" fill={theme.text} />
                  <rect x="0" y="0" width="2" height="14" fill={theme.text} />
                  <rect x="16" y="0" width="2" height="14" fill={theme.text} />
                  <rect x="2" y="2" width="2" height="2" fill={theme.text} />
                  <rect x="14" y="2" width="2" height="2" fill={theme.text} />
                  <rect x="4" y="4" width="2" height="2" fill={theme.text} />
                  <rect x="12" y="4" width="2" height="2" fill={theme.text} />
                  <rect x="6" y="6" width="6" height="2" fill={theme.text} />
                </svg>
                <div>
                  <div style={{ fontSize: '7px', opacity: 0.6, marginBottom: '2px' }}>EMAIL</div>
                  <a href="mailto:tanmaycloud251@gmail.com" style={{ fontSize: '8px', color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${theme.text}` }}>tanmaycloud251@gmail.com</a>
                </div>
              </div>

              {/* GitHub */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '12px', flexShrink: 0 }}>
                  <rect x="6" y="0" width="6" height="2" fill={theme.text} />
                  <rect x="4" y="2" width="10" height="2" fill={theme.text} />
                  <rect x="2" y="4" width="14" height="8" fill={theme.text} />
                  <rect x="4" y="12" width="10" height="2" fill={theme.text} />
                  <rect x="6" y="14" width="6" height="4" fill={theme.text} />
                  <rect x="5" y="6" width="2" height="2" fill={theme.bg} />
                  <rect x="11" y="6" width="2" height="2" fill={theme.bg} />
                </svg>
                <div>
                  <div style={{ fontSize: '7px', opacity: 0.6, marginBottom: '2px' }}>GITHUB</div>
                  <a href="https://github.com/TanmayCloud251" target="_blank" style={{ fontSize: '8px', color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${theme.text}` }}>TanmayCloud251</a>
                </div>
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '12px', flexShrink: 0 }}>
                  <rect x="0" y="0" width="18" height="18" fill={theme.text} />
                  <rect x="3" y="3" width="3" height="3" fill={theme.bg} />
                  <rect x="3" y="7" width="3" height="8" fill={theme.bg} />
                  <rect x="8" y="7" width="3" height="8" fill={theme.bg} />
                  <rect x="12" y="7" width="3" height="8" fill={theme.bg} />
                  <rect x="8" y="7" width="7" height="3" fill={theme.bg} />
                </svg>
                <div>
                  <div style={{ fontSize: '7px', opacity: 0.6, marginBottom: '2px' }}>LINKEDIN</div>
                  <a href="https://www.linkedin.com/in/tanmaymi251/" target="_blank" style={{ fontSize: '8px', color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${theme.text}` }}>tanmaymi251</a>
                </div>
              </div>

              {/* Instagram */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '12px', flexShrink: 0 }}>
                  <rect x="0" y="0" width="18" height="18" fill={theme.text} />
                  <rect x="2" y="2" width="14" height="14" fill={theme.bg} />
                  <rect x="4" y="4" width="10" height="10" fill={theme.text} />
                  <rect x="6" y="6" width="6" height="6" fill={theme.bg} />
                  <rect x="13" y="3" width="2" height="2" fill={theme.text} />
                </svg>
                <div>
                  <div style={{ fontSize: '7px', opacity: 0.6, marginBottom: '2px' }}>INSTAGRAM</div>
                  <a href="https://www.instagram.com/tanmaymishra251/" target="_blank" style={{ fontSize: '8px', color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${theme.text}` }}>tanmaymishra251</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 7 && (
          <div style={{ marginTop: '20px' }}>
            <h1 style={{ fontSize: '20px', marginBottom: '20px', color: theme.text }}>GAME COMPLETED</h1>
            <p style={{ fontSize: '10px', marginBottom: '30px' }}>THANKS FOR VISITING!</p>
            <a href="/resume.pdf" download="Tanmay_Mishra_Resume.pdf" style={{ textDecoration: 'none' }}>
              <button className="pixel-btn">DOWNLOAD RESUME</button>
            </a>
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
