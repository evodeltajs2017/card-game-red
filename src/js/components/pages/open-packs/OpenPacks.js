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
        this.cardsModal = new ShowCardsModal(document.querySelector(".open-packs-container"), () => {this.renderCardPacks();});
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
                            <div class="pack-number-div"> 
                                <p class="pack-number"></p>
                            </div>
						</div>`;

        div.innerHTML += `<div class="open-packs-zone secondary-container">
                            <div class="centered-card-pack">
                            </div>
						</div>`;

        this.renderCardPacks();

        document.querySelector(".button").addEventListener("click", (e) => {
            this.openPack(e);
        }, false);
	}

	renderCardPacks(){
	    document.querySelector(".grid").innerHTML = document.querySelector('.pack-number-div').outerHTML;

        const repo = new UserRepository();
        repo.getUnopenedCardPacks((status, data) => {
            if (status !== 200) {
                console.log("Error");
            } else {
                this.unopenedCPNumber = data.UnopenedCardPacks;

                if(this.unopenedCPNumber <= 0){
                    document.querySelector(".button").disabled = true;
                }

                let rest = this.unopenedCPNumber - 3;
                rest = (rest < 0) ? 0 : rest;

                const container = document.querySelector(".grid");
                for (let i = 1; i <= this.unopenedCPNumber - rest; i++) {
                    let x = 50;
                    let y = 30 * i + 190 * ( i - 1 );

                    let cardPack = (i === 1) ? new CardPack(container, () => {this.openPack();}): new CardPack(container, () => {});
                    cardPack.initialize();

                    cardPack.domElement.style.position = "absolute";
                    cardPack.domElement.style.left = x + "px";
                    cardPack.domElement.style.top = y + "px";
                }

                const remainingNumberDiv = document.querySelector(".pack-number-div");

                if(rest === 0){
                    remainingNumberDiv.style.display = "none";
                }
                if(rest > 0){
                    remainingNumberDiv.style.display = "show";
                    const remainingPacks = document.querySelector(".pack-number");
                    remainingPacks.innerHTML = `+${rest}`;
                }
            }
        });
    }

    centerPack(){
        document.querySelector(".centered-card-pack").className += " opened";
    }

    removeCenterPack(){
        document.querySelector(".centered-card-pack").className = "centered-card-pack";
    }

    showCards(cardsData){
        this.cardsModal.render(cardsData);
    }

    getCards(){
        const cardRepository = new CardRepository();
        cardRepository.openCardpack((status, data) => {
            if (status !== 200) {
                console.log("Error");
            } else {
                this.showCards(data);
            }
        });
    }

    openPack() {
        this.centerPack();
        setTimeout(() => {
            this.getCards();
            this.removeCenterPack();
        }, 500);
    }

	destroy() {
	}
}