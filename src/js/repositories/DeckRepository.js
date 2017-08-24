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

	editDeck(id, name, cardIds) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", `http://localhost:3000/deck/`, true);
   			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send(JSON.stringify({
				id,
				name,
				cardIds
			}));
		});
	}

	getCards() {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `http://localhost:3000/add-deck`, true);
			xhr.onreadystatechange = () => { 
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.responseText));
					} else {
						reject(xhr.statusText);
					}
				}
			};
			xhr.send();
		});
	}

	addDeck(name, id) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", `http://localhost:3000/add-deck/`, true);
   			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send(JSON.stringify({
				name,
				id
			}));
		});
	}

	getCardsForDeck(id) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `http://localhost:3000/view-deck/${id}`, true);
			xhr.onload = () => { resolve(JSON.parse(xhr.responseText)); };
			xhr.onerror = () => { reject(xhr.statusText); };
			xhr.send();
		});
	}
}