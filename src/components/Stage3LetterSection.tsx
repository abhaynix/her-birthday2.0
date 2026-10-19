import React from 'react';
import { motion } from 'motion/react';
import { useBirthday } from '../context/BirthdayContext';
import { sounds } from '../services/soundEffects';

const DEFAULT_POLAROID_FILES = [
  'girl4.webp',
  'girl4.webp',
  'girl5.webp',
  'girl6.webp',
  'girl7.webp',
  'girl8.webp',
  'girl9.webp',
  'girl10.webp',
  'girl11.webp',
];

const LAYOUT_POSITIONS = [
  'top-[8%] left-[6%] rotate-[-8deg]',
  'top-[12%] left-[36%] rotate-[6deg]',
  'top-[10%] right-[8%] rotate-[-5deg]',
  'top-[42%] left-[10%] rotate-[7deg]',
  'top-[46%] left-[40%] rotate-[-6deg]',
  'top-[38%] right-[10%] rotate-[10deg]',
  'bottom-[10%] left-[15%] rotate-[-10deg]',
  'bottom-[12%] left-[44%] rotate-[5deg]',
  'bottom-[8%] right-[12%] rotate-[-7deg]',
];

export const Stage3LetterSection: React.FC = () => {
  const { state } = useBirthday();

  const titles = state.polaroidTitles.length > 0 ? state.polaroidTitles : [
    'Cutie 🥹', 'Baddie 😎', 'Pretty ✨', 'My Love 🤍', 'Sunshine ☀️',
    'Angel 🪽', 'Beautiful 🌸', 'Dream Girl 💫', 'Queen 👑'
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-[#d9d3c7] select-none
                 before:absolute before:inset-0 before:pointer-events-none
                 before:bg-[linear-gradient(rgba(120,110,90,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,110,90,0.12)_1px,transparent_1px)]
                 before:bg-[size:40px_40px]
                 after:absolute after:inset-0 after:pointer-events-none
                 after:bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.08))]"
    >
      {/* Editorial Title Banner */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <h2 className="font-['Caveat'] text-4xl sm:text-5xl font-bold text-neutral-800 drop-shadow-sm">
          A Few of My Favorite Memories
        </h2>
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-600 mt-1">
          Drag & rearrange polaroids on the memory board
        </p>
      </div>

      {/* Decorative ambient symbols */}
      <div className="absolute top-20 left-20 text-5xl opacity-30 pointer-events-none">✿</div>
      <div className="absolute bottom-20 right-20 text-5xl opacity-30 pointer-events-none">♡</div>
      <div className="absolute top-[45%] right-[5%] text-4xl opacity-30 pointer-events-none">✨</div>
      <div className="absolute bottom-16 left-12 text-4xl opacity-25 pointer-events-none">❀</div>

      {/* Draggable Polaroid Cards with Uniform Sizing & Workflow */}
      <div className="relative w-full h-screen [perspective:3000px] overflow-hidden">
        {LAYOUT_POSITIONS.map((posClass, idx) => {
          const photo = state.photos[idx % state.photos.length];
          const defaultFallback = `/ref/${DEFAULT_POLAROID_FILES[idx % DEFAULT_POLAROID_FILES.length]}`;
          const imgSrc = photo ? photo.src : defaultFallback;
          const title = titles[idx % titles.length];

          return (
            <motion.div
              key={`polaroid-${idx}-${photo?.id || idx}`}
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              dragElastic={0.2}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              whileTap={{ scale: 1.02, cursor: 'grabbing' }}
              onDragStart={() => sounds.playPop()}
              className={`absolute ${posClass} bg-white rounded-xl shadow-2xl p-3 overflow-visible cursor-grab active:cursor-grabbing touch-none select-none z-10 transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]`}
            >
              <div className="relative overflow-visible">
                {/* Standardized Uniform Photo Frame */}
                <div className="h-44 w-44 sm:h-56 sm:w-56 rounded-lg overflow-hidden bg-neutral-100">
                  <img
                    src={imgSrc}
                    alt={title}
                    draggable={false}
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                  />
                </div>
                <div className="absolute -top-6 -right-6 text-4xl sm:text-5xl z-50 pointer-events-none drop-shadow-md">
                  ❤️
                </div>
                <p className="mt-3 text-center text-neutral-800 text-2xl sm:text-3xl font-semibold font-['Caveat'] pointer-events-none">
                  {title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
