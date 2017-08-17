class ViewDecks {

	constructor(container) {
		this.container = container;
		this.grid = undefined;
	}

	initialize() {
		this.grid = new Grid(this.container, `View decks`, `http://localhost:3000/view-card-types`,
			[{
				fieldName: "id",
				displayName: "ID",
				render: (rawData, i) => `<div>${rawData.Id}</div>`
			}, {
				fieldName: "name",
				displayName: "Name",
				render: (rawData, i) => `<div>${rawData.Name}</div>`
			}, {
				fieldName: "actions",
				displayName: "Actions",
				render: (rawData, i) => `<button type="button" data-internalid="${rawData.Id}" class="edit${i}">Edit</button><button type="button" data-internalid="${rawData.Id}" class="delete${i}">Delete</button>`,
				listener: (i) => this.setEventListeners(i)
			}]);
		this.grid.initialize();
	}

	setEventListeners(i) {
		document.querySelector(`.grid-container .edit${i}`).addEventListener("click", (e) => { this.getMessageForEdit(i); }, false);
		document.querySelector(`.grid-container .delete${i}`).addEventListener("click", (e) => { this.deleteCardType(i); }, false);
	}

	getMessageForEdit(i) {
		console.log(`Pressed edit button for the deck with the id ${document.querySelector(`.grid-container .edit${i}`).getAttribute("data-internalid")}`);
	}

	deleteCardType(i) {
		let cardTypeId = document.querySelector(`.grid-container .delete${i}`).getAttribute("data-internalid");
		if (confirm(`Are you sure you want to delete the deck with the id ${cardTypeId}?`)) {
			const cardTypesRepository = new CardTypesRepository();
			const promise = cardTypesRepository.deleteCardType(cardTypeId);
			promise.then((data) => {
				console.log(data);
				if (data.isCardType == 1) {
					alert(`Deleted the deck with the id ${cardTypeId} and deleted ${data.countCards} cards.`);
				} else {
					alert(`The deck with the id ${cardTypeId} was already deleted.`);
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
