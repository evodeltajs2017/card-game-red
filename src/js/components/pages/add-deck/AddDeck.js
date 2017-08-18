class AddDeck {

	constructor(container) {
		this.container = container;
		this.draggedElement = undefined;
	}

	initialize() {
		const divMain = document.createElement("div");
		divMain.innerHTML = 
			`<div class="add-deck-container" style="height:${0.77 * screen.height}px">
				<div class="header">
					<div class="title"><h1>Create deck</h1></div>
					<div class="buttons">
						<button class="saveButton">Save</button>
					</div>
				</div> 
				<div class="content"></div>
			</div>`;
		this.container.appendChild(divMain);
		document.querySelector(`.add-deck-container .content`).innerHTML = `
			<div class="available-cards">
				<div class="drag-box draggable0" draggable="true" data-position="0">0</div> 
				<div class="drag-box draggable1" draggable="true" data-position="0">1</div> 
				<div class="drag-box draggable2" draggable="true" data-position="0">2</div> 
				<div class="drag-box draggable3" draggable="true" data-position="0">3</div> 
			</div>
			<div class="choosed-cards">
				<input class="deck-name" placeholder="Card Deck Name"></input>
				<div class="drag-box draggable4" draggable="true" data-position="1">4</div>
				<div class="drag-box draggable5" draggable="true" data-position="1">5</div>
				<div class="drag-box draggable6" draggable="true" data-position="1">6</div>
				<div class="drag-box draggable7" draggable="true" data-position="1">7</div>
			</div>
		`;
		this.setListeners();
	}

	setListeners() {
		const availableCards = document.querySelector(`.add-deck-container .available-cards`);
		const choosedCards = document.querySelector(`.add-deck-container .choosed-cards`);

		for (let i = 0; i < 8; i++) {
			const draggableDiv = document.querySelector(`.add-deck-container .draggable${i}`);
			draggableDiv.ondragstart = (e) => {
			    this.draggedElement = draggableDiv;
			    let position = draggableDiv.getAttribute("data-position");
			    if(position == 1) {
			    	availableCards.style.backgroundColor = "#26004d";
			    } else {
			    	choosedCards.style.backgroundColor = "#26004d";
			    }
			};
			draggableDiv.ondragend = (e) => {
			    this.draggedElement = undefined;
			    choosedCards.style.backgroundColor = "transparent";
			    availableCards.style.backgroundColor = "transparent";
			};
		}

		availableCards.ondragover = (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
		} 
		availableCards.ondrop = (e) => {
			e.preventDefault();
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
			this.draggedElement.setAttribute("data-position", 1);
			availableCards.style.backgroundColor = "transparent";
			choosedCards.appendChild(this.draggedElement);
			this.draggedElement = undefined;
		}
	}

	destroy() {
	}

}
