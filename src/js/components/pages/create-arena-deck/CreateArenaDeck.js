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
		console.log(cards);
		for (let i = 0; i < cards.length; i++) {
			let card = new Card(this.domElement.querySelector(`.arena-cards`), cards[i]);
			card.initialize();
			Array.from(this.domElement.getElementsByClassName("card")).forEach( x => {x.className = "card-arena-view";} );
		}
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

	handleProgressBars() {
		var elem = document.getElementById("myBar");   
		var width = 1;
		var id = setInterval(frame, 10);
		function frame() {
			if (width >= 100) {
			  clearInterval(id);
			} else {
			  width++; 
			  elem.style.width = width + '%'; 
			}
		}
	}

	destroy() {
	}
}