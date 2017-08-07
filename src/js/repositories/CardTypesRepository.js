class CardTypesRepository {
	constructor() {

	}

	getAllCardTypes(callback) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:3000/view-card-types-ok", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				callback(this.status, JSON.parse(this.responseText));
			}
		}
		xhr.send();
	}
}