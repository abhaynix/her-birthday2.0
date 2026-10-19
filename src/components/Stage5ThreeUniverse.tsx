import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { useBirthday } from '../context/BirthdayContext';
import { sounds } from '../services/soundEffects';
import { Sparkles, Flame, RefreshCw } from 'lucide-react';
import { MemoryPhoto } from '../types';

export const Stage5ThreeUniverse: React.FC = () => {
  const { state } = useBirthday();
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<MemoryPhoto | null>(null);
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const activePhotos = state.photos && state.photos.length > 0 ? state.photos : [];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      // Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 16);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
      dirLight.position.set(10, 10, 10);
      scene.add(dirLight);

      const tealLight = new THREE.PointLight(0x31b8c6, 1.5, 30);
      tealLight.position.set(-10, -5, -5);
      scene.add(tealLight);

      // Background Starfield
      const starGeo = new THREE.BufferGeometry();
      const starCount = 1200;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 80;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7 });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // Concentric Wireframe Glowing Spheres
      const sphereMatInner = new THREE.MeshStandardMaterial({ color: '#1a1a2e', transparent: true, opacity: 0.15, wireframe: true });
      const sphereMat1 = new THREE.MeshStandardMaterial({ color: '#31b8c6', transparent: true, opacity: 0.05, wireframe: true });
      const sphereMat2 = new THREE.MeshStandardMaterial({ color: '#31b8c6', transparent: true, opacity: 0.03, wireframe: true });
      const sphereMat3 = new THREE.MeshStandardMaterial({ color: '#31b8c6', transparent: true, opacity: 0.02, wireframe: true });

      const sInner = new THREE.Mesh(new THREE.SphereGeometry(2, 24, 24), sphereMatInner);
      const s1 = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 32), sphereMat1);
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 32), sphereMat2);
      const s3 = new THREE.Mesh(new THREE.SphereGeometry(16, 32, 32), sphereMat3);
      scene.add(sInner, s1, s2, s3);

      // Central Celebratory 3D Birthday Cake Model
      const cakeGroup = new THREE.Group();

      // Cake Base Platter
      const plateGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.2, 32);
      const plateMat = new THREE.MeshStandardMaterial({ color: '#e5e7eb', metalness: 0.8, roughness: 0.2 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = -2.6;
      cakeGroup.add(plate);

      // Bottom Tier
      const tier1Geo = new THREE.CylinderGeometry(2.8, 2.8, 1.4, 32);
      const tier1Mat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.3 });
      const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
      tier1.position.y = -1.8;
      cakeGroup.add(tier1);

      // Frosting Ribbons
      const frostGeo = new THREE.TorusGeometry(2.82, 0.12, 16, 32);
      const frostMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', roughness: 0.1 });
      const frost1 = new THREE.Mesh(frostGeo, frostMat);
      frost1.rotation.x = Math.PI / 2;
      frost1.position.y = -1.1;
      cakeGroup.add(frost1);

      // Top Tier
      const tier2Geo = new THREE.CylinderGeometry(1.9, 1.9, 1.2, 32);
      const tier2Mat = new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.3 });
      const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
      tier2.position.y = -0.5;
      cakeGroup.add(tier2);

      // Birthday Candles
      const candleGroup = new THREE.Group();
      const candleColors = ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
      const flameMeshes: THREE.Mesh[] = [];
      const flameLights: THREE.PointLight[] = [];

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const cx = Math.cos(angle) * 1.0;
        const cz = Math.sin(angle) * 1.0;

        const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
        const cMat = new THREE.MeshStandardMaterial({ color: candleColors[i % candleColors.length] });
        const candle = new THREE.Mesh(cGeo, cMat);
        candle.position.set(cx, 0.4, cz);
        candleGroup.add(candle);

        const fGeo = new THREE.ConeGeometry(0.12, 0.3, 16);
        const fMat = new THREE.MeshBasicMaterial({ color: '#ffedd5' });
        const flame = new THREE.Mesh(fGeo, fMat);
        flame.position.set(cx, 0.95, cz);
        candleGroup.add(flame);
        flameMeshes.push(flame);

        const flight = new THREE.PointLight(0xffaa33, 0.6, 4);
        flight.position.set(cx, 1.0, cz);
        candleGroup.add(flight);
        flameLights.push(flight);
      }

      cakeGroup.add(candleGroup);
      scene.add(cakeGroup);

      // Fibonacci Constellation Cards Group with Standardized Uniform Geometry
      const cardsGroup = new THREE.Group();
      const cardMeshes: { mesh: THREE.Mesh; data: MemoryPhoto }[] = [];
      const loader = new THREE.TextureLoader();

      const numCards = activePhotos.length;
      const phi = (1 + Math.sqrt(5)) / 2;

      activePhotos.forEach((photo, idx) => {
        const y = 1 - (idx / Math.max(1, numCards - 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = 2 * Math.PI * idx / phi;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        const dist = 7.5 + (idx % 3) * 1.5;

        // Uniform 1.8 x 2.4 dimension for all celestial cards
        const cardGeo = new THREE.PlaneGeometry(1.8, 2.4);
        loader.load(photo.src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          const cardMat = new THREE.MeshStandardMaterial({
            map: tex,
            side: THREE.DoubleSide,
            roughness: 0.4
          });
          const mesh = new THREE.Mesh(cardGeo, cardMat);
          mesh.position.set(x * dist, y * dist, z * dist);
          mesh.lookAt(0, 0, 0);
          cardsGroup.add(mesh);
          cardMeshes.push({ mesh, data: photo });
        });
      });

      scene.add(cardsGroup);

      // Interaction: Raycaster for Card Clicking
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onClick = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cardsGroup.children);
        if (intersects.length > 0) {
          const hit = cardMeshes.find(c => c.mesh === intersects[0].object);
          if (hit) {
            sounds.playPop();
            setSelectedCard(hit.data);
          }
        }
      };

      container.addEventListener('click', onClick);

      // Drag Orbit Rotation
      let isDragging = false;
      let prevX = 0;
      let prevY = 0;
      let targetRotX = 0;
      let targetRotY = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;

        targetRotY += deltaX * 0.005;
        targetRotX += deltaY * 0.005;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Render Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        cardsGroup.rotation.y += 0.002;
        cakeGroup.rotation.y += 0.004;
        stars.rotation.y += 0.0003;

        cardsGroup.rotation.y += targetRotY * 0.05;
        cardsGroup.rotation.x += targetRotX * 0.05;
        targetRotX *= 0.92;
        targetRotY *= 0.92;

        flameMeshes.forEach((flame, i) => {
          if (!isCandleBlown) {
            const flicker = Math.sin(elapsedTime * 12 + i) * 0.15;
            flame.scale.set(1 + flicker, 1 + flicker * 1.2, 1 + flicker);
            flameLights[i].intensity = 0.5 + flicker * 0.5;
          } else {
            flame.scale.set(0, 0, 0);
            flameLights[i].intensity = 0;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        container.removeEventListener('click', onClick);
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.warn('Three.js failed to initialize WebGL context:', err);
    }
  }, [isCandleBlown, activePhotos]);

  const handleBlowCandles = () => {
    sounds.playCandleBlow();
    setIsCandleBlown(true);
    setWishMade(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleResetCandles = () => {
    sounds.playTick();
    setIsCandleBlown(false);
    setWishMade(false);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* Ambient Top HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <h2 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl text-white font-bold tracking-tight">
          3D Celestial Galaxy & Birthday Cake
        </h2>
        <p className="font-mono text-xs text-neutral-400 mt-1">
          Drag to rotate galaxy · Click floating cards to inspect · Blow out candle to make a wish
        </p>
      </div>

      {/* Candle Blow / Wish Ceremony Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        {!isCandleBlown ? (
          <button
            onClick={handleBlowCandles}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white font-medium text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 animate-pulse text-amber-200" />
            <span>Make a Wish & Blow Out Candles</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        ) : (
          <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <div className="px-5 py-2.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-emerald-400 text-xs font-mono flex items-center gap-2 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Wish Granted for {state.recipientName}! Happy {state.targetAge}th Birthday! 🎉</span>
            </div>
            <button
              onClick={handleResetCandles}
              title="Relight candles"
              className="p-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Card Inspection Modal */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-sm w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-2xl text-center"
          >
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <img
                src={selectedCard.src}
                alt={selectedCard.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-white">
                {selectedCard.title}
              </h3>
              <p className="font-['Caveat'] text-lg text-amber-400 mt-1">
                A cherished memory in the stars ✨
              </p>
              <button
                onClick={() => setSelectedCard(null)}
                className="mt-4 w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
