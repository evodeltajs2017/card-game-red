class CardTypes {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const divMain = document.createElement("div");
		
		let itemsPerPage = 10;
		let currentPage = 1;
		let totalItems = 23;
		let totalPages = parseInt(totalItems / itemsPerPage);
		if (totalItems % itemsPerPage > 0) {
			totalPages++;
		}
		if (totalItems == totalItems % itemsPerPage) {
			itemsPerPage = totalItems % itemsPerPage;
		}
		
		let pageButtons = "";
		for (let i = 0; i < totalPages; i++) {
			pageButtons += `<button class="pageButton">${i + 1}</button>`
		}
		
		let buttonAdmin = `<button type="button" class="edit">Edit</button><button type="button" class="delete">Delete</button>`;
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
		tableTest += `<tr><td>${i + 1}</td>
		<td>Name</td>
		<td>${parseInt(Math.random() * 10) + 1}</td>
		<td>${parseInt(Math.random() * 10) + 1}</td>
		<td>${parseInt(Math.random() * 10) + 1}</td>
		<td>${buttonAdmin}</td></tr>`;
		}
		tableTest += `</table>`;
		divMain.innerHTML = 
		`<div class="card-types">
			<div class="header">
				<h1 class="title">View card types</h1>
				<div class="search">
					<input type="text" class="searchField" placeholder="Search"></input>
					<input type="submit" class="searchButton"></input>
				</div>
			</div> 
			<div class="content">
				${tableTest}
				<div class="pages">
					<div class="itemsPerPage">Showing ${itemsPerPage} out of ${totalItems} cards</div>
					<div class="pageButtons">${pageButtons}<div>
				</div>
			</div>
		</div>`;
		this.container.appendChild(divMain);
	}

	destroy() {
	}
}
