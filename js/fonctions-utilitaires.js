
/**
 * Cette fonction permet Créer la structure HTML pour afficher une card à partir des paramètres.
 * 
 * @param {object} pDetails - Les détails de la tâche. 
 * @returns - Une carte de tâche.
 * @author - alexandre-roy
 */
export function creerCard(pDetails){    
    let colCards = document.createElement("div");
    colCards.classList = "col-12 col-sm-6 col-lg-4";

    let card = document.createElement("div");
    card.classList = "card shadow bg-white rounded-4 card-tache m-2";

    let imgCard = document.createElement("img");
    imgCard.className = "card-img-top";
    imgCard.src = "images/checkbox.png";
    imgCard.classList = "w-50"; 

    let divTitre = document.createElement("div");
    divTitre.classList = "mx-3";

    let titreTache = document.createElement("h2");
    titreTache.classList = "card-title fs-5";
    titreTache.textContent = `${pDetails.id}: ${pDetails.titre}`;

    let cardBody = document.createElement("div");
    cardBody.classList = "card-body py-0 d-flex align-items-center";

    let dl = document.createElement("dl");

    let dtIdTache = document.createElement("dt");
    dtIdTache.textContent = "id";
    let ddIdTache = document.createElement("dd");
    ddIdTache.textContent = pDetails.id;
    dl.appendChild(dtIdTache);
    dl.appendChild(ddIdTache);

    let dtTitre = document.createElement("dt");
    dtTitre.textContent = "titre";
    let ddTitre = document.createElement("dd");
    ddTitre.textContent = pDetails.titre;
    dl.appendChild(dtTitre);
    dl.appendChild(ddTitre);

    let dtDateDebut = document.createElement("dt");
    dtDateDebut.textContent = "dateDebut";
    let ddDateDebut = document.createElement("dd");
    ddDateDebut.textContent = pDetails.dateDebut;
    dl.appendChild(dtDateDebut);
    dl.appendChild(ddDateDebut);

    let dtDateFin = document.createElement("dt");
    dtDateFin.textContent = "dateFin";
    let ddDateFin = document.createElement("dd");
    ddDateFin.textContent = pDetails.dateFin;
    dl.appendChild(dtDateFin);
    dl.appendChild(ddDateFin);

    let dtDureeEnNbJours = document.createElement("dt");
    dtDureeEnNbJours.textContent = "dureeEnNbJours";
    let ddDureeEnNbJours = document.createElement("dd");
    ddDureeEnNbJours.textContent = pDetails.dureeEnNbJours;
    dl.appendChild(dtDureeEnNbJours);
    dl.appendChild(ddDureeEnNbJours);

    let dtPctComplete = document.createElement("dt");
    dtPctComplete.textContent = "pctComplete";
    let ddPctComplete = document.createElement("dd");
    ddPctComplete.textContent = pDetails.pctComplete;
    dl.appendChild(dtPctComplete);
    dl.appendChild(ddPctComplete);

    let dtDependances = document.createElement("dt");
    dtDependances.textContent = "dependances";
    let ddDependances = document.createElement("dd");
    ddDependances.classList = "mb-0";
    ddDependances.textContent = pDetails.dependances || "null";
    dl.appendChild(dtDependances);
    dl.appendChild(ddDependances);

    let divBtn = document.createElement("div");
    divBtn.classList = "d-flex justify-content-end mt-auto mb-3 me-3";

    let btnSupprimer = document.createElement("button");
    btnSupprimer.classList = "btn btn-danger";
    btnSupprimer.textContent = "Supprimer";
    divBtn.appendChild(btnSupprimer);

    cardBody.appendChild(titreTache);
    cardBody.appendChild(dl);
    divTitre.appendChild(titreTache);
    card.appendChild(imgCard);
    card.appendChild(divTitre);
    card.appendChild(cardBody);  
    card.appendChild(divBtn); 
    colCards.appendChild(card);

    return colCards;
}

/**
 * Fonction qui convertit un nombre de jours en millisecondes et le retourne.
 * 
 * @param {number} pNbJours - Le nombre de jours à convertir.
 * @returns - Le nombre de jours en millisecondes.
 * @author - alexandre-roy
 */
export function convertirJoursEnMillisecondes(pNbJours){
    return pNbJours * 24 * 60 * 60 * 1000;
}

/**
 * Fonction qui convertit un nombre de millisecondes en jours et le retourne.
 * 
 * @param {number} pNbMillisecondes - Le nombre de millisecondes à convertir.
 * @returns - Le nombre de millisecondes en jours.
 * @author - alexandre-roy
 */
export function convertirMillisecondesEnJours(pNbMillisecondes){
    return pNbMillisecondes / 24 / 60 / 60 / 1000;
}