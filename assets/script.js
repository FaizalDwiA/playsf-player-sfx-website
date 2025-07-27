// =============================
// DAFTAR SFX YANG TERSEDIA
// =============================
const sfxList = [
  { nama: "Akh", file: "akh.mp3" },
  { nama: "Anime Wow", file: "anime-wow-sound-effect_ejcigGk.mp3" },
  { nama: "Bruh", file: "bruh-sound-effect_WstdzdM.mp3" },
  { nama: "Camera", file: "camera_zLdd1zp.mp3" },
  { nama: "Cartoon Slide", file: "cartoon-slide.mp3" },
  { nama: "Slip", file: "cartoonslip.mp3" },
  { nama: "Click", file: "click.mp3" },
  { nama: "Ding", file: "ding.mp3" },
  { nama: "Explosion Meme", file: "explosion-meme_dTCfAHs.mp3" },
  { nama: "GTA San Andreas", file: "gta-sa.mp3" },
  { nama: "Jatuhin Pipa (Jigsaw)", file: "jixaw-metal-pipe-falling-sound.mp3" },
  { nama: "John Cena", file: "john-cena.mp3" },
  { nama: "Keyboard", file: "keyboard-typing-sound-effect.mp3" },
  { nama: "Mario Jump", file: "maro-jump-sound-effect_1.mp3" },
  { nama: "Mancing Mania", file: "memento-mancing-mania_ymrKDvh.mp3" },
  { nama: "Record Scratch", file: "record-scratch-2.mp3" },
  { nama: "Sad Trombone", file: "sadtrombone.swf.mp3" },
  { nama: "Mario Death", file: "super-mario-death-sound-sound-effect.mp3" },
  { nama: "Thunder", file: "thunder-sound-effect.mp3" },
  { nama: "UFO Laser", file: "ufo-laser-blaster-hit-02.mp3" },
  { nama: "Vine Boom", file: "vine-boom.mp3" },
  { nama: "Wilhelm Scream", file: "wilhelmscream.mp3" },
];

// =============================
// ELEMEN DOM
// =============================
const nowPlaying = document.getElementById("nowPlaying");
const audio = document.getElementById("mainAudio");
const progressBar = document.getElementById("progressBar");
const toggleBtn = document.getElementById("toggleBtn");
const stopBtn = document.getElementById("stopBtn");
const loopToggle = document.getElementById("loopToggle");
const volumeControl = document.getElementById("volumeControl");
const sfxGrid = document.getElementById("sfxGrid");
const searchInput = document.getElementById("searchInput");

// =============================
// STATE GLOBAL
// =============================
let currentIndex = -1;
let currentButton = null;

// =============================
// RENDER TOMBOL-TOMBOL SFX
// =============================
function renderButtons(filter = "") {
  sfxGrid.innerHTML = ""; // Kosongkan isi grid

  sfxList.forEach((sfx, index) => {
    // Filter nama jika ada keyword pencarian
    if (sfx.nama.toLowerCase().includes(filter.toLowerCase())) {
      const btn = document.createElement("button");
      btn.className = "sfx-button";
      btn.textContent = sfx.nama;
      btn.dataset.index = index;

      // Event saat tombol diklik
      btn.addEventListener("click", () => loadAndPlay(index));

      // Tandai tombol aktif jika sedang diputar
      if (index === currentIndex) btn.classList.add("active");

      sfxGrid.appendChild(btn);
    }
  });
}

// =============================
// MUAT DAN PUTAR SFX
// =============================
function loadAndPlay(index) {
  const selected = sfxList[index];
  if (!selected) return;

  // Ubah sumber audio dan putar
  audio.src = `sfx/${selected.file}`;
  currentIndex = index;
  nowPlaying.textContent = `🔊 ${selected.nama}`;
  audio.play();

  // Update tombol Play/Pause
  toggleBtn.textContent = "⏸️ Pause";

  // Update status tombol aktif
  document
    .querySelectorAll(".sfx-button")
    .forEach((btn) => btn.classList.remove("active"));
  const clickedBtn = sfxGrid.querySelector(`[data-index="${index}"]`);
  clickedBtn.classList.add("active");
  currentButton = clickedBtn;
}

// =============================
// KONTROL PLAY / PAUSE
// =============================
toggleBtn.addEventListener("click", () => {
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
    toggleBtn.textContent = "⏸️ Pause";
    nowPlaying.textContent = `Sedang diputar: ${sfxList[currentIndex].nama}`;
  } else {
    audio.pause();
    toggleBtn.textContent = "▶️ Play";
  }
});

// =============================
// KONTROL STOP
// =============================
stopBtn.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  toggleBtn.textContent = "▶️ Play";
  nowPlaying.textContent = "Tidak ada suara diputar.";

  if (currentButton) {
    currentButton.classList.remove("active");
    currentButton = null;
  }
});

// =============================
// LOOP TOGGLE
// =============================
loopToggle.addEventListener("click", () => {
  audio.loop = !audio.loop;
  loopToggle.classList.toggle("active", audio.loop);
});

// =============================
// KONTROL VOLUME
// =============================
volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// =============================
// KONTROL PROGRESS BAR
// =============================
audio.addEventListener("timeupdate", () => {
  progressBar.max = audio.duration || 0;
  progressBar.value = audio.currentTime;
});

progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});

// =============================
// GANTI LABEL SAAT AUDIO SELESAI
// =============================
audio.addEventListener("ended", () => {
  toggleBtn.textContent = "▶️ Play";
});

// =============================
// PENCARIAN REAL-TIME
// =============================
searchInput.addEventListener("keyup", (e) => {
  const keyword = e.target.value;
  renderButtons(keyword);
});

// =============================
// SYNC LABEL JIKA AUDIO DIPUTAR / DI-PAUSE DARI LUAR
// =============================
audio.addEventListener("play", () => (toggleBtn.textContent = "⏸️ Pause"));
audio.addEventListener("pause", () => (toggleBtn.textContent = "▶️ Play"));

// =============================
// INISIALISASI AWAL
// =============================
renderButtons();
