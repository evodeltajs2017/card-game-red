class AddDeck {

	constructor(container, router) {
		this.container = container;
		this.router = router;
		this.draggedElement = undefined;
		this.totalCards = undefined;
		this.countCardsInDeck = 0;
		this.isEdit = router.getOptions() != undefined;
	}

	initialize() {
		const divMain = document.createElement("div");
		let header = "Create deck";
		let buttons = `<button title="Minimum 30 cards required" class="saveButton" disabled="true">Save</button>`;
		if (this.isEdit) {
			header = "Edit deck";
			buttons = `<button class="cancelButton">Cancel</button>
				<button title="No changes made" class="saveButton" disabled="true">Save</button>`;
		}
		divMain.innerHTML = 
			`<div class="add-deck-container" style="height:${0.77 * screen.height}px">
				<div class="header">
					<div class="title"><h1>${header}</h1></div>
					<div class="buttons">${buttons}</div>
				</div> 
				<div class="content"></div>
			</div>`;
		this.container.appendChild(divMain);
		this.generateCards();
		this.setEventListenerForSave();
		this.setEventListenerForName();
		if (this.isEdit) {
			this.setEventListenerForCancel();
		}
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
		let promise = deckRepository.getCards();
		if (this.isEdit) {
			promise = deckRepository.getCardsForDeck(this.router.getOptions().deckId);
		}
		promise.then((data) => {
			this.buildCards(data);
		},(reason) => {
			console.log("Error", reason.statusText);
		});
	}

	buildCards(data) {
		if (this.isEdit) {
			this.totalCards = data.cardsNotUsed.length + data.cardsUsed.length;
			this.countCardsInDeck = data.cardsUsed.length;
			this.getInputName().value = data.deckName;
			let divCardsNotUsed = "";
			for (let i = 0; i < data.cardsNotUsed.length; i++) {
				divCardsNotUsed += this.createDraggable(i, 0, data.cardsNotUsed[i]);
			}
			this.getDivAvailableCards().innerHTML = divCardsNotUsed;
			let divCardsUsed = "";
			for (let i = 0; i < data.cardsUsed.length; i++) {
				divCardsUsed += this.createDraggable(i + data.cardsNotUsed.length, 1, data.cardsUsed[i]);
			}
			this.getDivChoosedCards().innerHTML = divCardsUsed;
		} else {
			this.totalCards = data.items.length;
			let divCards = "";
			for (let i = 0; i < this.totalCards; i++) {
				divCards += this.createDraggable(i, 0, data.items[i]);
			}
			this.getDivAvailableCards().innerHTML = divCards;
		}
		this.setListeners();
	}

	createDraggable(i, position, card) {
		return `<div class="drag-box draggable${i}" draggable="true" data-position="${position}" data-id="${card.Id}">
					<div class="mana-cost">${card.Cost}</div>
					<div class="card-name">${card.Name}</div>
				</div>`;
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
				this.getButtonSave().setAttribute("title", `${this.countCardsInDeck} current card(s) in deck (minimum 30)`);
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
				this.getButtonSave().setAttribute("title", `${this.countCardsInDeck} current card(s) in deck (minimum 30)`);
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
					if (document.querySelector(`.add-deck-container .draggable${i}`).getAttribute("data-position") == 1) {
						cardIds.push(document.querySelector(`.add-deck-container .draggable${i}`).getAttribute("data-id"));
					}
				}
				let promise = deckRepository.addDeck(
					this.getInputName().value,
					cardIds
				);
				if (this.isEdit) {
					promise = deckRepository.editDeck(
						this.router.getOptions().deckId,
						this.getInputName().value,
						cardIds
					);
				}
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

	setEventListenerForName() {
		this.getInputName().addEventListener("input", (e) => {
			this.checkValidation();
		}); 
	}

	setEventListenerForCancel() {
		document.querySelector(`.add-deck-container .cancelButton`).addEventListener("click", (e) => {
			this.router.go("/view-decks");
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
		return document.querySelector(`.add-deck-container .available-cards`);
	}

	getDivChoosedCards() {
		return document.querySelector(`.add-deck-container .choosed-cards`);
	}

	getButtonSave() {
		return document.querySelector(".add-deck-container .saveButton");
	}

	getInputName() {
		return document.querySelector(`.add-deck-container .deck-name`);
	}

	destroy() {
	}

}
