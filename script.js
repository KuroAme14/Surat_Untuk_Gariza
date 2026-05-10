document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const letters = document.querySelectorAll(".letter");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("img-full");
    const zoomImg = document.getElementById("zoom-img");
    const closeModal = document.querySelector(".close-modal");
    const btnSelesai = document.getElementById("btn-selesai");

    // --- 1. FUNGSI HUJAN BUNGA ---
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

    // --- 2. NAVIGASI SURAT ---
    function showLetter(index) {
        letters.forEach(l => { 
            l.classList.add("hidden"); 
            l.classList.remove("show"); 
        });
        if (letters[index]) {
            letters[index].classList.remove("hidden");
            setTimeout(() => letters[index].classList.add("show"), 50);
        }
    }

    // Buka Amplop & Munculkan Dekorasi
    envelope.addEventListener("click", () => {
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

    // Tombol Lanjut
    document.querySelectorAll(".btn-next").forEach((btn, i) => {
        btn.onclick = () => showLetter(i + 1);
    });

    // Tombol Kembali
    document.querySelectorAll(".btn-back").forEach((btn, i) => {
        btn.onclick = () => showLetter(i);
    });

    // --- 3. FITUR POP-UP GAMBAR (FIXED BUG) ---
    zoomImg.onclick = function(e) {
        e.stopPropagation(); // Mencegah event bubbling
        modal.style.display = "flex"; 
        modalImg.src = this.src;
        document.body.style.overflow = "hidden"; // Kunci scroll
    };

    // Tutup lewat Tombol X
    closeModal.onclick = function(e) {
        e.stopPropagation();
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    // Tutup lewat Klik Area Hitam (Background)
    modal.onclick = function(event) {
        if (event.target !== modalImg) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // Tutup lewat tombol ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // --- 4. TOMBOL SELESAI ---
    if (btnSelesai) {
        btnSelesai.onclick = () => {
            if(confirm("Apakah kamu yakin ingin menutup surat ini?")) {
                document.body.innerHTML = `
                    <div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:serif; color:#557A95; text-align:center; background:#F9F8FB; padding:20px;">
                        <div>
                            <h2>Sesi telah berakhir 🤍</h2>
                            <p>Silakan buka kembali file untuk membaca ulang.</p>
                        </div>
                    </div>`;
                
                setTimeout(() => { window.close(); }, 3000);
            }
        };
    }
});
