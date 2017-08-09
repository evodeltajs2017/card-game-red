const marginLeftParticles = 360;
const marginTopParticles = 360;

class OpenPacks {
	constructor(container) {
		this.container = container;
		this.unopenedCPNumber = null;

	}

	initialize() {
		const div = document.createElement("div");
		div.className = "open-packs-container";
		this.container.appendChild(div);
        this.domElement = div;

        this.render();
        this.cardsModal = new ShowCardsModal(document.querySelector(".open-packs-container"), () => {this.renderCardPacksGrid();});
        this.cardsModal.initialize();
	}

	render(){
		const div = document.querySelector(".open-packs-container");
        div.innerHTML = `<div class="header">
							<div class="title">
								<h1>Open Card Packs</h1>
							</div>
							<button class="button">Open</button>
						</div>`;

        div.innerHTML += `<div class="grid secondary-container">
                            <div class="packs-div"></div>
                            <div class="pack-number-div"> 
                                <p class="pack-number"></p>
                            </div>
						</div>`;

        div.innerHTML += `<div class="open-packs-zone secondary-container">
                            <div class="centered-card-pack">
                            </div>
						</div>`;

        this.renderCardPacksGrid();

        document.querySelector(".button").addEventListener("click", (e) => {
            this.openPack(e);
        }, false);
	}

	renderCardPacksGrid(){
	    document.querySelector(".packs-div").innerHTML = "";
	    if(document.querySelector(".first-pack") !== null){
            document.querySelector(".first-pack").outerHTML = "";
        }

        const repo = new UserRepository();
        repo.getUnopenedCardPacks()
            .then(
                (data) => {
                    this.unopenedCPNumber = data.UnopenedCardPacks;

                    if (this.unopenedCPNumber <= 0) {
                        this.disableOpenButton();
                    }

                    let notDisplayablePacksNr = this.unopenedCPNumber - 3;
                    notDisplayablePacksNr = (notDisplayablePacksNr < 0) ? 0 : notDisplayablePacksNr;

                    this.renderCardPacks(notDisplayablePacksNr);
                }
            )
            .catch( (error) => {console.log(error);});

    }

    disableOpenButton(){
        document.querySelector(".button").disabled = true;
    }

    renderCardPacks(notDisplayablePacksNr){
        const container = document.querySelector(".packs-div");
        this.renderFirstCardPack();

        for (let i = 1; i <= this.unopenedCPNumber - notDisplayablePacksNr - 1; i++) {
            let cardPack = new CardPack(container, () => {});
            cardPack.initialize();
        }
        this.displayNumberOfRemainingPacks(notDisplayablePacksNr);
    }

    renderFirstCardPack(){
        if(this.unopenedCPNumber >= 1){
            const div = document.querySelector(".open-packs-container");

            let cardPack = new CardPack(div, () => {this.openPack();});
            cardPack.initialize();
            cardPack.domElement.className += " first-pack animated";
        }
    }

    displayNumberOfRemainingPacks(remainingPacksNr){
        const remainingNumberDiv = document.querySelector(".pack-number-div");

        if(remainingPacksNr === 0){
            remainingNumberDiv.style.display = "none";
        }
        if(remainingPacksNr > 0){
            remainingNumberDiv.style.display = "show";
            const remainingPacks = document.querySelector(".pack-number");
            remainingPacks.innerHTML = `+${remainingPacksNr}`;
        }
    }

    centerPack(){
        document.querySelector(".card-pack.animated").className += " move";
    }

    resetOpenPackCssClasses(){
        document.querySelector(".centered-card-pack").className = "centered-card-pack";
        document.querySelector(".open-packs-zone").className = " open-packs-zone secondary-container";
        document.querySelector(".centered-card-pack").style.display = "inherit";
        document.querySelector(".move").style.opacity = "1.0";
    }

    showCards(cardsData){
        this.cardsModal.show(cardsData);
    }

    getCards(){
        const cardRepository = new CardRepository();
        cardRepository.openCardpack()
            .then(
                (cardsData) => {this.showCards(cardsData);}
            )
            .catch( (error) => {
                console.log(error.message);
            });
    }

    animateCircle(){
        document.querySelector(".open-packs-zone").className += " circle-burn";
    }

    explodePack(){
        document.querySelector(".card-pack.animated.move").className += " explode";
    }

    hideCenterPack(){
        document.querySelector(".move").style.opacity = "0.0";
        document.querySelector(".centered-card-pack").style.display = "none";
    }

    displayExplosionParticles(){
        const colors = ["#7F0000", "#E1B076", "#525657", "#5B4436", "#A64531", "#FE0000", "#F1C588", "#2C2C2E",
            "#84869F", "#7F0000", "#1B28A8", "#454A46"];

        const particleNumber = 300;

        for(let i=0; i<particleNumber; i++){

            const particleDiv = this.createExplosionParticleDiv();

            particleDiv.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            setTimeout(() => {
                this.setExplosionParticleStyle(particleDiv, particleNumber, i);
            }, 100);
        }
    }

    createExplosionParticleDiv(){
        const centerPack = document.querySelector(".open-packs-zone");
        const particleDiv = document.createElement("div");
        particleDiv.className = "explosion-pixel";
        centerPack.appendChild(particleDiv);
        this.domElement = particleDiv;
        return particleDiv;
    }

    setExplosionParticleStyle(explosionParticle, particleNumber, index){
        const circleMaxRadius = 400;
        let randRadius = Math.random() * circleMaxRadius;

        let x = marginLeftParticles + (randRadius + 200) * Math.sin(pi / piRadians * index * (2*piRadians/particleNumber));
        let y = marginTopParticles + randRadius * Math.cos(pi / piRadians * index * (2*piRadians/particleNumber));

        explosionParticle.style.left = x + "px";
        explosionParticle.style.top = y + "px";
        explosionParticle.style.height = "1px";
        explosionParticle.style.width = "1px";
        explosionParticle.style.opacity = "0.0";
    }

    openPack() {
        this.centerPack();
        setTimeout(() => {
            this.animateCircle();
            this.explodePack();
            }, 1490);
        setTimeout(() => {
            this.hideCenterPack();
            this.displayExplosionParticles();
            }, 2250);
        setTimeout(() => {
            this.getCards();
            this.resetOpenPackCssClasses();
            }, 3150);
    }

	destroy() {
	}
}