// scripts/templates/photographerHeader.js

export function createPhotographerHeader(photographer) {
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
