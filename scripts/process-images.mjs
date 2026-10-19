import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = '/home/devx/Downloads/birthday-celebration-experience-&-parity-clone';
const SRC_DIR = path.join(PROJECT_ROOT, 'public/ref');
const OUT_DIR = path.join(PROJECT_ROOT, 'public/media');

const slots = {
  'threejs-memory': {
    images: ['girl4.webp', 'girl6.webp', 'girl7.webp', 'girl8.webp'],
    maxDim: 2048,
    widths: [512, 1024, 2048],
    isTexture: true,
    quality: { webp: 80, avif: 55, jpeg: 75 }
  },
  'polaroid-board': {
    images: ['girl5.webp', 'girl9.webp', 'girl10.webp', 'girl11.webp', 'girl12.webp', 'girl13.webp'],
    widths: [225, 390, 768],
    isTexture: false,
    quality: { webp: 80, avif: 55, jpeg: 75 },
    gravity: sharp.gravity.north
  },
  'scrapbook-album': {
    images: ['girl5.webp', 'girl9.webp', 'girl10.webp', 'girl11.webp', 'girl12.webp', 'girl13.webp'],
    widths: [225, 390, 768],
    isTexture: false,
    quality: { webp: 80, avif: 55, jpeg: 75 },
    gravity: sharp.gravity.north
  },
  'hero-gallery': {
    images: ['girl1.webp', 'girl2.webp', 'girl4.webp', 'girl6.webp', 'girl7.webp', 'girl8.webp'],
    widths: [225, 300, 390, 768, 1280],
    isTexture: false,
    quality: { webp: 80, avif: 55, jpeg: 75 },
    gravity: sharp.gravity.center
  },
  'og-image': {
    images: ['girl7.webp'],
    widths: [300, 600, 1200],
    isTexture: false,
    quality: { webp: 80, avif: 55, jpeg: 75 },
    gravity: sharp.gravity.center,
    crop: { width: 1200, height: 630 }
  },
  'favicon': {
    images: ['girl1.webp'],
    widths: [32, 48, 64, 128, 256],
    isTexture: false,
    quality: { webp: 80, avif: 55, jpeg: 75 },
    gravity: sharp.gravity.center
  }
};

async function processSlot(slotId, config) {
  const slotDir = path.join(OUT_DIR, slotId);
  fs.mkdirSync(slotDir, { recursive: true });

  const results = [];

  for (const imgName of config.images) {
    const srcPath = path.join(SRC_DIR, imgName);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Missing source: ${srcPath}`);
      continue;
    }

    const baseName = path.parse(imgName).name;
    const srcImage = sharp(srcPath);
    const metadata = await srcImage.metadata();
    const srcWidth = metadata.width;
    const srcHeight = metadata.height;

    // Generate blur placeholder (tiny base64)
    const blurBuffer = await sharp(srcPath)
      .resize(20, 20, { fit: 'inside', withoutEnlargement: true })
      .blur(10)
      .webp({ quality: 20 })
      .toBuffer();
    const blurBase64 = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    const imgResult = {
      source: imgName,
      sourceWidth: srcWidth,
      sourceHeight: srcHeight,
      sourceSize: fs.statSync(srcPath).size,
      blurPlaceholder: blurBase64,
      variants: []
    };

    // Determine which widths to generate (include source width as max)
    const targetWidths = [...new Set(config.widths.filter(w => w <= srcWidth).concat(srcWidth))].sort((a,b) => a-b);

    // Process each width
    for (const w of targetWidths) {
      const h = Math.round((w / srcWidth) * srcHeight);

      // Three.js textures: cap at maxDim, make power-of-two friendly
      let outWidth = w, outHeight = h;
      if (config.isTexture) {
        if (w > config.maxDim) continue;
        // Round to nearest power of 2 for mipmap efficiency
        outWidth = Math.pow(2, Math.round(Math.log2(w)));
        outHeight = Math.pow(2, Math.round(Math.log2(h)));
        if (outWidth > config.maxDim) outWidth = config.maxDim;
        if (outHeight > config.maxDim) outHeight = config.maxDim;
      }

      const variants = {};

      // AVIF
      const avifPath = path.join(slotDir, `${baseName}-${outWidth}.avif`);
      await sharp(srcPath)
        .rotate() // auto-rotate from EXIF
        .resize(outWidth, outHeight, {
          fit: config.crop ? 'cover' : 'inside',
          withoutEnlargement: true,
          position: config.gravity || sharp.gravity.center
        })
        .avif({ quality: config.quality.avif })
        .toFile(avifPath);
      variants.avif = { path: avifPath, size: fs.statSync(avifPath).size };

      // WebP
      const webpPath = path.join(slotDir, `${baseName}-${outWidth}.webp`);
      await sharp(srcPath)
        .rotate()
        .resize(outWidth, outHeight, {
          fit: config.crop ? 'cover' : 'inside',
          withoutEnlargement: true,
          position: config.gravity || sharp.gravity.center
        })
        .webp({ quality: config.quality.webp })
        .toFile(webpPath);
      variants.webp = { path: webpPath, size: fs.statSync(webpPath).size };

      // JPEG fallback
      const jpegPath = path.join(slotDir, `${baseName}-${outWidth}.jpg`);
      await sharp(srcPath)
        .rotate()
        .resize(outWidth, outHeight, {
          fit: config.crop ? 'cover' : 'inside',
          withoutEnlargement: true,
          position: config.gravity || sharp.gravity.center
        })
        .jpeg({ quality: config.quality.jpeg, mozjpeg: true })
        .toFile(jpegPath);
      variants.jpeg = { path: jpegPath, size: fs.statSync(jpegPath).size };

      imgResult.variants.push({ width: outWidth, height: outHeight, ...variants });
    }

    results.push(imgResult);
  }

  // Write manifest
  const manifestPath = path.join(slotDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    slotId,
    processedAt: new Date().toISOString(),
    images: results
  }, null, 2));

  console.log(`✓ ${slotId}: ${results.length} images processed`);
  return results;
}

async function main() {
  console.log('Starting image processing...\n');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const allResults = {};
  for (const [slotId, config] of Object.entries(slots)) {
    allResults[slotId] = await processSlot(slotId, config);
  }

  // Write combined manifest
  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ slots: allResults, generatedAt: new Date().toISOString() }, null, 2)
  );

  console.log('\n✓ All slots processed. Manifest written to public/media/manifest.json');
}

main().catch(console.error);
