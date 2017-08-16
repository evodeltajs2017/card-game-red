class Grid {

	constructor(container, url, fields, searchField) {
		this.container = container;
		this.url = url;
		this.fields = fields;
		this.searchField = searchField;
		this.itemsPerPage = undefined;
		this.currentPage = undefined;
		this.totalItems = undefined;
		this.totalPages = undefined;
	}

	initialize() {
		this.currentPage = 1;
		this.requestPromise();
	}

	requestPromise() {
		const gridRepository = new GridRepository();
		const promise = gridRepository.getGridForUrl(this.url, this.currentPage, this.searchField);
		promise.then((data) => {
			this.generateContent(data);
		}).catch((reason) => {
			console.log("Error", reason.statusText);
		});
	}

	generateContent(result) {
		this.initializeValues(result.count);
		let contentDiv = `
			<div class="pages">
				${this.getGeneratedTable(result)}
				<div class="itemsPerPage">Showing ${this.itemsPerPage} out of ${this.totalItems}</div>
				<div class="pageButtons">${this.getGeneratedPageButtons()}<div>
			</div>`;
		this.container.innerHTML = contentDiv;
		//TO DO: change this
		this.setEventListenersForPageButtons();
	}

	initializeValues(count) {
		this.itemsPerPage = 10;
		this.totalItems = count;
		this.totalPages = parseInt(this.totalItems / 10);
		if (this.totalItems % 10 > 0) {
			this.totalPages++;
		}
		if (this.totalPages === this.currentPage && this.totalItems % 10 > 0) {
			this.itemsPerPage = this.totalItems % 10;
		}
	}

	getGeneratedTable(data) {
		let table = `<table><tr>`;
		for (let i = 0; i < this.fields.length; i++) {
			table += `<th>${this.fields[i].displayName}</th>`;
		}
		table += `</tr>`;

		for (let i = 0; i < this.itemsPerPage; i++) {
			table += `<tr>`;
			for (let j = 0; j < this.fields.length; j++) {
				//Impediments here
				table += `<td>${this.fields[j].render}</td>`;
			}
			table += `</tr>`;
		}
		table += `</table>`;
		return table;
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

	setEventListenersForPageButtons() {
		for (let i = 1; i <= this.totalPages; i++) {
			if (i != this.currentPage) {
				document.querySelector(`.card-types .pageButton${i}`).addEventListener("click", (e) => { 
					this.currentPage = i;
					this.requestPromise();
				 }, false);
			}
		}
	}

	destroy() {

	}

}