import "./style.css";

// =======================
// ELEMENTS
// =======================
const videoElement = document.getElementById("videoview");
const canvas = document.getElementById("pinkCanvas");
const ctx = canvas.getContext("2d");
const filterButtons = document.querySelectorAll(".filter-button");
const countdown = document.getElementById("countdown-overlay");
const imagecontainer = document.getElementById("images-container");
const captureCanvas = document.getElementById("captureCanvas");
const capture = document.getElementById("capture-button");
const retakeButton = document.getElementById("retake-button");
const confirmButton = document.getElementById("confirm-button");
const skipbtn = document.getElementById("skipBtn")

retakeButton.style.display = "none";
confirmButton.style.display = "none";
skipbtn.style.display = "none";

// =======================
// GLOBAL STATES
// =======================
let finalImageData = null;
let currentFilter = "none";
let filterActive = false;
confirmButton.disabled = true;
let photos = [];

// =======================
// CAMERA INIT
// =======================
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => (videoElement.srcObject = stream))
    .catch((err) => {
      console.error("Camera error:", err);
      const frame = document.getElementById("photobooth-frame");
      frame.innerHTML = "<p>Camera access denied or no camera found.</p>";
    });
} else {
  alert("Sorry, your browser does not support webcam access.");
}

// =======================
// FILTER BUTTON HANDLING
// =======================
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter || "none";
    applyFilter(currentFilter);
  });
});

// =======================
// APPLY FILTER
// =======================
function applyFilter(type) {
  if (type === "none") {
    filterActive = false;
    videoElement.style.display = "block";
    canvas.style.display = "none";
    videoElement.style.filter = "none";
  } else {
    filterActive = true;
    loopCanvasFilter();
  }
}

function loopCanvasFilter() {
  if (!filterActive) return;

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  switch (currentFilter) {
    case "pink":
      applyPink(frame.data);
      break;
    case "twilight":
      applyBlueTwilight(frame.data);
      break;
    case "2016":
      applyPurple(frame.data);
      break;
    case "grayscale":
      applyGrayscale(frame.data);
      break;
    case "vintage":
      applyVintage(frame.data);
      break;
    case "dreamy":
      applyDreamy(frame.data);
      break;
  }

  ctx.putImageData(frame, 0, 0);
  canvas.style.display = "block";
  videoElement.style.display = "none";

  requestAnimationFrame(loopCanvasFilter);
}

function applyPink(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let newR = r * 1.1 - g * 0.05 + b * 0.2;
    let newG = r * 0.05 + g * 0.7 + b * 0.05;
    let newB = r * 0.2 - g * 0.05 + b * 1.0;

    const contrastFactor = 1.03;
    newR = (newR - 128) * contrastFactor + 128;
    newB = (newB - 128) * contrastFactor + 128;

    data[i] = Math.max(0, Math.min(255, newR));
    data[i + 1] = Math.max(0, Math.min(255, newG));
    data[i + 2] = Math.max(0, Math.min(255, newB));
  }
}

function applyBlueTwilight(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Step 1: Desaturate for cinematic tone
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;
    const desaturate = 0.45;
    let r1 = r * (1 - desaturate) + gray * desaturate;
    let g1 = g * (1 - desaturate) + gray * desaturate;
    let b1 = b * (1 - desaturate) + gray * desaturate;

    // Step 2: Cool teal shift (reduce red, boost green & blue)
    let newR = r1 * 0.75; // reduce warmth
    let newG = g1 * 1.13 + b1 * 0.2; // slight green/blue tint
    let newB = b1 * 1.2 + g1 * 0.1; // stronger blue component

    // Step 3: Gentle contrast curve
    const contrast = 0.92;
    const brightness = -30; // slightly darker for cinematic feel
    newR = (newR - 128) * contrast + 128 + brightness;
    newG = (newG - 128) * contrast + 128 + brightness;
    newB = (newB - 128) * contrast + 128 + brightness + 10; // cool lift

    // Step 4: Clamp values
    data[i] = Math.max(0, Math.min(255, newR));
    data[i + 1] = Math.max(0, Math.min(255, newG));
    data[i + 2] = Math.max(0, Math.min(255, newB));
  }
}

function applyPurple(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Desaturate untuk soft vintage look
    const gray = r * 0.299 + g * 0.587 + b * 0.114;
    const desaturation = 0.1;

    let newR = r + (gray - r) * desaturation;
    let newG = g + (gray - g) * desaturation;
    let newB = b + (gray - b) * desaturation;

    // Warm peachy-pink tone (boost red & green, slight blue)
    newR = newR * 1.2 + newG * 0.08; // Lebih warm/orange
    newG = newG * 1.0 + newR * 0.09; // Slight peachy
    newB = newB * 1.0 + newR * 0.09; // Sedikit pink, tidak terlalu biru

    // Brightness boost (overexposed/glowy)
    const brightness = 10;
    newR += brightness;
    newG += brightness;
    newB += brightness;

    // Low contrast (soft, washed out)
    const contrastFactor = 1.0;
    newR = (newR - 128) * contrastFactor + 128;
    newG = (newG - 128) * contrastFactor + 128;
    newB = (newB - 128) * contrastFactor + 128;

    // Lift shadows (faded look - signature 2014)
    const shadowLift = 17;
    if (newR < 70) newR += shadowLift;
    if (newG < 70) newG += shadowLift;
    if (newB < 70) newB += shadowLift;

    // Slight warm glow di highlights
    if (newR > 180) newR += 8;
    if (newG > 180) newG += 8;

    data[i] = Math.max(0, Math.min(255, newR));
    data[i + 1] = Math.max(0, Math.min(255, newG));
    data[i + 2] = Math.max(0, Math.min(255, newB));
  }
}

function applyGrayscale(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
}

function applyVintage(data) {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Sepia tone matrix
    let newR = r * 0.9 + g * 0.3 + b * 0.1;
    let newG = r * 0.2 + g * 0.8 + b * 0.1;
    let newB = r * 0.1 + g * 0.2 + b * 0.6;

    // Boost brightness & contrast slightly
    const contrastFactor = 1.1;
    newR = ((newR - 128) * contrastFactor + 128) * 1.05 + 10;
    newG = ((newG - 128) * contrastFactor + 128) * 1.05 + 8;
    newB = ((newB - 128) * contrastFactor + 128) * 0.9;

    data[i] = Math.max(0, Math.min(255, newR));
    data[i + 1] = Math.max(0, Math.min(255, newG));
    data[i + 2] = Math.max(0, Math.min(255, newB));
  }
}

function applyDreamy(data) {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Increase brightness
    const brightness = 1.2;
    r *= brightness;
    g *= brightness;
    b *= brightness;

    // Increase saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const saturation = 1.4;
    r = gray + (r - gray) * saturation;
    g = gray + (g - gray) * saturation;
    b = gray + (b - gray) * saturation;

    // Reduce contrast
    const contrast = 0.9;
    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;

    // Warm hue shift (simplified rotation)
    const hueShift = 20 / 360; // 20 degrees
    const newR = r * (1 + hueShift * 0.5);
    const newG = g * (1 + hueShift * 0.3);
    const newB = b * (1 - hueShift * 0.2);

    // Note: Blur effect can't be replicated in pixel manipulation
    // You'd need to implement a convolution filter for true blur

    data[i] = Math.max(0, Math.min(255, newR));
    data[i + 1] = Math.max(0, Math.min(255, newG));
    data[i + 2] = Math.max(0, Math.min(255, newB));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  imagecontainer.innerHTML = "";
  photos = [];

  const savedFilter = localStorage.getItem("currentFilter");

  if (savedFilter) {
    currentFilter = savedFilter;

    videoElement.addEventListener("loadeddata", function runFilter() {
      applyFilter(savedFilter);
      videoElement.removeEventListener("loadeddata", runFilter);
    });

    if (videoElement.readyState >= 2) {
      applyFilter(savedFilter);
    }
  }
});

// =======================
// LAYOUT SETTINGS
// =======================
const selectedLayout = localStorage.getItem("selectedLayout");
const layoutCount = { layout2: 2, layout3: 3, layout4: 4 };
const neededPhotos = layoutCount[selectedLayout] || 1;
let isTakingPhotos = false;

// =======================
// CAPTURE LOGIC
// =======================
capture.addEventListener("click", startPhotoSequence);

function startPhotoSequence() {
  if (isTakingPhotos) return;
  isTakingPhotos = true;
  capture.disabled = true;
  capture.style.display = "none";
  takePhoto();
}

function takePhoto() {
  const ctx2 = captureCanvas.getContext("2d");
  let counter = 3;

  countdown.classList.remove("hidden");
  countdown.textContent = counter;

  const interval = setInterval(() => {
    counter--;
    if (counter > 0) {
      countdown.textContent = counter;
    } else {
      clearInterval(interval);
      countdown.textContent = "Smile!";

      setTimeout(() => {
        countdown.classList.add("hidden");

        captureCanvas.width = 960;
        captureCanvas.height = 720;

        const source = filterActive ? canvas : videoElement;

        ctx2.save();
        ctx2.drawImage(source, 0, 0, captureCanvas.width, captureCanvas.height);
        ctx2.restore();

        const imageData = captureCanvas.toDataURL("image/jpeg", 0.7);
        photos.push(imageData);

        const img = new Image();
        img.src = imageData;

        imagecontainer.append(img);

        if (photos.length < neededPhotos) {
          setTimeout(takePhoto, 1000);
        } else {
          generateFinalLayout();
          retakeButton.style.display = "block";
          confirmButton.style.display = "block";
          skipbtn.style.display = "block";
          capture.style.display = "none";
        }
      }, 300);
    }
  }, 1000);
}

// =======================
// FINAL LAYOUT
// =======================
async function generateFinalLayout() {
  console.log("Memulai proses penggabungan foto...");
  const finalCanvas = document.createElement("canvas");
  const ctx3 = finalCanvas.getContext("2d");

  return new Promise((resolve, reject) => {
    const layoutImg = new Image();
    layoutImg.src = `/assets/${selectedLayout}.png`;

    layoutImg.onload = async () => {
      try {
        if (selectedLayout === "layout2") {
          finalCanvas.width = 1280;
          finalCanvas.height = 2880;
        } else if (selectedLayout === "layout3") {
          finalCanvas.width = 1280;
          finalCanvas.height = 2880;
        } else if (selectedLayout === "layout4") {
          // layout4 dihandle di placePhotos, biarkan dulu
          finalCanvas.width = layoutImg.width;
          finalCanvas.height = layoutImg.height;
        } else {
          finalCanvas.width = layoutImg.width;
          finalCanvas.height = layoutImg.height;
        }

        const loadedPhotos = await Promise.all(photos.map((p) => makeImg(p)));
        placePhotos(ctx3, selectedLayout, loadedPhotos);
        ctx3.drawImage(layoutImg, 0, 0);

        finalImageData = finalCanvas.toDataURL("image/jpeg", 0.7); // kompres 70%
        localStorage.setItem("finalPhoto", finalImageData);

        confirmButton.disabled = false;
        console.log("Proses selesai! Kamu bisa download sekarang.");
        resolve();
      } catch (error) {
        console.error("Gagal menggambar layout:", error);
        reject(error);
      }
    };

    layoutImg.onerror = () => {
      console.error("File tidak ditemukan di: " + layoutImg.src);
      alert("Error: File layout tidak ditemukan. Cek folder assets!");
      reject(new Error("Layout image not found"));
    };
  });
}

function downloadFinalImage() {
  console.log("Status finalImageData:", finalImageData ? "Tersedia" : "Kosong");

  if (!finalImageData) {
    // Jika kosong, coba paksa generate ulang
    if (photos.length >= neededPhotos) {
      alert("Sedang memproses ulang, mohon tunggu sebentar...");
      generateFinalLayout();
    } else {
      alert("Foto belum lengkap!");
    }
    return;
  }

  const link = document.createElement("a");
  link.href = finalImageData;
  link.download = "photobooth.png";
  document.body.appendChild(link); // Penting untuk beberapa browser
  link.click();
  document.body.removeChild(link);
}

// =======================
// PLACE PHOTOS
// =======================

function placePhotos(ctx, layout, loadedPhotos) {
  if (layout === "layout2") {
    const H = 1200;

    const img1 = loadedPhotos[0];
    const W1 = H * (img1.width / img1.height);
    const x1 = (ctx.canvas.width - W1) / 2;
    ctx.drawImage(img1, x1, 100, W1, H);

    const img2 = loadedPhotos[1];
    const W2 = H * (img2.width / img2.height);
    const x2 = (ctx.canvas.width - W2) / 2;
    ctx.drawImage(img2, x2, 1300, W2, H);
  }

  if (layout === "layout3") {

    const slots = [
      { x: 78, y: 77, w: 1137, h: 689 },
      { x: 78, y: 838, w: 1137, h: 689 },
      { x: 78, y: 1600, w: 1137, h: 689 },
    ];

    slots.forEach((slot, i) => {
      const img = loadedPhotos[i];

      // Hitung scale agar foto cover slot (tidak gepeng)
      const scale = Math.max(slot.w / img.width, slot.h / img.height);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;

      // Crop dari tengah
      const offsetX = (scaledW - slot.w) / 2;
      const offsetY = (scaledH - slot.h) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(slot.x, slot.y, slot.w, slot.h); // clip area slot
      ctx.clip();
      ctx.drawImage(img, slot.x - offsetX, slot.y - offsetY, scaledW, scaledH);
      ctx.restore();
    });
  }

  if (layout === "layout4") {
    const paddingX = 50;
    const gap = 40;
    const startY = 40;
    const H = 670;

    const img1 = loadedPhotos[0]; 
    const photoW = H * (img1.width / img1.height);

    // Resize canvas sesuai konten
    ctx.canvas.width = paddingX * 2 + photoW;
    ctx.canvas.height = startY * 2 + H * 4 + gap * 3;

    // Gambar foto dulu
    ctx.drawImage(loadedPhotos[0], paddingX, startY, photoW, H);
    ctx.drawImage(loadedPhotos[1], paddingX, startY + (H + gap), photoW, H);
    ctx.drawImage(loadedPhotos[2], paddingX, startY + (H + gap) * 2, photoW, H);
    ctx.drawImage(loadedPhotos[3], paddingX, startY + (H + gap) * 3, photoW, H);

    // Gambar layout PNG di atasnya (akan di-scale otomatis)
    // ctx.drawImage(layoutImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

function makeImg(data) {
  // dataURL to Image object
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = data;
  });
}

retakeButton.addEventListener("click", () => {
  photos = [];
  imagecontainer.innerHTML = "";
  retakeButton.style.display = "none";
  confirmButton.style.display = "none";
  skipbtn.style.display = "none";
  capture.style.display = "block";
  isTakingPhotos = false;
  capture.disabled = false;
});

confirmButton.addEventListener("click", () => {
  downloadFinalImage();
});

document.getElementById("skipBtn").addEventListener("click", async () => {
  if (photos.length > 0) {
    try {
      await generateFinalLayout();
    } catch (e) {
      // Layout gagal, simpan foto pertama sebagai fallback
      console.warn("Layout gagal, pakai foto pertama:", e);
      localStorage.setItem("finalPhoto", photos[0]);
    }
  }
  window.location.href = "index4.html";
});