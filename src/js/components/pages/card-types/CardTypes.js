class CardTypes {
	constructor(container) {
		this.container = container;
	}

	initialize() {
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

		this.requestDatabase(document.querySelector(`.card-types .searchField`).value, 1);

		document.querySelector(`.card-types .searchButton`).addEventListener("click", (e) => { 
			this.onSearch();
		}, false);
		document.querySelector(`.card-types .searchField`).addEventListener("keyup", (e) => {
		    event.preventDefault();
		    if (event.keyCode == 13) {
		        this.onSearch();
		    }
		});
	}

	generateTable(result, page, search) {
		let itemsPerPage = result.cardTypes.length;
		let currentPage = page;
		let totalItems = result.count;
		let totalPages = parseInt(totalItems / 10);
		if (totalItems % 10 > 0) {
			totalPages++;
		}
		// if (totalItems == totalItems % itemsPerPage) {
		// 	itemsPerPage = totalItems % itemsPerPage;
		// }
		
		let pageButtons = "";
		for (let i = 0; i < totalPages; i++) {
			if (currentPage == i + 1) {
				pageButtons += `<button disabled>${i + 1}</button>`;
			} else {
				pageButtons += `<button class="pageButton${i + 1}">${i + 1}</button>`;
			}
		}
		
		let tableTest = `<table>
			<tr>
			<th>ID</th>
			<th>Name</th>
			<th>Cost</th>
			<th>Damage</th>
			<th>Health</th>
			<th>Admins</th>
			</tr>`;
		for (let i = 0; i < itemsPerPage; i++) {
			let cardType = result.cardTypes[i];
			let buttonAdmin = `<button type="button" data-internalid="${cardType.Id}" class="edit${i}">Edit</button><button type="button" data-internalid="${cardType.Id}" class="delete${i}">Delete</button>`;
			tableTest += `<tr><td>${cardType.Id}</td>
			<td>${cardType.Name}</td>
			<td>${cardType.Cost}</td>
			<td>${cardType.Damage}</td>
			<td>${cardType.Health}</td>
			<td>${buttonAdmin}</td></tr>`;
		}
		tableTest += `</table>`;
		let contentDiv = `
			<div class="pages">
				${tableTest}
				<div class="itemsPerPage">Showing ${itemsPerPage} out of ${totalItems} cards</div>
				<div class="pageButtons">${pageButtons}<div>
			</div>`;
		document.querySelector(".card-types .content").innerHTML = contentDiv;
		for (let i = 0; i < totalPages; i++) {
			if (i + 1 != currentPage) {
				let button = document.querySelector(`.card-types .pageButton${i + 1}`);
				button.addEventListener("click", (e) => { this.requestDatabase(search, i + 1); }, false);
			}
		}
		for (let i = 0; i < itemsPerPage; i++) {
			let buttonEdit = document.querySelector(`.card-types .edit${i}`);
			buttonEdit.addEventListener("click", (e) => { console.log(`Pressed edit button for the card type with the id ${buttonEdit.getAttribute("data-internalid")}`);}, false);
			let buttonDelete = document.querySelector(`.card-types .delete${i}`);
			buttonDelete.addEventListener("click", (e) => { console.log(`Pressed delete button for the card type with the id ${buttonDelete.getAttribute("data-internalid")}`);}, false);
		}
	}

	requestDatabase(searchName, pageIndex) {
		const request = new XMLHttpRequest();
		const context = this;
		request.open("GET", `http://localhost:3000/view-card-types?searchName=${searchName}&pageIndex=${(pageIndex - 1) * 10}`, true);
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				context.generateTable(JSON.parse(this.response), pageIndex, searchName);
			}
		}
		request.send();
	}

	onSearch() {
		this.requestDatabase(document.querySelector(`.card-types .searchField`).value, 1);
		document.querySelector(`.card-types .searchField`).value = "";
	}

	destroy() {
	}
}
