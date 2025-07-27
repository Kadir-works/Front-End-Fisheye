//  écouteur de clavier pour détecter la touche Escape
function handleKeyDown(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

// tabulation limitée aux champs et boutons de la modale
function trapFocus(modal) {
  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = modal.querySelectorAll(focusableSelectors);
  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });
}
/* eslint-disable no-unused-vars */
function displayModal(photographerName = "") {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  // le focus au premier champ du formulaire pour l'accessibilité
  document.getElementById("prenom").focus();
  // Rendre le reste du document inaccessible aux lecteurs d'écran
  document.getElementById("main").setAttribute("aria-hidden", "true");
  document.addEventListener("keydown", handleKeyDown);
  trapFocus(modal);
  // Mettre à jour le nom du photographe dans le titre de la modale
  const nameSpan = document.getElementById("photographer-contact-name");
  if (nameSpan) {
    nameSpan.textContent = photographerName;
  }
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  document.removeEventListener("keydown", handleKeyDown);
  // Réinitialiser le texte pour la prochaine ouverture si nécessaire
  const nameSpan = document.getElementById("photographer-contact-name");
  if (nameSpan) {
    nameSpan.textContent = "";
  }
}

// Empêche le comportement par défaut de soumission du formulaire (rechargement de page)
/* eslint-disable no-unused-vars */
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
