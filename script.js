document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the 'fade-in' class
    const fadeElements = document.querySelectorAll('.fade-in');

    // Create an Intersection Observer callback
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Once the element is intersecting (visible on screen), add the 'visible' class
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserver after showing so it only animates once
                observer.unobserve(entry.target);
            }
        });
    };

    // Observer options
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // triggers when 10% of the element is visible
    };

    // Instantiate the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Start observing each fade-in element
    fadeElements.forEach(el => observer.observe(el));

    // Optional: Add subtle parallax effect on mousemove for background orbs
    const orbs = document.querySelectorAll('.glow-orb');
    
    // Only apply mousemove parallax if it's not a touch device
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            
            orbs.forEach((orb, index) => {
                const speed = index === 0 ? 30 : -40;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
});
