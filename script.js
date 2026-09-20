document.addEventListener("DOMContentLoaded", () => {
    // 1. Intersection Observer for fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        fadeElements.forEach(el => observer.observe(el));
    }

    // 2. Subtle parallax for background orbs on fine pointer devices
    const orbs = document.querySelectorAll('.glow-orb');
    if (orbs.length > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            
            orbs.forEach((orb, index) => {
                const speed = index === 0 ? 30 : -40;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // 3. Universal Mobile Hamburger Menu
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    if (hamburger && menu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = menu.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
        });

        // Close mobile menu when clicking outside
        document.addEventListener("click", (e) => {
            if (menu.classList.contains("active") && !menu.contains(e.target) && e.target !== hamburger) {
                menu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });

        // Close mobile menu when a navigation link is tapped
        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 4. 3D Coverflow Game Showcase Carousel
    const carouselStage = document.querySelector(".carousel-stage");
    const cards = document.querySelectorAll(".showcase-card");
    const prevBtn = document.querySelector(".carousel-paddle.prev");
    const nextBtn = document.querySelector(".carousel-paddle.next");
    const dotsContainer = document.querySelector(".carousel-dots");

    if (carouselStage && cards.length > 0) {
        let currentIndex = 0;
        const totalCards = cards.length;

        // Generate pagination dots if not pre-rendered
        if (dotsContainer && dotsContainer.children.length === 0) {
            cards.forEach((_, idx) => {
                const dot = document.createElement("button");
                dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                dot.setAttribute("aria-label", `Go to game ${idx + 1}`);
                dot.addEventListener("click", () => updateCarousel(idx));
                dotsContainer.appendChild(dot);
            });
        }
        const dots = document.querySelectorAll(".carousel-dot");

        function updateCarousel(newIndex) {
            currentIndex = (newIndex % totalCards + totalCards) % totalCards;

            cards.forEach((card, i) => {
                // Calculate circular relative offset
                let offset = (i - currentIndex + totalCards) % totalCards;
                if (offset > totalCards / 2) {
                    offset -= totalCards;
                }

                card.classList.remove("active", "prev", "next", "hidden-left", "hidden-right");

                if (offset === 0) {
                    card.classList.add("active");
                    card.setAttribute("aria-hidden", "false");
                    card.tabIndex = 0;
                } else if (offset === -1) {
                    card.classList.add("prev");
                    card.setAttribute("aria-hidden", "true");
                    card.tabIndex = -1;
                } else if (offset === 1) {
                    card.classList.add("next");
                    card.setAttribute("aria-hidden", "true");
                    card.tabIndex = -1;
                } else if (offset < -1) {
                    card.classList.add("hidden-left");
                    card.setAttribute("aria-hidden", "true");
                    card.tabIndex = -1;
                } else {
                    card.classList.add("hidden-right");
                    card.setAttribute("aria-hidden", "true");
                    card.tabIndex = -1;
                }
            });

            // Update dots
            dots.forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentIndex);
            });
        }

        // Initialize carousel state
        updateCarousel(0);

        // Paddle buttons
        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                updateCarousel(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                updateCarousel(currentIndex + 1);
            });
        }

        // Card click handling
        cards.forEach((card, idx) => {
            card.addEventListener("click", (e) => {
                // If not active card, don't follow link immediately, bring to center first
                if (idx !== currentIndex) {
                    e.preventDefault();
                    updateCarousel(idx);
                }
                // If already active, default action (navigating to href) proceeds naturally!
            });
        });

        // Keyboard arrow navigation
        document.addEventListener("keydown", (e) => {
            const carouselContainer = document.querySelector(".carousel-container");
            if (!carouselContainer) return;
            
            // If user has focused inside or carousel is in viewport
            const rect = carouselContainer.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                if (e.key === "ArrowLeft") {
                    updateCarousel(currentIndex - 1);
                } else if (e.key === "ArrowRight") {
                    updateCarousel(currentIndex + 1);
                }
            }
        });

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        carouselStage.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });

        carouselStage.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            const diffX = e.touches[0].clientX - touchStartX;
            const diffY = e.touches[0].clientY - touchStartY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                // Horizontal swipe detected
            }
        }, { passive: true });

        carouselStage.addEventListener("touchend", (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    // Swiped Right -> Go to previous
                    updateCarousel(currentIndex - 1);
                } else {
                    // Swiped Left -> Go to next
                    updateCarousel(currentIndex + 1);
                }
            }
        }, { passive: true });
    }
});
