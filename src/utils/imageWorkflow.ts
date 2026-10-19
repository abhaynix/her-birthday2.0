/**
 * Image processing workflow to standardize all uploaded photos
 * to identical dimensions, aspect ratios, and center-crops
 * so they match seamlessly across all 5 celebration stages.
 */

export interface StandardizedImageOptions {
  targetWidth?: number;
  targetHeight?: number;
  aspectRatio?: 'square' | 'portrait'; // square (1:1) or portrait (4:5)
  quality?: number;
}

export async function processAndStandardizeImage(
  fileOrUrl: File | string,
  options: StandardizedImageOptions = {}
): Promise<string> {
  const {
    aspectRatio = 'portrait',
    quality = 0.92
  } = options;

  // Standard dimensions: 800x1000 for 4:5 portrait, or 800x800 for square
  const targetWidth = options.targetWidth || (aspectRatio === 'square' ? 800 : 800);
  const targetHeight = options.targetHeight || (aspectRatio === 'square' ? 800 : 1000);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to acquire canvas context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Calculate center-crop coordinates
      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      const targetRatio = targetWidth / targetHeight;
      const srcRatio = imgWidth / imgHeight;

      let srcX = 0;
      let srcY = 0;
      let srcW = imgWidth;
      let srcH = imgHeight;

      if (srcRatio > targetRatio) {
        // Image is wider than target: crop left & right
        srcW = imgHeight * targetRatio;
        srcX = (imgWidth - srcW) / 2;
      } else {
        // Image is taller than target: crop top & bottom (favoring center/upper face)
        srcH = imgWidth / targetRatio;
        srcY = (imgHeight - srcH) * 0.35; // slightly higher than true center to preserve head/face
      }

      // Draw standard cropped image
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetWidth, targetHeight);

      // Return standardized data URL
      const standardizedDataUrl = canvas.toDataURL('image/webp', quality);
      resolve(standardizedDataUrl);
    };

    img.onerror = (err) => {
      reject(err);
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
