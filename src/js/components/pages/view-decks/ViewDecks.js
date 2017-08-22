class ViewDecks {

	constructor(container, router) {
		this.container = container;
		this.router = router;
		this.grid = undefined;
	}

	initialize() {
		this.grid = new Grid(this.container, `View decks`, `http://localhost:3000/view-deck`,
			[{
				fieldName: "id",
				displayName: "ID",
				width: 100,
				render: (rawData, i) => `<div>${rawData.Id}</div>`
			}, {
				fieldName: "name",
				displayName: "Name",
				render: (rawData, i) => `<div>${rawData.Name}</div>`
			}, {
				fieldName: "actions",
				displayName: "Actions",
				width: 200,
				render: (rawData, i) => `<button type="button" data-internalid="${rawData.Id}" class="edit${i}">Edit</button><button type="button" data-internalid="${rawData.Id}" class="delete${i}">Delete</button>`,
				listener: (i) => this.setEventListeners(i)
			}]);
		this.grid.initialize();
	}

	setEventListeners(i) {
		document.querySelector(`.grid-container .edit${i}`).addEventListener("click", (e) => { this.editDeck(i); }, false);
		document.querySelector(`.grid-container .delete${i}`).addEventListener("click", (e) => { this.deleteDeck(i); }, false);
	}

	editDeck(i) {
		let deckId = document.querySelector(`.grid-container .edit${i}`).getAttribute("data-internalid");
		this.router.go("/add-deck", false, {deckId});
	}

	deleteDeck(i) {
		let deckId = document.querySelector(`.grid-container .delete${i}`).getAttribute("data-internalid");
		if (confirm(`Are you sure you want to delete the deck with the id ${deckId}?`)) {
			const deckRepository = new DeckRepository();
			const promise = deckRepository.deleteDeck(deckId);
			promise.then((data) => {
				if (data.isDeck == 1) {
					alert(`Deleted the deck with the id ${deckId}.`);
				} else {
					alert(`The deck with the id ${deckId} was already deleted.`);
				}
				this.grid.generateGrid();
			}).catch((reason) => {
				console.log("Error", reason.statusText);
			});
		}
	}

	destroy() {
	}

}
