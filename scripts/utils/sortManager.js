// scripts/utils/sortManager.js

let currentMediaList = [];
let displayMediaCallback = null;
let photographerName = "";

export function setupSort(mediaList, callback, name) {
  currentMediaList = mediaList;
  displayMediaCallback = callback;
  photographerName = name;

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortMedia(e.target.value);
    });
  }
}

// Fonction de tri
function sortMedia(criteria) {
  switch (criteria) {
    case "popularity":
      currentMediaList.sort((a, b) => b.likes - a.likes);
      break;
    case "date":
      currentMediaList.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "title":
      currentMediaList.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      console.warn("Critère de tri inconnu :", criteria);
  }
  // Après le tri, on appelle la fonction de rappel pour rafraîchir l'affichage
  if (displayMediaCallback) {
    displayMediaCallback(currentMediaList, photographerName);
  }
}
