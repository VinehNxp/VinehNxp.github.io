const WHATSAPP_NUMBER = "5599999999999";

(() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const floatingWhatsApp = document.querySelector("[data-floating-whatsapp]");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const lightboxTitle = document.querySelector("[data-lightbox-title]");
  const lightboxArt = document.querySelector("[data-lightbox-art]");
  let lastFocusedElement = null;

  const getWhatsAppUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  const openWhatsApp = (message) => {
    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  const closeMenu = () => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
    navMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    if (!navToggle || !navMenu) return;
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    navMenu.classList.toggle("is-open", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
  };

  document.querySelectorAll("[data-whatsapp-message]").forEach((element) => {
    const message = element.dataset.whatsappMessage;
    if (!message) return;
    element.setAttribute("href", getWhatsAppUrl(message));
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
  });

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceName = button.dataset.service;
      openWhatsApp(`Olá! Gostaria de agendar o serviço: ${serviceName}.`);
    });
  });

  if (floatingWhatsApp) {
    const message = "Olá! Gostaria de agendar um horário na Barbearia Prime.";
    floatingWhatsApp.href = getWhatsAppUrl(message);
    floatingWhatsApp.target = "_blank";
    floatingWhatsApp.rel = "noopener noreferrer";
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const handleScroll = () => {
    const hasScrolled = window.scrollY > 20;
    header?.classList.toggle("is-scrolled", hasScrolled);
    floatingWhatsApp?.classList.toggle("is-visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((element) => element.classList.add("reveal-pending"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    lastFocusedElement?.focus();
  };

  const openLightbox = (galleryItem) => {
    if (!lightbox || !lightboxTitle || !lightboxArt) return;
    lastFocusedElement = document.activeElement;
    const title = galleryItem.dataset.galleryLabel || "Estilo";
    lightboxTitle.textContent = title;
    lightboxArt.className = `lightbox-art ${galleryItem.className.replace("gallery-item", "").replace("reveal", "").replace("is-visible", "").trim()}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    lightboxClose?.focus();
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });
})();
