import "./style.css";

const buttons = document.querySelectorAll(
  ".button, .pbutton, .funbutton, .layout-btn, #nextBtn"
);
const clickSound = document.getElementById("clickSound");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    // klik animasi kecil
    btn.style.transform = "scale(0.9)";
    setTimeout(() => (btn.style.transform = "scale(1)"), 150);

    // tunggu suara selesai dulu
    clickSound.onended = () => {
      // mulai efek transisi
      document.body.classList.add("fade-out");

      // setelah fade-out selesai, baru pindah halaman
      setTimeout(() => {
        window.location.href = btn.dataset.target;
      }, 500); // durasi fade
    };
  });
});
