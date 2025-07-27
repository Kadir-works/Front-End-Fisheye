// scripts/pages/photographer.js

// === Fonctions utilitaires ===
async function fetchData() {
  const response = await fetch("../../data/photographers.json");
  return await response.json();
}

function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// === Imports des autres modules ===
import { mediaFactory } from "../factories/mediaFactory.js";
import { initLikesManager } from "../utils/likesManager.js";
import { setupSort } from "../utils/sortManager.js";
import { initLightbox } from "../utils/lightbox.js";

// === Variables globales ===
let currentPhotographer = null;
let currentMediaList = [];

// === Créer l'en-tête du photographe ===
function createPhotographerHeader(photographer) {
  const header = document.querySelector(".photograph-header");
  header.innerHTML = `
    <div class="photographer-info">
      <h1>${photographer.name}</h1>
      <h2 class="location">${photographer.city}, ${photographer.country}</h2>
      <h3 class="tagline">${photographer.tagline}</h3>
    </div>
    <button class="contact_button" onclick="displayModal('${photographer.name}')">Contactez-moi</button>
    <img src="assets/photographers/portraits/${photographer.portrait}"
         class="photographer-portrait"
         alt="Portrait de ${photographer.name}">
  `;
}

// === Afficher les médias ===
async function displayMedia(mediaData, photographerName) {
  const mediaGallery = document.querySelector(".media-gallery");
  mediaGallery.innerHTML = "";

  mediaData.forEach((media) => {
    const mediaCard = mediaFactory({
      ...media,
      photographerName: photographerName,
    });

    mediaCard.setAttribute("data-id", media.id);

    const mediaElement = mediaCard.querySelector("img, video");
    if (mediaElement) {
      mediaElement.addEventListener("click", () => {
        const initialIndex = mediaData.findIndex((m) => m.id === media.id);
        initLightbox(mediaData, initialIndex, photographerName);
      });

      mediaElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const initialIndex = mediaData.findIndex((m) => m.id === media.id);
          initLightbox(mediaData, initialIndex, photographerName);
        }
      });
    }

    mediaGallery.appendChild(mediaCard);
  });
}

// === Initialisation de la page ===
async function initPhotographerPage() {
  const data = await fetchData();
  const photographerId = getPhotographerIdFromUrl();

  currentPhotographer = data.photographers.find((p) => p.id === photographerId);
  currentMediaList = data.media.filter(
    (m) => m.photographerId === photographerId
  );

  if (currentPhotographer) {
    createPhotographerHeader(currentPhotographer);
    const photographerFolderName = currentPhotographer.name.split(/[- ]/)[0];

    displayMedia(currentMediaList, photographerFolderName);

    initLikesManager(
      currentMediaList,
      currentPhotographer.price,
      displayMedia,
      photographerFolderName
    );

    setupSort(currentMediaList, displayMedia, photographerFolderName);
  } else {
    console.error("Photographe non trouvé.");
    window.location.href = "index.html";
  }
}

// === Démarrage ===
initPhotographerPage();
