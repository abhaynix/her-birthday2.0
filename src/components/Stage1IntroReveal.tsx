import React, { useState } from 'react';
import { useBirthday } from '../context/BirthdayContext';
import { RotateCcw } from 'lucide-react';
import { sounds } from '../services/soundEffects';

export const Stage1IntroReveal: React.FC = () => {
  const { state } = useBirthday();
  const [iframeKey, setIframeKey] = useState(0);

  // Compute birthdate query params if modified
  const iframeSrc = `/birthday.html?v=${iframeKey}`;

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTick();
    setIframeKey(k => k + 1);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden select-none">
      {/* 1:1 Iframe Presentation */}
      <iframe
        key={iframeKey}
        src={iframeSrc}
        title="Birthday Reveal"
        className="w-full h-full border-none block"
        allow="autoplay"
      />

      {/* Floating replay control */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={handleReplay}
          title="Replay Odometer & Burn Effect"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs border border-neutral-800 transition-colors backdrop-blur-sm shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Reveal</span>
        </button>
      </div>

      {/* Subtle indicator to scroll down to next section */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-mono">
        <span>Scroll Down</span>
        <span className="animate-bounce">↓</span>
      </div>
    </div>
  );
};
