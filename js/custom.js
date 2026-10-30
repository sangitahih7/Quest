// ! Pre Loader By Jquery

// $(window).on("load", function () {
//     $("#pre_Loader").fadeOut(2000);
// });

// =======================<<<<<>>>>>=======================


// ! Custom Fixed NavBar

// $(function () {
//     $(window).scroll(function () {
//         if ($(window).scrollTop() > 400) {
//             $("header").addClass("active");
//         } else {
//             $("header").removeClass("active");
//         }
//     });
// });

// =======================<<<<<>>>>>=======================


// ! Back To Top (Jquery)

let btn = $('#backToTop');
$(window).on('scroll', function () {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});
btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, '1000');
});


// =======================<<<<<>>>>>=======================

// ! Easy Responsive Tabs

// $(document).ready(function () {
//     $('#horizontalTab').easyResponsiveTabs({
//         type: 'default',
//         width: 'auto',
//         fit: true,
//         closed: 'accordion',
//         activate: function (event) {
//             var $tab = $(this);
//             var $info = $('#tabInfo');
//             var $name = $('span', $info);
//             $name.text($tab.text());
//             $info.show();
//         }
//     });
// });

// =======================<<<<<>>>>>=======================


// ! Swiper Slider

// var swiper = new Swiper(".mySwiper", {
//     loop: true,
//     // centeredSlides: true,
//     slidesPerView: 3,
//     spaceBetween: 30,
//     autoplay: {
//         delay: 1000,
//         disableOnInteraction: true,
//     },
//     speed: 1500,
//     // direction: "vertical",
//     navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//     },
// });

// Autoplay Stop on Hover

/* $(".swiper").mouseenter(function () {
    swiper.autoplay.stop();
});

$(".swiper").mouseleave(function () {
    swiper.autoplay.start();
});

*/
// 26.10.26
// =======================<<<<<DISCOVER SECTION JS>>>>>=======================

const discoverSwiper = new Swiper(".discoverSwiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 800,
    effect: "fade",

    fadeEffect: {
        crossFade: true
    },

    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },

    navigation: {
        nextEl: ".discover-next"
    }
});

// Click right-side items to change the left image
const adventureItems = document.querySelectorAll(".adventure_item");

adventureItems.forEach((item) => {
    item.addEventListener("click", function () {
        const slideIndex = Number(this.dataset.slide);

        // Update active item
        adventureItems.forEach((adventure) => {
            adventure.classList.remove("active");
        });

        this.classList.add("active");

        // Change left-side slider
        discoverSwiper.slideToLoop(slideIndex);
    });
});

// Keep the selected right-side item in sync
discoverSwiper.on("slideChange", function () {
    const realIndex = discoverSwiper.realIndex;

    adventureItems.forEach((item) => {
        item.classList.toggle(
            "active",
            Number(item.dataset.slide) === realIndex
        );
    });
});








// =======================<<<<<water effect on banner>>>>>=======================


document.addEventListener("DOMContentLoaded", () => {

    const banner = document.querySelector(".banner");
    const bg = banner?.querySelector(".bnr_bg");
    const img = bg?.querySelector('img:not(#waterMask)');
    const maskImg = bg?.querySelector("#waterMask");
    const canvas = bg?.querySelector("#waterCanvas");

    if (!banner || !bg || !img || !maskImg || !canvas) {
        console.warn("Water ripple: Required elements not found.");
        return;
    }

    const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        premultipliedAlpha: false
    });

    if (!gl) {
        console.warn("WebGL is not supported.");
        return;
    }

    // -----------------------------------------
    // VERTEX SHADER
    // -----------------------------------------

    const vertexShader = `
        attribute vec2 aPosition;
        varying vec2 vUv;

        void main() {
            vUv = aPosition * 0.5 + 0.5;
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;

    // -----------------------------------------
    // FRAGMENT SHADER
    // -----------------------------------------

    const fragmentShader = `
        precision highp float;

        varying vec2 vUv;

        uniform sampler2D uImage;
        uniform sampler2D uMask;

        uniform vec2 uResolution;
        uniform vec2 uImageSize;

        uniform float uTime;

        uniform vec3 uRipples[8];

        void main() {

            vec2 uv = vUv;

            // ---------------------------------
            // OBJECT-FIT: COVER
            // ---------------------------------

            float canvasAspect =
                uResolution.x / uResolution.y;

            float imageAspect =
                uImageSize.x / uImageSize.y;

            if (canvasAspect > imageAspect) {

                uv.y = (uv.y - 0.5) *
                    (imageAspect / canvasAspect) + 0.5;

            } else {

                uv.x = (uv.x - 0.5) *
                    (canvasAspect / imageAspect) + 0.5;
            }

            // ---------------------------------
            // WATER MASK
            // White = water
            // Black = people, raft, rocks, etc.
            // ---------------------------------

            float waterMask = texture2D(uMask, uv).r;

            waterMask = smoothstep(
                0.15,
                0.85,
                waterMask
            );

            // ---------------------------------
            // WATER RIPPLE DISTORTION
            // ---------------------------------

            vec2 distortion = vec2(0.0);

            for (int i = 0; i < 8; i++) {

                vec2 center = uRipples[i].xy;

                float age = uTime - uRipples[i].z;

                if (age >= 0.0 && age < 2.0) {

                    vec2 delta = uv - center;

                    delta.x *= canvasAspect;

                    float dist = length(delta);

                    // Expanding ripple
                    float radius = age * 0.38;

                    // Soft ripple ring
                    float ring = exp(
                        -pow((dist - radius) / 0.10, 2.0)
                    );

                    // Natural wave movement
                    float wave = sin(
                        dist * 55.0 - age * 7.0
                    );

                    // Smooth fade
                    float fade = exp(-age * 1.5);

                    vec2 direction = normalize(
                        vec2(
                            delta.x / canvasAspect,
                            delta.y
                        ) + vec2(0.00001)
                    );

                    distortion += direction
                        * wave
                        * ring
                        * fade
                        * 0.018;
                }
            }

            // ---------------------------------
            // APPLY DISTORTION ONLY ON WATER
            // ---------------------------------

            vec2 finalUV = clamp(
                uv + distortion * waterMask,
                vec2(0.001),
                vec2(0.999)
            );

            gl_FragColor = texture2D(
                uImage,
                finalUV
            );
        }
    `;

    // -----------------------------------------
    // CREATE SHADER
    // -----------------------------------------

    function createShader(type, source) {

        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

            console.error(
                "Shader error:",
                gl.getShaderInfoLog(shader)
            );

            gl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    const vs = createShader(
        gl.VERTEX_SHADER,
        vertexShader
    );

    const fs = createShader(
        gl.FRAGMENT_SHADER,
        fragmentShader
    );

    if (!vs || !fs) return;

    // -----------------------------------------
    // CREATE PROGRAM
    // -----------------------------------------

    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

        console.error(
            "Program error:",
            gl.getProgramInfoLog(program)
        );

        return;
    }

    gl.useProgram(program);

    // -----------------------------------------
    // FULLSCREEN GEOMETRY
    // -----------------------------------------

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,

            -1,  1,
             1, -1,
             1,  1
        ]),
        gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(
        program,
        "aPosition"
    );

    gl.enableVertexAttribArray(position);

    gl.vertexAttribPointer(
        position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    // -----------------------------------------
    // UNIFORMS
    // -----------------------------------------

    const uImage = gl.getUniformLocation(
        program,
        "uImage"
    );

    const uMask = gl.getUniformLocation(
        program,
        "uMask"
    );

    const uResolution = gl.getUniformLocation(
        program,
        "uResolution"
    );

    const uImageSize = gl.getUniformLocation(
        program,
        "uImageSize"
    );

    const uTime = gl.getUniformLocation(
        program,
        "uTime"
    );

    const uRipples = gl.getUniformLocation(
        program,
        "uRipples[0]"
    );

    // -----------------------------------------
    // IMAGE TEXTURE
    // -----------------------------------------

    const imageTexture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(
        gl.TEXTURE_2D,
        imageTexture
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        gl.LINEAR
    );

    gl.uniform1i(uImage, 0);

    // -----------------------------------------
    // WATER MASK TEXTURE
    // -----------------------------------------

    const maskTexture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(
        gl.TEXTURE_2D,
        maskTexture
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR
    );

    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        gl.LINEAR
    );

    gl.uniform1i(uMask, 1);

    // -----------------------------------------
    // UPLOAD ORIGINAL IMAGE
    // -----------------------------------------

    function uploadImage() {

        if (!img.naturalWidth || !img.naturalHeight) {
            return false;
        }

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(
            gl.TEXTURE_2D,
            imageTexture
        );

        gl.pixelStorei(
            gl.UNPACK_FLIP_Y_WEBGL,
            true
        );

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );

        gl.uniform2f(
            uImageSize,
            img.naturalWidth,
            img.naturalHeight
        );

        return true;
    }

    // -----------------------------------------
    // UPLOAD WATER MASK
    // -----------------------------------------

    function uploadMask() {

        if (!maskImg.naturalWidth || !maskImg.naturalHeight) {
            return false;
        }

        if (
            maskImg.naturalWidth !== img.naturalWidth ||
            maskImg.naturalHeight !== img.naturalHeight
        ) {
            console.warn(
                "Water mask and banner image dimensions must match."
            );

            return false;
        }

        gl.activeTexture(gl.TEXTURE1);

        gl.bindTexture(
            gl.TEXTURE_2D,
            maskTexture
        );

        gl.pixelStorei(
            gl.UNPACK_FLIP_Y_WEBGL,
            true
        );

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.LUMINANCE,
            gl.LUMINANCE,
            gl.UNSIGNED_BYTE,
            maskImg
        );

        return true;
    }

    // -----------------------------------------
    // PREPARE MASK FOR CURSOR DETECTION
    // -----------------------------------------

    const maskCanvas = document.createElement("canvas");

    const maskCtx = maskCanvas.getContext("2d", {
        willReadFrequently: true
    });

    let maskPixels = null;
    let maskWidth = 0;
    let maskHeight = 0;

    function prepareMaskCheck() {

        maskWidth = maskImg.naturalWidth;
        maskHeight = maskImg.naturalHeight;

        maskCanvas.width = maskWidth;
        maskCanvas.height = maskHeight;

        maskCtx.drawImage(
            maskImg,
            0,
            0,
            maskWidth,
            maskHeight
        );

        maskPixels = maskCtx.getImageData(
            0,
            0,
            maskWidth,
            maskHeight
        ).data;
    }

    // -----------------------------------------
    // CHECK WHETHER CURSOR IS OVER WATER
    // -----------------------------------------

    function isWaterAt(x, y) {

        if (!maskPixels) return false;

        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return false;

        const canvasAspect = rect.width / rect.height;

        const imageAspect = img.naturalWidth / img.naturalHeight;

        let sourceX = x;
        let sourceY = y;

        // Match object-fit: cover
        // and object-position: center.

        if (canvasAspect > imageAspect) {

            const visibleHeight = imageAspect / canvasAspect;

            sourceY = (
                y - (1 - visibleHeight) / 2
            ) / visibleHeight;

        } else {

            const visibleWidth = canvasAspect / imageAspect;

            sourceX = (
                x - (1 - visibleWidth) / 2
            ) / visibleWidth;
        }

        if (
            sourceX < 0 ||
            sourceX > 1 ||
            sourceY < 0 ||
            sourceY > 1
        ) {
            return false;
        }

        const px = Math.min(
            maskWidth - 1,
            Math.floor(sourceX * maskWidth)
        );

        const py = Math.min(
            maskHeight - 1,
            Math.floor(sourceY * maskHeight)
        );

        const index = (py * maskWidth + px) * 4;

        const brightness = maskPixels[index];

        // Only start ripples on white water areas.
        return brightness > 128;
    }

    // -----------------------------------------
    // RIPPLE SETTINGS
    // -----------------------------------------

    const ripples = [];

    const startTime = performance.now();

    let lastX = -100;
    let lastY = -100;

    let lastRippleTime = 0;

    const MAX_RIPPLES = 8;

    // -----------------------------------------
    // ADD RIPPLE
    // -----------------------------------------

    function addRipple(x, y, now) {

        ripples.push({

            x: x,

            y: 1 - y,

            time: (now - startTime) / 1000

        });

        if (ripples.length > MAX_RIPPLES) {
            ripples.shift();
        }
    }

    // -----------------------------------------
    // RESPONSIVE CANVAS
    // -----------------------------------------

    function resizeCanvas() {

        const rect = bg.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        const width = Math.round(rect.width * dpr);
        const height = Math.round(rect.height * dpr);

        if (
            canvas.width !== width ||
            canvas.height !== height
        ) {

            canvas.width = width;
            canvas.height = height;
        }

        gl.viewport(
            0,
            0,
            width,
            height
        );

        gl.uniform2f(
            uResolution,
            width,
            height
        );
    }

    // -----------------------------------------
    // CURSOR MOVEMENT
    // -----------------------------------------

    bg.addEventListener("pointermove", event => {

        if (event.pointerType === "touch") return;

        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const dx = (x - lastX) * rect.width;
        const dy = (y - lastY) * rect.height;

        const now = performance.now();

        const movedDistance = Math.hypot(dx, dy);

        // Update cursor tracking even over protected areas.
        // This prevents a large ripple jump when entering water.
        lastX = x;
        lastY = y;

        // Create ripples only over water.
        if (
            movedDistance > 5 &&
            now - lastRippleTime > 55 &&
            isWaterAt(x, y)
        ) {

            addRipple(x, y, now);

            lastRippleTime = now;
        }
    });

    // -----------------------------------------
    // RESET CURSOR WHEN LEAVING BANNER
    // -----------------------------------------

    bg.addEventListener("pointerleave", () => {

        lastX = -100;
        lastY = -100;

    });

    // -----------------------------------------
    // ANIMATION LOOP
    // -----------------------------------------

    let animationStarted = false;

    function render(now) {

        if (!animationStarted) return;

        resizeCanvas();

        const seconds = (now - startTime) / 1000;

        const rippleData = new Float32Array(
            MAX_RIPPLES * 3
        );

        for (let i = 0; i < ripples.length; i++) {

            rippleData[i * 3] = ripples[i].x;

            rippleData[i * 3 + 1] = ripples[i].y;

            rippleData[i * 3 + 2] = ripples[i].time;
        }

        // Remove expired ripples.
        while (
            ripples.length &&
            seconds - ripples[0].time > 2
        ) {
            ripples.shift();
        }

        gl.uniform1f(
            uTime,
            seconds
        );

        gl.uniform3fv(
            uRipples,
            rippleData
        );

        // Keep texture units correctly bound.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, maskTexture);

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            6
        );

        requestAnimationFrame(render);
    }

    // -----------------------------------------
    // INITIALIZATION
    // -----------------------------------------

    function init() {

        if (animationStarted) return;

        if (
            !img.complete ||
            !maskImg.complete ||
            !img.naturalWidth ||
            !maskImg.naturalWidth
        ) {
            return;
        }

        if (!uploadImage()) return;

        if (!uploadMask()) return;

        prepareMaskCheck();

        resizeCanvas();

        animationStarted = true;

        requestAnimationFrame(render);
    }

    // -----------------------------------------
    // WAIT FOR BOTH IMAGES
    // -----------------------------------------

    img.addEventListener("load", init);

    maskImg.addEventListener("load", init);

    img.addEventListener("error", () => {
        console.error("Banner image could not be loaded.");
    });

    maskImg.addEventListener("error", () => {
        console.error("Water mask could not be loaded.");
    });

    if (
        img.complete &&
        maskImg.complete
    ) {
        init();
    }

    // -----------------------------------------
    // RESIZE OBSERVER
    // -----------------------------------------

    window.addEventListener("resize", resizeCanvas);

    if ("ResizeObserver" in window) {

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        resizeObserver.observe(bg);
    }

});



// 29.10.26
// =========================  choose section animation js =================================


document.addEventListener("DOMContentLoaded", function () {
    const adventureCards = document.querySelectorAll(".adventure_card");

    if (!adventureCards.length) return;

    // Show cards immediately when reduced motion is preferred
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        adventureCards.forEach(card => {
            card.classList.add("is-visible");
        });
        return;
    }

    // Fallback for browsers without IntersectionObserver
    if (!("IntersectionObserver" in window)) {
        adventureCards.forEach(card => {
            card.classList.add("is-visible");
        });
        return;
    }

    const adventureObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    adventureObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    adventureCards.forEach(card => {
        adventureObserver.observe(card);
    });
});



// ===================== crew section js ==========================

document.addEventListener("DOMContentLoaded", function () {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".crew-section");
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const heading = section.querySelector(".crew-heading");
    const cards = section.querySelectorAll(".crew-card");
    const watermark = section.querySelector(".crew-watermark");
    const people = section.querySelector(".crew-people");

    // Start each layer just outside its visible area
    if (heading) {
        gsap.set(heading, { autoAlpha: 0, y: 30 });
    }

    gsap.set(cards, { autoAlpha: 0, y: 35 });

    if (watermark) {
        gsap.set(watermark, { autoAlpha: 0, y: 20 });
    }

    if (people) {
        gsap.set(people, {
            clipPath: "inset(100% 0 0 0)",
            y: 20
        });
    }

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none reverse"
        }
    });

    if (heading) {
        timeline.to(heading, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    }

    if (watermark) {
        timeline.to(watermark, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.45");
    }

    timeline.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power3.out"
    }, "-=0.4");

    if (people) {
        timeline.to(people, {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 1.1,
            ease: "power2.inOut"
        }, "-=0.2");
    }

    window.addEventListener("load", () => ScrollTrigger.refresh());
});



// ===================== why-quest and adventure js ==================================


document.addEventListener("DOMContentLoaded", function () {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    if (typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // WHY QUEST: unfolds into view as you scroll
    gsap.fromTo(
        ".why-quest",
        {
            rotateX: -7,
            scale: 0.96,
            y: 70,
            transformPerspective: 1400,
            transformOrigin: "center top"
        },
        {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".why-quest",
                start: "top 90%",
                end: "top 25%",
                scrub: 1
            }
        }
    );

    // ADVENTURE: the yellow panel unfolds independently
    gsap.fromTo(
        ".adventure .container",
        {
            rotateX: -9,
            scale: 0.95,
            y: 65,
            transformPerspective: 1400,
            transformOrigin: "center top"
        },
        {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".adventure",
                start: "top 90%",
                end: "top 25%",
                scrub: 1
            }
        }
    );

});




// ====================== life js =========================


document.addEventListener("DOMContentLoaded", function () {
    const lifeSection = document.querySelector(".life");

    if (!lifeSection) return;

    const lifeObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("life-revealed");
                } else {
                    entry.target.classList.remove("life-revealed");
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -5% 0px"
        }
    );

    lifeObserver.observe(lifeSection);
});


// ============================= review js =====================


document.addEventListener("DOMContentLoaded", function () {
    const reviewSection = document.querySelector(".quest-review-section");

    if (!reviewSection) return;

    // Enable the entrance animation
    reviewSection.classList.add("reveal-ready");

    const reviewObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    reviewSection.classList.add("is-visible");
                } else {
                    reviewSection.classList.remove("is-visible");
                }
            });
        },
        {
            threshold: 0.25,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    reviewObserver.observe(reviewSection);
});



// ================= connect text js ==================
document.addEventListener("DOMContentLoaded", function () {
    const connectSection = document.querySelector(".connect");

    if (!connectSection) return;

    const connectObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    connectSection.classList.add("text-visible");
                } else {
                    connectSection.classList.remove("text-visible");
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    connectObserver.observe(connectSection);
});