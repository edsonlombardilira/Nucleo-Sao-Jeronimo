/* =========================================================
   NÚCLEO SÃO JERÔNIMO — SCRIPT PRINCIPAL
   ---------------------------------------------------------
   Responsabilidades:
   1. Menu mobile
   2. Carrossel do Hero
   3. Ano automático do rodapé

   O script foi mantido sem bibliotecas externas.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. ANO AUTOMÁTICO
       ===================================================== */

    document.querySelectorAll("[data-year]").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================================
       02. MENU MOBILE
       ===================================================== */

    const mobileToggle = document.querySelector(".mobile-toggle");
    const menu = document.querySelector(".menu");

    if (mobileToggle && menu) {

        const closeMenu = () => {
            menu.classList.remove("open");
            mobileToggle.setAttribute("aria-expanded", "false");
            mobileToggle.setAttribute("aria-label", "Abrir menu");
        };

        mobileToggle.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("open");

            mobileToggle.setAttribute("aria-expanded", String(isOpen));
            mobileToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        });

        /* Fecha o menu depois que o usuário escolhe uma opção. */
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        /* Fecha o menu ao clicar fora dele. */
        document.addEventListener("click", (event) => {
            if (
                menu.classList.contains("open") &&
                !menu.contains(event.target) &&
                !mobileToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        /* Fecha o menu com ESC. */
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }


    /* =====================================================
       03. CARROSSEL DO HERO
       ===================================================== */

    const carousel = document.querySelector(".hero-carousel");

    if (!carousel) {
        return;
    }

    const slides = [...carousel.querySelectorAll(".hero-slide")];
    const dots = [...carousel.querySelectorAll(".hero-dot")];
    const previousButton = carousel.querySelector(".hero-prev");
    const nextButton = carousel.querySelector(".hero-next");

    if (!slides.length) {
        return;
    }

    let currentSlide = 0;
    let autoPlayTimer = null;

    /*
       Troca a imagem mantendo o texto e os botões
       exatamente no mesmo lugar.
    */
    const showSlide = (index) => {

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === currentSlide);
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === currentSlide;

            dot.classList.toggle("is-active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const previousSlide = () => {
        showSlide(currentSlide - 1);
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayTimer = window.setInterval(nextSlide, 6000);
    };

    const stopAutoPlay = () => {
        if (autoPlayTimer) {
            window.clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    };

    /* Setas */
    nextButton?.addEventListener("click", () => {
        nextSlide();
        startAutoPlay();
    });

    previousButton?.addEventListener("click", () => {
        previousSlide();
        startAutoPlay();
    });

    /* Indicadores */
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    /*
       Pausa quando o mouse está sobre o Hero.
       Isso evita que a imagem troque enquanto a pessoa
       está tentando ler o conteúdo.
    */
    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    /* Pausa quando o teclado entra no Hero. */
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            startAutoPlay();
        }
    });

    /*
       Suporte a teclado:
       ← imagem anterior
       → próxima imagem
    */
    carousel.addEventListener("keydown", (event) => {

        if (event.key === "ArrowLeft") {
            previousSlide();
            startAutoPlay();
        }

        if (event.key === "ArrowRight") {
            nextSlide();
            startAutoPlay();
        }
    });

    /* Respeita a preferência do sistema por menos movimento. */
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
        startAutoPlay();
    }
});
