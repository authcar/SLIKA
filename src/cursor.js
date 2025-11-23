import './style.css';

const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  // Update posisi cursor
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  // Buat sparkle trail
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  sparkle.style.left = e.clientX + "px";
  sparkle.style.top = e.clientY + "px";
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 600);
});
