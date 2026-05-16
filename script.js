document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const letters = document.querySelectorAll(".letter");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("img-full");
    const closeModal = document.querySelector(".close-modal");
    const btnSelesai = document.getElementById("btn-selesai");
    const audio = document.getElementById("myAudio");

    // Simpan teks asli surat agar tidak hilang saat efek mengetik berjalan ulang
    const originalTexts = Array.from(letters).map(l => {
        const p = l.querySelector("p");
        return p ? p.innerText : "";
    });

    // --- 1. FUNGSI EFEK MENGETIK ---
    function typeWriter(element, text, speed = 50) {
        element.innerHTML = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // --- 2. FUNGSI HUJAN BUNGA ---
    function createPetal() {
        const rainContainer = document.getElementById("flower-rain");
        if (!rainContainer) return;
        const petals = ['🌸', '🌷', '🌹', '✨', '🤍'];
        const petal = document.createElement("div");
        petal.classList.add("petal");
        petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = Math.random() * 100 + "vw";
        petal.style.animationDuration = Math.random() * 3 + 2 + "s";
        petal.style.opacity = Math.random();
        rainContainer.appendChild(petal);
        setTimeout(() => { petal.remove(); }, 5000);
    }
    setInterval(createPetal, 300);

    // --- 3. NAVIGASI SURAT & EFEK MENGETIK ---
    function showLetter(index) {
        letters.forEach(l => { 
            l.classList.add("hidden"); 
            l.classList.remove("show"); 
        });

        if (letters[index]) {
            letters[index].classList.remove("hidden");
            setTimeout(() => {
                letters[index].classList.add("show");
                
                const textEl = letters[index].querySelector("p");
                if (textEl && index !== 1) { // Kecualikan surat countdown (index 1)
                    typeWriter(textEl, originalTexts[index]);
                }
            }, 400);
        }
    }

    // Buka Amplop
    envelope.addEventListener("click", () => {
        if (audio) audio.play().catch(e => console.log(e));
        envelope.classList.add("open");
        
        const decor = document.getElementById("flower-decor");
        if (decor) {
            decor.classList.remove("hidden");
            setTimeout(() => decor.classList.add("show-decor"), 400);
        }

        setTimeout(() => {
            envelope.style.display = "none";
            showLetter(0);
        }, 600);
    });

    // Navigasi Tombol
    document.querySelectorAll(".btn-next").forEach((btn, i) => {
        btn.onclick = () => showLetter(i + 1);
    });
    document.querySelectorAll(".btn-back").forEach((btn, i) => {
        btn.onclick = () => showLetter(i);
    });

    // --- 4. LOGIKA TOMBOL GESER PANAH & POP-UP ZOOM GAMBAR ---
    const sliderImgs = document.querySelectorAll(".slider-img");
    const btnPrevPhoto = document.getElementById("prev-photo");
    const btnNextPhoto = document.getElementById("next-photo");
    let currentPhotoIndex = 0;

    // A. Fungsi Ganti Foto ke Kanan (Maju)
    function nextPhoto() {
        if (sliderImgs.length === 0) return;
        sliderImgs[currentPhotoIndex].classList.remove("show");
        sliderImgs[currentPhotoIndex].classList.add("hidden");

        currentPhotoIndex = (currentPhotoIndex + 1) % sliderImgs.length;

        sliderImgs[currentPhotoIndex].classList.remove("hidden");
        sliderImgs[currentPhotoIndex].classList.add("show");
    }

    // B. Fungsi Ganti Foto ke Kiri (Mundur)
    function prevPhoto() {
        if (sliderImgs.length === 0) return;
        sliderImgs[currentPhotoIndex].classList.remove("show");
        sliderImgs[currentPhotoIndex].classList.add("hidden");

        currentPhotoIndex = (currentPhotoIndex - 1 + sliderImgs.length) % sliderImgs.length;

        sliderImgs[currentPhotoIndex].classList.remove("hidden");
        sliderImgs[currentPhotoIndex].classList.add("show");
    }

    // C. Daftarkan Event Klik Tombol Panah
    if (btnNextPhoto) {
        btnNextPhoto.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah bentrok agar tidak membuka zoom saat klik panah
            nextPhoto();
        });
    }
    if (btnPrevPhoto) {
        btnPrevPhoto.addEventListener("click", (e) => {
            e.stopPropagation();
            prevPhoto();
        });
    }

    // D. Klik Tepat Pada Area Gambar yang Aktif Untuk Zoom Layar Penuh
    sliderImgs.forEach((img) => {
        img.addEventListener("click", (e) => {
            if (e.target.classList.contains('show')) {
                modal.style.display = "flex"; 
                modalImg.src = e.target.src;
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Fungsi Menutup Modal Zoom (Tetap dipertahankan)
    closeModal.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };
    modal.onclick = function(e) {
        if (e.target !== modalImg) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // --- 5. COUNTDOWN ---
    function startCountdown() {
        const startDate = new Date("2025-05-25T00:00:00").getTime(); 
        setInterval(() => {
            const now = new Date().getTime();
            const diff = now - startDate;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            const el = document.getElementById("countdown");
            if (el) el.innerHTML = `${days} Hari : ${hours} Jam : ${minutes} Menit : ${seconds} Detik`;
        }, 1000);
    }
    startCountdown();

    // --- 6. TOMBOL SELESAI ---
    if (btnSelesai) {
        btnSelesai.onclick = () => {
            if(confirm("Apakah kamu yakin ingin menutup surat ini?")) {
                document.body.innerHTML = `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background:#F9F8FB; font-family:serif; color:#557A95; text-align:center; padding:20px;">
                        <h2 style="animation: fadeIn 2s forwards;">I'll always love you, Gariza... 🌸</h2>
                        <p style="animation: fadeIn 3s forwards;">Sampai jumpa di hari esok yang lebih indah.</p>
                    </div>`;
            }
        };    
    }
});
