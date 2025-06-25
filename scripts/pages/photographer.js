async function fetchData() {
  const response = await fetch("../../data/photographers.json");
  return await response.json();
}

function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

function createPhotographerHeader(photographer) {
  const header = document.querySelector(".photograph-header");
  header.innerHTML = `
    <div class="photographer-info">
      <h1>${photographer.name}</h1>
      <p>${photographer.city}, ${photographer.country}</p>
      <p>${photographer.tagline}</p>
    </div>
    <img src="assets/photographers/portraits/${photographer.portrait}" 
         class="photographer-portrait" 
         alt="Portrait de ${photographer.name}">
    <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
  `;
}

function createGallery(mediaList, photographerFirstName) {
  const gallery = document.createElement("section");
  gallery.className = "media-gallery";

  mediaList.forEach((media) => {
    const filePath = media.image
      ? `assets/photographers/${photographerFirstName}/${media.image}`
      : `assets/photographers/${photographerFirstName}/${media.video}`;

    const mediaTag = media.image
      ? `<img src="${filePath}" alt="${media.title}" tabindex="0">`
      : `<video controls tabindex="0">
           <source src="${filePath}" type="video/mp4">
           ${media.title}
         </video>`;

    gallery.innerHTML += `
      <article class="media-card" data-id="${media.id}">
        ${mediaTag}
        <div class="media-info">
          <h2>${media.title}</h2>
          <div class="likes">
            <span class="like-count">${media.likes}</span>
            <button class="like-button" aria-label="Liker ${media.title}">♥</button>
          </div>
        </div>
      </article>
    `;
  });

  document.getElementById("main").appendChild(gallery);
}

async function init() {
  const { photographers, media } = await fetchData();
  const photographerId = getPhotographerIdFromUrl();
  const photographer = photographers.find((p) => p.id === photographerId);
  const mediaList = media.filter((m) => m.photographerId === photographerId);

  if (photographer) {
    photographer.firstName = photographer.name.split(" ")[0]; // pour accéder au dossier Mimi/, Tracy/, etc.
    createPhotographerHeader(photographer);
    createGallery(mediaList, photographer.firstName);
  } else {
    document.getElementById("main").innerHTML =
      "<p>Photographe introuvable</p>";
  }
}

init();
