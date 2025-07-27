// scripts/utils/likesManager.js

// Liste de tous les médias, incluant leurs informations de likes.
let currentMediaList = [];
// Prix du photographe par jour, affiché dans le pied de page.
let photographerPrice = 0;
// Ensemble des IDs des médias que l'utilisateur a "likés" durant la session.
const likedMediaIds = new Set();
// Fonction de rappel (callback) pour rafraîchir l'affichage de la galerie.
let updateGalleryCallback = null;
// Nom du photographe, utilisé par la fonction de rappel pour le re-rendu de la galerie.
let photographerName = "";

/**
 * Initialise le gestionnaire de likes avec les données nécessaires.
 * @param {Array<Object>} mediaList - La liste des objets média (photos/vidéos).
 * @param {number} price - Le prix journalier du photographe.
 * @param {Function} callback - La fonction à appeler pour mettre à jour l'affichage de la galerie.
 * @param {string} name - Le nom du photographe.
 */
export function initLikesManager(mediaList, price, callback, name) {
  currentMediaList = mediaList;
  photographerPrice = price;
  updateGalleryCallback = callback;
  photographerName = name;
  updateStatsFooter(); // Met à jour le pied de page dès l'initialisation.
}

/**
 * Gère l'événement de clic sur un bouton "like" pour un média spécifique.
 * Incrémente ou décrémente le nombre de likes et met à jour l'interface.
 * @param {number} mediaId - L'ID unique du média liké/déliké.
 */
export function handleLike(mediaId) {
  const media = currentMediaList.find((m) => m.id === mediaId);
  if (!media) {
    console.error("Média non trouvé avec l'ID:", mediaId);
    return;
  }

  const likeCountElement = document.querySelector(
    `.media-card[data-id="${mediaId}"] .like-count`
  );
  const likeButton = document.querySelector(
    `.media-card[data-id="${mediaId}"] .like-btn`
  );

  if (!likeCountElement || !likeButton) {
    console.error("Éléments de like introuvables pour le média:", mediaId);
    return;
  }

  if (likedMediaIds.has(mediaId)) {
    // Le média a déjà été liké, on le dé-like.
    media.likes--;
    likedMediaIds.delete(mediaId);
    likeButton.classList.remove("is-liked");
  } else {
    // Le média n'a pas encore été liké, on le like.
    media.likes++;
    likedMediaIds.add(mediaId);
    likeButton.classList.add("is-liked");
  }

  // Appelle la fonction de rappel pour re-rendre la galerie complète.
  // Cela assure que les compteurs de likes et les styles sont correctement mis à jour.
  if (updateGalleryCallback) {
    updateGalleryCallback(currentMediaList, photographerName);
  }

  updateStatsFooter(); // Met à jour le total des likes dans le pied de page.
}

/**
 * Met à jour l'affichage du total des likes et du prix journalier
 * dans le pied de page de la galerie.
 */
function updateStatsFooter() {
  const totalLikesSpan = document.querySelector(
    ".photographer-stats .total-likes"
  );
  const pricePerDaySpan = document.querySelector(
    ".photographer-stats .price-per-day"
  );

  if (totalLikesSpan) {
    // Calcule le total de tous les likes cumulés pour tous les médias.
    const totalLikes = currentMediaList.reduce(
      (sum, media) => sum + media.likes,
      0
    );
    totalLikesSpan.textContent = totalLikes;
  }

  if (pricePerDaySpan) {
    pricePerDaySpan.textContent = `${photographerPrice}€ / jour`;
  }
}
