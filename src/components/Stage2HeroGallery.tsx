import React, { useState } from 'react';
import { useBirthday } from '../context/BirthdayContext';
import { sounds } from '../services/soundEffects';

export const Stage2HeroGallery: React.FC = () => {
  const { state } = useBirthday();
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Default memories array
  const memories = state.photos.length > 0 ? state.photos : [
    { id: '1', src: '/ref/girl.jpg', title: 'Memory 1', alt: 'Memory 1' },
    { id: '2', src: '/ref/girl2.webp', title: 'Memory 2', alt: 'Memory 2' },
    { id: '3', src: '/ref/girl4.webp', title: 'Memory 3', alt: 'Memory 3' },
    { id: '4', src: '/ref/girl4.webp', title: 'Memory 4', alt: 'Memory 4' },
    { id: '5', src: '/ref/girl5.webp', title: 'Memory 5', alt: 'Memory 5' },
    { id: '6', src: '/ref/girl6.webp', title: 'Memory 6', alt: 'Memory 6' },
    { id: '7', src: '/ref/girl7.webp', title: 'Memory 7', alt: 'Memory 7' },
    { id: '8', src: '/ref/girl8.webp', title: 'Memory 8', alt: 'Memory 8' },
    { id: '9', src: '/ref/girl9.webp', title: 'Memory 9', alt: 'Memory 9' },
    { id: '10', src: '/ref/girl10.webp', title: 'Memory 10', alt: 'Memory 10' },
    { id: '11', src: '/ref/girl11.webp', title: 'Memory 11', alt: 'Memory 11' },
  ];

  return (
    <section className="relative overflow-hidden flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FAFAF7] text-[#14140F] select-none">
      {/* Date Header in JetBrains Mono */}
      <div className="font-mono flex items-center justify-between px-8 pt-8 text-[11px] uppercase tracking-[0.25em] text-[#8A8A80] sm:px-14">
        <span>{state.birthDate}</span>
        <span className="hidden sm:inline">Chapter {state.targetAge}</span>
      </div>

      {/* Main Title & Typography in Bricolage Grotesque & Work Sans */}
      <div className="px-8 pt-12 sm:px-14 sm:pt-16 z-10 max-w-2xl">
        <h1 className="font-['Bricolage_Grotesque'] text-[15vw] leading-[0.88] tracking-tight text-[#14140F] sm:text-7xl lg:text-8xl">
          <span className="font-light">Happy</span>
          <br />
          <span className="font-bold">Birthday</span>
          <br />
          <span className="font-bold text-amber-500">{state.recipientName}</span>
        </h1>
        <div className="mt-6 h-px w-16 bg-[#9C7A3F]" />
        <p className="font-['Work_Sans'] mt-6 max-w-sm text-base leading-relaxed text-[#4A4A42]">
          {state.birthdayWish}
        </p>
      </div>

      {/* Floating Parallax Ribbon of Memories */}
      <div className="relative mt-8 sm:mt-4 w-full overflow-hidden py-10 z-10">
        <div className="flex gap-4 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] w-max px-4">
          {[...memories, ...memories].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => {
                sounds.playTick();
                setActivePhoto(item.src);
              }}
              className="group relative h-28 w-24 sm:h-36 sm:w-28 shrink-0 overflow-hidden rounded-md border border-[#14140F]/15 bg-[#14140F]/5 shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-md cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.title || `Memory ${idx + 1}`}
                draggable={false}
                className="h-full w-full object-cover grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                <span className="text-[10px] text-white font-mono truncate">{item.title || `Memory #${idx + 1}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Photo Preview */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-md w-full overflow-hidden rounded-xl bg-white p-2 shadow-2xl">
            <img
              src={activePhoto}
              alt="Memory detail"
              className="w-full h-80 object-cover rounded-lg"
            />
            <div className="p-3 text-center">
              <p className="font-['Caveat'] text-2xl text-neutral-800">Unforgettable moments with {state.recipientName}</p>
              <button
                onClick={() => setActivePhoto(null)}
                className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest hover:text-black cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar with Hairline Dividers */}
      <div className="mt-auto flex items-center justify-between px-8 pb-8 sm:px-14">
        <div className="h-px flex-1 bg-[#14140F]/10" />
        <span className="font-mono px-4 text-[10px] uppercase tracking-[0.25em] text-[#8A8A80]">
          Scroll to Explore Polaroids
        </span>
        <div className="h-px flex-1 bg-[#14140F]/10" />
      </div>
    </section>
  );
};
