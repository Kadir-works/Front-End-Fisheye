// scripts/pages/index.js

// Import du template qui crée les cartes de photographes
import { photographerTemplate } from "../templates/photographer.js";

// Fonction pour récupérer les données des photographes depuis le fichier JSON
async function getPhotographers() {
  try {
    // On récupère les données du fichier JSON (chemin à adapter selon ta structure)
    const response = await fetch("data/photographers.json");
    const data = await response.json();

    // On affiche les données dans la console (debug)
    console.log(data.photographers);

    // On retourne la liste des photographes
    return data.photographers;
  } catch (error) {
    console.error("Erreur lors du chargement des photographes :", error);
  }
}

// Fonction pour afficher tous les photographes dans la page d'accueil
async function displayPhotographers(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    // Utilisation du template pour chaque photographe
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

// Fonction d'initialisation de la page
async function init() {
  // On récupère les données
  const photographers = await getPhotographers();
  // On les affiche sur la page
  displayPhotographers(photographers);
}

// On démarre tout
init();
