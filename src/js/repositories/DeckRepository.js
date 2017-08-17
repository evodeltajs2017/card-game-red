class DeckRepository {
	constructor() {

	}

	deleteDeck(id) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("DELETE", `http://localhost:3000/deck/${id}`, true);
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send();
		});
	}

	editDeck(id, name) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", `http://localhost:3000/deck/`, true);
   			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send(JSON.stringify({
				id,
				name
			}));
		});
	}
}