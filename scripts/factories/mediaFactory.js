// scripts/factories/mediaFactory.js

// Importe la fonction 'handleLike' depuis le gestionnaire de likes.
// Cette fonction sera appelée quand un utilisateur cliquera sur le bouton "J'aime".
import { handleLike } from "../utils/likesManager.js";

/**
 * Fonction usine (factory) pour créer un élément HTML représentant un média (image ou vidéo).
 * @param {object} mediaData - Les données du média (id, image, video, title, likes, photographerName).
 * @returns {HTMLElement} L'élément div HTML complet représentant la carte du média.
 */
export function mediaFactory(mediaData) {
  // Extrait les propriétés nécessaires de l'objet mediaData pour un accès plus facile.
  const { id, image, video, title, likes } = mediaData;

  // Crée le conteneur principal pour la carte du média.
  const mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media-card"); // Ajoute une classe pour le style CSS.
  mediaContainer.setAttribute("data-id", id); // Ajoute un attribut data-id pour identifier le média.

  let mediaElement; // Déclare une variable pour stocker l'élément img ou video.

  // Vérifie si le média est une image ou une vidéo et crée l'élément HTML approprié.
  if (image) {
    mediaElement = document.createElement("img");
    // Construit le chemin de l'image en utilisant le nom du photographe (du dossier).
    mediaElement.setAttribute(
      "src",
      `assets/photographers/${mediaData.photographerName}/${image}`
    );
    mediaElement.setAttribute("alt", title); // Texte alternatif pour l'accessibilité.
    mediaElement.setAttribute("tabindex", "0"); // Rend l'image focusable au clavier.
  } else if (video) {
    mediaElement = document.createElement("video");
    // Construit le chemin de la vidéo.
    mediaElement.setAttribute(
      "src",
      `assets/photographers/${mediaData.photographerName}/${video}`
    );
    mediaElement.setAttribute("controls", true); // Affiche les contrôles de lecture/pause.
    mediaElement.setAttribute("tabindex", "0"); // Rend la vidéo focusable au clavier.
  }

  // Crée le conteneur pour les informations du média (titre et likes).
  const mediaInfo = document.createElement("div");
  mediaInfo.classList.add("media-info"); // Ajoute une classe pour le style.
  // Utilise innerHTML pour insérer le titre, le compteur de likes et le bouton de like.
  mediaInfo.innerHTML = `
        <h3>${title}</h3>
        <div class="likes">
            <span class="like-count">${likes}</span>
            <button class="like-btn" aria-label="like">♥</button>
        </div>
    `;

  // Ajoute l'élément média (image/vidéo) et les informations au conteneur principal.
  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(mediaInfo);

  // Trouve le bouton "J'aime" à l'intérieur de la carte média.
  const likeButton = mediaInfo.querySelector(".like-btn");
  if (likeButton) {
    // Ajoute un écouteur d'événement au bouton "J'aime".
    // Quand il est cliqué, appelle la fonction handleLike avec l'ID du média.
    likeButton.addEventListener("click", () => {
      handleLike(id);
    });
  } else {
    // Affiche une erreur si le bouton de like n'est pas trouvé (pour le débogage).
    console.error(
      "Erreur: Le bouton '.like-btn' n'a pas été trouvé pour le média avec l'ID:",
      id
    );
  }

  // Retourne le conteneur complet de la carte média, prêt à être ajouté au DOM.
  return mediaContainer;
}
