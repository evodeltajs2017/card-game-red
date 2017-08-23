class CreateArenaDeck {
	constructor(container, router) {
		this.container = container;
		this.router = router;
	}

	initialize() {
		const domElement = new HtmlElements();
		this.domElement = domElement.createArenaTemplate();
		this.getCardChoises();
	}

	showCardChoises(cards) {
		for (let i = 0; i < cards.length; i++) {
			let card = new Card(this.domElement.querySelector(`.arena-cards`), cards[i]);
			card.initialize();
			Array.from(this.domElement.getElementsByClassName("card")).forEach( (x) => {
				x.className = "card-arena-view";
				// x.style.visibility = "hidden";
				// x.style.left = "-2000px";
				
				x.draggable = true;
				x.addEventListener("click", () => {
					this.addCardToDeck(x);
					setTimeout(this.animateProgressBars.bind(this, x), 500);
					setTimeout(this.cardsOutro.bind(this), 500);
					setTimeout(this.clearOldCards.bind(this), 1000);
					setTimeout(this.getCardChoises.bind(this), 1500);
					// setTimeout(this.cardsIntro.bind(this), 1500);
				});
			});
		}
		// this.cardsIntro();		
	}

	setEventListeners() {
		this.domElement.querySelector(".card-arena-view").addEventListener("click", () => {
			let card = this.domElement.querySelector(".card-arena-view");
			this.addCardToDeck();
		}, false);
	}

	getCardChoises() {
		const card = new ArenaRepository();
		card.getCards()
			.then(
                (cardsData) => {this.showCardChoises(cardsData);}
            )
            .catch( (error) => {
                console.log(error.message);
            });
	}

	animateProgressBars(card) {
		let cardCost = parseInt(card.childNodes[0].textContent);
		let elem = this.domElement.querySelector(`.progress-${cardCost}`);
		let height = 1;
		let id = setInterval(frame, 2);
		
		if (cardCost >= 7) {
			elem = this.domElement.querySelector(`.progress-7`);
		}

		function frame() {
			if (height >= 100) {
			  clearInterval(id);
			} else {
			  height++; 
			  elem.style.height = height + '%'; 
			}
		}
	}

	handleProgressBars(card) {
		let maxPts = 100;
		let cardChoices = [];
		let cardCost = parseInt(card.childNodes[0].textContent);
		let targetProgressBar = this.domElement.querySelector(`.progress-${cardCost}`);
		let height = 0;

		if (cardCost >= 7) {
			targetProgressBar = this.domElement.querySelector(`.progress-7`);
		}

		cardChoices.push()


	}

	addCardToDeck(card) {
		let cardCost = card.childNodes[0].textContent;
		let cardName = card.childNodes[4].textContent;
		const deckContainer = this.domElement.querySelector(".arena-deck");
		const div = document.createElement("div");
		div.className = "deck-card";
		div.innerHTML = `<div class="card-deck-cost">${cardCost}</div>
						<div class="card-deck-name">${cardName}</div>`
		deckContainer.appendChild(div);
	}

	cardsIntro() {
		let elem = this.domElement.getElementsByClassName("card-arena-view");
		
		for (let i = 0; i < elem.length; i++) {
			let pos = Math.floor(Math.random() * 200);
			let id = setInterval(frame, 5);

			function frame() {
				if (pos == 0) {
					clearInterval(id);
				} else {
					pos--;
					// elem[i].style.visibility = "visible";
					elem[i].style.left = 0;
					elem[i].style.bottom = pos * 20 + 'px'; 
					elem[i].style.right = pos + 'px'; 
				}
			}
		}
	}

	cardsOutro() {
		let elem = this.domElement.getElementsByClassName("card-arena-view");

		for (let i = 0; i < elem.length; i++) {
			let pos = 0;
			let incrementer = 0;
			let id = setInterval(frame, 5);

			function frame() {
				incrementer += 1;
         
			    pos += Math.pow(1.05, incrementer);
			     
			    elem[0].style.bottom = pos + "px";
			    elem[1].style.right = pos + "px";
			    elem[2].style.bottom = pos + "px";
			     
			    if (Math.abs(pos) >= 800) {
			        pos = 800;
			        clearInterval(id);
				}
			}
		}
	}

	clearOldCards() {
		let cardsArea = this.domElement.querySelector(`.arena-cards`);
		cardsArea.innerHTML = '';
	}

	

	destroy() {
	}
}