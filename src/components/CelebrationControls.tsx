import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Sparkles, ShieldCheck, PartyPopper, Volume } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBirthday } from '../context/BirthdayContext';
import { sounds } from '../services/soundEffects';

interface CelebrationControlsProps {
  onScrollToStage: (stageIndex: number) => void;
  activeStage: number;
}

export const CelebrationControls: React.FC<CelebrationControlsProps> = ({
  onScrollToStage,
  activeStage,
}) => {
  const {
    isMusicPlaying,
    toggleMusic,
    isMuted,
    toggleMute,
    musicVolume,
    setMusicVolume,
    setIsPersonalizing,
    setIsAuditOpen,
  } = useBirthday();
  const [showVolume, setShowVolume] = useState(false);

  const handleConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
    });
  };

  const stages = [
    { title: 'Intro & Fire Reveal' },
    { title: 'Parallax Ribbon' },
    { title: 'Polaroid Memories' },
    { title: 'Scrapbook Album' },
    { title: '3D Galaxy & Cake' },
  ];

  return (
    <>
      {/* Floating Bottom Celebration Dock */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {/* Background Music Toggle */}
        <button
          onClick={toggleMusic}
          title={isMusicPlaying ? 'Pause Birthday Music' : 'Play Birthday Music'}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md border text-xs font-mono transition-all shadow-xl cursor-pointer ${
            isMusicPlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
          }`}
        >
          <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">{isMusicPlaying ? 'Music Playing' : 'Play Music'}</span>
          {isMusicPlaying && (
            <div className="flex items-end gap-0.5 h-3 ml-1">
              <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
              <span className="w-0.5 h-2/3 bg-amber-400 animate-pulse delay-75" />
              <span className="w-0.5 h-4/5 bg-amber-400 animate-pulse delay-150" />
            </div>
          )}
        </button>

        {/* Volume Control */}
        <div className="relative group">
          <button
            onClick={() => setShowVolume(!showVolume)}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            title={`Volume: ${Math.round(musicVolume * 100)}%`}
            className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 backdrop-blur-md shadow-xl transition-colors cursor-pointer group"
          >
            {musicVolume === 0 || isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : musicVolume < 0.5 ? (
              <Volume className="w-4 h-4 text-amber-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          {showVolume && (
            <div className="absolute bottom-full right-0 mb-2 w-32 px-3 py-2 bg-neutral-900/95 border border-neutral-700 rounded-lg shadow-xl backdrop-blur-md">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full h-1.5 appearance-none bg-neutral-700 rounded-full cursor-pointer accent-amber-500"
                aria-label="Music volume"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                <span>Mute</span>
                <span>{Math.round(musicVolume * 100)}%</span>
                <span>Max</span>
              </div>
            </div>
          )}
        </div>

        {/* SFX Mute/Unmute */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 backdrop-blur-md shadow-xl transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Confetti Blast */}
        <button
          onClick={handleConfetti}
          title="Blast Birthday Confetti"
          className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-amber-400 backdrop-blur-md shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        {/* Personalize Studio Button */}
        <button
          onClick={() => {
            sounds.playTick();
            setIsPersonalizing(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-semibold text-xs shadow-xl transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personalize</span>
        </button>

        {/* Audit Console Button */}
        <button
          onClick={() => {
            sounds.playTick();
            setIsAuditOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 hover:text-emerald-300 text-xs font-mono shadow-xl transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Parity Audit</span>
        </button>
      </div>

      {/* Floating Vertical Section Dots Indicator */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-3">
        {stages.map((st, idx) => {
          const isActive = activeStage === idx;
          return (
            <button
              key={st.title}
              onClick={() => onScrollToStage(idx)}
              title={st.title}
              className="group relative flex items-center cursor-pointer"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-3 bg-amber-400 ring-4 ring-amber-400/30'
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
              <span className="absolute left-6 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-neutral-800">
                {st.title}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
