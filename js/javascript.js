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
    gantt: {
      criticalPathEnabled: false,
      arrow: {
        angle: 100,
        width: 3,
        color: "#f28500",
      },
      labelStyle: {
        fontName: "Oswald",
        fontSize: 17,
        color: "#2d353e",
      },
    },
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

    let modalTitle = document.createElement("h5");
    modalTitle.classList = "modal-title";
    modalTitle.textContent = "Édition d'une tâche";

    let btnX = document.createElement("button");
    btnX.classList = "btn-close";
    btnX.setAttribute("data-bs-dismiss", "modal");
    btnX.addEventListener("click", function () {
      divModal.classList.remove("show", "d-block");
      divModal.classList.add("d-none");
      chart.draw(data, options);
    });

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(btnX);
    modalContent.appendChild(modalHeader);

    let divForm = document.createElement("div");
    divForm.classList = "modal-body";

    let frmModal = document.createElement("form");
    frmModal.classList = "row";

    let divId = document.createElement("div");
    divId.classList = "col-12 mb-3";
    let labelId = document.createElement("label");
    labelId.classList = "form-label";
    labelId.setAttribute("for", "id");
    labelId.textContent = "ID";
    let inputId = document.createElement("input");
    inputId.classList = "form-control bg-white";
    inputId.setAttribute("type", "text");
    inputId.setAttribute("id", "id");
    inputId.setAttribute("value", selection.id);
    divId.appendChild(labelId);
    divId.appendChild(inputId);
    frmModal.appendChild(divId);

    let divTitre = document.createElement("div");
    divTitre.classList = "col-12 mb-3";
    let labelTitre = document.createElement("label");
    labelTitre.classList = "form-label";
    labelTitre.setAttribute("for", "titre");
    labelTitre.textContent = "Nom de la tâche";
    let inputTitre = document.createElement("input");
    inputTitre.classList = "form-control bg-white";
    inputTitre.setAttribute("type", "text");
    inputTitre.setAttribute("id", "titre");
    inputTitre.setAttribute("value", selection.titre);
    divTitre.appendChild(labelTitre);
    divTitre.appendChild(inputTitre);
    frmModal.appendChild(divTitre);

    let divDates = document.createElement("div");
    divDates.classList = "d-flex justify-content-between";

    let divDateDebut = document.createElement("div");
    divDateDebut.classList = "mb-3 me-4 w-50";
    let labelDateDebut = document.createElement("label");
    labelDateDebut.classList = "form-label";
    labelDateDebut.setAttribute("for", "dateDebut");
    labelDateDebut.textContent = "Date de début";
    let inputDateDebut = document.createElement("input");
    inputDateDebut.classList = "form-control bg-white";
    inputDateDebut.setAttribute("type", "date");
    inputDateDebut.setAttribute("id", "dateDebut");
    inputDateDebut.setAttribute("value", selection.dateDebut.toISOString().split("T")[0]);
    divDateDebut.appendChild(labelDateDebut);
    divDateDebut.appendChild(inputDateDebut);
    divDates.appendChild(divDateDebut);

    let divDateFin = document.createElement("div");
    divDateFin.classList = "mb-3 w-50";
    let labelDateFin = document.createElement("label");
    labelDateFin.classList = "form-label";
    labelDateFin.setAttribute("for", "dateFin");
    labelDateFin.textContent = "Date de fin";
    let inputDateFin = document.createElement("input");
    inputDateFin.classList = "form-control bg-white";
    inputDateFin.setAttribute("type", "date");
    inputDateFin.setAttribute("id", "dateFin");
    inputDateFin.setAttribute("value", selection.dateFin.toISOString().split("T")[0]);
    divDateFin.appendChild(labelDateFin);
    divDateFin.appendChild(inputDateFin);
    divDates.appendChild(divDateFin);

    frmModal.appendChild(divDates);

    let divTemps = document.createElement("div");
    divTemps.classList = "d-flex justify-content-between";

    let divNbJours = document.createElement("div");
    divNbJours.classList = "mb-3";
    let labelNbJours = document.createElement("label");
    labelNbJours.classList = "form-label";
    labelNbJours.setAttribute("for", "nbJours");
    labelNbJours.textContent = "Nb. jour(s) estimé";
    let inputNbJours = document.createElement("input");
    inputNbJours.classList = "form-control bg-white";
    inputNbJours.setAttribute("type", "number");
    inputNbJours.setAttribute("id", "nbJours");
    inputNbJours.setAttribute("value", selection.dureeEnNbJours);
    divNbJours.appendChild(labelNbJours);
    divNbJours.appendChild(inputNbJours);
    divTemps.appendChild(divNbJours);

    let divRealisation = document.createElement("div");

    let divInputGroup = document.createElement("div");
    divInputGroup.classList = "input-group";
    let spanInputGroupText = document.createElement("span");
    spanInputGroupText.classList = "input-group-text";
    let spanInputGroupTextIcon = document.createElement("i");
    spanInputGroupTextIcon.classList = "bi bi-stopwatch-fill";
    spanInputGroupText.appendChild(spanInputGroupTextIcon);

    divRealisation.classList = "mb-3 mx-4";
    let labelRealisation = document.createElement("label");
    labelRealisation.classList = "form-label";
    labelRealisation.setAttribute("for", "realisation");
    labelRealisation.textContent = "Jours réalisés";
    let inputRealisation = document.createElement("input");
    inputRealisation.classList = "form-control bg-white";
    inputRealisation.setAttribute("type", "number");
    inputRealisation.setAttribute("id", "realisation");
    inputRealisation.setAttribute("value", selection.pctComplete / 100 * selection.dureeEnNbJours);

    divRealisation.appendChild(labelRealisation);
    divInputGroup.appendChild(spanInputGroupText);
    divInputGroup.appendChild(inputRealisation);
    divRealisation.appendChild(divInputGroup);
    divTemps.appendChild(divRealisation);

    let divAvancement = document.createElement("div");
    divAvancement.classList = "mb-3";
    let labelAvancement = document.createElement("label");
    labelAvancement.classList = "form-label";
    labelAvancement.setAttribute("for", "avancement");
    labelAvancement.textContent = "Avancement (%)";
    let inputAvancement = document.createElement("input");
    inputAvancement.classList = "form-control bg-white";
    inputAvancement.setAttribute("type", "text");
    inputAvancement.setAttribute("id", "avancement");
    inputAvancement.setAttribute("value", selection.pctComplete + "%");
    divAvancement.appendChild(labelAvancement);
    divAvancement.appendChild(inputAvancement);
    divTemps.appendChild(divAvancement);

    frmModal.appendChild(divTemps);

    let divChrono = document.createElement("div");
    divChrono.classList = "d-flex justify-content-center";

    let btnDemarrer = document.createElement("button");
    btnDemarrer.classList = "btn btn-success me-3 d-flex flex-column align-items-center w-15";
    let start = spanInputGroupTextIcon.cloneNode(true);
    btnDemarrer.appendChild(start);
    let spanGo = document.createElement("span");
    spanGo.textContent = "START";
    btnDemarrer.appendChild(spanGo);   
    btnDemarrer.addEventListener("click", calculerAvancement());

    let btnArreter = document.createElement("button");
    btnArreter.classList = "btn btn-danger d-flex flex-column align-items-center w-15";
    let stop  = spanInputGroupTextIcon.cloneNode(true);
    btnArreter.appendChild(stop);
    let spanStop = document.createElement("span");
    spanStop.textContent = "STOP";
    btnArreter.appendChild(spanStop);
    btnArreter.addEventListener("click", arreterMinuterie());

    divChrono.appendChild(btnDemarrer);
    divChrono.appendChild(btnArreter);

    frmModal.appendChild(divChrono);

    let divDependances = document.createElement("div");
    divDependances.classList = "col-12";
    let labelDependances = document.createElement("label");
    labelDependances.classList = "form-label";
    labelDependances.setAttribute("for", "dependances");
    labelDependances.textContent = "Dépendances";
    let inputDependances = document.createElement("input");
    inputDependances.classList = "form-control bg-white";
    inputDependances.setAttribute("type", "text");
    inputDependances.setAttribute("id", "dependances");
    inputDependances.setAttribute("value", selection.dependances);
    divDependances.appendChild(labelDependances);
    divDependances.appendChild(inputDependances);
    frmModal.appendChild(divDependances);

    let modalFooter = document.createElement("div");
    modalFooter.classList = "modal-footer";

    let btnFermer = document.createElement("button");
    btnFermer.classList = "btn btn-secondary text-white";
    btnFermer.setAttribute("data-bs-dismiss", "modal");
    btnFermer.textContent = "Fermer";
    btnFermer.addEventListener("click", function () {
      divModal.classList.remove("show", "d-block");
      divModal.classList.add("d-none");
      chart.draw(data, options);
    });

    let btnSauvegarder = document.createElement("button");
    btnSauvegarder.classList = "btn btn-primary text-white";
    btnSauvegarder.textContent = "Sauvegarder";
    btnSauvegarder.addEventListener("click", function () {

    myData.detailsTache[chart.getSelection()[0].row].id = inputId.value;
    myData.detailsTache[chart.getSelection()[0].row].titre = inputTitre.value;

      divModal.classList.remove("show", "d-block");
      divModal.classList.add("d-none");
      chargerEtAfficherDonneesDiagrammeEtCards();
    });

    divForm.appendChild(frmModal);

    modalFooter.appendChild(btnFermer);
    modalFooter.appendChild(btnSauvegarder);
    modalContent.appendChild(divForm);
    modalDialog.appendChild(modalContent);
    modalContent.appendChild(modalFooter);
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
