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

    // ==========================================
    // AS 5 IMAGENS
    // ==========================================
    const mediaData = [
        "https://cdn.phototourl.com/free/2026-09-15-c0113818-942d-4b05-bcb7-294d8ae67978.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-bfc3294d-86dc-4b0e-a20d-3c0ea74f2971.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-68d104e8-7095-423d-b640-624719be78cc.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-fc53d80b-22e5-4084-bfbb-350d10d68c6b.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-0f1c44fc-81f8-4f72-854b-e1decc2ba8fc.jpg"
    ];

    // ==========================================
    // DADOS DA GALERIA
    // ==========================================
    const galleryData = [
        { src: mediaData[0], director: "andre-chitas" },
        { src: mediaData[1], director: "andre-chitas" },
        { src: mediaData[2], director: "francisco-ramalho" },
        { src: mediaData[3], director: "francisco-ramalho" },
        { src: mediaData[4], director: "goncalo-zx" },
        { src: mediaData[0], director: "goncalo-zx" },
        { src: mediaData[1], director: "andre-chitas" },
        { src: mediaData[2], director: "francisco-ramalho" },
        { src: mediaData[3], director: "goncalo-zx" },
        { src: mediaData[4], director: "andre-chitas" },
        { src: mediaData[0], director: "francisco-ramalho" },
        { src: mediaData[2], director: "goncalo-zx" }
    ];

    const gallery = document.getElementById("gallery");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // ==========================================
    // ASPECT RATIOS — TODOS HORIZONTAIS
    // ==========================================
    const aspectRatios = [
        16/9,
        4/3,
        3/2,
        21/9,
        2/1,
        5/4
    ];

    // ==========================================
    // ÁREA VIRTUAL (tile que se repete infinitamente)
    // ==========================================
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const VIRTUAL_W = vw * 1.5;
    const VIRTUAL_H = vh * 1.5;

    gallery.style.width = VIRTUAL_W + "px";
    gallery.style.height = VIRTUAL_H + "px";

    // ==========================================
    // GRELHA
    // ==========================================
    const COLS = 4;
    const ROWS = Math.ceil(galleryData.length / COLS);
    const CELL_W = VIRTUAL_W / COLS;
    const CELL_H = VIRTUAL_H / ROWS;

    const cells = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            cells.push({ r, c });
        }
    }
    cells.sort(() => Math.random() - 0.5);

    const items = [];

    // ==========================================
    // CRIAÇÃO DOS ITENS
    // ==========================================
    galleryData.forEach((data, i) => {
        const cell = cells[i % cells.length];
        const item = document.createElement("div");
        item.classList.add("gallery-item");
        item.dataset.director = data.director;

        const ratio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];

        // Tamanho: 42-54% da célula
        let imgW = CELL_W * (0.42 + Math.random() * 0.12);
        let imgH = imgW / ratio;

        const maxH = CELL_H * 0.6;
        if (imgH > maxH) {
            imgH = maxH;
            imgW = imgH * ratio;
        }

        const cellX = cell.c * CELL_W;
        const cellY = cell.r * CELL_H;
        const offsetX = Math.random() * (CELL_W - imgW);
        const offsetY = Math.random() * (CELL_H - imgH);

        const baseX = cellX + offsetX;
        const baseY = cellY + offsetY;

        item.style.left = baseX + "px";
        item.style.top = baseY + "px";
        item.style.width = imgW + "px";
        item.style.height = imgH + "px";

        const img = document.createElement("img");
        img.src = data.src;
        img.alt = `Trabalho de ${data.director}`;
        img.onerror = () => console.error("❌ Falhou:", data.src);
        item.appendChild(img);
        gallery.appendChild(item);

        items.push({
            element: item,
            baseX: baseX,
            baseY: baseY
        });
    });

    // ==========================================
    // DRAG (NAVEGAÇÃO LIVRE E INFINITA)
    // ==========================================
    let targetPanX = 0, targetPanY = 0;
    let currentPanX = 0, currentPanY = 0;

    let isDragging = false;
    let startMouseX = 0, startMouseY = 0;
    let startPanX = 0, startPanY = 0;

    const DRAG_SENSITIVITY = 1.0;

    const isInteractive = (el) =>
        el.closest(".logo-container, .nav-overlay, .filters, .site-footer");

    // ---- MOUSE ----
    window.addEventListener("mousedown", (e) => {
        if (isInteractive(e.target)) return;
        isDragging = true;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        startPanX = targetPanX;
        startPanY = targetPanY;
        document.body.classList.add("grabbing");
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        targetPanX = startPanX + (e.clientX - startMouseX) * DRAG_SENSITIVITY;
        targetPanY = startPanY + (e.clientY - startMouseY) * DRAG_SENSITIVITY;
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.classList.remove("grabbing");
    });

    // ---- TOUCH ----
    window.addEventListener("touchstart", (e) => {
        if (isInteractive(e.target)) return;
        const t = e.touches[0];
        isDragging = true;
        startMouseX = t.clientX;
        startMouseY = t.clientY;
        startPanX = targetPanX;
        startPanY = targetPanY;
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const t = e.touches[0];
        targetPanX = startPanX + (t.clientX - startMouseX) * DRAG_SENSITIVITY;
        targetPanY = startPanY + (t.clientY - startMouseY) * DRAG_SENSITIVITY;
    }, { passive: true });

    window.addEventListener("touchend", () => {
        isDragging = false;
    });

    // ==========================================
    // LOOP DE ANIMAÇÃO — WRAP INFINITO
    // ==========================================
    function loop() {
        currentPanX += (targetPanX - currentPanX) * 0.1;
        currentPanY += (targetPanY - currentPanY) * 0.1;

        items.forEach((item) => {
            const screenX = item.baseX + currentPanX;
            const screenY = item.baseY + currentPanY;

            const n = Math.round((vw / 2 - screenX) / VIRTUAL_W);
            const m = Math.round((vh / 2 - screenY) / VIRTUAL_H);

            gsap.set(item.element, {
                x: currentPanX + n * VIRTUAL_W,
                y: currentPanY + m * VIRTUAL_H,
                force3D: true
            });
        });

        requestAnimationFrame(loop);
    }
    loop();

    // ==========================================
    // PARALLAX NO HOVER
    // ==========================================
    window.addEventListener("mousemove", (e) => {
        if (isDragging) return;

        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        items.forEach((item) => {
            gsap.to(item.element.querySelector("img"), {
                x: mouseX * 8,
                y: mouseY * 8,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });

    // ==========================================
    // FILTROS
    // ==========================================
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;

            items.forEach((item) => {
                const director = item.element.dataset.director;
                if (filter === "all" || director === filter) {
                    item.element.classList.remove("hidden");
                } else {
                    item.element.classList.add("hidden");
                }
            });
        });
    });

});