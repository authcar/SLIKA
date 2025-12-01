import "./style.css";

const videoElement = document.getElementById("webcam-feed");
const canvas = document.getElementById("pinkCanvas");
const ctx = canvas.getContext("2d");

const filterButtons = document.querySelectorAll(".filter-btn");
const countdownBox = document.getElementById("countdown-box");

let currentFilter = "none";
let filterActive = false;

// Check if the browser supports media devices (webcams)
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
//button event
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter || "none";
    console.log("Filter chosen:", currentFilter);
    applyFilter(currentFilter);
  });
});

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
    case "grayscale": // ✨ NEW: Now uses canvas instead of CSS filter
      applyGrayscale(frame.data);
      break;
    case "vintage": // ✨ NEW: Now uses canvas instead of CSS filter
      applyVintage(frame.data);
      break;
    case "dreamy": // ✨ NEW: Now uses canvas instead of CSS filter
      applyDreamy(frame.data);
      break;
  }

  ctx.putImageData(frame, 0, 0);
  canvas.style.display = "block";
  videoElement.style.display = "none";

  requestAnimationFrame(loopCanvasFilter);
}

// === Pink Filter Effect ===
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

document.getElementById("nextBtn").addEventListener("click", () => {
  localStorage.setItem("currentFilter", currentFilter);
  console.log("Saved filter:", currentFilter);
  window.location.href = "index3.html";
});
