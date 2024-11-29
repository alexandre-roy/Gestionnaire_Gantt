"use strict";

// eslint-disable-next-line no-unused-vars
const DATA_TACHES = {
    taches: [
        { type: "string", titreTache: "ID de la tâche" },
        { type: "string", titreTache: "Nom de la tâche" },
        { type: "date", titreTache: "Date de début" },
        { type: "date", titreTache: "Date de fin" },
        { type: "number", titreTache: "Durée" },
        { type: "number", titreTache: "% complétée" },
        { type: "string", titreTache: "Dépendances" }
    ],
    detailsTache: [
        {
            id: "task01",
            titre: "Trouver une idée de projet",
            dateDebut: new Date(2023, 10, 1),
            dateFin: new Date(2023, 10, 5),
            dureeEnNbJours: 4,
            pctComplete: 100,
            dependances: null
        },
        {
            id: "task02",
            titre: "Créer la maquette filaire",
            dateDebut: new Date(2023, 10, 5),
            dateFin: new Date(2023, 10, 7),
            dureeEnNbJours: 2,
            pctComplete: 50,
            dependances: ["task01"]
        }, 
        {
            id: "task03",
            titre: "Composer les textes",
            dateDebut: new Date(2023, 10, 5),
            dateFin: new Date(2023, 10, 8),
            dureeEnNbJours: 3,
            pctComplete: 33,
            dependances: ["task01"]
        },
        {
            id: "task04",
            titre: "Créer la mise en page Boostrap",
            dateDebut: new Date(2023, 10, 6),
            dateFin: new Date(2023, 10, 7),
            dureeEnNbJours: 1,
            pctComplete: 100,
            dependances: ["task01"]
        },
        {
            id: "task05",
            titre: "Développer la partie dynamique (JavaScript)",
            dateDebut: new Date(2023, 10, 7),
            dateFin: new Date(2023, 10, 17),
            dureeEnNbJours: 10,
            pctComplete: 0,
            dependances: ["task04", "task02"]
        }
    ]

};