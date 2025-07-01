// scripts/utils/likesManager.js

let currentMediaList = []; // Pour stocker les médias et leurs likes
let photographerPrice = 0; // Pour stocker le prix du photographe
const likedMediaIds = new Set(); // Pour suivre les médias qui ont été "likés" par l'utilisateur
let updateGalleryCallback = null; // NOUVEAU : Pour stocker la fonction de mise à jour de la galerie (displayMedia)
let photographerName = ""; // NOUVEAU : Pour stocker le nom du photographe nécessaire au callback

// Function d'initialisation du gestionnaire de likes
// AJOUTEZ 'callback' et 'name' comme paramètres
export function initLikesManager(mediaList, price, callback, name) {
  currentMediaList = mediaList;
  photographerPrice = price;
  updateGalleryCallback = callback; // Stocke la fonction displayMedia
  photographerName = name; // Stocke le nom du photographe
  updateStatsFooter(); // Affiche le total initial
}

// Gère le clic sur un bouton "like"
export function handleLike(mediaId) {
  console.log("handleLike a été appelée pour l'ID:", mediaId);

  const media = currentMediaList.find((m) => m.id === mediaId);
  if (!media) {
    console.error("Média non trouvé avec l'ID:", mediaId);
    return;
  }
  console.log("Média trouvé:", media);

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
  console.log("Éléments DOM trouvés:", { likeCountElement, likeButton });

  if (likedMediaIds.has(mediaId)) {
    // Le média a déjà été liké, on dé-like
    media.likes--;
    likedMediaIds.delete(mediaId);
    likeButton.classList.remove("is-liked"); // Mise à jour immédiate (sera écrasée par le re-rendu)
    console.log(
      "Média dé-liké. Nouveaux likes:",
      media.likes,
      "likedMediaIds:",
      Array.from(likedMediaIds)
    );
  } else {
    // Le média n'a pas encore été liké, on like
    media.likes++;
    likedMediaIds.add(mediaId);
    likeButton.classList.add("is-liked"); // Mise à jour immédiate (sera écrasée par le re-rendu)
    console.log(
      "Média liké. Nouveaux likes:",
      media.likes,
      "likedMediaIds:",
      Array.from(likedMediaIds)
    );
  }

  // Mettre à jour l'affichage du like sur la carte spécifique
  // Cette ligne n'est plus strictement nécessaire pour la persistance,
  // car le re-rendu complet va la mettre à jour, mais elle aide à la réactivité immédiate.
  likeCountElement.textContent = media.likes;
  console.log(
    "Affichage mis à jour pour l'ID",
    mediaId,
    "avec",
    media.likes,
    "likes."
  );

  // **********************************************
  // NOUVEAU : Appelle la fonction de rappel pour re-rendre la galerie entière
  // Ceci garantit que les nombres et les styles sont mis à jour
  // à partir des données `currentMediaList` qui sont maintenant correctes.
  // **********************************************
  if (updateGalleryCallback) {
    updateGalleryCallback(currentMediaList, photographerName);
    console.log("Re-rendu de la galerie déclenché.");
  }

  updateStatsFooter(); // Met à jour le total des likes dans le pied de page
  console.log("Pied de page mis à jour.");
}

// Met à jour l'affichage du total des likes et du prix dans le pied de page
function updateStatsFooter() {
  const totalLikesSpan = document.querySelector(
    ".photographer-stats .total-likes"
  );
  const pricePerDaySpan = document.querySelector(
    ".photographer-stats .price-per-day"
  );

  if (totalLikesSpan) {
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
