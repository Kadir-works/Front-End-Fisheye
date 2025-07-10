// scripts/utils/sortManager.js

// Variables globales pour stocker la liste des médias, la fonction de rappel pour l'affichage
// et le nom du photographe. Elles sont initialisées par setupSort.
let currentMediaList = [];
let displayMediaCallback = null;
let photographerName = "";

// Variables pour les éléments du DOM du sélecteur personnalisé.
// Déclarées avec 'let' pour être accessibles dans toutes les fonctions imbriquées
// et pour permettre de les assigner une fois que le DOM est prêt.
let customSelectWrapper = null;
let customSelectTrigger = null;
let customOptionsList = null;
let customOptions = null; // NodeList de toutes les options <li> du sélecteur
let currentlySelectedOption = null; // Référence à l'élément <li> actuellement sélectionné
let arrowIconElement = null; // Référence à l'élément image/icône de la flèche
let triggerTextElement = null;
/**
 * Initialise le gestionnaire de tri pour les médias.
 * Configure le comportement du menu déroulant personnalisé.
 * @param {Array} mediaList - La liste des médias à trier.
 * @param {Function} callback - La fonction à appeler après le tri pour rafraîchir l'affichage.
 * @param {string} name - Le nom du photographe (utilisé pour le chemin des médias si nécessaire).
 */
export function setupSort(mediaList, callback, name) {
  // Met à jour les variables globales avec les données passées
  currentMediaList = mediaList;
  displayMediaCallback = callback;
  photographerName = name;

  // --- Sélection des éléments du DOM pour le sélecteur personnalisé ---
  customSelectWrapper = document.querySelector(".custom-select-wrapper");
  customSelectTrigger = document.querySelector(".custom-select-trigger");
  customOptionsList = document.querySelector(".custom-options-list");
  customOptions = document.querySelectorAll(".custom-option");
  arrowIconElement = customSelectTrigger.querySelector(".arrow-icon"); // Sélectionne votre image SVG existante

  // Vérification que tous les éléments nécessaires sont présents dans le DOM
  if (
    !customSelectWrapper ||
    !customSelectTrigger ||
    !customOptionsList ||
    customOptions.length === 0 ||
    !arrowIconElement
  ) {
    console.error(
      "Erreur : Un ou plusieurs éléments du sélecteur personnalisé n'ont pas été trouvés. " +
        "Vérifiez votre HTML (classes, IDs) et l'ordre d'exécution de votre JS."
    );
    return; // Arrête l'exécution si les éléments clés sont manquants
  }

  // --- LOG DE DÉBOGAGE : Confirme que les éléments sont trouvés ---
  console.log("Sélecteur de tri trouvé et initialisé :", {
    wrapper: customSelectWrapper,
    trigger: customSelectTrigger,
    list: customOptionsList,
    optionsCount: customOptions.length,
    arrow: arrowIconElement,
  });

  // --- Initialisation de l'état du sélecteur au chargement de la page ---
  // Tente de trouver l'option marquée comme 'selected' dans le HTML (par défaut "Popularité")
  currentlySelectedOption = customOptionsList.querySelector(
    ".custom-option.selected"
  );

  if (currentlySelectedOption) {
    // Si une option est trouvée avec la classe 'selected'
    // Met à jour le texte affiché dans le déclencheur (trigger) avec le texte de cette option.
    // On s'assure de ne pas écraser l'élément SVG de la flèche en insérant le texte avant l'icône.
    // OU en ciblant un span spécifique si le texte est enveloppé.
    // Option 1: Insérer le texte au début du trigger (plus simple si le texte est seul)
    customSelectTrigger.prepend(
      document.createTextNode(currentlySelectedOption.textContent.trim() + " ")
    );

    // Option 2 (plus robuste si le texte est dans un span, par exemple):
    // const triggerTextSpan = customSelectTrigger.querySelector(".trigger-text"); // ex: <span class="trigger-text"></span>
    // if (triggerTextSpan) triggerTextSpan.textContent = currentlySelectedOption.textContent.trim();

    // Cache l'option initialement sélectionnée de la liste déroulante
    currentlySelectedOption.style.display = "none";
    currentlySelectedOption.setAttribute("aria-selected", "true"); // Pour l'accessibilité
  } else {
    // Si aucune option n'a la classe 'selected', considère la première option comme sélectionnée par défaut
    currentlySelectedOption = customOptions[0];
    currentlySelectedOption.classList.add("selected"); // Ajoute la classe 'selected'
    customSelectTrigger.prepend(
      document.createTextNode(currentlySelectedOption.textContent.trim() + " ")
    );
    currentlySelectedOption.style.display = "none"; // Cache l'option sélectionnée
    currentlySelectedOption.setAttribute("aria-selected", "true"); // Pour l'accessibilité
  }

  // Ajoute un tabindex au trigger pour le rendre focusable si ce n'est pas déjà fait dans le HTML
  if (!customSelectTrigger.hasAttribute("tabindex")) {
    customSelectTrigger.setAttribute("tabindex", "0");
  }
  customSelectTrigger.setAttribute("aria-haspopup", "listbox"); // Indique que c'est un menu déroulant
  customSelectTrigger.setAttribute("aria-expanded", "false"); // Par défaut, le menu est fermé
  customOptionsList.setAttribute("role", "listbox"); // Indique que c'est une liste de sélection
  customOptionsList.setAttribute("aria-hidden", "true"); // Par défaut, la liste est cachée pour les lecteurs d'écran

  customOptions.forEach((option) => {
    option.setAttribute("role", "option"); // Chaque option est un rôle "option"
    // tabindex="-1" permet de rendre l'option focusable via JS, mais pas par la tabulation normale
    option.setAttribute("tabindex", "-1");
  });

  // --- Gestion de l'ouverture/fermeture du sélecteur au clic sur le déclencheur (trigger) ---
  customSelectTrigger.addEventListener("click", () => {
    // Bascule la classe 'open' sur le wrapper pour contrôler l'affichage via CSS
    const isOpen = customSelectWrapper.classList.toggle("open");

    // Met à jour les attributs ARIA pour l'accessibilité (indique si le menu est ouvert/fermé)
    customSelectTrigger.setAttribute("aria-expanded", isOpen);
    customOptionsList.setAttribute("aria-hidden", !isOpen);

    if (isOpen) {
      // Si le menu s'ouvre :
      // Cache l'option actuellement sélectionnée dans la liste pour éviter la redondance
      if (currentlySelectedOption) {
        currentlySelectedOption.style.display = "none";
      }
      // Rend toutes les autres options visibles (au cas où elles auraient été cachées)
      customOptions.forEach((option) => {
        if (option !== currentlySelectedOption) {
          option.style.display = "block"; // 'list-item' est aussi une bonne valeur pour les <li>
          option.setAttribute("tabindex", "0"); // Rend l'option focusable si elle est visible
        }
      });
      // Déplace le focus sur la première option visible pour l'accessibilité au clavier
      const firstVisibleOption = customOptionsList.querySelector(
        ".custom-option[style*='display: block'], .custom-option:not([style*='display: none'])"
      );
      if (firstVisibleOption) {
        firstVisibleOption.focus();
      }
    } else {
      // Si le menu se ferme :
      // Rend l'option actuellement sélectionnée visible à nouveau dans la liste (si elle était cachée)
      // C'est important pour le cas où le menu est ouvert puis fermé sans sélection,
      // ou si l'utilisateur rouvre le menu et veut voir toutes les options.
      if (currentlySelectedOption) {
        currentlySelectedOption.style.display = "block"; // 'list-item'
        currentlySelectedOption.setAttribute("tabindex", "-1"); // Retire le tabindex si elle est cachée par le JS
      }
      // S'assure que toutes les options (sauf la sélectionnée) sont à nouveau non-focusables par tabulation si le menu est fermé
      customOptions.forEach((option) => {
        if (option !== currentlySelectedOption) {
          option.setAttribute("tabindex", "-1");
        }
      });
    }
  });

  // --- Gestion de la fermeture du sélecteur si un clic se produit en dehors ---
  document.addEventListener("click", (e) => {
    // Vérifie si le clic n'est pas à l'intérieur du sélecteur ET si le sélecteur est ouvert
    if (
      !customSelectWrapper.contains(e.target) &&
      customSelectWrapper.classList.contains("open")
    ) {
      customSelectWrapper.classList.remove("open"); // Ferme le menu
      customSelectTrigger.setAttribute("aria-expanded", "false");
      customOptionsList.setAttribute("aria-hidden", "true");
      // Rend l'option sélectionnée visible à nouveau lors de la fermeture
      if (currentlySelectedOption) {
        currentlySelectedOption.style.display = "block"; // 'list-item'
        currentlySelectedOption.setAttribute("tabindex", "-1"); // Retire le tabindex
      }
      // S'assure que toutes les options sont à nouveau non-focusables par tabulation
      customOptions.forEach((option) => option.setAttribute("tabindex", "-1"));
    }
  });

  // --- Gestion de la sélection d'une option ---
  customOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedValue = option.dataset.value; // Récupère la valeur de tri (popularity, date, title)
      const selectedText = option.textContent.trim(); // Récupère le texte de l'option cliquée

      // Effectue la mise à jour uniquement si une nouvelle option est sélectionnée
      if (option !== currentlySelectedOption) {
        // 1. Rendre l'ancienne option sélectionnée visible dans la liste et retirer sa classe 'selected'
        if (currentlySelectedOption) {
          currentlySelectedOption.classList.remove("selected");
          currentlySelectedOption.style.display = "block"; // La rend visible pour la prochaine ouverture
          currentlySelectedOption.setAttribute("aria-selected", "false");
          currentlySelectedOption.setAttribute("tabindex", "-1");
        }

        // 2. Marquer la nouvelle option comme sélectionnée et la cacher de la liste
        option.classList.add("selected");
        option.style.display = "none"; // La cache car elle est maintenant sélectionnée
        option.setAttribute("aria-selected", "true");
        option.setAttribute("tabindex", "0"); // L'option sélectionnée doit être focusable (mais cachée) pour ARIA
        currentlySelectedOption = option; // Met à jour la référence globale de l'option sélectionnée

        // 3. Met à jour le texte du déclencheur (trigger) avec la nouvelle option sélectionnée.
        // On retire le nœud texte précédent et on en ajoute un nouveau pour éviter les problèmes.
        if (
          customSelectTrigger.firstChild &&
          customSelectTrigger.firstChild.nodeType === Node.TEXT_NODE
        ) {
          customSelectTrigger.removeChild(customSelectTrigger.firstChild);
        }
        customSelectTrigger.prepend(
          document.createTextNode(selectedText + " ")
        );

        // 4. Appelle la fonction de tri des médias avec la nouvelle valeur
        sortMedia(selectedValue);
      }

      // 5. Ferme le sélecteur après la sélection
      customSelectWrapper.classList.remove("open");
      customSelectTrigger.setAttribute("aria-expanded", "false");
      customOptionsList.setAttribute("aria-hidden", "true");

      // S'assure que toutes les options sont à nouveau non-focusables par tabulation après la fermeture
      customOptions.forEach((opt) => {
        if (opt !== currentlySelectedOption) {
          // L'option sélectionnée garde son tabindex=0
          opt.setAttribute("tabindex", "-1");
        }
      });

      customSelectTrigger.focus(); // Remet le focus sur le déclencheur pour l'accessibilité
    });

    // --- Gestion de la navigation au clavier pour chaque option ---
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        // Si 'Entrée' ou 'Espace' est pressé sur une option, simule un clic
        e.preventDefault(); // Empêche le défilement de la page si 'Espace' est pressé
        option.click(); // Déclenche le gestionnaire de clic de l'option
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        // Trouve l'option visible précédente
        let prevOption = option.previousElementSibling;
        while (prevOption && prevOption.style.display === "none") {
          prevOption = prevOption.previousElementSibling;
        }
        if (prevOption) {
          prevOption.focus(); // Déplace le focus vers l'option précédente visible
        } else {
          customSelectTrigger.focus(); // Si plus d'options visibles, retourne au déclencheur
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        // Trouve l'option visible suivante
        let nextOption = option.nextElementSibling;
        while (nextOption && nextOption.style.display === "none") {
          nextOption = nextOption.nextElementSibling;
        }
        if (nextOption) {
          nextOption.focus(); // Déplace le focus vers l'option suivante visible
        } else {
          customSelectTrigger.focus(); // Si plus d'options visibles, retourne au déclencheur
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        // Ferme le menu et rend l'option sélectionnée visible
        customSelectWrapper.classList.remove("open");
        customSelectTrigger.setAttribute("aria-expanded", "false");
        customOptionsList.setAttribute("aria-hidden", "true");
        if (currentlySelectedOption) {
          currentlySelectedOption.style.display = "block";
          currentlySelectedOption.setAttribute("tabindex", "-1");
        }
        // S'assure que toutes les options sont à nouveau non-focusables par tabulation
        customOptions.forEach((opt) => opt.setAttribute("tabindex", "-1"));
        customSelectTrigger.focus(); // Remet le focus sur le déclencheur
      }
    });
  });

  // --- Gestion de la navigation au clavier pour le déclencheur (trigger) ---
  customSelectTrigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      customSelectTrigger.click(); // Ouvre/ferme le menu
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!customSelectWrapper.classList.contains("open")) {
        customSelectTrigger.click(); // Ouvre le menu si ce n'est pas déjà fait
      }
      // Déplace le focus vers la première option visible dans la liste
      const firstVisibleOption = customOptionsList.querySelector(
        ".custom-option[style*='display: block'], .custom-option:not([style*='display: none'])"
      );
      if (firstVisibleOption) {
        firstVisibleOption.focus();
      }
    } else if (e.key === "ArrowUp") {
      // Ajout de la navigation ArrowUp pour le trigger
      e.preventDefault();
      if (customSelectWrapper.classList.contains("open")) {
        // Si le menu est ouvert, déplace le focus vers la dernière option visible
        const visibleOptions = Array.from(customOptions).filter(
          (option) => option.style.display !== "none"
        );
        if (visibleOptions.length > 0) {
          visibleOptions[visibleOptions.length - 1].focus();
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      // Ferme le menu et rend l'option sélectionnée visible
      customSelectWrapper.classList.remove("open");
      customSelectTrigger.setAttribute("aria-expanded", "false");
      customOptionsList.setAttribute("aria-hidden", "true");
      if (currentlySelectedOption) {
        currentlySelectedOption.style.display = "block";
        currentlySelectedOption.setAttribute("tabindex", "-1");
      }
      // S'assure que toutes les options sont à nouveau non-focusables par tabulation
      customOptions.forEach((opt) => opt.setAttribute("tabindex", "-1"));
    }
  });

  /**
   * Fonction interne pour trier la liste des médias en fonction du critère donné.
   * @param {string} criteria - Le critère de tri ("popularity", "date", ou "title").
   */
  function sortMedia(criteria) {
    switch (criteria) {
      case "popularity":
        currentMediaList.sort((a, b) => b.likes - a.likes); // Trie par likes décroissants
        break;
      case "date":
        currentMediaList.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trie par date décroissante
        break;
      case "title":
        // Trie par titre alphabétique, insensible à la casse et aux accents
        currentMediaList.sort((a, b) =>
          a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
        );
        break;
      default:
        console.warn("Critère de tri inconnu :", criteria);
    }
    // Après le tri, on appelle la fonction de rappel pour rafraîchir l'affichage des médias sur la page
    if (displayMediaCallback) {
      displayMediaCallback(currentMediaList, photographerName);
    }
  }
}
