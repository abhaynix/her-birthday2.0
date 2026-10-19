export interface MemoryPhoto {
  id: string;
  src: string;
  title: string;
  alt: string;
  rotation?: string;
  positionClass?: string;
}

export interface BirthdayState {
  recipientName: string;
  targetAge: number;
  birthDate: string;
  birthdayWish: string;
  photos: MemoryPhoto[];
  polaroidTitles: string[];
}

export interface ManifestItem {
  id: string;
  category: string;
  item: string;
  sourceValue: string | number;
  cloneValue: string | number;
  status: 'PASS' | 'FAIL' | 'BLOCKED';
  evidence: string;
  file?: string;
  sizeBytes?: number;
  sha256?: string;
}
