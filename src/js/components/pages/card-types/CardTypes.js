class CardTypes {

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
				fieldName: "cost",
				displayName: "Cost",
				render: (rawData, i) => `<div>${rawData.Cost}</div>`
			}, {
				fieldName: "damage",
				displayName: "Damage",
				render: (rawData, i) => `<div>${rawData.Damage}</div>`
			}, {
				fieldName: "health",
				displayName: "Health",
				render: (rawData, i) => `<div>${rawData.Health}</div>`
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
		console.log(`Pressed edit button for the card type with the id ${document.querySelector(`.grid-container .edit${i}`).getAttribute("data-internalid")}`);
	}

	deleteCardType(i) {
		let cardTypeId = document.querySelector(`.grid-container .delete${i}`).getAttribute("data-internalid");
		if (confirm(`Are you sure you want to delete the card type with the id ${cardTypeId}?`)) {
			const cardTypesRepository = new CardTypesRepository();
			const promise = cardTypesRepository.deleteCardType(cardTypeId);
			promise.then((data) => {
				console.log(data);
				if (data.isCardType == 1) {
					if (data.countDecks == undefined || data.countDecks == null || data.countDecks == 0) {
						alert(`Deleted the card type with the id ${cardTypeId} and ${data.countCards} card(s).`);
					} else {
						alert(`Deleted the card type with the id ${cardTypeId}, ${data.countCards} card(s) and ${data.countDecks} deck(s).`);
					}
				} else {
					alert(`The card type with the id ${cardTypeId} was already deleted.`);
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
