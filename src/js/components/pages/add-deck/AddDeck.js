class AddDeck {

	constructor(container, router) {
		this.container = container;
		this.router = router;
		this.draggedElement = undefined;
		this.totalCards = undefined;
		this.countCardsInDeck = 0;
	}

	initialize() {
		const divMain = document.createElement("div");
		divMain.innerHTML = 
			`<div class="add-deck-container" style="height:${0.77 * screen.height}px">
				<div class="header">
					<div class="title"><h1>Create deck</h1></div>
					<div class="buttons">
						<button title="Minimum 30 cards required" class="saveButton" disabled="true">Save</button>
					</div>
				</div> 
				<div class="content"></div>
			</div>`;
		this.container.appendChild(divMain);
		this.generateCards();
		this.setEventListenerForSave();
	}

	generateCards() {
		document.querySelector(`.add-deck-container .content`).innerHTML = `
			<div class="available-cards"></div>
			<div class="container-created-deck">
				<input class="deck-name" placeholder="Card Deck Name"></input>
				<div class="choosed-cards"></div>
			</div>
		`;
		const deckRepository = new DeckRepository();
		const promise = deckRepository.getCards();
		promise.then((data) => {
			this.buildCards(data);
		},(reason) => {
			console.log("Error", reason.statusText);
		});
	}

	buildCards(data) {
		this.totalCards = data.items.length;
		let divCards = "";
		for (let i = 0; i < this.totalCards; i++) {
			divCards += `
				<div class="drag-box draggable${i}" draggable="true" data-position="0" data-id="${data.items[i].Id}">
					<div class="mana-cost">${data.items[i].Cost}</div>
					<div class="card-name">${data.items[i].Name}</div>
				</div>
			`;
		}
		this.getDivAvailableCards().innerHTML = divCards;
		this.setListeners();
	}

	setListeners() {
		const availableCards = this.getDivAvailableCards();
		const choosedCards = document.querySelector(`.add-deck-container .container-created-deck`);

		for (let i = 0; i < this.totalCards; i++) {
			const draggableDiv = document.querySelector(`.add-deck-container .draggable${i}`);
			draggableDiv.ondragstart = (e) => {
			    this.draggedElement = draggableDiv;
			    let position = draggableDiv.getAttribute("data-position");
			    if(position == 1) {
			    	// availableCards.style.backgroundColor = "#99661A";
			    	availableCards.classList.add("animation");
			    } else {
			    	// choosedCards.style.backgroundColor = "#99661A";
			    	choosedCards.classList.add("animation");
			    }
			};
			draggableDiv.ondragend = (e) => {
			    this.draggedElement = undefined;
			    choosedCards.style.backgroundColor = "transparent";
			    availableCards.style.backgroundColor = "transparent";
			    choosedCards.classList.remove("animation");
			    availableCards.classList.remove("animation");
			};
		}

		availableCards.ondragover = (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
		} 
		availableCards.ondrop = (e) => {
			e.preventDefault();
			if (this.draggedElement.getAttribute("data-position") == 1) {
				this.countCardsInDeck--;
				this.getButtonSave().setAttribute("title", `${this.countCardsInDeck} current card(s) in deck (minimum 30)`);
				if (this.countCardsInDeck > 29) {
					this.getButtonSave().disabled = false;
				} else {
					this.getButtonSave().disabled = true;
				}
			}
			this.draggedElement.setAttribute("data-position", 0);
			availableCards.style.backgroundColor = "transparent";
			availableCards.appendChild(this.draggedElement);
			this.draggedElement = undefined;
		}

		choosedCards.ondragover = (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
		} 
		choosedCards.ondrop = (e) => {
			e.preventDefault();
			if (this.draggedElement.getAttribute("data-position") == 0) {
				this.countCardsInDeck++;
				this.getButtonSave().setAttribute("title", `${this.countCardsInDeck} current card(s) in deck (minimum 30)`);
				if (this.countCardsInDeck > 29) {
					this.getButtonSave().disabled = false;
				} else {
					this.getButtonSave().disabled = true;
				}
			}
			this.draggedElement.setAttribute("data-position", 1);
			availableCards.style.backgroundColor = "transparent";
			this.getDivChoosedCards().appendChild(this.draggedElement);
			this.draggedElement = undefined;
		}
	}

	setEventListenerForSave() {
		this.getButtonSave().addEventListener("click", (e) => {
			const deckRepository = new DeckRepository();
			if (document.querySelector(`.add-deck-container .deck-name`).value != "") {
				let cardIds = [];
				for (let i = 0; i < this.totalCards; i++) {
					if (document.querySelector(`.add-deck-container .draggable${i}`).getAttribute("data-position") == 1) {
						cardIds.push(document.querySelector(`.add-deck-container .draggable${i}`).getAttribute("data-id"));
					}
				}
				const promise = deckRepository.addDeck(
					document.querySelector(`.add-deck-container .deck-name`).value,
					cardIds
				);
				promise.then((data) => {
					if (data.status > 0) {
						this.router.go("/view-decks");
					}
				},(reason) => {
					console.log("Error", reason.statusText);
				});
			} else {
				alert("Name cannot be empty.");
			}
		}, false);
	}

	getDivAvailableCards() {
		return document.querySelector(`.add-deck-container .available-cards`);
	}

	getDivChoosedCards() {
		return document.querySelector(`.add-deck-container .choosed-cards`);
	}

	getButtonSave() {
		return document.querySelector(".add-deck-container .saveButton");
	}

	destroy() {
	}

}
