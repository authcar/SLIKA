document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const FRAME_DESIGNS_BY_LAYOUT = {
    layout2: [
      { label: "Denim", src: "./src/assets/frames/2/frame-denim.png" },
      { label: "Grass", src: "./src/assets/frames/2/frame-grass.png" },
      { label: "Cloud", src: "./src/assets/frames/2/frame-cloud.png" },
    ],
    layout3: [
      { label: "Gradient", src: "./src/assets/frames/frame-gradient.png" },
      { label: "Grass", src: "./src/assets/frames/frame-grass.png" },
      { label: "BP", src: "./src/assets/frames/frame-bp.png" },
      { label: "Star", src: "./src/assets/frames/frame-star.png" },
    ],
    layout4: [
      { label: "Grass", src: "./src/assets/frames/frame-grass.png" },
    ],
  };

  const selectedLayout = localStorage.getItem("selectedLayout") || "layout2";
  const FRAME_DESIGNS = FRAME_DESIGNS_BY_LAYOUT[selectedLayout] ?? FRAME_DESIGNS_BY_LAYOUT["layout2"];

  const saveButton = document.getElementById("saveBtn");
  const restartButton = document.getElementById("restartBtn");

  let selectedFrameSrc = null;
  let basePhotoImg = null;

  // Ambil foto dari localStorage
  const finalImage = localStorage.getItem("finalPhoto");

  if (!finalImage) {
    alert("Foto tidak ditemukan! Kembali ke halaman kamera.");
    window.location.href = "index3.html";
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
    buildFramePicker();
  };
  basePhotoImg.src = finalImage;

  // Disable tombol save dulu
  disableSaveButton();

  function buildFramePicker() {
    // Cari container yang sudah ada di HTML, atau buat baru
    let pickerContainer = document.getElementById("frame-picker");

    if (!pickerContainer) {
      // Buat container otomatis kalau belum ada di HTML
      pickerContainer = document.createElement("div");
      pickerContainer.id = "frame-picker";
      pickerContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 16px 0;
      `;
      // Sisipkan sebelum canvas
      canvas.parentElement.insertBefore(pickerContainer, canvas);
    }

    pickerContainer.innerHTML = ""; // reset kalau dipanggil ulang

    FRAME_DESIGNS.forEach(({ label, src }) => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        gap: 4px;
      `;

      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.alt = label;
      thumb.style.cssText = `
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 8px;
        border: 3px solid transparent;
        transition: border-color 0.2s, transform 0.15s;
      `;

      const lbl = document.createElement("span");
      lbl.textContent = label;
      lbl.style.cssText = `
        font-size: 11px;
        color: #fff;
        font-family: sans-serif;
      `;

      wrapper.appendChild(thumb);
      wrapper.appendChild(lbl);

      wrapper.addEventListener("click", () => {
        // Hapus selected dari semua thumb
        pickerContainer.querySelectorAll("img").forEach((img) => {
          img.style.borderColor = "transparent";
          img.style.transform = "scale(1)";
        });

        // Tandai yang dipilih
        thumb.style.borderColor = "#ff85b3";
        thumb.style.transform = "scale(1.08)";

        selectedFrameSrc = src;
        drawPhotoWithFrame();
        enableSaveButton();
      });

      pickerContainer.appendChild(wrapper);
    });
  }

  // ============================
  // FUNCTION: Draw Foto Aja
  // ============================
  function drawPhotoToCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); // simpan state canvas// geser titik awal ke kanan
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
    const frameImg = new Image();
    frameImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(basePhotoImg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      const finalResult = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = finalResult;
      link.download = `slika-photobooth-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("✅ Foto berhasil didownload!");
    };
    frameImg.src = selectedFrameSrc;
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
