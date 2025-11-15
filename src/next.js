import './style.css';

const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

const videoElement = document.getElementById("webcam-feed");
const canvas = document.getElementById("pinkCanvas");
const ctx = canvas.getContext("2d");

let currentFilter = "none";
let pinkActive = false;
let twilightactive = false;
let purpleactive = false;


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      videoElement.srcObject = stream;
    })
    .catch(function (err) {
      console.error("The following error occurred: " + err);
      const frame = document.getElementById("photobooth-frame");
      frame.innerHTML = "<p>Camera access denied or no camera found.</p>";
    });
} else {
  alert("Sorry, your browser does not support webcam access.");
}

function applyFilter(type) {
  pinkActive = type === "pink";
  twilightactive = type === "twilight";
  purpleactive = type === "2016";

  if (pinkActive || twilightactive || purpleactive) {
    videoElement.style.filter = "none";
    loopcanvasFilter();
  } else {
    pinkActive = false;
    twilightactive = false;
    purpleactive = false;

    switch (type) {
      case "grayscale":
        videoElement.style.display = "block";
        canvas.style.display = "none";
        videoElement.style.filter = "grayscale(1)";
        break;
      case "vintage":
        videoElement.style.display = "block";
        canvas.style.display = "none";
        videoElement.style.filter = "sepia(0.7) contrast(1.1) brightness(1.05)";
        break;
      case "dreamy":
        videoElement.style.display = "block";
        canvas.style.display = "none";
        videoElement.style.filter =
          "brightness(1.2) saturate(1.4) contrast(0.9) hue-rotate(20deg) blur(1.5px)";
        break;
      case "2016":
        videoElement.style.display = "block";
        canvas.style.display = "none";
        videoElement.style.filter =
          "brightness(1.1) contrast(0.9) saturate(1.1) sepia(0.15) hue-rotate(320deg) blur(0.3px)";

        break;
      default:
        videoElement.style.display = "block";
        canvas.style.display = "none";
        videoElement.style.filter = "none";
        break;
    }
  }
}

function loopcanvasFilter() {
  if (!pinkActive && !twilightactive && !purpleactive) return;

  if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    requestAnimationFrame(loopcanvasFilter);
    return;
  }

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (pinkActive) applyPink(frame.data);
  if (twilightactive) applyBlueTwilight(frame.data);
  if (purpleactive) applypurple(frame.data);

  ctx.putImageData(frame, 0, 0);

  canvas.style.display = "block";
  videoElement.style.display = "none";

  requestAnimationFrame(loopcanvasFilter);
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

function applypurple(data) {
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


document.addEventListener("DOMContentLoaded", () => {
    const savedFilter = localStorage.getItem("currentFilter");

    if (savedFilter && videoElement) { // Tambahkan cek videoElement
        currentFilter = savedFilter;
        pinkActive = savedFilter === "pink";
        twilightactive = savedFilter === "twilight";
        purpleactive = savedFilter === "2016";

        // Menerapkan solusi penundaan video yang disarankan sebelumnya di sini!
        videoElement.addEventListener("loadeddata", function runFilter() {
            applyFilter(savedFilter);
            videoElement.removeEventListener("loadeddata", runFilter);
        });

        // Fallback jika loadeddata terlewat atau stream sudah berjalan
        if (videoElement.readyState >= 2) {
             applyFilter(savedFilter);
        }
    }
});

// =================================================================
// Logika Mouse dan Sparkle (Dibiarkan)
// =================================================================

document.addEventListener("mousemove", (e) => {
  // Update posisi cursor
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px"; // Buat sparkle trail

  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  sparkle.style.left = e.clientX + "px";
  sparkle.style.top = e.clientY + "px";
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 600);
});

const savedFilter = localStorage.getItem("currentFilter") || "none";
console.log("Loaded filter:", savedFilter);
applyFilter(savedFilter);
