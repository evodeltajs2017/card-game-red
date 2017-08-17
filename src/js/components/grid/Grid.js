class Grid {

	constructor(container, pageName, url, fields, searchField) {
		this.container = container;
		this.pageName = pageName;
		this.url = url;
		this.fields = fields;
		this.searchField = searchField;
		this.itemsPerPage = undefined;
		this.currentPage = undefined;
		this.totalItems = undefined;
		this.totalPages = undefined;
	}

	initialize() {
		const divMain = document.createElement("div");
		divMain.innerHTML = 
			`<div class="grid-container">
				<div class="header">
					<div class="title"><h1>${this.pageName}</h1></div>
					<div class="search">
						<input type="text" class="searchField" placeholder="Search"></input>
						<input type="submit" class="searchButton"></input>
					</div>
				</div> 
				<div class="content"></div>
			</div>`;
		this.currentPage = 1;
		this.container.appendChild(divMain);
		this.requestPromise();
		this.setEventListenersForSearch();
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
			<div class="grid">
				${this.getGeneratedTable(result)}
				<div class="itemsPerPage">Showing ${this.itemsPerPage} out of ${this.totalItems}</div>
				<div class="pageButtons">${this.getGeneratedPageButtons()}<div>
			</div>`;
		document.querySelector(`.grid-container .content`).innerHTML = contentDiv;
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
			table += `<th${this.getColumnWidth(i)}>${this.fields[i].displayName}</th>`;
		}
		table += `</tr>`;
		for (let i = 0; i < this.itemsPerPage; i++) {
			table += `<tr>`;
			for (let j = 0; j < this.fields.length; j++) {
				table += `<td${this.getColumnWidth(j)}>${this.fields[j].render(data.items[i])}</td>`;
			}
			table += `</tr>`;
		}
		table += `</table>`;
		return table;
	}

	getColumnWidth(index) {
		if (this.fields[index].width !== undefined) {
			return ` style="width:${this.fields[index].width}px;"`;
		}
		return "";
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
				document.querySelector(`.grid-container .pageButton${i}`).addEventListener("click", (e) => { 
					this.currentPage = i;
					this.requestPromise();
				 }, false);
			}
		}
	}

	setEventListenersForSearch() {
		document.querySelector(`.grid-container .searchButton`).addEventListener("click", (e) => { 
			this.onSearch();
		}, false);
		this.getSearchField().addEventListener("keyup", (e) => {
		    if (e.keyCode == 13) {
		        this.onSearch();
		    }
		});
	}

	onSearch() {
		this.generateGrid(this.getSearchField().value);
		this.getSearchField().value = "";
	}

	getSearchField() {
		return document.querySelector(`.grid-container .searchField`);
	}

	destroy() {

	}

}