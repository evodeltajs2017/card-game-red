class EditDeck {

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
			`<div class="edit-deck-container" style="height:${0.77 * screen.height}px">
				<div class="header">
					<div class="title"><h1>Edit deck</h1></div>
					<div class="buttons">
						<button class="cancelButton">Cancel</button>
						<button title="No changes made" class="saveButton" disabled="true">Save</button>
					</div>
				</div> 
				<div class="content"></div>
			</div>`;
		this.container.appendChild(divMain);
		this.generateCards();
		this.setEventListenerForSave();
		this.setEventListenerForCancel();
		this.setEventListenerForName();
	}

	generateCards() {
		document.querySelector(`.edit-deck-container .content`).innerHTML = `
			<div class="available-cards"></div>
			<div class="container-created-deck">
				<input class="deck-name" placeholder="Card Deck Name"></input>
				<div class="choosed-cards"></div>
			</div>
		`;
		const deckRepository = new DeckRepository();
		const promise = deckRepository.getCardsForDeck(this.router.getOptions().deckId);
		promise.then((data) => {
			this.buildCards(data);
		},(reason) => {
			console.log("Error", reason.statusText);
		});
	}

	buildCards(data) {
		this.totalCards = data.cardsNotUsed.length + data.cardsUsed.length;
		this.countCardsInDeck = data.cardsUsed.length;
		this.getInputName().value = data.deckName;
		let divCardsNotUsed = "";
		for (let i = 0; i < data.cardsNotUsed.length; i++) {
			divCardsNotUsed += `
				<div class="drag-box draggable${i}" draggable="true" data-position="0" data-id="${data.cardsNotUsed[i].Id}">
					<div class="mana-cost">${data.cardsNotUsed[i].Cost}</div>
					<div class="card-name">${data.cardsNotUsed[i].Name}</div>
				</div>
			`;
		}
		this.getDivAvailableCards().innerHTML = divCardsNotUsed;
		let divCardsUsed = "";
		for (let i = 0; i < data.cardsUsed.length; i++) {
			divCardsUsed += `
				<div class="drag-box draggable${i + data.cardsNotUsed.length}" draggable="true" data-position="1" data-id="${data.cardsUsed[i].Id}">
					<div class="mana-cost">${data.cardsUsed[i].Cost}</div>
					<div class="card-name">${data.cardsUsed[i].Name}</div>
				</div>
			`;
		}
		this.getDivChoosedCards().innerHTML = divCardsUsed;
		this.setListeners();
	}

	setListeners() {
		const availableCards = this.getDivAvailableCards();
		const choosedCards = document.querySelector(`.edit-deck-container .container-created-deck`);

		for (let i = 0; i < this.totalCards; i++) {
			const draggableDiv = document.querySelector(`.edit-deck-container .draggable${i}`);
			draggableDiv.ondragstart = (e) => {
			    this.draggedElement = draggableDiv;
			    let position = draggableDiv.getAttribute("data-position");
			    if (position == 1) {
			    	availableCards.classList.add("animation");
			    } else {
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
				this.getButtonSave().setAttribute("title", `${this.countCardsInDeck} current card(s) in deck (required 30)`);
				this.checkValidation();
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
				this.getButtonSave().setAttribute("title", `${this.countCardsInDeck} current card(s) in deck (required 30)`);
				this.checkValidation();
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
			if (this.getInputName().value != "") {
				let cardIds = [];
				for (let i = 0; i < this.totalCards; i++) {
					if (document.querySelector(`.edit-deck-container .draggable${i}`).getAttribute("data-position") == 1) {
						cardIds.push(document.querySelector(`.edit-deck-container .draggable${i}`).getAttribute("data-id"));
					}
				}
				const promise = deckRepository.editDeck(
					this.router.getOptions().deckId,
					this.getInputName().value,
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

	setEventListenerForCancel() {
		document.querySelector(`.edit-deck-container .cancelButton`).addEventListener("click", (e) => {
			this.router.go("/view-decks");
		});
	}

	setEventListenerForName() {
		this.getInputName().addEventListener("input", (e) => {
			this.checkValidation();
		}); 
	}

	checkValidation() {
		let checkName = this.getInputName().value != null && this.getInputName().value != "" && this.getInputName().value != undefined;
		if (this.countCardsInDeck == 30 && checkName) {
			this.getButtonSave().disabled = false;
			this.getButtonSave().setAttribute("title", ``);
		} else if (this.countCardsInDeck == 30 && !checkName) {
			this.getButtonSave().setAttribute("title", `Name field is empty`);
			this.getButtonSave().disabled = true;
		} else {
			this.getButtonSave().disabled = true;
		}
	}

	getDivAvailableCards() {
		return document.querySelector(`.edit-deck-container .available-cards`);
	}

	getDivChoosedCards() {
		return document.querySelector(`.edit-deck-container .choosed-cards`);
	}

	getButtonSave() {
		return document.querySelector(".edit-deck-container .saveButton");
	}

	getInputName() {
		return document.querySelector(`.edit-deck-container .deck-name`);
	}

	destroy() {
	}

}
