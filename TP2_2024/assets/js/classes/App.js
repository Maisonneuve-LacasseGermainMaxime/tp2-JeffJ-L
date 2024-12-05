import Router from "./Router.js";
import Formulaire from "./Formulaire.js";
import Exercice from "./Exercice.js";
import ToastModale from "../components/ToastModale.js";

class App {
    static #instance;
    #listeExercices;
    #formulaire;
    #router;

    //Permet d'accéder à l'instance de la classe de n'importe où dans le code en utilisant App.instance
    static get instance() {
        return App.#instance;
    }   

    constructor() {
        if (App.#instance) {
            return App.#instance;
        } else {
            App.#instance = this;
        }

        this.#listeExercices = [];
        this.#formulaire;

        this.panneauListeHTML = document.querySelector("[data-panneau='liste']");
        this.panneauDetailHTML = document.querySelector("[data-panneau='detail']");
        this.panneauFormulaireHTML = document.querySelector("[data-panneau='formulaire']");
        this.listeExercicesHTML = document.querySelector("[data-liste-exercices]");

        this.#router = new Router(this);
        this.#formulaire = new Formulaire(this);

        localStorage.clear();
    }

   async #recupererTout(){
    const response = await fetch("http://localhost:80/api/exercices/lireTout.php");
    const listeExercices = await response.json();

    this.#listeExercices = [];
    this.listeExercicesHTML.innerHTML = "";

    listeExercices.forEach((exercice) => {
        this.#listeExercices.push(exercice);
        new Exercice(exercice, this.listeExercicesHTML, this);
    });

    }


   async #recupererUn(id){
        try {
            const reponse = await fetch(`http://localhost:80/api/exercices/lireUn.php?id=${id}`);
            const exercice = await reponse.json();

            if (reponse.ok == false) {
                throw new Error(exercice.message);
            }

            const exerciceInfos = exercice[0];
            const { type, duree, description, date, difficulte } = exerciceInfos;

            this.panneauDetailHTML.querySelector("[data-type]").textContent = type;
            this.panneauDetailHTML.querySelector("[data-duree]").textContent = duree;
            this.panneauDetailHTML.querySelector("[data-description]").textContent = description;
            this.panneauDetailHTML.querySelector("[data-date]").textContent = date;
            this.panneauDetailHTML.querySelector("[data-difficulte]").textContent = difficulte;
            
        } catch (error) {
            new ToastModale("Une erreur est survenue", "error");
        }

    }


    async #supprimer(id) {
        const reponse = await fetch(`http://localhost:80/api/exercices/supprimerUn.php?id=${id}`);

        const exercice = await reponse.json();
        //redirection
        history.pushState({}, "", "/");
        this.#recupererTout();

        // Afficher ToastModale
        new ToastModale("Exercice supprimé", "success");
    }

    getSupprimer(id) {
        return this.#supprimer(id);
    }

    getRouter() {
        return this.#router;
    }


    #cacherTout() {
        this.panneauListeHTML.classList.add("invisible");
        this.panneauDetailHTML.classList.add("invisible");
        this.panneauFormulaireHTML.classList.add("invisible");
    }

    afficherListe(){
        this.#cacherTout();
        this.panneauListeHTML.classList.remove("invisible");
        this.#recupererTout();
    }

    afficherDetail(id){
        this.#cacherTout();
        this.panneauDetailHTML.classList.remove("invisible");
        this.#recupererUn(id);
    }

    afficherFormulaire(){
        this.#cacherTout();
        this.panneauFormulaireHTML.classList.remove("invisible");
    }
}

export default App;
