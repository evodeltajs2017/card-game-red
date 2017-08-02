class CardTypeRepository {
	constructor() {
	}

	postCardType(status, cardData) {
		const xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
		    	alert('success');
		    }
		};

		xhr.open("POST", "http://localhost:3000/add-card-type", true);
		xhr.send(this.cardData);
	}

	// postCardType(callback) {
	// 	const xhr = new XMLHttpRequest();
	// 	xhr.open("POST", "http://localhost:3000/add-card-type", true);

	// 	xhr.onreadystatechange = function() {
	// 		if (xhr.readyState === XMLHttpRequest.DONE) {
	// 			callback(this.status, JSON.parse(this.responseText));
	// 		}
	// 	};

	// 	xhr.send("foo=bar&lorem=ipsum");
	// }
}