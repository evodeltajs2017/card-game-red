class CardTypes {

	constructor(container) {
		this.container = container;
		this.itemsPerPage = undefined;
		this.currentPage = undefined;
		this.totalItems = undefined;
		this.totalPages = undefined;
	}

	initialize() {
		this.createMainContainer();
		this.currentPage = 1;
		this.requestPromise();
		this.setEventListenersForSearch();
	}

	createMainContainer() {
		const divMain = document.createElement("div");
		divMain.innerHTML = 
		`<div class="card-types">
			<div class="header">
				<h1 class="title">View card types</h1>
				<div class="search">
					<input type="text" class="searchField" placeholder="Search"></input>
					<input type="submit" class="searchButton"></input>
				</div>
			</div> 
			<div class="content"></div>
		</div>`;
		this.container.appendChild(divMain);
	}

	requestPromise(searchName) {
		const cardTypesRepository = new CardTypesRepository();
		const promise = cardTypesRepository.getCardTypes(this.currentPage, searchName);
		promise.then((data) => {
			console.log(`The statement is${data.test}`);
			this.generateContent(data, searchName);
		}).catch((reason) => {
			console.log("Error", reason.statusText);
		});
	}

	getSearchField() {
		return document.querySelector(`.card-types .searchField`);
	}

	generateContent(result, search) {
		this.initializeValues(result);
		let contentDiv = `
			<div class="pages">
				${this.getGeneratedTable(result)}
				<div class="itemsPerPage">Showing ${this.itemsPerPage} out of ${this.totalItems} cards</div>
				<div class="pageButtons">${this.getGeneratedPageButtons()}<div>
			</div>`;
		document.querySelector(".card-types .content").innerHTML = contentDiv;
		this.setEventListenersForPageButtons(search);
		this.setEventListenersForAdminButtons();
	}

	initializeValues(result) {
		this.itemsPerPage = result.cardTypes.length;
		this.totalItems = result.count;
		this.totalPages = parseInt(this.totalItems / 10);
		if (this.totalItems % 10 > 0) {
			this.totalPages++;
		}
	}

	getGeneratedTable(data) {
		let table = `<table>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Cost</th>
				<th>Damage</th>
				<th>Health</th>
				<th>Actions</th>
			</tr>`;
		for (let i = 0; i < this.itemsPerPage; i++) {
			let cardType = data.cardTypes[i];
			table += `<tr><td>${cardType.Id}</td>
			<td>${cardType.Name}</td>
			<td>${cardType.Cost}</td>
			<td>${cardType.Damage}</td>
			<td>${cardType.Health}</td>
			<td>${this.getGeneratedAdminButtons(i, cardType.Id)}</td></tr>`;
		}
		table += `</table>`;
		return table;
	}

	getGeneratedAdminButtons(id, data) {
		return `<button type="button" data-internalid="${data}" class="edit${id}">Edit</button><button type="button" data-internalid="${data}" class="delete${id}">Delete</button>`
	}

	getGeneratedPageButtons() {
		let pageButtons = "";
		for (let i = 1; i <= this.totalPages; i++) {
			if (this.currentPage == i) {
				pageButtons += `<button disabled>${i}</button>`;
			} else {
				pageButtons += `<button class="pageButton${i}">${i}</button>`;
			}
		}
		return pageButtons;
	}

	setEventListenersForPageButtons(search) {
		for (let i = 1; i <= this.totalPages; i++) {
			if (i != this.currentPage) {
				document.querySelector(`.card-types .pageButton${i}`).addEventListener("click", (e) => { 
					this.currentPage = i;
					this.requestPromise(search);
				 }, false);
			}
		}
	}

	setEventListenersForAdminButtons() {
		for (let i = 0; i < this.itemsPerPage; i++) {
			this.getAdminEditButton(i).addEventListener("click", (e) => { this.getMessageForEdit(i); }, false);
			this.getAdminDeleteButton(i).addEventListener("click", (e) => { this.getMessageForDelete(i); }, false);
		}
	}

	getAdminEditButton(id) {
		return document.querySelector(`.card-types .edit${id}`);
	}

	getMessageForEdit(id) {
		console.log(`Pressed edit button for the card type with the id ${this.getAdminEditButton(id).getAttribute("data-internalid")}`);
	}

	getAdminDeleteButton(id) {
		return document.querySelector(`.card-types .delete${id}`);
	}

	getMessageForDelete(id) {
		console.log(`Pressed delete button for the card type with the id ${this.getAdminDeleteButton(id).getAttribute("data-internalid")}`);
	}

	setEventListenersForSearch() {
		document.querySelector(`.card-types .searchButton`).addEventListener("click", (e) => { 
			this.onSearch();
		}, false);
		this.getSearchField().addEventListener("keyup", (e) => {
		    if (e.keyCode == 13) {
		        this.onSearch();
		    }
		});
	}

	onSearch() {
		this.currentPage = 1;
		this.requestPromise(this.getSearchField().value);
		this.getSearchField().value = "";
	}

	destroy() {
	}

}
