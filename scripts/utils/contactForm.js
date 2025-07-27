// scripts/utils/contactForme.js

// écouteur de clavier pour détecter la touche Escape
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
  const mainContent = document.getElementById("main");

  modal.style.display = "block";
  // La modale n'est plus cachée aux lecteurs d'écran lorsqu'elle est ouverte
  modal.removeAttribute("aria-hidden");

  // Rendre le reste du document inaccessible aux lecteurs d'écran
  if (mainContent) {
    // Vérifie si l'élément main existe
    mainContent.setAttribute("aria-hidden", "true");
  }

  // le focus au premier champ du formulaire pour l'accessibilité
  document.getElementById("prenom").focus();

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
  const mainContent = document.getElementById("main"); // Référence au contenu principal

  modal.style.display = "none";
  // La modale est de nouveau cachée aux lecteurs d'écran lorsqu'elle est fermée
  modal.setAttribute("aria-hidden", "true");

  document.removeEventListener("keydown", handleKeyDown);

  // Rendre le reste du document accessible aux lecteurs d'écran
  if (mainContent) {
    // Vérifie si l'élément main existe
    mainContent.removeAttribute("aria-hidden");
  }

  // Réinitialiser le texte pour la prochaine ouverture si nécessaire
  const nameSpan = document.getElementById("photographer-contact-name");
  if (nameSpan) {
    nameSpan.textContent = "";
  }
  const contactButtonOnPage = document.querySelector(".contact_button");
  if (contactButtonOnPage) {
    contactButtonOnPage.focus();
  } else {
    // Si aucun bouton d'ouverture spécifique, mettez le focus sur un élément par défaut
    // Par exemple, le logo du site
    document.querySelector(".logo").focus();
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

  // fermer la modale après l'envoi
  closeModal();

  // Réinitialiser le formulaire
  document.querySelector(".modal form").reset();
}
