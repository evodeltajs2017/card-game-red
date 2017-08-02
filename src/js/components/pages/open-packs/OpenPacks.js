class OpenPacks {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.className = "open-packs-container";
		this.container.appendChild(div);
        this.domElement = div;

        this.render();
	}

	render(){
		const div = document.querySelector(".open-packs-container");
        div.innerHTML = `<div class="header">
							<div class="title">
								<h1>Open Card Packs</h1>
							</div>
							<div class="button">
								<button>Open</button>
							</div>
						</div>`;

        div.innerHTML += `<div class="grid secondary-container">
                            <div class="pack-number-div"> 
                                <p class="plus">+</p> 
                                <p class="pack-number">2</p>
                            </div>
						</div>`;

        div.innerHTML += `<div class="open-packs-zone secondary-container">
                            <div class="centered-card-pack">
                            </div>
						</div>`;

        this.renderCardPacks();
	}

	renderCardPacks(){
	    document.querySelector(".grid").innerHTML = document.querySelector('.pack-number-div').outerHTML;

	    let unopenedCPNumber = 0;

        const repo = new UserRepository();
        repo.getUnopenedCardPacks((status, data) => {
            if (status !== 200) {

                div.innerHTML = "<h1>Get Error</h1>";

            } else {
                console.log(status, data.UnopenedCardPacks);
                unopenedCPNumber = data.UnopenedCardPacks;
                console.log(unopenedCPNumber);

                const rest = unopenedCPNumber - 3;

                const container = document.querySelector(".grid");
                for (let i = 1; i <= unopenedCPNumber - rest; i++) {
                    let x = 50;
                    let y = 35 * i + 190 * ( i - 1 );

                    const cardPack = new CardPack(container);
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
                    remainingPacks.innerHTML = rest;
                }
            }
        });
    }

	destroy() {
	}
}