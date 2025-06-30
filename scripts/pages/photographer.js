// === FILE: scripts/pages/photographer.js ===
// Ce fichier gère l'affichage complet de la page photographer.html
// Il inclut : chargement des données, affichage du photographe, tri des médias, likes, lightbox

// === 1. Récupérer les données JSON ===
async function fetchData() {
  const response = await fetch("../../data/photographers.json");
  return await response.json();
}

// === 2. Récupérer l'ID du photographe depuis l'URL ===
function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// === 3. Afficher l'en-tête du photographe ===
function createPhotographerHeader(photographer) {
  const header = document.querySelector(".photograph-header");
  header.innerHTML = `
    <div class="photographer-info">
      <h1>${photographer.name}</h1>
      <p class="location">${photographer.city}, ${photographer.country}</p>
      <p class="tagline">${photographer.tagline}</p>
    </div>
    <button class="contact_button" onclick="displayModal('${photographer.name}')">Contactez-moi</button>
    <img src="assets/photographers/portraits/${photographer.portrait}" 
         class="photographer-portrait" 
         alt="Portrait de ${photographer.name}">
  `;
}

// === 4. Générer la galerie des médias ===
function displayMedia(mediaList, photographerFirstName) {
  const gallery = document.querySelector(".media-gallery");
  gallery.innerHTML = "";

  mediaList.forEach((media, index) => {
    const filePath = media.image
      ? `assets/photographers/${photographerFirstName}/${media.image}`
      : `assets/photographers/${photographerFirstName}/${media.video}`;

    const mediaTag = media.image
      ? `<img src="${filePath}" alt="${media.title}" tabindex="0">`
      : `<video tabindex="0"><source src="${filePath}" type="video/mp4">${media.title}</video>`;

    const article = document.createElement("article");
    article.className = "media-card";
    article.innerHTML = `
      ${mediaTag}
      <div class="media-info">
        <h2>${media.title}</h2>
        <div class="likes">
          <span class="like-count">${media.likes}</span>
          <button class="like-button" aria-label="Liker ${media.title}">♥</button>
        </div>
      </div>
    `;

    // Clic pour ouvrir dans lightbox
    article
      .querySelector("img, video")
      .addEventListener("click", () =>
        openLightbox(media, mediaList, index, photographerFirstName)
      );

    // Clic sur le bouton like
    article.querySelector(".like-button").addEventListener("click", (e) => {
      const likeButton = e.currentTarget;
      const likeCount = article.querySelector(".like-count");
      let count = parseInt(likeCount.textContent);

      const isLiked = likeButton.classList.contains("liked");

      if (isLiked) {
        count--;
        likeButton.classList.remove("liked");
      } else {
        count++;
        likeButton.classList.add("liked");
      }

      likeCount.textContent = count;
      updateTotalLikes();
    });

    gallery.appendChild(article);
  });
}

// === 5. Tri des médias ===
function sortMedia(mediaList, criteria) {
  switch (criteria) {
    case "popularity":
      return mediaList.sort((a, b) => b.likes - a.likes);
    case "date":
      return mediaList.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "title":
      return mediaList.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return mediaList;
  }
}

// === 6. Mettre à jour le total des likes ===
function updateTotalLikes() {
  const likeSpans = document.querySelectorAll(".like-count");
  let total = 0;
  likeSpans.forEach((span) => (total += parseInt(span.textContent)));
  // Affichage futur du total si prévu dans la maquette (ex: à droite du prix)
}

// === 8. Initialisation de la page ===
async function init() {
  const { photographers, media } = await fetchData();
  const photographerId = getPhotographerIdFromUrl();

  const photographer = photographers.find((p) => p.id === photographerId);
  const mediaList = media.filter((m) => m.photographerId === photographerId);

  if (photographer) {
    photographer.firstName = photographer.name.split(" ")[0];
    createPhotographerHeader(photographer);

    // Tri par défaut : popularité
    const defaultSorted = sortMedia(mediaList, "popularity");
    displayMedia(defaultSorted, photographer.firstName);

    // Gérer le tri via le menu déroulant
    const select = document.getElementById("sort-select");
    select.addEventListener("change", () => {
      const sorted = sortMedia([...mediaList], select.value);
      displayMedia(sorted, photographer.firstName);
    });
  } else {
    document.getElementById("main").innerHTML =
      "<p>Photographe introuvable</p>";
  }
}

// === 9. Lancement du script ===
init();

let currentIndex = 0;
let currentMediaList = [];
let currentPhotographerFolder = "";

// Ouvre la lightbox avec un média donné
function openLightbox(media, mediaList, index, folder) {
  currentIndex = index;
  currentMediaList = mediaList;
  currentPhotographerFolder = folder;

  const lightbox = document.getElementById("lightbox");
  const content = document.querySelector(".lightbox-content");

  const filePath = media.image
    ? `assets/photographers/${folder}/${media.image}`
    : `assets/photographers/${folder}/${media.video}`;

  const mediaHTML = media.image
    ? `<img src="${filePath}" alt="${media.title}">`
    : `<video controls autoplay><source src="${filePath}" type="video/mp4"></video>`;

  content.innerHTML = `
    ${mediaHTML}
    <h2>${media.title}</h2>
  `;

  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  lightbox.focus();
}

// Ferme la lightbox
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}

// Navigue dans les médias
function showNextMedia() {
  currentIndex = (currentIndex + 1) % currentMediaList.length;
  openLightbox(
    currentMediaList[currentIndex],
    currentMediaList,
    currentIndex,
    currentPhotographerFolder
  );
}

function showPrevMedia() {
  currentIndex =
    (currentIndex - 1 + currentMediaList.length) % currentMediaList.length;
  openLightbox(
    currentMediaList[currentIndex],
    currentMediaList,
    currentIndex,
    currentPhotographerFolder
  );
}

// Événements lightbox
document
  .querySelector(".lightbox-close")
  .addEventListener("click", closeLightbox);
document
  .querySelector(".lightbox-next")
  .addEventListener("click", showNextMedia);
document
  .querySelector(".lightbox-prev")
  .addEventListener("click", showPrevMedia);
document.addEventListener("keydown", (e) => {
  const isOpen = document.getElementById("lightbox").classList.contains("show");
  if (!isOpen) return;

  if (e.key === "ArrowRight") showNextMedia();
  if (e.key === "ArrowLeft") showPrevMedia();
  if (e.key === "Escape") closeLightbox();
});
