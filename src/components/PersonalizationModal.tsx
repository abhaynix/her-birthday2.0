import React, { useState, useRef } from 'react';
import { useBirthday } from '../context/BirthdayContext';
import { X, Sparkles, RotateCcw, Heart, Calendar, User, MessageSquare, Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { processAndStandardizeImage } from '../utils/imageWorkflow';
import { MemoryPhoto } from '../types';

export const PersonalizationModal: React.FC = () => {
  const { state, updateState, setPhotos, resetDefaults, isPersonalizing, setIsPersonalizing } = useBirthday();

  const [activeTab, setActiveTab] = useState<'info' | 'photos'>('info');
  const [name, setName] = useState(state.recipientName);
  const [age, setAge] = useState(state.targetAge);
  const [date, setDate] = useState(state.birthDate);
  const [wish, setWish] = useState(state.birthdayWish);
  const [photosList, setPhotosList] = useState<MemoryPhoto[]>(state.photos);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isPersonalizing) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setUploadStatus(`Standardizing ${files.length} images to uniform workflow...`);
    sounds.playTick();

    try {
      const processed: MemoryPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Standardize each image to uniform 4:5 aspect ratio and identical 800x1000 dimensions
        const standardizedUrl = await processAndStandardizeImage(file, {
          aspectRatio: 'portrait',
          targetWidth: 800,
          targetHeight: 1000,
          quality: 0.92,
        });

        const title = state.polaroidTitles[i % state.polaroidTitles.length] || `Memory ${i + 1}`;
        processed.push({
          id: `custom-${Date.now()}-${i}`,
          src: standardizedUrl,
          title,
          alt: file.name,
        });
      }

      // Merge or replace photos
      const updated = [...processed, ...photosList].slice(0, 12);
      setPhotosList(updated);
      setPhotos(updated);
      sounds.playPop();
      setUploadStatus(`Successfully standardized ${processed.length} photos!`);
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (err) {
      setUploadStatus('Failed to process image. Please try another format.');
      console.error(err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    sounds.playTick();
    const updated = photosList.filter(p => p.id !== id);
    setPhotosList(updated);
    setPhotos(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();
    updateState({
      recipientName: name.trim() || 'Sweety',
      targetAge: state.targetAge,
      birthDate: '20 October 2004',
      birthdayWish: wish.trim() || state.birthdayWish,
      photos: photosList,
    });
    setIsPersonalizing(false);
  };

  const handleReset = () => {
    sounds.playTick();
    resetDefaults();
    setName('Sweety');
    setAge(20);
    setDate('20 October 2004');
    setWish("May this year bring you closer to everything you're chasing.");
    setPhotosList(state.photos);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-['Bricolage_Grotesque']">
              Personalize Birthday Celebration
            </h3>
          </div>
          <button
            onClick={() => setIsPersonalizing(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-neutral-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Text & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Standardized Photos ({photosList.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'info' && (
            <form id="bday-form" onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  <User className="w-3.5 h-3.5 text-rose-400" />
                  <span>Recipient Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sweety, Chloe, Alex"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Turning Age</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Date Label</span>
                  </label>
                  <input
                    type="text"
                    value={date}
                    readOnly
                    placeholder="20 October 2004"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Heartfelt Birthday Wish</span>
                </label>
                <textarea
                  rows={3}
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  placeholder="Write a custom heartfelt birthday blessing..."
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors text-sm resize-none"
                />
              </div>
            </form>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Uploader Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-amber-400/80 rounded-xl p-5 text-center bg-neutral-800/40 hover:bg-neutral-800/70 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/webp,image/jpeg,image/png,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-2.5 rounded-full bg-neutral-700/60 group-hover:bg-amber-400/20 text-neutral-300 group-hover:text-amber-300 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      Upload Photos (WebP, JPG, PNG)
                    </p>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Auto-standardized to uniform 4:5 aspect ratio & identical dimensions
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {uploadStatus && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-mono text-amber-300 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}

              {/* Photos Grid with Uniform Workflow */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-neutral-400">
                    Active Memory Photos (Same Size Workflow)
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {photosList.length} / 12 slots filled
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {photosList.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shadow-sm"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt || `Memory ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white pointer-events-none">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex items-center justify-between border-t border-neutral-800 bg-neutral-900/90">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 1:1 Original</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPersonalizing(false)}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
