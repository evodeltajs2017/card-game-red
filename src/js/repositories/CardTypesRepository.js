class CardTypesRepository {
	constructor() {

	}

	getAllCardTypes(searchName, pageIndex, callback) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", `http://localhost:3000/view-card-types?searchName=${searchName}&pageIndex=${(pageIndex - 1) * 10}`, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				callback(this.status, JSON.parse(this.responseText));
			}
		}
		xhr.send();
	}
}