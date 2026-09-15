document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // NAVEGAÇÃO
    // ==========================================
    const logoToggle = document.getElementById("logo-toggle");
    const navOverlay = document.getElementById("nav-overlay");
    const navClose = document.getElementById("nav-close");

    // Bird: se menu aberto → vai para home; se fechado → abre menu
    logoToggle.addEventListener("click", () => {
        if (navOverlay.classList.contains("is-open")) {
            window.location.href = "index.html";
        } else {
            navOverlay.classList.add("is-open");
        }
    });

    // Botão X: fecha o menu
    navClose.addEventListener("click", () => {
        navOverlay.classList.remove("is-open");
    });

    // ESC também fecha
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            navOverlay.classList.remove("is-open");
        }
    });

});