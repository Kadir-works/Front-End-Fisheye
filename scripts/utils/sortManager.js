// scripts/utils/sortManager.js

let currentMediaList = [];
let displayMediaCallback = null;
let photographerName = "";

let customSelectWrapper = null;
let customSelectTrigger = null;
let customOptionsList = null;
let customOptions = null;
let currentlySelectedOption = null;
let arrowIconElement = null;
let triggerTextElement = null; // Ajouté pour cibler le span.trigger-text

export function setupSort(mediaList, callback, name) {
  currentMediaList = mediaList;
  displayMediaCallback = callback;
  photographerName = name;

  customSelectWrapper = document.querySelector(".custom-select-wrapper");
  customSelectTrigger = document.querySelector(".custom-select-trigger");
  customOptionsList = document.querySelector(".custom-options-list");
  customOptions = document.querySelectorAll(".custom-option");
  arrowIconElement = customSelectTrigger.querySelector(".arrow-icon");
  triggerTextElement = customSelectTrigger.querySelector(".trigger-text"); // Cible le span .trigger-text

  if (
    !customSelectWrapper ||
    !customSelectTrigger ||
    !customOptionsList ||
    customOptions.length === 0 ||
    !arrowIconElement ||
    !triggerTextElement
  ) {
    console.error(
      "Erreur : Un ou plusieurs éléments du sélecteur personnalisé n'ont pas été trouvés. " +
        "Vérifiez votre HTML (classes, IDs) et l'ordre d'exécution de votre JS."
    );
    return;
  }

  console.log("Sélecteur de tri trouvé et initialisé :", {
    wrapper: customSelectWrapper,
    trigger: customSelectTrigger,
    list: customOptionsList,
    optionsCount: customOptions.length,
    arrow: arrowIconElement,
    triggerText: triggerTextElement,
  });

  // --- Initialisation de l'état du sélecteur au chargement de la page ---
  currentlySelectedOption = customOptionsList.querySelector(
    ".custom-option.selected"
  );

  if (!currentlySelectedOption) {
    currentlySelectedOption = customOptions[0];
    currentlySelectedOption.classList.add("selected");
  }

  // Met à jour le texte affiché dans le déclencheur en utilisant le span .trigger-text
  triggerTextElement.textContent = currentlySelectedOption.textContent.trim();

  // Gère l'accessibilité ARIA pour l'option initialement sélectionnée
  customOptions.forEach((option) => {
    option.setAttribute("role", "option");
    option.setAttribute("tabindex", "-1"); // Par défaut, non focusable via tabulation pour toutes les options
    option.setAttribute("aria-selected", "false");
  });

  currentlySelectedOption.setAttribute("aria-selected", "true");

  // Configuration des attributs ARIA pour le déclencheur et la liste
  customSelectTrigger.setAttribute("tabindex", "0");
  customSelectTrigger.setAttribute("aria-haspopup", "listbox");
  customSelectTrigger.setAttribute("aria-expanded", "false");
  customOptionsList.setAttribute("role", "listbox");
  customOptionsList.setAttribute("aria-hidden", "true"); // La liste est cachée par défaut

  // --- Gestion de l'ouverture/fermeture du sélecteur au clic sur le déclencheur (trigger) ---
  customSelectTrigger.addEventListener("click", () => {
    const isOpen = customSelectWrapper.classList.toggle("open"); // Bascule la classe 'open'

    customSelectTrigger.setAttribute("aria-expanded", isOpen);
    customOptionsList.setAttribute("aria-hidden", !isOpen);

    customOptions.forEach((option) => {
      if (isOpen) {
        // Si le menu s'ouvre :
        if (option === currentlySelectedOption) {
          // L'option sélectionnée est masquée dans la liste
          option.classList.add("is-hidden-in-list");
          option.setAttribute("tabindex", "-1"); // Non tabulable si cachée
        } else {
          option.setAttribute("tabindex", "0"); // Rend les autres options focusables
          option.classList.remove("is-hidden-in-list");
        }
      } else {
        // Si le menu se ferme : toutes les options redeviennent non focusables et visibles
        option.setAttribute("tabindex", "-1");
        option.classList.remove("is-hidden-in-list");
      }
    });

    if (isOpen) {
      // Déplace le focus sur la première option visible pour l'accessibilité au clavier
      const firstVisibleOption = customOptionsList.querySelector(
        ".custom-option:not(.is-hidden-in-list)"
      );
      if (firstVisibleOption) {
        firstVisibleOption.focus();
      }
    } else {
      customSelectTrigger.focus(); // Remet le focus sur le déclencheur si le menu se ferme
    }
  });

  // --- Gestion de la fermeture du sélecteur si un clic se produit en dehors ---
  document.addEventListener("click", (e) => {
    if (
      !customSelectWrapper.contains(e.target) &&
      customSelectWrapper.classList.contains("open")
    ) {
      customSelectWrapper.classList.remove("open");
      customSelectTrigger.setAttribute("aria-expanded", "false");
      customOptionsList.setAttribute("aria-hidden", "true");

      customOptions.forEach((option) => {
        option.setAttribute("tabindex", "-1"); // Rend toutes les options non focusables
        option.classList.remove("is-hidden-in-list"); // S'assure qu'elles redeviennent visibles
      });
    }
  });

  // --- Gestion de la sélection d'une option ---
  customOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedValue = option.dataset.value;
      const selectedText = option.textContent.trim();

      if (option !== currentlySelectedOption) {
        // Retire la classe 'selected' de l'ancienne option
        if (currentlySelectedOption) {
          currentlySelectedOption.classList.remove("selected");
          currentlySelectedOption.setAttribute("aria-selected", "false");
          currentlySelectedOption.setAttribute("tabindex", "-1");
          currentlySelectedOption.classList.remove("is-hidden-in-list");
        }

        // Marque la nouvelle option comme sélectionnée
        option.classList.add("selected");
        option.setAttribute("aria-selected", "true");
        // L'option sélectionnée ne doit pas être cachée immédiatement après la sélection,
        // car le menu se ferme. Elle sera cachée à la prochaine ouverture.
        currentlySelectedOption = option;

        // Met à jour le texte du déclencheur en utilisant le span .trigger-text
        triggerTextElement.textContent = selectedText;

        sortMedia(selectedValue); // Appelle la fonction de tri
      }

      // Ferme le sélecteur après la sélection
      customSelectWrapper.classList.remove("open");
      customSelectTrigger.setAttribute("aria-expanded", "false");
      customOptionsList.setAttribute("aria-hidden", "true");

      // Réinitialise les tabindexes et visibilité de toutes les options après fermeture
      customOptions.forEach((opt) => {
        opt.setAttribute("tabindex", "-1");
        opt.classList.remove("is-hidden-in-list");
      });

      customSelectTrigger.focus();
    });

    // --- Gestion de la navigation au clavier pour chaque option ---
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        option.click();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const visibleOptions = Array.from(customOptions).filter(
          (opt) => !opt.classList.contains("is-hidden-in-list")
        );
        const currentIndex = visibleOptions.indexOf(option);
        if (currentIndex > 0) {
          visibleOptions[currentIndex - 1].focus();
        } else {
          customSelectTrigger.focus(); // Retourne au trigger si on est sur la première option
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const visibleOptions = Array.from(customOptions).filter(
          (opt) => !opt.classList.contains("is-hidden-in-list")
        );
        const currentIndex = visibleOptions.indexOf(option);
        if (currentIndex < visibleOptions.length - 1) {
          visibleOptions[currentIndex + 1].focus();
        } else {
          customSelectTrigger.focus(); // Retourne au trigger si on est sur la dernière option
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        customSelectWrapper.classList.remove("open");
        customSelectTrigger.setAttribute("aria-expanded", "false");
        customOptionsList.setAttribute("aria-hidden", "true");
        customOptions.forEach((opt) => {
          opt.setAttribute("tabindex", "-1");
          opt.classList.remove("is-hidden-in-list");
        });
        customSelectTrigger.focus();
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
        customSelectTrigger.click(); // Ouvre le menu si fermé
      }
      const firstVisibleOption = customOptionsList.querySelector(
        ".custom-option:not(.is-hidden-in-list)"
      );
      if (firstVisibleOption) {
        firstVisibleOption.focus(); // Déplace le focus sur la première option visible
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (customSelectWrapper.classList.contains("open")) {
        // Si le menu est ouvert, déplace le focus sur la dernière option visible
        const visibleOptions = Array.from(customOptions).filter(
          (opt) => !opt.classList.contains("is-hidden-in-list")
        );
        if (visibleOptions.length > 0) {
          visibleOptions[visibleOptions.length - 1].focus();
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      customSelectWrapper.classList.remove("open");
      customSelectTrigger.setAttribute("aria-expanded", "false");
      customOptionsList.setAttribute("aria-hidden", "true");
      customOptions.forEach((opt) => {
        opt.setAttribute("tabindex", "-1");
        opt.classList.remove("is-hidden-in-list");
      });
      customSelectTrigger.focus();
    }
  });

  function sortMedia(criteria) {
    switch (criteria) {
      case "popularity":
        currentMediaList.sort((a, b) => b.likes - a.likes);
        break;
      case "date":
        currentMediaList.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "title":
        currentMediaList.sort((a, b) =>
          a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
        );
        break;
      default:
        console.warn("Critère de tri inconnu :", criteria);
    }
    if (displayMediaCallback) {
      displayMediaCallback(currentMediaList, photographerName);
    }
  }
}
