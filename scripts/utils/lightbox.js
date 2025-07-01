// scripts/utils/lightbox.js
let currentMediaList = []; // Liste des médias du photographe
let currentIndex = 0; // Index du média actuellement affiché
let photographerName = ""; // Nom du photographe (pour les chemins d'accès)

// Initialisation de la lightbox (appelée depuis photographer.js)
export function initLightbox(mediaList, initialIndex, name) {
  currentMediaList = mediaList;
  currentIndex = initialIndex;
  photographerName = name; // Nom du photographe pour construire les chemins
  openLightbox(currentMediaList[currentIndex]); // Ouvre la lightbox avec le média actuel
  setupLightboxEventListeners(); // Configure les écouteurs une seule fois
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
}

// Ferme la lightbox
export function closeLightbox() {
  // Exportez-la si elle est appelée depuis le HTML (croix)
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  // Optionnel: remettre le focus sur l'élément qui a ouvert la lightbox si possible
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
        showNextMedia();
        break;
      case "ArrowLeft":
        showPrevMedia();
        break;
      case "Escape":
        closeLightbox();
        break;
    }
  });
}

// Premier appel pour configurer les écouteurs d'événements.
// Cela se fera une seule fois au chargement du script.
// Vous pouvez aussi l'appeler via une fonction `init` si vous préférez.
// Pour l'instant, je vais laisser `initLightbox` gérer l'appel `setupLightboxEventListeners`
// afin d'assurer que les éléments sont bien chargés.
// Ou mieux, on appelle setupLightboxEventListeners directement, car les éléments de la lightbox sont statiques.
setupLightboxEventListeners(); // Appeler une fois au chargement du module
