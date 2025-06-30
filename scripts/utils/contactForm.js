function displayModal(photographerName = "") {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  // Optionnel: Ajouter le focus au premier champ du formulaire pour l'accessibilité
  document.getElementById("prenom").focus();
  // Optionnel: Rendre le reste du document inaccessible aux lecteurs d'écran
  //   document.getElementById("main").setAttribute("aria-hidden", "true");
  // Mettre à jour le nom du photographe dans le titre de la modale
  const nameSpan = document.getElementById("photographer-contact-name");
  if (nameSpan) {
    nameSpan.textContent = photographerName;
  }
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  //   document.getElementById("main").setAttribute("aria-hidden", "false");
  // Réinitialiser le texte pour la prochaine ouverture si nécessaire
  const nameSpan = document.getElementById("photographer-contact-name");
  if (nameSpan) {
    nameSpan.textContent = "";
  }
}

// Empêche le comportement par défaut de soumission du formulaire (rechargement de page)
function submitForm(event) {
  event.preventDefault();

  // Récupère les éléments du formulaire
  const prenom = document.getElementById("prenom").value;
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Affiche les valeurs dans la console
  console.log("--- Données du formulaire de contact ---");
  console.log("Prénom :", prenom);
  console.log("Nom :", nom);
  console.log("Email :", email);
  console.log("Message :", message);
  console.log("-------------------------------------");

  //  fermer la modale après l'envoi
  closeModal();

  //  Réinitialiser le formulaire
  document.querySelector(".modal form").reset();
}
