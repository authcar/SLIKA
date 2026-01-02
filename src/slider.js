const wrapper = document.querySelector(".slider-wrapper");
const thumb = document.querySelector(".slider-thumb");
const content = document.querySelector(".sticker-list");

// Scroll biasa dengan mouse wheel
content.addEventListener("scroll", () => {
  const maxScroll = content.scrollHeight - content.clientHeight;
  const scrollPercent = content.scrollTop / maxScroll;

  // Update posisi thumb
  const maxTop = wrapper.offsetHeight - thumb.offsetHeight;
  thumb.style.top = scrollPercent * maxTop + "px";
});

// Optional: Biar thumb juga bisa di-klik drag (hybrid mode)
let isDragging = false;
let startY = 0;
let startTop = 0;

thumb.addEventListener("mousedown", (e) => {
  isDragging = true;
  startY = e.clientY;
  startTop = parseInt(window.getComputedStyle(thumb).top);
  thumb.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  let dy = e.clientY - startY;
  let newTop = startTop + dy;

  if (newTop < 0) newTop = 0;
  const maxTop = wrapper.offsetHeight - thumb.offsetHeight;
  if (newTop > maxTop) newTop = maxTop;

  thumb.style.top = newTop + "px";

  // Scroll content berdasarkan posisi thumb
  const scrollPercent = newTop / maxTop;
  const maxScroll = content.scrollHeight - content.clientHeight;
  content.scrollTop = scrollPercent * maxScroll;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  thumb.style.cursor = "grab";
});

function scrollStickers(percent) {
  const content = document.querySelector(".sticker-list");

  // scrollHeight - clientHeight = total jarak scroll
  const maxScroll = content.scrollHeight - content.clientHeight;

  content.scrollTop = percent * maxScroll;
}

let stickers = [];

class Sticker {
  constructor(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.isDragging = false;
  }
}
document.querySelectorAll(".stikel").forEach((stickerEl) => {
  stickerEl.addEventListener("click", () => {
    let img = new Image();
    img.src = stickerEl.src;

    img.onload = () => {
      stickers.push(new Sticker(img, 100, 100, 200, 200));
      drawFinalCanvas();
    };
  });
});
