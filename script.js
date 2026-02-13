// =====================================
// Performance & Loading Optimizations
// =====================================

// Hide loading screen when everything is loaded
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 600);
    }
});

// Preload critical resources
document.addEventListener('DOMContentLoaded', () => {
    // Fade in animation on load
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    });

    // Initialize all features
    initIntersectionObserver();
    initSmoothScrolling();
    initLazyLoading();
    initParallaxEffect();
    optimizeAnimations();
    initImageModal();
    initCursorEffects();
    initTwitchStreamState();
    initBgmPlayer();
});

// =====================================
// Background Music Player
// =====================================
function initBgmPlayer() {
    const audio = document.getElementById('bgmAudio');
    const toggle = document.getElementById('bgmToggle');
    const label = toggle ? toggle.querySelector('.bgm-text') : null;

    if (!audio || !toggle || !label) return;

    const savedMuted = localStorage.getItem('bgmMuted');
    const isMuted = savedMuted === null ? false : savedMuted === 'true';

    audio.volume = 0.5;
    audio.muted = isMuted;
    updateBgmUi(isMuted);

    // Try to start playback (may be blocked until user interaction)
    audio.play().catch(() => {
        // Autoplay might be blocked; user interaction will start it
    });

    toggle.addEventListener('click', () => {
        const nextMuted = !audio.muted;
        audio.muted = nextMuted;
        localStorage.setItem('bgmMuted', String(nextMuted));
        updateBgmUi(nextMuted);

        if (!nextMuted) {
            audio.play().catch(() => {
                audio.muted = true;
                localStorage.setItem('bgmMuted', 'true');
                updateBgmUi(true);
            });
        }
    });

    function updateBgmUi(muted) {
        toggle.classList.toggle('is-muted', muted);
        toggle.setAttribute('aria-pressed', String(!muted));
        label.textContent = muted ? 'BGM OFF' : 'BGM ON';
    }
}

// =====================================
// Intersection Observer for Animations
// =====================================
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger animation to children
                const children = entry.target.querySelectorAll('.info-item, .game-tag, .social-link');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(20px) scale(0.8)';
                        requestAnimationFrame(() => {
                            child.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0) scale(1)';
                        });
                    }, index * 80);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.info-card, .games-card, .social-section');
    cards.forEach(card => observer.observe(card));
}

// =====================================
// Smooth Scrolling
// =====================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =====================================
// Lazy Loading Images
// =====================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// =====================================
// Parallax Effect
// =====================================
function initParallaxEffect() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const header = document.querySelector('.header');
                
                if (header) {
                    // Subtle parallax on header
                    header.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// =====================================
// Animation Optimizations
// =====================================
function optimizeAnimations() {
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const bgAnimation = document.querySelector('.bg-animation');
        if (document.hidden) {
            bgAnimation.style.animationPlayState = 'paused';
        } else {
            bgAnimation.style.animationPlayState = 'running';
        }
    });

    // Reduce animations on low-power mode
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateAnimations() {
                const bgAnimation = document.querySelector('.bg-animation');
                if (battery.charging === false && battery.level < 0.2) {
                    // Reduce animations when battery is low
                    bgAnimation.style.display = 'none';
                } else {
                    bgAnimation.style.display = 'block';
                }
            }
            
            battery.addEventListener('chargingchange', updateAnimations);
            battery.addEventListener('levelchange', updateAnimations);
            updateAnimations();
        });
    }
}

// =====================================
// Social Link Analytics (Optional)
// =====================================
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Visual feedback
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        const rect = link.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        link.style.position = 'relative';
        link.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =====================================
// Mouse Trail Effect (Optional)
// =====================================
let mouseTrailEnabled = window.innerWidth > 768; // Only on larger screens

if (mouseTrailEnabled) {
    const colors = ['#f7c7fa', '#5568fc', '#b794f6'];
    let colorIndex = 0;
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) { // Only create trail occasionally
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.width = '8px';
            trail.style.height = '8px';
            trail.style.borderRadius = '50%';
            trail.style.background = colors[colorIndex % colors.length];
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '9999';
            trail.style.opacity = '0.6';
            trail.style.transition = 'all 0.5s ease-out';
            
            document.body.appendChild(trail);
            colorIndex++;
            
            requestAnimationFrame(() => {
                trail.style.opacity = '0';
                trail.style.transform = 'scale(2)';
            });
            
            setTimeout(() => trail.remove(), 500);
        }
    });
}

// =====================================
// Easter Egg: Click on profile image
// =====================================
const profileImg = document.querySelector('.profile-img');
let clickCount = 0;

if (profileImg) {
    profileImg.addEventListener('click', () => {
        clickCount++;
        
        // Add bounce animation
        profileImg.style.animation = 'none';
        setTimeout(() => {
            profileImg.style.animation = 'profilePulse 3s ease-in-out infinite, bounce 0.5s ease';
        }, 10);
        
        // Special effect after 5 clicks
        if (clickCount >= 5) {
            createConfetti();
            clickCount = 0;
        }
    });
}

// Confetti effect
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#f7c7fa', '#5568fc', '#b794f6', '#8b7ef8', '#c9b4fa'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
    }
`;
document.head.appendChild(confettiStyle);

// =====================================
// Console Easter Egg
// =====================================
console.log('%c🐱 ねこにゃんこ ', 'font-size: 30px; font-weight: bold; color: #f7c7fa; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cフォローしてくれてありがとう！💕', 'font-size: 14px; color: #5568fc;');
console.log('%cDeveloped with ♡', 'font-size: 12px; color: #999;');

// =====================================
// Performance Monitoring
// =====================================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// =====================================
// Image Modal
// =====================================
function initImageModal() {
    const triggerImage = document.getElementById('triggerImage');
    const imageModal = document.getElementById('imageModal');
    
    if (!triggerImage || !imageModal) return;
    
    // Open modal on image click
    triggerImage.addEventListener('click', () => {
        imageModal.classList.add('active');
    });
    
    // Close modal on background click
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
        }
    });
}

// =====================================
// Cursor Following Effects
// =====================================
function initCursorEffects() {
    const effectsContainer = document.querySelector('.cursor-effects');
    const specialImgContainer = document.getElementById('specialImgContainer');
    const triggerImage = document.getElementById('triggerImage');
    const particles = ['✨', '💖', '⭐'];
    let mouseX = 0;
    let mouseY = 0;
    const maxImages = 20; // Maximum number of images
    let imageCount = 1;
    const floatingImages = [];
    const margin = 20;
    const containerWidth = 150;
    const containerHeight = 150;
    
    // Image tracking object
    class FloatingImage {
        constructor(container) {
            this.container = container;
            this.x = Math.random() * (window.innerWidth - containerWidth);
            this.y = Math.random() * (window.innerHeight - containerHeight);
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3;
            this.speed = 1.5;
        }
        
        update() {
            this.x += this.vx * this.speed;
            this.y += this.vy * this.speed;
            
            // Get viewport dimensions
            const maxX = window.innerWidth - containerWidth - margin;
            const maxY = window.innerHeight - containerHeight - margin;
            
            // Bounce when hitting edges (using viewport dimensions)
            if (this.x < margin) {
                this.x = margin;
                this.vx = Math.abs(this.vx);
            } else if (this.x > maxX) {
                this.x = maxX;
                this.vx = -Math.abs(this.vx);
            }
            
            if (this.y < margin) {
                this.y = margin;
                this.vy = Math.abs(this.vy);
            } else if (this.y > maxY) {
                this.y = maxY;
                this.vy = -Math.abs(this.vy);
            }
            
            // Use fixed positioning relative to viewport
            this.container.style.left = this.x + 'px';
            this.container.style.top = this.y + 'px';
        }
    }
    
    function createNewImage() {
        if (imageCount >= maxImages) return;
        
        const newContainer = document.createElement('div');
        newContainer.className = 'special-img-container';
        newContainer.style.position = 'fixed';
        newContainer.style.width = '150px';
        newContainer.style.height = '150px';
        newContainer.style.display = 'flex';
        newContainer.style.justifyContent = 'center';
        newContainer.style.alignItems = 'center';
        newContainer.style.zIndex = '999';
        newContainer.style.pointerEvents = 'none';
        
        const newImg = document.createElement('img');
        newImg.src = '55a6cd2043673d56_20260214043220-removebg-preview.png';
        newImg.alt = 'Special';
        newImg.className = 'special-img';
        newImg.style.maxWidth = '150px';
        newImg.style.height = 'auto';
        newImg.style.cursor = 'pointer';
        newImg.style.filter = 'drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2))';
        newImg.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        newImg.style.pointerEvents = 'auto';
        
        // Add hover effects
        newImg.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.filter = 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.3))';
        });
        
        newImg.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2))';
        });
        
        // Click to create more images
        newImg.addEventListener('click', (e) => {
            e.stopPropagation();
            createNewImage();
        });
        
        newContainer.appendChild(newImg);
        document.body.insertBefore(newContainer, document.querySelector('.container'));
        
        const floatingImg = new FloatingImage(newContainer);
        floatingImages.push(floatingImg);
        imageCount++;
    }
    
    // Initialize first image
    if (specialImgContainer && triggerImage) {
        const firstImg = new FloatingImage(specialImgContainer);
        floatingImages.push(firstImg);
        
        triggerImage.style.pointerEvents = 'auto';
        triggerImage.style.cursor = 'pointer';
        triggerImage.addEventListener('click', (e) => {
            e.stopPropagation();
            createNewImage();
        });
    }
    
    // Animation loop
    function animate() {
        floatingImages.forEach(img => img.update());
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Animation will automatically adjust to new viewport
    });
    
    // Particle effects on mouse move
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (Math.random() > 0.7) {
            createParticle(mouseX, mouseY);
        }
    });
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', offsetX + 'px');
        particle.style.setProperty('--ty', offsetY + 'px');
        
        effectsContainer.appendChild(particle);
        particle.classList.add('active');
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// =====================================
// Twitch Stream State Manager
// =====================================
function initTwitchStreamState() {
    const twitchLive = document.getElementById('twitchLive');
    const twitchArchive = document.getElementById('twitchArchive');
    const twitchTitle = document.getElementById('twitchTitle');
    const livePlayer = document.getElementById('livePlayer');
    const archivePlayer = document.getElementById('archivePlayer');
    
    if (!twitchLive || !twitchArchive || !livePlayer || !archivePlayer) return;
    
    // Initialize Twitch players using Twitch.Player API
    function setupPlayers() {
        // Clear previous content
        livePlayer.innerHTML = '';
        archivePlayer.innerHTML = '';
        
        try {
            // Create live stream player
            if (window.Twitch && window.Twitch.Player) {
                new window.Twitch.Player("livePlayer", {
                    channel: "nekonekoax",
                    layout: "video",
                    width: "100%",
                    height: "100%"
                });
                
                // Create archive player with video 2696596501
                new window.Twitch.Player("archivePlayer", {
                    video: "2696596501",
                    layout: "video",
                    width: "100%",
                    height: "100%"
                });
                
                console.log('Twitch players initialized successfully');
            }
        } catch (error) {
            console.error('Error initializing Twitch players:', error);
        }
    }
    
    // Store stream state (default to showing archive)
    let isLive = false;
    
    // Check Twitch stream status
    async function checkStreamStatus() {
        try {
            const cacheKey = 'nekonekoax_stream_status';
            const cacheTime = localStorage.getItem(cacheKey + '_time');
            const now = Date.now();
            
            // Use cache if less than 2 minutes old
            if (cacheTime && (now - parseInt(cacheTime)) < 120000) {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    isLive = cached === 'live';
                    updateDisplay();
                    return;
                }
            }
            
            // Default to showing archive
            isLive = false;
            
            // Save status to localStorage
            localStorage.setItem(cacheKey, isLive ? 'live' : 'archive');
            localStorage.setItem(cacheKey + '_time', now.toString());
            
            updateDisplay();
        } catch (error) {
            console.log('Using default stream display');
            isLive = false;
            updateDisplay();
        }
    }
    
    function updateDisplay() {
        if (isLive) {
            // Show live stream
            twitchLive.style.display = 'block';
            twitchArchive.style.display = 'none';
            twitchTitle.textContent = 'げーむはいしん中！';
            twitchTitle.style.color = '#5568fc';
        } else {
            // Show archives
            twitchLive.style.display = 'none';
            twitchArchive.style.display = 'block';
            twitchTitle.textContent = 'すぎた配信たち';
            twitchTitle.style.color = '#b794f6';
        }
    }
    
    // Setup players and check status immediately
    setupPlayers();
    checkStreamStatus();
    
    // Check status when page comes back into focus
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            checkStreamStatus();
        }
    });
}

