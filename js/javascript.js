import { DATA_TACHES } from "./data-taches.js";
import * as utils from "./fonctions-utilitaires.js";

let myData = DATA_TACHES;

/**
 * Fonction qui met en place le visuel de la page.
 * 
 * @author - alexandre-roy
 */
function chargerEtAfficherDonneesDiagrammeEtCards(){
    afficherCardsTaches();
}

/**
 *  Affiche toutes les tâches sous forme de card.
 * 
 * @author - alexandre-roy
 */
function afficherCardsTaches(){
    let rowCards = document.getElementById("cards");
    rowCards.classList = "row";

    rowCards.textContent = "";

    for(const i in myData.taches){
        let card = utils.creerCard(myData.detailsTache[i]);
        rowCards.appendChild(card);
    }
}

/**
 * Permet de bâtir le DataTable que Google a besoin à partir de notre base de données (DATA_TACHES).
 *  
 * @author - alexandre-roy
 */
function creerDonneesPourGraphique(){
    
}

/**
 * Vérifie si la tâche fait partie des dépendances d'autres tâches. 
 * 
 * @param {string} pIdTache - L'id de la tâche à vérifier.
 * @returns {boolean} - Retourne vrai si la tâche fait partie des dépendances d'autres tâches, sinon faux.
 * @author - alexandre-roy
 */
function verifierSiDependanceExiste(pIdTache){

}

/**
 * Permet d'afficher les données dans une formulaire intégré à une fenêtre modale pour les éditer.
 * 
 * @author - alexandre-roy
 */
function recupererTacheSelectionneeDansDiagrammeDeGantt(){

}

/**
 * Cette fonction compte les secondes et les affiche dans le champ Réalisation.
 * 
 * @author - alexandre-roy
 */
function calculerAvancement(){

}

/**
 * Cette fonction permet d'arrêter la minuterie.
 * 
 * @author - alexandre-roy
 */
function arreterMinuterie(){

}

/**
 * Cette fonction mets à jour les données du DataTable dudiagramme de Gantt.
 * 
 * @author - alexandre-roy
 */
function sauvegarderChangementsTache(){

}

/**
 * Cette fonction supprime une tâche dont le Id est spécifié dans un attribut HTML personnalisé « data-id » dans les données du graphique.
 * 
 * @param {Event} e 
 * @author - alexandre-roy
 */
function supprimerTache(e){

}

/**
 * Fonction d'initialisation de la page.
 * 
 * @author - alexandre-roy
 */
function initialisation(){
    chargerEtAfficherDonneesDiagrammeEtCards();
}

/**
 * Appel de la fonction initialisation lors du chargement de la page.
 * 
 * @author - alexandre-roy
 */
window.addEventListener("DOMContentLoaded", initialisation);