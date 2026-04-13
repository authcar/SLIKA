document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const frameOptions = document.querySelectorAll(".frame-option");
  const saveButton = document.querySelector(
    'img[src="./src/assets/button save.png"]',
  );
  const restartButton = document.querySelector(
    'img[src="./src/assets/restart button.png"]',
  );

  let selectedFrameSrc = null;
  let basePhotoImg = null;

  // Ambil foto dari localStorage
  const finalImage = localStorage.getItem("finalPhoto");
  if (!finalImage) {
    console.error("finalPhoto not found in localStorage");
    alert("Foto tidak ditemukan! Silakan ambil foto terlebih dahulu.");
    return;
  }

  // Load foto base dulu untuk dapetin ukuran aslinya
  basePhotoImg = new Image();
  basePhotoImg.onload = () => {
    // Set canvas size sesuai foto asli (biar ga gepeng)
    canvas.width = basePhotoImg.width;
    canvas.height = basePhotoImg.height;

    // Draw foto pertama kali (tanpa frame)
    drawPhotoToCanvas();
  };
  basePhotoImg.src = finalImage;

  // Disable tombol save dulu
  disableSaveButton();

  // ============================
  // CLICK FRAME → REAL-TIME PREVIEW
  // ============================
  frameOptions.forEach((frameOption) => {
    frameOption.addEventListener("click", () => {
      // Remove selected dari semua
      frameOptions.forEach((f) => f.classList.remove("selected"));

      // Add selected ke yang diklik
      frameOption.classList.add("selected");

      // Simpan frame yang dipilih
      selectedFrameSrc = frameOption.src;

      // LANGSUNG RENDER FOTO + FRAME
      drawPhotoWithFrame();

      // Enable tombol save
      enableSaveButton();
    });
  });

  // ============================
  // FUNCTION: Draw Foto Aja
  // ============================
  function drawPhotoToCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // simpan state canvas
    ctx.translate(canvas.width, 0); // geser titik awal ke kanan
    ctx.scale(-1, 1); // flip horizontal (mirror)
    ctx.drawImage(basePhotoImg, 0, 0, canvas.width, canvas.height); // balikin state biar ga pengaruh gambar lain
    ctx.restore();
  }

  // ============================
  // FUNCTION: Draw Foto + Frame
  // ============================
  function drawPhotoWithFrame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw foto dulu
    ctx.drawImage(basePhotoImg, 0, 0, canvas.width, canvas.height);

    // 2. Draw frame di atasnya (overlay)
    if (selectedFrameSrc) {
      const frameImg = new Image();
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      };
      frameImg.src = selectedFrameSrc;
    }
  }

  // ============================
  // SAVE BUTTON
  // ============================
  function enableSaveButton() {
    saveButton.style.opacity = "1";
    saveButton.style.cursor = "pointer";
    saveButton.style.pointerEvents = "auto";
  }

  function disableSaveButton() {
    saveButton.style.opacity = "0.5";
    saveButton.style.cursor = "not-allowed";
    saveButton.style.pointerEvents = "none";
  }

  saveButton.addEventListener("click", () => {
    if (!selectedFrameSrc) {
      alert("Pilih frame dulu yaa! 🖼️");
      return;
    }

    // Download hasil akhir dari canvas
    const finalResult = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = finalResult;
    link.download = `slika-photobooth-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ Foto berhasil didownload!");
  });

  // ============================
  // RESTART BUTTON
  // ============================
  restartButton.addEventListener("click", () => {
    if (confirm("Mau ulang dari awal? Foto akan hilang lho! 😱")) {
      localStorage.removeItem("finalPhoto");
      localStorage.removeItem("selectedLayout");
      localStorage.removeItem("currentFilter");
      window.location.href = "index.html";
    }
  });
});
