class OpenPacks {
	constructor(container) {
		this.container = container;
		this.unopenedCPNumber = null;
        this.marginLeftParticles = 360;
        this.marginTopParticles = 360;
        this.pi = 3.14;
        this.piRadians = 180;
        this.domElement = null;

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
        this.domElement.innerHTML = `<div class="header">
							<div class="title">
								<h1>Open Card Packs</h1>
							</div>
							<button class="button">Open</button>
						</div>`;

        this.domElement.innerHTML += `<div class="grid secondary-container">
                            <div class="packs-div"></div>
                            <div class="pack-number-div"> 
                                <p class="pack-number"></p>
                            </div>
						</div>`;

        this.domElement.innerHTML += `<div class="open-packs-zone secondary-container">
                            <div class="particles-div"></div>
                            <div class="centered-card-pack"></div>
						</div>`;

        this.renderCardPacksGrid();

        this.domElement.querySelector(".button").addEventListener("click", (e) => {
            this.openPack(e);
        }, false);
	}

	renderCardPacksGrid(){
        this.domElement.querySelector(".packs-div").innerHTML = "";
	    if(this.domElement.querySelector(".first-pack") !== null){
            this.domElement.querySelector(".first-pack").outerHTML = "";
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
        this.domElement.querySelector(".button").disabled = true;
    }

    renderCardPacks(notDisplayablePacksNr){
        const container =  this.domElement.querySelector(".packs-div");
        this.renderFirstCardPack();

        for (let i = 1; i <= this.unopenedCPNumber - notDisplayablePacksNr - 1; i++) {
            let cardPack = new CardPack(container, () => {});
            cardPack.initialize();
        }
        this.displayNumberOfRemainingPacks(notDisplayablePacksNr);
    }

    renderFirstCardPack(){
        if(this.unopenedCPNumber >= 1){

            let cardPack = new CardPack( this.domElement, () => {this.openPack();});
            cardPack.initialize();
            cardPack.domElement.className += " first-pack animated";
        }
    }

    displayNumberOfRemainingPacks(remainingPacksNr){
        const remainingNumberDiv =  this.domElement.querySelector(".pack-number-div");

        if(remainingPacksNr === 0){
            remainingNumberDiv.style.display = "none";
        }
        if(remainingPacksNr > 0){
            remainingNumberDiv.style.display = "show";
            const remainingPacks =  this.domElement.querySelector(".pack-number");
            remainingPacks.innerHTML = `+${remainingPacksNr}`;
        }
    }

    centerPack(){
        this.domElement.querySelector(".card-pack.animated").className += " move";
    }

    resetOpenPackCssClasses(){
        this.domElement.querySelector(".centered-card-pack").className = "centered-card-pack";
        this.domElement.querySelector(".open-packs-zone").className = " open-packs-zone secondary-container";
        this.domElement.querySelector(".centered-card-pack").style.display = "inherit";
        this.domElement.querySelector(".move").style.opacity = "1.0";
        this.domElement.querySelector(".particles-div").innerHTML = "";
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
        this.domElement.querySelector(".open-packs-zone").className += " circle-burn";
    }

    explodePack(){
        this.domElement.querySelector(".card-pack.animated.move").className += " explode";
    }

    hideCenterPack(){
        this.domElement.querySelector(".move").style.opacity = "0.0";
        this.domElement.querySelector(".centered-card-pack").style.display = "none";
    }

    displayExplosionParticles(){
        const colors = ["#7F0000", "#E1B076", "#525657", "#5B4436", "#A64531", "#FE0000", "#F1C588", "#2C2C2E",
            "#84869F", "#7F0000", "#1B28A8", "#454A46"];

        const particleNumber = 300;

        for(let i=0; i<particleNumber; i++){

            const particleDiv = this.createExplosionParticleDiv();

            const randColor = colors[Math.floor(Math.random() * colors.length)];
            particleDiv.style.backgroundColor = randColor;
            particleDiv.style.boxShadow = `0 0 0 20px ${randColor}`;

            setTimeout(() => {
                this.setExplosionParticleStyle(particleDiv, particleNumber, i, randColor);
            }, 100);
        }
    }

    createExplosionParticleDiv(){
        const centerPack =  this.domElement.querySelector(".particles-div");
        const particleDiv =  document.createElement("div");
        particleDiv.className = "explosion-pixel";
        centerPack.appendChild(particleDiv);
        return particleDiv;
    }

    setExplosionParticleStyle(explosionParticle, particleNumber, index, color){
        const circleMaxRadius = 400;
        let randRadius = Math.random() * circleMaxRadius;

        let x = this.marginLeftParticles + (randRadius + 200) * Math.sin(this.pi / this.piRadians * index * (2*this.piRadians/particleNumber));
        let y = this.marginTopParticles + randRadius * Math.cos(this.pi / this.piRadians * index * (2*this.piRadians/particleNumber));

        explosionParticle.style.left = x + "px";
        explosionParticle.style.top = y + "px";
        explosionParticle.style.boxShadow = `0 0 20px 1px ${color}`;
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
            }, 3250);
    }

	destroy() {
	}
}