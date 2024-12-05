import ToastModale from "../components/ToastModale.js";

class Formulaire {
    constructor(app) {
        this.app = app;
        this.formulaireHTML = document.querySelector("form");
        this.boutonSoumettre = this.formulaireHTML.querySelector("[type='submit']");
        this.formulaireHTML.addEventListener("change", this.validerFormulaire.bind(this));
        this.formulaireHTML.addEventListener("submit", this.onSoumettre.bind(this));
    }



    async onSoumettre(evenement) {
        evenement.preventDefault();

        if (this.formulaireHTML.checkValidity()) {
            const body = {
                type: this.formulaireHTML.type.value,
                duree: this.formulaireHTML.duree.value,
                description: this.formulaireHTML.description.value,
                date: this.formulaireHTML.date.value,
                difficulte: this.formulaireHTML.difficulte.value,
            };

            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };

            const reponse = await fetch("http://localhost:80/api/exercices/ajouterUn.php", config);
            const message = await reponse.json();
            //Rediriger vers la liste après
            history.pushState({}, "", "/liste");
            this.app.getRouter().miseAJourURL();
            new ToastModale("L'élément a été ajouté avec succès", "success");
        }
    }

    validerFormulaire() {
        let estValide = this.formulaireHTML.checkValidity();
        if(estValide == true){
            this.boutonSoumettre.classList.remove('disabled');
            // console.log(this.boutonSoumettre);
        }else {
            this.boutonSoumettre.classList.add('disabled');
        }
    }
}

export default Formulaire;
