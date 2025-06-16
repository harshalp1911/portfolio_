/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show-menu");
    });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}
/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName("skills__content"),
    skillsHeader = document.querySelectorAll(".skills__header");

function toggleSkills() {
    let itemsClass = this.parentNode.className;

    for (i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = "skills__content skills__close";
    }
    if (itemsClass == "skills__content skills__close") {
        this.parentNode.className = "skills__content skills__open";
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener("click", toggleSkills);
});

/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll("[data-target]"),
    tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.target);

        tabContents.forEach((tabContent) => {
            tabContent.classList.remove("qualification__active");
        });
        target.classList.add("qualification__active");

        tabs.forEach((tab) => {
            tab.classList.remove("qualification__active");
        });
        tab.classList.add("qualification__active");
    });
});

/*==================== PORTFOLIO SWIPER  ====================*/
let swiperP = new Swiper(".portfolio__container", {
    cssMode: true,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    mousewheel: true,
    keyboard: true,
});
/*==================== TESTIMONIAL ====================*/
let swiperT = new Swiper(".testimonial__container", {
    grabCursor: true,
    loop: true,
    spaceBetween: 48,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        568: {
            slidesPerView: 2,
        },
    },
    /*   mousewheel: true, */
    keyboard: true,
});
/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document
                .querySelector(".nav__menu a[href*=" + sectionId + "]")
                .classList.add("active-link");
        } else {
            document
                .querySelector(".nav__menu a[href*=" + sectionId + "]")
                .classList.remove("active-link");
        }
    });
}
window.addEventListener("scroll", scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const nav = document.getElementById("header");
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 80) nav.classList.add("scroll-header");
    else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById("scroll-up");
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
    else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme
    );
    themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
        iconTheme
    );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});

// /* ======== form message handling ========= */
// document.addEventListener("DOMContentLoaded", function () {
//     const contactForm = document.querySelector(".contact__form");

//     if (contactForm) {
//       contactForm.addEventListener("submit", function (event) {
//         event.preventDefault(); // Prevent default form submission

//         // Get form input values
//         const name = document.querySelector("#name").value;
//         const email = document.querySelector("#email").value;
//         const message = document.querySelector("#message").value;

//         // Debugging: Log the data (or send via EmailJS)
//         console.log("Name:", name);
//         console.log("Email:", email);
//         console.log("Message:", message);

//         // Optionally, reset the form after submission
//         contactForm.reset();
//       });
//     }
//   });

// /* ======== form message handling Email.js ========= */
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("1aHCsqFKOYbCtNqwo"); // Initialize EmailJS with your Public Key

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Get form input values
            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const message = document.querySelector("#message").value;

            // Send email using EmailJS
            emailjs.send("service_h1kx3a7", "template_yrrulcb", {
                from_name: name,
                reply_to: email,
                message: message,
            })
                .then(function (response) {
                    console.log("Email sent successfully!", response);
                    alert("Your message has been sent successfully!");
                    contactForm.reset(); // Reset  form after successful submission
                })
                .catch(function (error) {
                    console.error("Error sending email:", error);
                    alert("Oops! Something went wrong. Please try again.");
                });
        });
    }
});

// ─── BUBBLE ANIMATION ────────────────────────────────────

// 1) Define the bubble factory
function createBubble() {
    const container = document.getElementById("bubbles");
    const b = document.createElement("div");
    const size = 10 + Math.random() * 40;      // 10–50px
    const left = Math.random() * 100;          // 0–100% across

    b.classList.add("bubble");
    b.style.width = b.style.height = `${size}px`;
    b.style.left = `${left}%`;

    // delay the pop animation so it runs at end of rise
    const riseDuration = 6; // seconds (matches your CSS)
    b.style.setProperty("--pop-delay", `${riseDuration}s`);

    container.appendChild(b);

    // clean up after animation finishes
    setTimeout(() => container.removeChild(b), (riseDuration + 0.5) * 1000);
}

// 2) Start spawning bubbles once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Make sure the <div id="bubbles"> exists in your HTML
    setInterval(createBubble, 500); // every 0.5s
});