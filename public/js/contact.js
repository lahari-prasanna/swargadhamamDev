
function revealOnScroll() {
    document.querySelectorAll(".contact-card, .contact-form").forEach(el => {
        let rect = el.getBoundingClientRect().top;
        if (rect < window.innerHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
}
window.addEventListener("scroll", revealOnScroll);

document.querySelectorAll(".contact-card, .contact-form").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "1s ease";
});

revealOnScroll();

// Scroll reveal
function reveal() {
    document.querySelectorAll(".contact-card").forEach(el => {
        let rect = el.getBoundingClientRect().top;
        if (rect < window.innerHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.transition = "1s ease";
        }
    });
}
window.addEventListener("scroll", reveal);
reveal();

// Mouse Tilt Effect
document.querySelectorAll(".contact-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        let r = card.getBoundingClientRect();
        let x = e.clientX - r.left;
        let y = e.clientY - r.top;
        let rotateY = ((x / r.width) - 0.5) * 15;
        let rotateX = ((y / r.height) - 0.5) * -15;

        card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.04)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    });
});

