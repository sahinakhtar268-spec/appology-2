/* ==========================================================================
   Interactive Apology Website - JavaScript Logic & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FLOATING HEARTS CANVAS BACKGROUND ---
    const heartsCanvas = document.getElementById('heartsCanvas');
    const hCtx = heartsCanvas.getContext('2d');
    
    let canvasWidth = (heartsCanvas.width = window.innerWidth);
    let canvasHeight = (heartsCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        canvasWidth = (heartsCanvas.width = window.innerWidth);
        canvasHeight = (heartsCanvas.height = window.innerHeight);
    });

    class Heart {
        constructor() {
            this.reset();
            // Start at random heights initially so they are distributed
            this.y = Math.random() * canvasHeight;
        }

        reset() {
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + Math.random() * 50 + 10;
            this.size = Math.random() * 12 + 6;
            this.speed = Math.random() * 1.2 + 0.6;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.02 - 0.01;
            this.swingWidth = Math.random() * 1.5 + 0.5;
            this.swingSpeed = Math.random() * 0.01 + 0.005;
            this.swingOffset = Math.random() * 100;
        }

        update() {
            this.y -= this.speed;
            this.angle += this.spinSpeed;
            // Drifting left and right (sine wave)
            this.x += Math.sin(this.y * this.swingSpeed + this.swingOffset) * this.swingWidth;

            // Fade out as they get close to the top
            if (this.y < 150) {
                this.opacity -= 0.005;
            }

            if (this.y < 0 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            hCtx.save();
            hCtx.globalAlpha = Math.max(0, this.opacity);
            hCtx.translate(this.x, this.y);
            hCtx.rotate(this.angle);
            
            // Drawing heart shape
            hCtx.beginPath();
            hCtx.moveTo(0, 0);
            hCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            hCtx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            hCtx.closePath();
            
            // Soft blush color gradients
            hCtx.fillStyle = 'rgba(255, 133, 162, 0.7)';
            hCtx.fill();
            hCtx.restore();
        }
    }

    const heartsArray = [];
    const maxHearts = Math.min(60, Math.floor(canvasWidth / 25)); // Cap density on small screens
    for (let i = 0; i < maxHearts; i++) {
        heartsArray.push(new Heart());
    }

    function animateHearts() {
        hCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        heartsArray.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animateHearts);
    }
    animateHearts();


    // --- 2. ENVELOPE OPEN / CLOSE INTERACTION ---
    const envelope = document.getElementById('envelope');
    const envelopeTip = document.getElementById('envelopeTip');
    
    envelope.addEventListener('click', (e) => {
        // Prevent clicking inside the text box from toggling the envelope closure
        if (e.target.closest('.letter') && envelope.classList.contains('open')) {
            return;
        }
        
        envelope.classList.toggle('open');
        
        if (envelope.classList.contains('open')) {
            envelopeTip.innerHTML = '<i class="fas fa-envelope"></i> Click the cover to close the letter';
        } else {
            envelopeTip.innerHTML = '<i class="fas fa-envelope-open-text"></i> Click the envelope to open my letter';
        }
    });


    // --- 3. REASONS FLIP CARDS TOUCH/CLICK TOGGLE ---
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });


    // --- 4. SCROLL REVEAL OBSERVER (Smooth Fade-ins) ---
    const revealElements = document.querySelectorAll('.timeline-item, .polaroid-card, .commitment-item');
    
    // Add opacity styling initial states via Javascript to avoid styles breaking if JS is disabled
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = el.classList.contains('timeline-item') 
            ? (el.classList.contains('left') ? 'translateX(-30px)' : 'translateX(30px)')
            : 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.style.opacity = '1';
                target.style.transform = 'translate(0, 0)';
                observer.unobserve(target); // Only trigger once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 5. CUSTOM MUSIC PLAYER WIDGET (HTML5 Audio Player) ---
    const musicPlayer = document.getElementById('musicPlayer');
    const togglePlayer = document.getElementById('togglePlayer');
    const vinylRecord = document.getElementById('vinylRecord');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const audioPlayer = document.getElementById('audioPlayer');
    
    // Toggle expand/collapse of music player
    togglePlayer.addEventListener('click', (e) => {
        e.stopPropagation();
        musicPlayer.classList.toggle('collapsed');
    });

    // Clicking the vinyl record when collapsed will expand the player
    vinylRecord.addEventListener('click', (e) => {
        if (musicPlayer.classList.contains('collapsed')) {
            e.stopPropagation();
            musicPlayer.classList.remove('collapsed');
        }
    });

    // Play/Pause toggle
    playBtn.addEventListener('click', () => {
        if (!audioPlayer) return;
        
        if (audioPlayer.paused) {
            audioPlayer.play().catch(err => console.log("Error playing audio: ", err));
        } else {
            audioPlayer.pause();
        }
    });

    // HTML5 Audio Event Listeners to keep UI in sync
    audioPlayer.addEventListener('play', () => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        vinylRecord.classList.add('playing');
    });

    audioPlayer.addEventListener('pause', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        vinylRecord.classList.remove('playing');
    });

    audioPlayer.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        vinylRecord.classList.remove('playing');
        progressBar.style.width = '0%';
    });

    // Update progress bar as audio plays
    audioPlayer.addEventListener('timeupdate', () => {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        if (duration > 0) {
            const percentage = (currentTime / duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    });

    // Seek when clicking on the progress bar
    progressContainer.addEventListener('click', (e) => {
        if (!audioPlayer) return;
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        if (duration > 0) {
            const seekTime = (clickX / width) * duration;
            audioPlayer.currentTime = seekTime;
        }
    });

    // Skip forward 15 seconds
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (audioPlayer) {
            audioPlayer.currentTime = Math.min(audioPlayer.duration || 0, audioPlayer.currentTime + 15);
        }
    });
    
    // Skip backward 15 seconds
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (audioPlayer) {
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 15);
        }
    });


    // --- 6. ACCEPTANCE MODAL & HEART CONFETTI SHOWER ---
    const acceptBtn = document.getElementById('acceptBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cCtx = confettiCanvas.getContext('2d');
    
    let cWidth = (confettiCanvas.width = window.innerWidth);
    let cHeight = (confettiCanvas.height = window.innerHeight);
    let confettiActive = false;
    const confettiPieces = [];

    window.addEventListener('resize', () => {
        cWidth = (confettiCanvas.width = window.innerWidth);
        cHeight = (confettiCanvas.height = window.innerHeight);
    });

    class ConfettiHeart {
        constructor() {
            this.x = Math.random() * cWidth;
            // Burst from top or scattered
            this.y = Math.random() * -cHeight - 20;
            this.size = Math.random() * 15 + 8;
            this.speedY = Math.random() * 4 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.04 - 0.02;
            
            // Random cute heart colors (pinks, reds, white, gold)
            const colors = [
                '#ff85a2', '#ff5c8a', '#ffb7b2', '#ffdac1', 
                '#ffd6e0', '#d4af37', '#ffffff', '#e5b3a3'
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > cHeight + 20) {
                // Recycle to top
                this.y = -30;
                this.x = Math.random() * cWidth;
            }
        }

        draw() {
            cCtx.save();
            cCtx.translate(this.x, this.y);
            cCtx.rotate(this.rotation);
            cCtx.beginPath();
            cCtx.moveTo(0, 0);
            cCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            cCtx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            cCtx.closePath();
            cCtx.fillStyle = this.color;
            cCtx.fill();
            cCtx.restore();
        }
    }

    function initConfetti() {
        confettiPieces.length = 0;
        const pieceCount = Math.min(120, Math.floor(cWidth / 8));
        for (let i = 0; i < pieceCount; i++) {
            confettiPieces.push(new ConfettiHeart());
        }
    }

    function animateConfetti() {
        if (!confettiActive) return;
        cCtx.clearRect(0, 0, cWidth, cHeight);
        
        confettiPieces.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateConfetti);
    }

    acceptBtn.addEventListener('click', () => {
        // Trigger heart confetti shower
        confettiCanvas.style.display = 'block';
        confettiActive = true;
        initConfetti();
        animateConfetti();
        
        // Show Acceptance Modal
        modalBackdrop.classList.add('active');
        
        // Optionally play music player when accepting
        if (audioPlayer && audioPlayer.paused) {
            audioPlayer.play().catch(err => console.log("Audio autoplay blocked: ", err));
            musicPlayer.classList.remove('collapsed');
        }
    });

    closeModalBtn.addEventListener('click', () => {
        modalBackdrop.classList.remove('active');
        // Let confetti slowly fade out or turn off
        setTimeout(() => {
            confettiActive = false;
            confettiCanvas.style.display = 'none';
        }, 1500);
    });

    // Close modal by clicking backdrop
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            modalBackdrop.classList.remove('active');
            setTimeout(() => {
                confettiActive = false;
                confettiCanvas.style.display = 'none';
            }, 1500);
        }
    });

});
