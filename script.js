document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const letters = document.querySelectorAll(".letter");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("img-full");
    const zoomImg = document.getElementById("zoom-img");
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

    // --- 4. POP-UP GAMBAR ---
    zoomImg.onclick = function(e) {
        e.stopPropagation();
        modal.style.display = "flex"; 
        modalImg.src = this.src;
        document.body.style.overflow = "hidden";
    };
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

    // --- 5. FITUR KLIK GANTI FOTO (SLIDER) ---
    const sliderContainer = document.getElementById("photo-slider");
    const sliderImgs = document.querySelectorAll(".slider-img");
    let currentPhotoIndex = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah bentrok dengan zoom

            // Sembunyikan foto sekarang
            sliderImgs[currentPhotoIndex].classList.remove("show");
            sliderImgs[currentPhotoIndex].classList.add("hidden");

            // Ganti ke index berikutnya
            currentPhotoIndex = (currentPhotoIndex + 1) % sliderImgs.length;

            // Tampilkan foto berikutnya
            sliderImgs[currentPhotoIndex].classList.remove("hidden");
            sliderImgs[currentPhotoIndex].classList.add("show");
            
            // Update gambar zoom agar sesuai foto yang tampil
            modalImg.src = sliderImgs[currentPhotoIndex].src;
        });
    }

    // --- 6. COUNTDOWN ---
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

    // --- 7. TOMBOL SELESAI ---
    btnSelesai.onclick = () => {
        if(confirm("Apakah kamu yakin ingin menutup surat ini?")) {
            document.body.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background:#F9F8FB; font-family:serif; color:#557A95; text-align:center; padding:20px;">
                    <h2 style="animation: fadeIn 2s forwards;">I'll always love you, Gariza... 🌸</h2>
                    <p style="animation: fadeIn 3s forwards;">Sampai jumpa di hari esok yang lebih indah.</p>
                </div>`;
        }
    };    
});
