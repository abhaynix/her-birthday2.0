import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { useBirthday } from '../context/BirthdayContext';
import { moveSpread } from '../utils/scrapbookNavigation';

export const Stage4ScrapbookAlbum: React.FC = () => {
  const { state } = useBirthday();
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flippingRef = useRef(false);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSpreads = 5;

  const flip = (direction: -1 | 1) => {
    if (flippingRef.current) return;
    const nextSpread = moveSpread(spreadIndex, direction, totalSpreads);
    if (nextSpread === spreadIndex) return;
    flippingRef.current = true;
    sounds.playPageFlip();
    setIsFlipping(true);
    flipTimer.current = setTimeout(() => {
      setSpreadIndex(nextSpread);
      setIsFlipping(false);
      flippingRef.current = false;
      flipTimer.current = null;
    }, 250);
  };

  const closeAlbum = () => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    flipTimer.current = null;
    flippingRef.current = false;
    setIsFlipping(false);
    setSpreadIndex(0);
  };

  useEffect(() => () => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && spreadIndex !== 0) closeAlbum();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [spreadIndex]);

  // Helper to get photo URL safely
  const getPhoto = (idx: number, fallback: string) => {
    return state.photos.length > 0 && state.photos[idx % state.photos.length]
      ? state.photos[idx % state.photos.length].src
      : fallback;
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black select-none p-4 relative overflow-hidden">
      {/* Ambient Header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Interactive Scrapbook Album</span>
        </div>
        <p className="text-xs text-neutral-400 mt-0.5">
          Click the cover or use arrows to flip pages (Spread {spreadIndex + 1} of {totalSpreads})
        </p>
      </div>
      {spreadIndex !== 0 && (
        <button
          type="button"
          onClick={closeAlbum}
          aria-label="Close scrapbook album"
          className="absolute top-6 right-6 z-40 rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Book Frame Container with 3D Depth & Drop Shadow */}
      <div className="relative flex items-center justify-center w-full max-w-5xl h-[520px] sm:h-[580px] [perspective:2000px]">
        {/* Navigation Arrow Left */}
        <button
          type="button"
          onClick={() => flip(-1)}
          disabled={spreadIndex === 0}
          aria-label="Previous spread"
          className="absolute -left-2 sm:left-4 z-40 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-xl cursor-pointer disabled:opacity-20 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Previous Page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* 3D Book Spine & Pages Spread */}
        <div
          className={`relative flex w-full max-w-[850px] h-[480px] sm:h-[520px] rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden border border-neutral-300/30 dark:border-neutral-800 ${
            isFlipping ? 'scale-[0.98] rotate-y-3' : 'scale-100 rotate-y-0'
          }`}
        >
          {/* Spread 0: Front Cover */}
          {spreadIndex === 0 && (
            <button type="button" aria-label="Open scrapbook album" onClick={() => flip(1)} className="relative w-full h-full bg-[#1e3a8a] flex items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-400">
              <img
                src="/pages/front.png"
                alt="Front Cover"
                draggable={false}
                className="w-full h-full object-contain scale-110 translate-x-2 pointer-events-none select-none"
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="font-['Caveat'] text-3xl sm:text-4xl text-amber-200 drop-shadow-md">
                  Click to open album ✨
                </span>
              </div>
            </button>
          )}

          {/* Spread 1: Pages 2 & 3 */}
          {spreadIndex === 1 && (
            <div className="relative w-full h-full flex flex-col md:flex-row bg-[#FAF6EE]">
              {/* Left Page (Page 2) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden border-r border-neutral-300/40">
                <img src="/pages/left.jpg" alt="Left Page" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                <img src="/elements/fwine.png" alt="Wine" draggable={false} className="absolute inset-0 m-auto object-contain -rotate-12 -translate-x-28 -translate-y-24 scale-50 pointer-events-none" />
                <img src="/elements/side3.png" alt="Sticker" draggable={false} className="absolute inset-0 m-auto object-contain -translate-x-20 -translate-y-10 scale-75 pointer-events-none" />
                <img src="/elements/mouse.png" alt="Cute mouse" draggable={false} className="absolute inset-0 m-auto object-contain z-30 translate-x-16 translate-y-28 scale-50 pointer-events-none" />
                <img src="/elements/butter.png" alt="Butterfly" draggable={false} className="absolute inset-0 m-auto object-contain scale-45 rotate-30 -translate-x-20 translate-y-24 pointer-events-none" />
                
                {/* Standardized Photo Slot 1 */}
                <div className="absolute inset-0 m-auto h-24 w-24 sm:h-28 sm:w-28 rotate-10 translate-x-10 -translate-y-16 rounded-md shadow-md overflow-hidden bg-neutral-200">
                <img src={getPhoto(0, '/ref/girl1.webp')} alt="Memory 1" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <img src="/elements/frame10.png" alt="Frame" draggable={false} className="absolute inset-0 m-auto object-contain scale-65 rotate-10 translate-x-10 -translate-y-14 z-20 pointer-events-none" />
                <img src="/elements/text1.png" alt="Quote" draggable={false} className="absolute inset-0 m-auto object-contain scale-50 translate-x-8 translate-y-12 pointer-events-none" />
              </div>

              {/* Right Page (Page 3) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                <img src="/pages/right.jpg" alt="Right Page" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                <img src="/elements/paper.png" alt="Paper" draggable={false} className="absolute inset-0 m-auto object-contain rotate-90 shadow-black translate-x-14 translate-y-24 scale-50 pointer-events-none" />
                <img src="/elements/starB.png" alt="Star" draggable={false} className="absolute inset-0 m-auto object-contain shadow-black -rotate-50 -translate-x-14 translate-y-20 scale-50 pointer-events-none" />
                
                {/* Standardized Photo Slots 2, 3, 4 */}
                <div className="absolute inset-0 m-auto h-16 w-16 rotate-20 translate-x-14 -translate-y-16 rounded shadow-md overflow-hidden bg-neutral-200">
                  <img src={getPhoto(1, '/ref/girl.jpg')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <div className="absolute inset-0 m-auto h-16 w-16 rotate-20 translate-x-20 -translate-y-32 rounded shadow-md overflow-hidden bg-neutral-200">
                  <img src={getPhoto(2, '/ref/girl2.webp')} alt="Memory 2" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <div className="absolute inset-0 m-auto h-16 w-16 rotate-20 translate-x-8 translate-y-1 rounded shadow-md overflow-hidden bg-neutral-200">
                  <img src={getPhoto(3, '/ref/girl4.webp')} alt="Memory 3" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <img src="/elements/frame9.png" alt="Frame" draggable={false} className="absolute inset-0 m-auto object-contain shadow-black rotate-12 translate-x-14 -translate-y-14 scale-75 pointer-events-none" />
                <img src="/elements/text2.png" alt="Text" draggable={false} className="absolute inset-0 m-auto object-contain shadow-black -translate-x-10 -translate-y-28 scale-55 pointer-events-none" />
                <img src="/elements/kit.png" alt="Sticker" draggable={false} className="absolute inset-0 m-auto object-contain shadow-black -translate-x-10 -translate-y-10 scale-55 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Spread 2: Pages 4 & 5 */}
          {spreadIndex === 2 && (
            <div className="relative w-full h-full flex flex-col md:flex-row bg-[#FAF6EE]">
              {/* Left Page (Page 4) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden border-r border-neutral-300/40">
                <img src="/pages/left.jpg" alt="Left Page" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                <img src="/elements/billa6.png" alt="Cat sticker" draggable={false} className="absolute inset-0 m-auto object-contain scale-50 rotate-1 -translate-x-24 -translate-y-8 pointer-events-none" />
                <img src="/elements/side1.png" alt="Wine glass" draggable={false} className="absolute inset-0 m-auto object-contain scale-45 rotate-180 -translate-x-20 translate-y-24 pointer-events-none" />
                <img src="/elements/starem.png" alt="Star tape" draggable={false} className="absolute inset-0 m-auto object-contain scale-20 -rotate-18 translate-x-14 -translate-y-36 z-20 pointer-events-none" />
                
                {/* Standardized Photo Slot 5 */}
                <div className="absolute inset-0 m-auto h-24 w-24 rotate-17 translate-x-10 -translate-y-16 rounded shadow-md overflow-hidden bg-neutral-200">
                  <img src={getPhoto(4, '/ref/girl4.webp')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <img src="/elements/frame11.png" alt="Frame" draggable={false} className="absolute inset-0 m-auto object-contain scale-70 rotate-18 translate-x-8 -translate-y-8 z-30 pointer-events-none" />
                <img src="/elements/moon.png" alt="Moon" draggable={false} className="absolute inset-0 m-auto object-contain scale-30 -rotate-14 -translate-x-16 translate-y-22 z-40 pointer-events-none" />
                <img src="/elements/fits.png" alt="Sticker" draggable={false} className="absolute inset-0 m-auto object-contain scale-40 -rotate-14 -translate-x-24 -translate-y-36 z-40 pointer-events-none" />
                <img src="/elements/note1.png" alt="Disk" draggable={false} className="absolute inset-0 m-auto object-contain scale-60 -rotate-7 z-50 translate-x-10 translate-y-28 pointer-events-none" />
                <img src="/elements/lovetape.png" alt="Washi Tape" draggable={false} className="absolute inset-0 m-auto object-contain scale-20 z-50 translate-x-8 translate-y-18 pointer-events-none" />
              </div>

              {/* Right Page (Page 5) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                <img src="/pages/right.jpg" alt="Right Page" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                <img src="/elements/side2.png" alt="Border" draggable={false} className="absolute inset-0 m-auto object-contain scale-60 z-20 translate-x-12 translate-y-18 pointer-events-none" />
                <img src="/elements/billa.png" alt="Cat illustration" draggable={false} className="absolute inset-0 m-auto object-contain scale-35 z-20 -translate-x-12 -translate-y-20 pointer-events-none" />
                <img src="/elements/boqey.png" alt="Bouquet" draggable={false} className="absolute inset-0 m-auto object-contain scale-40 z-20 -translate-x-10 translate-y-20 pointer-events-none" />
                
                {/* Standardized Photo Slot 6 */}
                <div className="absolute inset-0 m-auto h-24 w-24 translate-x-14 -translate-y-22 rounded shadow-md z-30 overflow-hidden bg-neutral-200">
                  <img src={getPhoto(5, '/ref/girl5.webp')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <img src="/frames/frame5.png" alt="Frame" draggable={false} className="absolute inset-0 m-auto object-contain scale-65 translate-x-14 -translate-y-20 z-40 pointer-events-none" />
                <img src="/elements/miss.png" alt="Miss You" draggable={false} className="absolute inset-0 m-auto object-contain scale-45 rotate-18 z-50 translate-x-20 translate-y-4 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Spread 3: Pages 6 & 7 */}
          {spreadIndex === 3 && (
            <div className="relative w-full h-full flex flex-col md:flex-row bg-[#FAF6EE]">
              {/* Left Page (Page 6) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden border-r border-neutral-300/40">
                <img src="/pages/left.jpg" alt="Left Page" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                <img src="/elements/side4.png" alt="Border" draggable={false} className="absolute inset-0 m-auto object-contain scale-60 z-20 -translate-x-16 translate-y-18 pointer-events-none" />
                <img src="/elements/disk.png" alt="Vintage vinyl disk" draggable={false} className="absolute inset-0 m-auto object-contain scale-55 z-20 -translate-x-32 -translate-y-10 pointer-events-none" />
                <img src="/elements/billa5.png" alt="Cat sticker" draggable={false} className="absolute inset-0 m-auto object-contain scale-55 z-20 translate-x-14 translate-y-24 pointer-events-none" />
                
                {/* Standardized Photo Slots 7 & 8 */}
                <div className="absolute inset-0 m-auto h-20 w-20 -rotate-11 translate-x-4 -translate-y-8 rounded shadow-md z-30 overflow-hidden bg-neutral-200">
                  <img src={getPhoto(6, '/ref/girl11.webp')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <div className="absolute inset-0 m-auto h-20 w-20 rotate-11 translate-x-12 -translate-y-28 rounded shadow-md z-30 overflow-hidden bg-neutral-200">
                  <img src={getPhoto(7, '/ref/girl10.webp')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <img src="/elements/frame8.png" alt="Frame" draggable={false} className="absolute inset-0 m-auto object-contain scale-60 translate-x-8 -translate-y-18 z-40 pointer-events-none" />
                <img src="/elements/twoStar.png" alt="Stars" draggable={false} className="absolute inset-0 m-auto object-contain scale-35 -translate-x-10 translate-y-16 z-40 pointer-events-none" />
                <img src="/elements/text3.png" alt="Text" draggable={false} className="absolute inset-0 m-auto object-contain scale-40 -translate-x-16 -translate-y-36 z-40 pointer-events-none" />
              </div>

              {/* Right Page (Page 7) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                <img src="/pages/right.jpg" alt="Right Page" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                <img src="/elements/side5.png" alt="Border" draggable={false} className="absolute inset-0 m-auto object-contain scale-70 z-20 translate-x-18 translate-y-10 pointer-events-none" />
                <img src="/elements/text4.png" alt="Text" draggable={false} className="absolute inset-0 m-auto object-contain scale-50 z-20 -translate-x-6 -translate-y-30 pointer-events-none" />
                
                {/* Standardized Photo Slots 9 & 10 */}
                <div className="absolute inset-0 m-auto h-20 w-20 -rotate-4 -translate-x-14 -translate-y-12 rounded shadow-md z-30 overflow-hidden bg-neutral-200">
                  <img src={getPhoto(8, '/ref/girl9.webp')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <div className="absolute inset-0 m-auto h-20 w-20 rotate-10 -translate-x-8 translate-y-10 rounded shadow-md z-30 overflow-hidden bg-neutral-200">
                  <img src={getPhoto(9, '/ref/girl8.webp')} alt="Memory" draggable={false} className="w-full h-full object-cover object-center" />
                </div>
                <img src="/elements/frame7.png" alt="Frame" draggable={false} className="absolute inset-0 m-auto object-contain scale-60 -translate-x-10 translate-y-1 z-40 pointer-events-none" />
                <img src="/elements/billa4.png" alt="Cat sleeping" draggable={false} className="absolute inset-0 m-auto object-contain scale-50 -translate-x-12 translate-y-30 z-40 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Spread 4: Back Cover */}
          {spreadIndex === 4 && (
            <div className="relative w-full h-full bg-[#1e3a8a] flex items-center justify-center overflow-hidden">
              <img
                src="/pages/back.png"
                alt="Back Cover"
                draggable={false}
                className="w-full h-full object-contain scale-110 translate-x-2 pointer-events-none select-none"
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="font-['Caveat'] text-3xl sm:text-4xl text-amber-200 drop-shadow-md">
                  To Many More Beautiful Years 💖
                </span>
              </div>
            </div>
          )}

          {/* Center Spine Shadow for Physical Realism */}
          {spreadIndex > 0 && spreadIndex < 4 && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none z-50 hidden md:block" />
          )}
        </div>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          onClick={() => flip(1)}
          disabled={spreadIndex === totalSpreads - 1}
          aria-label="Next spread"
          className="absolute -right-2 sm:right-4 z-40 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-xl cursor-pointer disabled:opacity-20 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Next Page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
