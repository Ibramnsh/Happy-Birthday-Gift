// --- 1. Three.js Background Logic (Original Code) ---
let scene, camera, renderer, stars, starGeo;
let mouseX = 0,
  mouseY = 0;

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  starGeo = new THREE.BufferGeometry();
  const starCoords = [];
  for (let i = 0; i < 3000; i++) {
    starCoords.push(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
  }
  starGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starCoords, 3)
  );

  let starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.6,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  animateThree();
}

function animateThree() {
  stars.rotation.y += 0.0005;

  const targetX = mouseX * 0.02;
  const targetY = mouseY * 0.02;
  stars.position.x += (targetX - stars.position.x) * 0.1;
  stars.position.y += (targetY - stars.position.y) * 0.1;

  renderer.render(scene, camera);
  requestAnimationFrame(animateThree);
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 2. Translation & Interaction Logic ---
const translations = {
  en: {
    title: "A Cosmic Surprise For You",
    subtitle: "Floating in the digital space for a special friend",
    card1_title: "Hey, how are you today?",
    card1_btn: "Open",
    card2_title: "Don't forget to take a break!",
    card2_btn: "Got it",
    card3_title: "You're doing great, seriously.",
    card3_btn: "Read",
    card4_title: "Sending you good vibes ",
    card4_btn: "Click",
    surprise_btn: "Click for a Cosmic Surprise!",
    bday_title: "🎉 Happy 19th Birthday! 🎂",
    bday_msg:
      "Wishing you the most amazing 19th birthday! May this year bring you endless joy and adventures.",
    thank_you_btn: "Thank You!",
    close_btn: "Close",
    footer_text: "Thanks for being such a great friend 🌟",
    messages: [
      "Just wanted to remind you that you're appreciated. Keep going! 💪",
      "Take a moment to breathe and relax. You deserve it! 🌿",
      "You're doing an amazing job. Be proud of yourself! 🦁",
      "Sending you positive energy and happy thoughts! ✨",
    ],
  },
  zh: {
    title: "给你的星空惊喜",
    subtitle: "在数字太空中为你闪烁",
    card1_title: "你今天过得怎么样？",
    card1_btn: "打开",
    card2_title: "别忘了休息一下哦！",
    card2_btn: "知道啦",
    card3_title: "你真的做得很好。",
    card3_btn: "看看",
    card4_title: "送你一点好心情 ",
    card4_btn: "点击",
    surprise_btn: "点击查看特别惊喜！",
    bday_title: "🎉 19岁生日快乐！🎂",
    bday_msg: "祝你19岁生日快乐！愿这一年带给你无尽的欢乐和美好的冒险。",
    thank_you_btn: "谢谢你！",
    close_btn: "关闭",
    footer_text: "谢谢你成为这么好的朋友 🌟",
    messages: [
      "只是想提醒你，你很被珍惜。继续加油！💪",
      "花点时间深呼吸，放松一下。这是你应得的！🌿",
      "你做得很棒。要为自己感到骄傲！🦁",
      "送你满满的正能量和开心的念头！✨",
    ],
  },
};

let currentLang = "en";
const icons = ["✨", "☕", "🌙", "🚀"];

// Language Switch
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentLang = btn.dataset.lang;
    updateText();
  });
});

function updateText() {
  document.querySelectorAll(".translatable").forEach((el) => {
    el.classList.add("fade-out");
    setTimeout(() => {
      el.textContent = translations[currentLang][el.dataset.key];
      el.classList.remove("fade-out");
    }, 200);
  });
}

// --- 3. Modal & Confetti Logic (Fixed) ---

const messageModal = document.getElementById("messageModal");
const birthdayModal = document.getElementById("birthdayModal");
let confettiAnimationId = null; // ID untuk menyimpan animasi agar bisa di-stop

// Buka Modal Pesan Biasa
document.querySelectorAll(".card-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = btn.dataset.index;
    document.getElementById("msgText").textContent =
      translations[currentLang].messages[idx];
    document.getElementById("msgIcon").textContent = icons[idx];
    messageModal.classList.add("show");
  });
});

// Buka Modal Surprise (Birthday) + Confetti
document.getElementById("surpriseBtn").addEventListener("click", () => {
  birthdayModal.classList.add("show");
  fireConfetti();
});

// Tutup Modal & Stop Confetti
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    messageModal.classList.remove("show");
    birthdayModal.classList.remove("show");
    stopConfetti(); // Bersihkan layar saat ditutup
  });
});

// Logic Confetti yang Lebih Stabil
function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 150;

  // Inisialisasi Partikel
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height, // Mulai dari atas
      s: Math.random() * 5 + 2,
      c: `hsl(${Math.random() * 360}, 70%, 70%)`,
      speed: Math.random() * 3 + 2,
    });
  }

  function draw() {
    // Bersihkan canvas setiap frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particles.forEach((p) => {
      p.y += p.speed;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);

      // Cek apakah partikel masih di layar
      if (p.y < canvas.height) {
        activeParticles++;
      } else {
        // Opsional: Reset partikel ke atas untuk loop terus menerus
        // p.y = -10;
        // Kalau mau loop, uncomment baris di atas dan hapus 'activeParticles' check di bawah
      }
    });

    // Lanjutkan animasi hanya jika masih ada partikel di layar
    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(draw);
    } else {
      // Jika semua partikel sudah jatuh, bersihkan total
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Jika ada animasi sebelumnya berjalan, stop dulu
  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  draw();
}

// Fungsi Stop Confetti
function stopConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }

  // Paksa hapus semua gambar di canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Initialize
initThree();
