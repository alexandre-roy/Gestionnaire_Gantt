/** Intégration d"une bibliothèque JavaScript (Google Charts) */
//Intégration de l"exemple de la documentaiton de Google :
//https://developers.google.com/chart/interactive/docs/gallery/ganttchart?hl=fr

import { DATA_TACHES } from "./data-taches.js";
import * as utils from "./fonctions-utilitaires.js";

/*global google*/
/*global bootstrap*/

let data;
let options;
let chart;
let grandeur = 275;

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

  for (let i in DATA_TACHES.detailsTache) {
    let titreTache = document.createElement("h2");
    titreTache.classList = "card-title fs-5";
    titreTache.textContent = `${DATA_TACHES.detailsTache[i].id}: ${DATA_TACHES.detailsTache[i].titre}`;

    let arialabel = document.createElement("span");
    arialabel.classList = "visually-hidden";
    arialabel.textContent = "Supprimer la tâche";
    arialabel.setAttribute("id", "descSupprimer");

    let btnSupprimer = document.createElement("button"); 
    btnSupprimer.classList = "btn btn-danger";
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.setAttribute("data-id", i);
    btnSupprimer.setAttribute("id", "btnSupprimer");
    btnSupprimer.setAttribute("aria-labelledby", "descSupprimer");
    btnSupprimer.setAttribute("idTache", DATA_TACHES.detailsTache[i].id);
    btnSupprimer.addEventListener("click", supprimerTache);
    btnSupprimer.appendChild(arialabel);

    let card = utils.creerCard(
      "images/checkbox.png",
      titreTache,
      DATA_TACHES.detailsTache[i],
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

  for (const i in DATA_TACHES.detailsTache) {
    data.addRows([
      [
        DATA_TACHES.detailsTache[i].id,
        DATA_TACHES.detailsTache[i].titre,
        DATA_TACHES.detailsTache[i].dateDebut,
        DATA_TACHES.detailsTache[i].dateFin,
        DATA_TACHES.detailsTache[i].dureeEnNbJours,
        DATA_TACHES.detailsTache[i].pctComplete,
        DATA_TACHES.detailsTache[i].dependances
          ? String(DATA_TACHES.detailsTache[i].dependances)
          : null,
      ],
    ]);
  }

  options = {
    height: grandeur,
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
  for (const tache of DATA_TACHES.detailsTache) {
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
    let selection = DATA_TACHES.detailsTache[chart.getSelection()[0].row];

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
    modalTitle.textContent = "Modification d'une tâche";

    let btnX = document.createElement("button");
    btnX.classList = "btn-close animmodal";
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
    frmModal.setAttribute("novalidate", "");

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
    inputDateDebut.setAttribute("type", "datetime-local");
    inputDateDebut.setAttribute("id", "dateDebut");
    inputDateDebut.setAttribute(
      "value",
      selection.dateDebut.toISOString().slice(0, 16)
    );
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
    inputDateFin.setAttribute("type", "datetime-local");
    inputDateFin.setAttribute("id", "dateFin");
    inputDateFin.setAttribute(
      "value",
      selection.dateFin.toISOString().slice(0, 16)
    );
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
    inputNbJours.setAttribute("disabled", "");
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
    inputRealisation.setAttribute("disabled", "");
    inputRealisation.setAttribute(
      "value",
      ((selection.pctComplete / 100) * selection.dureeEnNbJours).toFixed(0)
    );

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
    inputAvancement.setAttribute("disabled", "");
    inputAvancement.setAttribute("value", selection.pctComplete);
    divAvancement.appendChild(labelAvancement);
    divAvancement.appendChild(inputAvancement);
    divTemps.appendChild(divAvancement);

    frmModal.appendChild(divTemps);

    let divChrono = document.createElement("div");
    divChrono.classList = "d-flex justify-content-around";

    let divVide = document.createElement("div");
    divVide.classList = "w-25";

    divChrono.appendChild(divVide);

    let btnDemarrer = document.createElement("button");
    btnDemarrer.setAttribute("id", "btnStart");
    if (selection.pctComplete == 100) {
      btnDemarrer.classList =
        "btn btn-white border-2 border-success text-success me-2-5 d-flex flex-column align-items-center w-15 ms-4-5";
    } else {
      btnDemarrer.classList =
        "btn btn-success me-2-5 d-flex flex-column align-items-center w-15 ms-4-5";
    }
    let start = spanInputGroupTextIcon.cloneNode(true);
    btnDemarrer.appendChild(start);
    let spanGo = document.createElement("span");
    spanGo.textContent = "START";
    btnDemarrer.appendChild(spanGo);
    btnDemarrer.addEventListener("click", function (e) {
      e.preventDefault();
      calculerAvancement();
    });

    let btnArreter = document.createElement("button");
    btnArreter.setAttribute("id", "btnStop");
    btnArreter.classList =
      "btn btn-white border-2 border-danger text-danger d-flex flex-column align-items-center w-15 me-3";
    let stop = spanInputGroupTextIcon.cloneNode(true);
    btnArreter.appendChild(stop);
    let spanStop = document.createElement("span");
    spanStop.textContent = "STOP";
    btnArreter.appendChild(spanStop);
    btnArreter.addEventListener("click", function (e) {
      e.preventDefault();
      arreterMinuterie();
    });

    divChrono.appendChild(btnDemarrer);
    divChrono.appendChild(btnArreter);

    let divProgress = document.createElement("div");
    divProgress.classList = "progress w-25 me-1 ms-2";
    divProgress.setAttribute("role", "progressbar");
    divProgress.setAttribute("aria-valuemin", "0");
    divProgress.setAttribute("aria-valuemax", "100");

    let divProgressBar = document.createElement("div");
    divProgressBar.setAttribute("id", "progressBar");

    if (selection.pctComplete < 50) {
      divProgressBar.classList = "progress-bar bg-danger";
    } else if (selection.pctComplete < 100) {
      divProgressBar.classList = "progress-bar bg-warning";
    } else {
      divProgressBar.classList = "progress-bar bg-success";
    }
    divProgressBar.style.width = selection.pctComplete + "%";

    divProgress.appendChild(divProgressBar);
    divProgress.appendChild(divProgressBar);
    divChrono.appendChild(divProgress);

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
    btnFermer.setAttribute("type", "button");
    btnFermer.setAttribute("data-bs-dismiss", "modal");
    btnFermer.textContent = "Fermer";
    btnFermer.addEventListener("click", function () {
      divModal.classList.remove("show", "d-block");
      divModal.classList.add("d-none");
      chart.draw(data, options);
    });

    let btnSave = document.createElement("button");
    btnSave.classList = "btn btn-primary text-white";
    btnSave.setAttribute("type", "button");
    btnSave.textContent = "Sauvegarder";
    btnSave.addEventListener("click", function () {
      if(inputDateFin.value < inputDateDebut.value) {
        afficherToast("form", "date");
        return;
      }
      if(inputId.value == "" || inputTitre.value == "") {
        afficherToast("form", "vide");
        return;
      }
      sauvegarderChangementsTache();
      divModal.classList.remove("show", "d-block");
      divModal.classList.add("d-none");
      chart.draw(data, options);
    });

    divForm.appendChild(frmModal);

    modalFooter.appendChild(btnFermer);
    modalFooter.appendChild(btnSave);
    modalContent.appendChild(divForm);
    modalDialog.appendChild(modalContent);
    modalContent.appendChild(modalFooter);
    divModal.appendChild(modalDialog);
  }
}

let timerInterval;

/**
 * Cette fonction compte les secondes et les affiche dans le champ Réalisation.
 *
 * @author - alexandre-roy
 */
function calculerAvancement() {
  let realisation = document.getElementById("realisation");
  let value = realisation.getAttribute("value");
  let avancement = document.getElementById("avancement");
  let nbJours = document.getElementById("nbJours").value;
  let progress = document.getElementById("progressBar");

  let btnDemarrer = document.getElementById("btnStart");
  btnDemarrer.classList =
    "btn btn-white border-2 border-success text-success me-2-5 d-flex flex-column align-items-center w-15 ms-4-5";

  realisation.setAttribute("value", value);
  avancement.setAttribute("value", ((value / nbJours) * 100).toFixed(0));
  progress.style.width = ((value / nbJours) * 100).toFixed(0) + "%";

  if (progress.style.width != "100%") {
    let btnArreter = document.getElementById("btnStop");
    btnArreter.classList =
      "btn btn-danger d-flex flex-column align-items-center w-15 me-3";
    timerInterval = setInterval(() => {
      value++;
      let valuePct = (value / nbJours) * 100;
      if (valuePct < 50) {
        progress.classList = "progress-bar bg-danger";
      } else if (valuePct < 100) {
        progress.classList = "progress-bar bg-warning";
      } else {
        progress.classList = "progress-bar bg-success";
      }
      realisation.setAttribute("value", value);
      avancement.setAttribute("value", valuePct.toFixed(0));
      progress.style.width = valuePct.toFixed(0) + "%";
      if (value == nbJours) {
        clearInterval(timerInterval);
        btnArreter.classList =
          "btn btn-white border-2 border-danger text-danger d-flex flex-column align-items-center w-15 me-3";
      }
    }, utils.convertirJoursEnMillisecondes(1));
  }
}

/**
 * Cette fonction permet d'arrêter la minuterie.
 *
 * @author - alexandre-roy
 */
function arreterMinuterie() {
  clearInterval(timerInterval);
  let progress = document.getElementById("progressBar");
  if (progress.style.width != "100%") {
    let btnDemarrer = document.getElementById("btnStart");
    btnDemarrer.classList =
      "btn btn-success me-2-5 d-flex flex-column align-items-center w-15 ms-4-5";
  }
  let btnArreter = document.getElementById("btnStop");
  btnArreter.classList =
    "btn btn-white border-2 border-danger text-danger d-flex flex-column align-items-center w-15 me-3";
}

/**
 * Cette fonction mets à jour les données du DataTable dudiagramme de Gantt.
 *
 * @author - alexandre-roy
 */
function sauvegarderChangementsTache() {
  let id = document.getElementById("id").value;
  let titre = document.getElementById("titre").value;
  let dateDebut = new Date(document.getElementById("dateDebut").value);
  let dateFin = new Date(document.getElementById("dateFin").value);
  let avancement = Number(document.getElementById("avancement").value);
  let dependances = document.getElementById("dependances").value;

 for (let i = 0; i < DATA_TACHES.detailsTache.length; i++) {
  if (DATA_TACHES.detailsTache[i].id === id) {
    DATA_TACHES.detailsTache[i].titre = titre;
    DATA_TACHES.detailsTache[i].dateDebut = dateDebut;
    DATA_TACHES.detailsTache[i].dateFin = dateFin;
    DATA_TACHES.detailsTache[i].dureeEnNbJours = dateFin.getDate() - dateDebut.getDate();
    DATA_TACHES.detailsTache[i].pctComplete = avancement;
    DATA_TACHES.detailsTache[i].dependances = dependances ? dependances.split(",") : null;
    break;
  }
}

chargerEtAfficherDonneesDiagrammeEtCards();
}

/**
 * Cette fonction supprime une tâche dont le Id est spécifié dans un attribut HTML personnalisé « data-id » dans les données du graphique.
 *
 * @param {Event} e
 * @author - alexandre-roy
 */
function supprimerTache(e) {
  let index = e.target.getAttribute("data-id");

  let idTache = e.target.getAttribute("idTache");

  if (verifierSiDependanceExiste(idTache)) {
    afficherToast("negatif");
    return;
  }
  DATA_TACHES.detailsTache.splice(index, 1);

  grandeur -= 45;
  chargerEtAfficherDonneesDiagrammeEtCards();
  afficherToast("positif");
}

/**
 * Cette fonction affiche un toast en fonction de l'action effectuée.
 *
 * @param {string} pToast - Si on veux afficher un toast positif ou négatif.
 * @author - alexandre-roy
 */
function afficherToast(pToast, pMessage) {
  if (pToast == "positif") {
    let toastElement = document.getElementById("toast");
    let toastHeader = document.getElementById("toast-header");
    toastHeader.classList =
      "toast-header bg-success text-white border-2 border-dark rounded-top-1";
    let toastTitre = document.getElementById("toast-titre");
    toastTitre.textContent = "ACTION COMPLÉTÉE";
    let toastBody = document.getElementById("toast-body");
    toastBody.classList = "toast-body bg-white text-dark rounded-bottom-2";
    toastBody.textContent = "La tâche a été supprimée avec succès.";
    let toast = new bootstrap.Toast(toastElement);
    toast.show();
  } else if (pToast == "negatif") {
    let toastElement = document.getElementById("toast");
    let toastHeader = document.getElementById("toast-header");
    toastHeader.classList =
      "toast-header bg-warning text-dark border-2 border-dark";
    let toastTitre = document.getElementById("toast-titre");
    toastTitre.textContent = "ACTION IMPOSSIBLE";
    let toastBody = document.getElementById("toast-body");
    toastBody.classList = "toast-body bg-white text-dark rounded-bottom-1";
    toastBody.textContent = "D'autres tâches dépendent de celle-ci.";
    let toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
  else if (pToast == "form"){
    let toastElement = document.getElementById("toast");
    let toastHeader = document.getElementById("toast-header");
    toastHeader.classList =
      "toast-header bg-warning text-dark border-2 border-dark";
    let toastTitre = document.getElementById("toast-titre");
    toastTitre.textContent = "ACTION IMPOSSIBLE";
    let toastBody = document.getElementById("toast-body");
    toastBody.classList = "toast-body bg-white text-dark rounded-bottom-1";
    if(pMessage == "vide")
    {
      toastBody.textContent = "Veuillez remplir tous les champs.";
    }  
    else if(pMessage == "date")
    {
      toastBody.textContent = "La date de fin doit être supérieure à la date de début.";
    } 
    let toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
}

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
