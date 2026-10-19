import React, { useRef, useState, useEffect } from 'react';
import { BirthdayProvider, useBirthday } from './context/BirthdayContext';
import { Stage1IntroReveal } from './components/Stage1IntroReveal';
import { Stage2HeroGallery } from './components/Stage2HeroGallery';
import { Stage3LetterSection } from './components/Stage3LetterSection';
import { Stage4ScrapbookAlbum } from './components/Stage4ScrapbookAlbum';
import { Stage5ThreeUniverse } from './components/Stage5ThreeUniverse';
import { CelebrationControls } from './components/CelebrationControls';
import { PersonalizationModal } from './components/PersonalizationModal';
import { ParityAuditDrawer } from './components/ParityAuditDrawer';

const MainLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeStage, setActiveStage } = useBirthday();

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const stage = Math.round(scrollTop / height);
    if (stage !== activeStage) {
      setActiveStage(stage);
    }
  };

  const scrollToStage = (stageIndex: number) => {
    if (!containerRef.current) return;
    const targetY = stageIndex * window.innerHeight;
    containerRef.current.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    setActiveStage(stageIndex);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Snap Scroll Container matching 1:1 original Next.js architecture */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-x-hidden overflow-y-scroll snap-y snap-mandatory bg-zinc-50 dark:bg-black select-none scroll-smooth"
      >
        {/* Section 1: Intro Odometer & Flame Burn Reveal */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <Stage1IntroReveal />
        </section>

        {/* Section 2: Hero Parallax Ribbon Gallery */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <Stage2HeroGallery />
        </section>

        {/* Section 3: Polaroid Scrapbook & Handwritten Love Letter */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <Stage3LetterSection />
        </section>

        {/* Section 4: 3D Turn-Page Scrapbook Album */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <div className="flex h-screen overflow-hidden flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Stage4ScrapbookAlbum />
          </div>
        </section>

        {/* Section 5: Three.js 3D Constellation Galaxy & Birthday Cake */}
        <section className="h-screen w-full snap-start overflow-y-scroll snap-always shrink-0 relative">
          <Stage5ThreeUniverse />
        </section>
      </div>

      {/* Floating Celebration Toolbar */}
      <CelebrationControls
        activeStage={activeStage}
        onScrollToStage={scrollToStage}
      />

      {/* Modals & Drawers */}
      <PersonalizationModal />
      <ParityAuditDrawer />
    </div>
  );
};

export default function App() {
  return (
    <BirthdayProvider>
      <MainLayout />
    </BirthdayProvider>
  );
}
