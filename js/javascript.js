/** Intégration d"une bibliothèque JavaScript (Google Charts) */
//Intégration de l"exemple de la documentaiton de Google :
//https://developers.google.com/chart/interactive/docs/gallery/ganttchart?hl=fr

import { DATA_TACHES } from "./data-taches.js";
import * as utils from "./fonctions-utilitaires.js";

/*global google*/
/*global bootstrap*/

let myData = DATA_TACHES;

let data;
let options;
let chart;

/**
 * Fonction qui met en place le visuel de la page.
 *
 * @author - alexandre-roy
 */
function chargerEtAfficherDonneesDiagrammeEtCards() {
  google.charts.load("current", { packages: ["gantt"] });
  google.charts.setOnLoadCallback(creerDonneesPourGraphique);

  afficherCardsTaches();
}

/**
 *  Affiche toutes les tâches sous forme de card.
 *
 * @author - alexandre-roy
 */
function afficherCardsTaches() {
  let rowCards = document.getElementById("cards");
  rowCards.classList = "row";
  rowCards.textContent = "";

  for (const i in myData.detailsTache) {
    let titreTache = document.createElement("h2");
    titreTache.classList = "card-title fs-5";
    titreTache.textContent = `${myData.detailsTache[i].id}: ${myData.detailsTache[i].titre}`;

    let btnSupprimer = document.createElement("button");
    btnSupprimer.classList = "btn btn-danger";
    btnSupprimer.textContent = "Supprimer";

    let card = utils.creerCard(
      "images/checkbox.png",
      titreTache,
      myData.detailsTache[i],
      true,
      btnSupprimer
    );

    rowCards.appendChild(card);
  }
}

/**
 * Permet de bâtir le DataTable que Google a besoin à partir de notre base de données (DATA_TACHES).
 *
 * @author - alexandre-roy
 */
function creerDonneesPourGraphique() {
  data = new google.visualization.DataTable();
  data.addColumn("string", "ID de la tâche");
  data.addColumn("string", "Nom de la tâche");
  data.addColumn("date", "Date de début");
  data.addColumn("date", "Date de fin");
  data.addColumn("number", "Durée");
  data.addColumn("number", "% complétée");
  data.addColumn("string", "Dépendances");

  for (const i in myData.detailsTache) {
    data.addRows([
      [
        myData.detailsTache[i].id,
        myData.detailsTache[i].titre,
        myData.detailsTache[i].dateDebut,
        myData.detailsTache[i].dateFin,
        myData.detailsTache[i].dureeEnNbJours,
        myData.detailsTache[i].pctComplete,
        myData.detailsTache[i].dependances
          ? String(myData.detailsTache[i].dependances)
          : null,
      ],
    ]);
  }

  options = {
    height: 275,
  };
  chart = new google.visualization.Gantt(document.getElementById("chart"));

  chart.draw(data, options);

  recupererTacheSelectionneeDansDiagrammeDeGantt();
}

/**
 * Vérifie si la tâche fait partie des dépendances d'autres tâches.
 *
 * @param {string} pIdTache - L'id de la tâche à vérifier.
 * @returns {boolean} - Retourne vrai si la tâche fait partie des dépendances d'autres tâches, sinon faux.
 * @author - alexandre-roy
 */
function verifierSiDependanceExiste(pIdTache) {
  for (const tache of myData.detailsTache) {
    if (tache.dependances == null) {
      continue;
    }
    for (let i = 0; i < tache.dependances.length; i++) {
      if (tache.dependances[i] == pIdTache) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Permet d'afficher les données dans une formulaire intégré à une fenêtre modale pour les éditer.
 *
 * @author - alexandre-roy
 */
function recupererTacheSelectionneeDansDiagrammeDeGantt() {
    google.visualization.events.addListener(chart, "select", selectHandler);

  function selectHandler() { 

    let selection = myData.detailsTache[chart.getSelection()[0].row];
    console.log(selection.id);

    let divModal = document.getElementById("modal");

    divModal.textContent = "";

    divModal.classList = "show modal d-block";
    divModal.setAttribute("role", "dialog");

    let modalDialog = document.createElement("div");
    modalDialog.classList = "modal-dialog";

    let modalContent = document.createElement("div");
    modalContent.classList = "modal-content bg-white";

    let modalHeader = document.createElement("div");
    modalHeader.classList = "modal-header";

    let btnX = document.createElement("button");
    btnX.classList = "btn-close";
    btnX.setAttribute("data-bs-dismiss", "modal");
    btnX.addEventListener("click", function() {
        divModal.classList.remove("show", "d-block");
        divModal.classList.add("d-none");
    });

    let modalTitle = document.createElement("h5");
    modalTitle.classList = "modal-title";
    modalTitle.textContent = "Édition d'une tâche";

    let modalFooter = document.createElement("div");
    modalFooter.classList = "modal-footer";

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(btnX);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    divModal.appendChild(modalDialog);

  }
}

/**
 * Cette fonction compte les secondes et les affiche dans le champ Réalisation.
 *
 * @author - alexandre-roy
 */
function calculerAvancement() {}

/**
 * Cette fonction permet d'arrêter la minuterie.
 *
 * @author - alexandre-roy
 */
function arreterMinuterie() {}

/**
 * Cette fonction mets à jour les données du DataTable dudiagramme de Gantt.
 *
 * @author - alexandre-roy
 */
function sauvegarderChangementsTache() {}

/**
 * Cette fonction supprime une tâche dont le Id est spécifié dans un attribut HTML personnalisé « data-id » dans les données du graphique.
 *
 * @param {Event} e
 * @author - alexandre-roy
 */
function supprimerTache(e) {}

/**
 * Fonction d'initialisation de la page.
 *
 * @author - alexandre-roy
 */
function initialisation() {
  chargerEtAfficherDonneesDiagrammeEtCards();
}

/**
 * Appel de la fonction initialisation lors du chargement de la page.
 *
 * @author - alexandre-roy
 */
window.addEventListener("DOMContentLoaded", initialisation);

window.addEventListener("resize", function () {
  chart.draw(data, options);
});
