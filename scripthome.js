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
    // TÚNEL 3D
    // ==========================================
    const config = {
        totalImages: 15,
        gap: 800,
        speed: 1.5,
        lerp: 0.08,
        exitPoint: 600,
        curveFactor: 0.18
    };

    const mediaData = [
        "https://cdn.phototourl.com/free/2026-09-15-c0113818-942d-4b05-bcb7-294d8ae67978.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-bfc3294d-86dc-4b0e-a20d-3c0ea74f2971.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-68d104e8-7095-423d-b640-624719be78cc.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-fc53d80b-22e5-4084-bfbb-350d10d68c6b.jpg",
        "https://cdn.phototourl.com/free/2026-09-15-0f1c44fc-81f8-4f72-854b-e1decc2ba8fc.jpg"
    ];

    const tunnelScene = document.getElementById("tunnel-scene");
    const cards = [];
    const tunnelDepth = config.totalImages * config.gap;
    const visibleDepth = 4 * config.gap;

    for (let i = 0; i < config.totalImages; i++) {
        const card = document.createElement("div");
        card.classList.add("video-card");

        const img = document.createElement("img");
        const caminho = mediaData[i % mediaData.length];
        img.src = caminho;
        img.alt = `Imagem ${i + 1}`;

        img.onload = () => console.log("✅ Carregou:", caminho);
        img.onerror = () => console.error("❌ FALHOU:", caminho);

        card.appendChild(img);
        tunnelScene.appendChild(card);

        cards.push({
            element: card,
            baseZ: -i * config.gap,
            currentZ: -i * config.gap
        });
    }

    let targetScroll = 0;
    let currentScroll = 0;

    window.addEventListener("wheel", (e) => {
        targetScroll += e.deltaY * config.speed;
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        targetScroll += deltaY * config.speed * 2;
        touchStartY = touchY;
    }, { passive: true });

    // Função de cálculo de opacidade — fade APENAS nas extremidades
    function calculateOpacity(z) {
    // z positivo = a passar a câmara (fade out rápido só no final)
    if (z > config.exitPoint) return 0;
    if (z > 0) {
        // Fade out apenas nos últimos 200px antes de sair
        const fadeOutStart = config.exitPoint * 0.4;
        if (z < fadeOutStart) return 1;
        return 1 - ((z - fadeOutStart) / (config.exitPoint - fadeOutStart));
    }

    // z negativo = a vir do fundo (fade in apenas no início)
    if (z > -visibleDepth) {
        // Fade in apenas nos primeiros 400px ao entrar
        const fadeInEnd = -visibleDepth + 400;
        if (z > fadeInEnd) return 1;
        return 1 - ((fadeInEnd - z) / 400);
    }

    return 0;
}

    gsap.ticker.add(() => {
        currentScroll += (targetScroll - currentScroll) * config.lerp;

        cards.forEach((cardObj) => {
            let z = cardObj.baseZ + currentScroll;

            if (z > config.exitPoint) {
                const offset = Math.ceil((z - config.exitPoint) / tunnelDepth) * tunnelDepth;
                cardObj.baseZ -= offset;
                z = cardObj.baseZ + currentScroll;
            }

            const opacity = calculateOpacity(z);
            const yOffset = z * config.curveFactor;
            const rotX = -(z / tunnelDepth) * 25;

            gsap.set(cardObj.element, {
                z: z,
                y: yOffset,
                rotationX: rotX,
                opacity: opacity,
                force3D: true,
                visibility: (opacity <= 0.01) ? "hidden" : "visible"
            });
        });
    });

});