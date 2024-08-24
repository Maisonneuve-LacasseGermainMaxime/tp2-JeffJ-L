class Exercice {
    constructor(exerciceInfos, conteneur, app) {
        const { id, type, duree, description, date, difficulte } = exerciceInfos;
        this.conteneur = conteneur;
        this.app = app;

        this.id = id;
        this.type = type;
        this.duree = duree;
        this.description = description;
        this.date = date;
        this.difficulte = difficulte;

        this.gabaritExercices = document.querySelector("template#exercice");
        this.injecterHTML();
    }

    injecterHTML() {
        let clone = this.gabaritExercices.content.cloneNode(true);

        this.conteneur.append(clone);
        this.elementHTML = this.conteneur.lastElementChild;

        this.elementHTML.id = this.id;

        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{id}}/g, this.id);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{type}}/g, this.type);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{duree}}/g, this.duree);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{description}}/g, this.description);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{date}}/g, this.date);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{difficulte}}/g, this.difficulte);

        this.elementHTML.addEventListener("click", this.onClic.bind(this));
       
    }


    onClic(evenement) {
        const exercice = evenement.currentTarget.closest(".exercice");
        const id = exercice.id;
    
        this.app.afficherDetail(id);
    
        const sectionDetail = document.querySelector("[data-panneau='detail']");
        sectionDetail.id = id;
        sectionDetail.innerHTML = sectionDetail.innerHTML.replaceAll(/{{id}}/g, id);
    
        // Suppression
        const boutonSupprimer = sectionDetail.querySelector(".btn.danger");
        if (boutonSupprimer) {
            boutonSupprimer.addEventListener("click", this.onClicSupprimer.bind(this));
            
        }else {
            history.pushState({}, "", `/detail?id=${id}`);
            this.app.getRouter().miseAJourURL();
        }
    }

    onClicSupprimer(evenement) {
        const declencheur = evenement.target;
        const exercice = declencheur.closest("[data-panneau='detail']");
        const id = exercice.id;

        this.app.getSupprimer(id);
        history.pushState({}, "", "/liste");
        this.app.getRouter().miseAJourURL();
    }
}

export default Exercice;