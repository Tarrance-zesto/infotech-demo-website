const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const scrollTopButton = document.getElementById("scroll-top");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const counters = document.querySelectorAll(".counter");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

let countersStarted = false;

// Keep navigation and utility buttons in sync with the current scroll position.
function setHeaderState() {
    const isScrolled = window.scrollY > 20;
    header.classList.toggle("scrolled", isScrolled);
    scrollTopButton.classList.toggle("visible", window.scrollY > 450);
}

function closeMobileMenu() {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPosition >= top && scrollPosition < bottom) {
            navAnchors.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        }
    });
}

function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    // Ease out so the counters feel responsive without ending abruptly.
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(easedProgress * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");

            if (entry.target.classList.contains("counter-grid") && !countersStarted) {
                counters.forEach(animateCounter);
                countersStarted = true;
            }
        }
    });
}, {
    threshold: 0.18
});

revealElements.forEach((element) => revealObserver.observe(element));

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function setFieldError(field, message) {
    const group = field.closest(".form-group");
    const error = group.querySelector(".error-message");

    group.classList.toggle("invalid", Boolean(message));
    error.textContent = message;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[+\d][\d\s()-]{7,}$/.test(phone);
}

// This demo form validates input on the client side and avoids sending data anywhere.
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const phone = contactForm.elements.phone;
    const message = contactForm.elements.message;
    let isValid = true;

    if (name.value.trim().length < 2) {
        setFieldError(name, "Please enter your name.");
        isValid = false;
    } else {
        setFieldError(name, "");
    }

    if (!validateEmail(email.value.trim())) {
        setFieldError(email, "Please enter a valid email address.");
        isValid = false;
    } else {
        setFieldError(email, "");
    }

    if (!validatePhone(phone.value.trim())) {
        setFieldError(phone, "Please enter a valid phone number.");
        isValid = false;
    } else {
        setFieldError(phone, "");
    }

    if (message.value.trim().length < 10) {
        setFieldError(message, "Please enter a message of at least 10 characters.");
        isValid = false;
    } else {
        setFieldError(message, "");
    }

    if (!isValid) {
        formStatus.textContent = "Please correct the highlighted fields.";
        return;
    }

    formStatus.textContent = "Thank you. Your message has been validated successfully.";
    contactForm.reset();
});

window.addEventListener("scroll", () => {
    setHeaderState();
    updateActiveNavLink();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        closeMobileMenu();
    }
});

setHeaderState();
updateActiveNavLink();
