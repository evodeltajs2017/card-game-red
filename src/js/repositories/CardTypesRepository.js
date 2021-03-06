class CardTypesRepository {
	constructor() {

	}

	getCardTypes(pageIndex, searchName) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			let query = `searchName=${searchName}&`;
			if (searchName === undefined) {
				query = "";
			}
			xhr.open("GET", `http://localhost:3000/view-card-types?${query}pageIndex=${(pageIndex - 1) * 10}`, true);
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send();
		});
	}

	deleteCardType(id) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("DELETE", `http://localhost:3000/card-types/${id}`, true);
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send();
		});
	}
}