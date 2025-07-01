// scripts/factories/mediaFactory.js

import { handleLike } from "../utils/likesManager.js"; // Assurez-vous que cette ligne est présente

export function mediaFactory(mediaData) {
  const { id, image, video, title, likes } = mediaData;
  const mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media-card");
  mediaContainer.setAttribute("data-id", id); // Très important pour retrouver le média

  let mediaElement;

  if (image) {
    mediaElement = document.createElement("img");
    mediaElement.setAttribute(
      "src",
      `assets/photographers/${mediaData.photographerName}/${image}`
    );
    mediaElement.setAttribute("alt", title);
    mediaElement.setAttribute("tabindex", "0");
  } else if (video) {
    mediaElement = document.createElement("video");
    mediaElement.setAttribute(
      "src",
      `assets/photographers/${mediaData.photographerName}/${video}`
    );
    mediaElement.setAttribute("controls", true);
    mediaElement.setAttribute("tabindex", "0");
  }

  const mediaInfo = document.createElement("div");
  mediaInfo.innerHTML = `
        <h3>${title}</h3>
        <div class="likes">
            <span class="like-count">${likes}</span>
            <button class="like-btn" aria-label="like">♥</button>
        </div>
    `;

  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(mediaInfo);

  // === VÉRIFIEZ MINUTIEUSEMENT CE BLOC ===
  const likeButton = mediaInfo.querySelector(".like-btn");
  if (likeButton) {
    likeButton.addEventListener("click", () => {
      // AJOUTEZ CETTE LIGNE ICI :
      console.log("SUCCESS: Clic détecté sur le bouton like pour l'ID:", id);
      handleLike(id);
    });
  } else {
    console.error(
      "Erreur: Le bouton '.like-btn' n'a pas été trouvé pour le média avec l'ID:",
      id
    );
  }
  // =====================================

  return mediaContainer;
}
