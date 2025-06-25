// Export de la fonction photographerTemplate pour pouvoir l'importer ailleurs (ex: index.js)
export function photographerTemplate(data) {
  // On extrait les données nécessaires de l'objet "data"
  const { id, name, portrait, city, country, tagline, price } = data;

  // On construit le chemin de la photo de profil du photographe
  const picture = `assets/photographers/portraits/${portrait}`;

  // Fonction qui crée le DOM (HTML) pour afficher un photographe sous forme de carte
  function getUserCardDOM() {
    // On crée un élément <article> pour regrouper toutes les infos du photographe
    const article = document.createElement("article");

    // On crée un lien <a> autour de l'image et du nom pour accéder à la page du photographe
    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`); // URL avec l'ID du photographe
    link.setAttribute("aria-label", `Voir la page de ${name}`); // Accessibilité

    // Création de l'image de profil
    const img = document.createElement("img");
    img.setAttribute("src", picture); // Chemin de l'image
    img.setAttribute("alt", `Portrait de ${name}`); // Texte alternatif pour l'accessibilité

    // Nom du photographe
    const h2 = document.createElement("h2");
    h2.textContent = name;

    // On insère l'image et le nom dans le lien
    link.appendChild(img);
    link.appendChild(h2);

    // On crée un paragraphe pour la localisation (ville, pays)
    const location = document.createElement("p");
    location.classList.add("photographer-location");
    location.textContent = `${city}, ${country}`;

    // On crée un paragraphe pour le slogan (tagline)
    const description = document.createElement("p");
    description.classList.add("photographer-tagline");
    description.textContent = tagline;

    // On crée un paragraphe pour le tarif journalier
    const rate = document.createElement("p");
    rate.classList.add("photographer-price");
    rate.textContent = `${price}€/jour`;

    // On ajoute tous les éléments à l'article
    article.appendChild(link); // Le lien avec image + nom
    article.appendChild(location); // La localisation
    article.appendChild(description); // Le slogan
    article.appendChild(rate); // Le tarif

    // On retourne l'article complet prêt à être inséré dans le HTML
    return article;
  }

  // On retourne un objet contenant les infos utiles et la fonction getUserCardDOM
  return { name, picture, getUserCardDOM };
}
