
        /* =========================================
           CIRCLE TRANSITION - RESPONSIVE & LAYOUT AWARE
        ========================================== */
        const transition = document.querySelector(".transition");
        const circles = gsap.utils.toArray(".transition-circle");
        const logo = document.querySelector(".transition-logo");
        const logoImg = document.querySelector(".transition-logo img");

        /*
         * Calculate how large the circle needs
         * to become to cover the entire screen.
         * Uses the actual circle size from CSS (responsive).
         */
        function getScale() {
            const circleSize = circles[0].offsetWidth; // get actual rendered size
            const radius = Math.sqrt(
                window.innerWidth ** 2 + window.innerHeight ** 2
            ) / 2;
            return radius / (circleSize / 2) * 1.1; // 1.1 for extra safety margin
        }

        /* =========================================
           PAGE ENTER (reveal hero)
        ========================================== */
        function pageEnter() {
            const scale = getScale();

            /*
             * Start with all circles covering the screen
             * and the logo visible.
             */
            gsap.set(circles, {
                scale: scale
            });

            gsap.set(logo, {
                opacity: 1,
                y: 0
            });

            /*
             * Reveal page by shrinking circles back toward the center,
             * while fading out the logo.
             */
            const tl = gsap.timeline();

            tl.to(logo, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: "power2.inOut"
            }, 0.7)
            .to(circles, {
                scale: 0,
                duration: 1.2,
                stagger: {
                    each: 0.12,
                    from: "start"
                },
                ease: "expo.inOut"
            }, 0.17);

            return tl;
        }

        /* =========================================
           PAGE EXIT
        ========================================== */
        function pageExit(url, callback) {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (callback) callback();
                    if (url && url !== '#') {
                        window.location.href = url;
                    }
                }
            });

            /*
             * Circles expand outward from the center and cover the page.
             * Once the screen is mostly covered, fade in the logo.
             */
            tl.to(circles, {
                scale: getScale(),
                duration: 1.1,
                stagger: {
                    each: 0.12,
                    from: "start"
                },
                ease: "expo.inOut"
            })
            .to(logo, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            }, "-=0.35");

            return tl;
        }

        /* =========================================
           INITIAL PAGE LOAD
        ========================================== */
        window.addEventListener("load", () => {
            // Ensure circles are sized correctly before first animation
            gsap.set(circles, { scale: 0 });
            pageEnter();
        });

        /* =========================================
           LINKS (all elements with [data-transition])
        ========================================== */
        document.querySelectorAll("[data-transition]").forEach(link => {
            link.addEventListener("click", function(event) {
                const url = this.getAttribute("href");

                /*
                 * Don't intercept modifier clicks.
                 */
                if (
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey
                ) {
                    return;
                }

                event.preventDefault();

                /*
                 * If the link points to "#" (dummy links in navbar),
                 * we still run the exit animation but then
                 * reset the page instead of navigating.
                 */
                if (!url || url === "#") {
                    pageExit(null, () => {
                        pageEnter();
                    });
                } else {
                    pageExit(url);
                }
            });
        });

        /* =========================================
           RESIZE - UPDATE SCALE & LOGO SIZING
        ========================================== */
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Update circle scale if they are currently in an expanded state
                const currentScale = gsap.getProperty(circles[0], "scale");
                if (currentScale > 0.1) {
                    gsap.set(circles, {
                        scale: getScale()
                    });
                }

                // Adjust logo image size responsively
                if (logoImg) {
                    const width = window.innerWidth;
                    let height = 50;
                    if (width < 360) height = 25;
                    else if (width < 480) height = 30;
                    else if (width < 640) height = 35;
                    else if (width < 768) height = 40;
                    else if (width < 1024) height = 45;
                    else height = 50;
                    logoImg.style.height = height + 'px';
                }
            }, 100);
        });

        // Initial logo sizing on load
        window.addEventListener('load', () => {
            if (logoImg) {
                const width = window.innerWidth;
                let height = 50;
                if (width < 360) height = 25;
                else if (width < 480) height = 30;
                else if (width < 640) height = 35;
                else if (width < 768) height = 40;
                else if (width < 1024) height = 45;
                else height = 50;
                logoImg.style.height = height + 'px';
            }
        });

        
        // ============ CAROUSEL FUNCTIONALITY ============
        const carousel = document.getElementById("carousel");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const controls = document.getElementById("carouselControls");
        let currentSlide = 0;
        const totalSlides = 5;

        // Create carousel controls
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement("div");
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(i);
            controls.appendChild(dot);
        }

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            document.querySelectorAll(".dot").forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        function goToSlide(n) {
            currentSlide = n;
            updateCarousel();
        }

        nextBtn.addEventListener("click", nextSlide);
        prevBtn.addEventListener("click", prevSlide);

        // Auto-play carousel
        setInterval(nextSlide, 5000);

        // ============ MENU ANIMATION ============
        const trigger = document.getElementById("menu-trigger");
        const expandedMenu = document.getElementById("expanded-menu");
        let isOpen = false;

        trigger.addEventListener("click", () => {
            isOpen = !isOpen;
            expandedMenu.style.height = isOpen ? "auto" : "0";
            gsap.to("#sub-menu img", {
                opacity: isOpen ? 1 : 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out"
            });
        });

