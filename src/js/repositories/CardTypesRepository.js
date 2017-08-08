class CardTypesRepository {
	constructor() {

	}

	getCardTypes(pageIndex, searchName) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `http://localhost:3000/view-card-types?searchName=${searchName}&pageIndex=${(pageIndex - 1) * 10}`, true);
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send();
		});
	}
}