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

// let btn = $('#backToTop');
// $(window).on('scroll', function () {
//     if ($(window).scrollTop() > 300) {
//         btn.addClass('show');
//     } else {
//         btn.removeClass('show');
//     }
// });
// btn.on('click', function (e) {
//     e.preventDefault();
//     $('html, body').animate({
//         scrollTop: 0
//     }, '1000');
// });


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





