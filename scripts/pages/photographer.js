// scripts/pages/photographer.js

// Imports des modules
import { fetchData, getPhotographerIdFromUrl } from "../utils/dataFetcher.js";
import { createPhotographerHeader } from "../templates/photographerHeader.js";
import { mediaFactory } from "../factories/mediaFactory.js";
// Il n'est plus nécessaire d'importer handleLike ici, car il est appelé depuis mediaFactory
import { initLikesManager /*, handleLike */ } from "../utils/likesManager.js";
import { setupSort } from "../utils/sortManager.js";
import { initLightbox, closeLightbox } from "../utils/lightbox.js"; // Importe les fonctions de la lightbox
// Importez displayModal et closeModal de contactForm.js si elles sont utilisées directement ici
// (Elles sont déjà attachées à window, mais une importation explicite est plus propre si on passe par addEventListener)
// import { displayModal, closeModal } from '../utils/contactForm.js'; // Si vous refactorisez les onclick/onsubmit en addEventListener

// Variables d'état globales pour cette page
let currentPhotographer = null;
let currentMediaList = []; // Les médias filtrés pour ce photographe

// --- Fonction pour afficher la galerie de médias ---
async function displayMedia(mediaData, photographerName) {
  const mediaGallery = document.querySelector(".media-gallery");
  mediaGallery.innerHTML = ""; // Vide la galerie avant d'ajouter de nouveaux médias

  mediaData.forEach((media) => {
    // Passez le `photographerName` à mediaFactory pour la construction des chemins
    const mediaCard = mediaFactory({
      ...media,
      photographerName: photographerName,
    });

    // Ajout de l'ID du média comme attribut data-id sur la carte
    // Très important pour pouvoir cibler cette carte spécifiquement lors du like/dé-like
    mediaCard.setAttribute("data-id", media.id);

    // Ajout d'un écouteur d'événements pour ouvrir la lightbox au clic sur l'image/vidéo
    const mediaElement = mediaCard.querySelector("img, video");
    if (mediaElement) {
      mediaElement.addEventListener("click", () => {
        // Trouvez l'index du média cliqué dans la liste actuelle
        const initialIndex = mediaData.findIndex((m) => m.id === media.id);
        initLightbox(mediaData, initialIndex, photographerName);
      });
      // Permettre l'ouverture de la lightbox avec la touche Entrée pour l'accessibilité
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

// --- Fonction d'initialisation de la page du photographe ---
async function initPhotographerPage() {
  // Récupérer les données
  const data = await fetchData();
  const photographerId = getPhotographerIdFromUrl();

  // Trouver le photographe et ses médias
  currentPhotographer = data.photographers.find((p) => p.id === photographerId);
  currentMediaList = data.media.filter(
    (m) => m.photographerId === photographerId
  );

  if (currentPhotographer) {
    // Afficher l'en-tête du photographe
    createPhotographerHeader(currentPhotographer);

    // Calculer le nom du dossier du photographe pour les chemins des médias
    const photographerFolderName = currentPhotographer.name.split(/[- ]/)[0]; // S'assure d'obtenir la première partie du nom sans espaces/tirets

    // Afficher la galerie de médias initiale
    displayMedia(currentMediaList, photographerFolderName);

    // **********************************************
    // MODIFICATION ICI : Passez 'displayMedia' et 'photographerFolderName'
    // à 'initLikesManager' pour qu'il puisse re-rendre la galerie.
    // **********************************************
    initLikesManager(
      currentMediaList,
      currentPhotographer.price,
      displayMedia, // La fonction de rappel
      photographerFolderName // Le nom du dossier
    );

    // Initialiser le gestionnaire de tri
    setupSort(currentMediaList, displayMedia, photographerFolderName); // displayMedia est passé comme callback

    // Gérer l'affichage de la modale de contact
    // Le bouton de contact de la modale est déjà géré via onclick dans le template.
    // Si vous souhaitez utiliser addEventListener, décommentez et adaptez ce bloc :
    // const contactBtn = document.querySelector(".contact_button");
    // if (contactBtn) {
    //     contactBtn.addEventListener("click", () => displayModal(currentPhotographer.name));
    // }
  } else {
    console.error("Photographe non trouvé.");
    // Gérer le cas où le photographe n'existe pas, par exemple rediriger vers la page d'accueil
    window.location.href = "index.html";
  }
}

// Lance l'initialisation de la page
initPhotographerPage();
