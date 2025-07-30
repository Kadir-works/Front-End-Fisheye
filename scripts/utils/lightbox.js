// scripts/utils/lightbox.js
let currentMediaList = []; // Liste des médias du photographe
let currentIndex = 0; // Index du média actuellement affiché
let photographerName = ""; // Nom du photographe (pour les chemins d'accès)
let lastFocusedElement = null;

// Initialisation de la lightbox (appelée depuis photographer.js)
export function initLightbox(mediaList, initialIndex, name) {
  currentMediaList = mediaList;
  currentIndex = initialIndex;
  photographerName = name; // Nom du photographe pour construire les chemins
  lastFocusedElement = document.activeElement;
  openLightbox(currentMediaList[currentIndex]); // Ouvre la lightbox avec le média actuel
  setupLightboxEventListeners(); // Configure les écouteurs une seule fois
}

function trapFocus(container) {
  const focusableSelectors = [
    "a[href]",
    "area[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "iframe",
    "object",
    "embed",
    "[contenteditable]",
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusableElements = container.querySelectorAll(
    focusableSelectors.join(", ")
  );
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Ouvre la lightbox avec un média spécifique
function openLightbox(media) {
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector(".lightbox-content");

  // Assurez-vous que le titre de la lightbox est mis à jour
  let mediaHTML = "";
  if (media.image) {
    mediaHTML = `<img src="assets/photographers/${photographerName}/${media.image}" alt="${media.title}">`;
  } else if (media.video) {
    mediaHTML = `<video controls src="assets/photographers/${photographerName}/${media.video}"></video>`;
  }

  lightboxContent.innerHTML = `
        ${mediaHTML}
        <h2>${media.title}</h2>
    `;

  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  lightbox.focus(); // Met le focus sur la lightbox pour la navigation clavier
  trapFocus(lightbox); // Piège le focus à l’intérieur de la lightbox
}

// Ferme la lightbox
export function closeLightbox() {
  const lightbox = document.getElementById("lightbox");

  // Redonner le focus à l’élément qui a ouvert la lightbox
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }

  // Ensuite seulement, masquer la lightbox
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}

// Navigue au média suivant
function showNextMedia() {
  currentIndex = (currentIndex + 1) % currentMediaList.length;
  openLightbox(currentMediaList[currentIndex]);
}

// Navigue au média précédent
function showPrevMedia() {
  currentIndex =
    (currentIndex - 1 + currentMediaList.length) % currentMediaList.length;
  openLightbox(currentMediaList[currentIndex]);
}

// Configure les écouteurs d'événements de la lightbox (appelé une seule fois)
function setupLightboxEventListeners() {
  const lightbox = document.getElementById("lightbox"); // Obtenez la lightbox une fois
  if (!lightbox) return; // Si la lightbox n'existe pas, sortez.

  // Écouteurs pour les boutons de navigation
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  const prevBtn = lightbox.querySelector(".lightbox-prev");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", showNextMedia);
  if (prevBtn) prevBtn.addEventListener("click", showPrevMedia);

  // Écouteur pour la navigation au clavier
  document.addEventListener("keydown", (e) => {
    // Vérifie si la lightbox est ouverte
    const isOpen = lightbox.classList.contains("show");
    if (!isOpen) return; // Ne fait rien si la lightbox est fermée

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        showNextMedia();
        break;
      case "ArrowLeft":
        showPrevMedia();
        e.preventDefault();
        break;
      case "Escape":
        closeLightbox();
        e.preventDefault();
        break;
    }
  });
}

setupLightboxEventListeners(); // Appeler une fois au chargement du module
