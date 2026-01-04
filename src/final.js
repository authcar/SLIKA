document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const finalImage = localStorage.getItem("finalPhoto");

  if (!finalImage) {
    console.error("finalPhoto not found in localStorage");
    return;
  }

  const img = new Image();
  img.onload = () => {
    // Optional: clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw full canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  img.src = finalImage;
});
