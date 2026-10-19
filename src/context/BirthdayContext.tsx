import React, { createContext, useContext, useState, useEffect } from 'react';
import { BirthdayState, MemoryPhoto } from '../types';
import { sounds } from '../services/soundEffects';

const INITIAL_PHOTOS: MemoryPhoto[] = [
  { id: '1', src: '/ref/girl1.webp', title: 'Sweety', alt: 'Memory 1' },
  { id: '2', src: '/ref/girl2.webp', title: 'Angel', alt: 'Memory 2' },
  { id: '3', src: '/ref/girl4.webp', title: 'Dreamgirl', alt: 'Memory 3' },
  { id: '4', src: '/ref/girl5.webp', title: 'Sweetheart', alt: 'Memory 4' },
  { id: '5', src: '/ref/girl6.webp', title: 'Icon', alt: 'Memory 5' },
  { id: '6', src: '/ref/girl7.webp', title: 'Stunner', alt: 'Memory 6' },
  { id: '7', src: '/ref/girl8.webp', title: 'Babe', alt: 'Memory 7' },
  { id: '8', src: '/ref/girl9.webp', title: 'Darling', alt: 'Memory 8' },
  { id: '9', src: '/ref/girl10.webp', title: 'Sunshine', alt: 'Memory 9' },
  { id: '10', src: '/ref/girl11.webp', title: 'Queen', alt: 'Memory 10' },
  { id: '11', src: '/ref/girl12.webp', title: 'Heartbreaker', alt: 'Memory 11' },
  { id: '12', src: '/ref/girl13.webp', title: 'My Love', alt: 'Memory 12' },
];

const INITIAL_TITLES = [
  'Cutie 🥹', 'Baddie 😎', 'Pretty ✨', 'My Love 🤍', 'Sunshine ☀️',
  'Angel 🪽', 'Beautiful 🌸', 'Dream Girl 💫', 'Queen 👑', 'Sweetheart 🍓',
  'Gorgeous 💕', 'Little Star ⭐'
];

const BIRTH_DATE = new Date(2004, 9, 20);
const getAge = (now = new Date()) => now.getFullYear() - BIRTH_DATE.getFullYear() - (now < new Date(now.getFullYear(), 9, 20) ? 1 : 0);

interface BirthdayContextType {
  state: BirthdayState;
  updateState: (partial: Partial<BirthdayState>) => void;
  setPhotos: (photos: MemoryPhoto[]) => void;
  resetDefaults: () => void;
  isPersonalizing: boolean;
  setIsPersonalizing: (v: boolean) => void;
  isAuditOpen: boolean;
  setIsAuditOpen: (v: boolean) => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  activeStage: number;
  setActiveStage: (stage: number) => void;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BirthdayState>(() => {
    const saved = localStorage.getItem('bday_clone_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.photos && parsed.photos.length > 0) {
          const photos = parsed.photos.map((photo: MemoryPhoto) => {
            const legacy = photo.src.match(/^\/media\/hero-gallery\/girl\d+-\d+\.webp$/);
            const replacement = legacy && INITIAL_PHOTOS.find(({ id }) => id === photo.id);
            return replacement ? { ...photo, src: replacement.src } : photo;
          });
          return { ...parsed, photos, targetAge: getAge(), birthDate: '20 October 2004' };
        }
      } catch {
        // fallback
      }
    }
    return {
      recipientName: 'Sweety',
      targetAge: getAge(),
      birthDate: '20 October 2004',
      birthdayWish: "May this year bring you closer to everything you're chasing.",
      photos: INITIAL_PHOTOS,
      polaroidTitles: INITIAL_TITLES,
    };
  });

  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sounds.getIsMuted());
  const [musicVolume, setMusicVolumeState] = useState(0.6);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    let active = true;
    let starting = false;
    const removeRetry = () => {
      window.removeEventListener('pointerdown', retryMusic);
      window.removeEventListener('keydown', retryMusic);
    };
    const startMusic = async () => {
      if (starting) return;
      starting = true;
      const playing = await sounds.startMusic();
      starting = false;
      if (!active) return;
      setIsMusicPlaying(playing);
      if (playing) removeRetry();
      else {
        window.addEventListener('pointerdown', retryMusic, { once: true });
        window.addEventListener('keydown', retryMusic, { once: true });
      }
    };
    const retryMusic = () => {
      removeRetry();
      void startMusic();
    };
    void startMusic();
    setIsMuted(sounds.getIsMuted());
    return () => {
      active = false;
      removeRetry();
    };
  }, []);

  const setMusicVolume = (vol: number) => {
    setMusicVolumeState(vol);
    sounds.setVolume(vol);
  };

  useEffect(() => {
    try {
      localStorage.setItem('bday_clone_state', JSON.stringify(state));
    } catch {
      // Storage quota or privacy restrictions
    }
  }, [state]);

  const updateState = (partial: Partial<BirthdayState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const setPhotos = (photos: MemoryPhoto[]) => {
    setState(prev => ({ ...prev, photos }));
  };

  const resetDefaults = () => {
    setState({
      recipientName: 'Sweety',
      targetAge: getAge(),
      birthDate: '20 October 2004',
      birthdayWish: "May this year bring you closer to everything you're chasing.",
      photos: INITIAL_PHOTOS,
      polaroidTitles: INITIAL_TITLES,
    });
  };

  const toggleMusic = async () => {
    const playing = await sounds.toggleMusic();
    setIsMusicPlaying(playing);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    sounds.setMuted(nextMute);
    setIsMuted(nextMute);
    if (nextMute) {
      setIsMusicPlaying(false);
    }
  };

  return (
    <BirthdayContext.Provider
      value={{
        state,
        updateState,
        setPhotos,
        resetDefaults,
        isPersonalizing,
        setIsPersonalizing,
        isAuditOpen,
        setIsAuditOpen,
        isMusicPlaying,
        toggleMusic,
        isMuted,
        toggleMute,
        musicVolume,
        setMusicVolume,
        activeStage,
        setActiveStage
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
};
