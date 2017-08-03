class CardTypeRepository {
	constructor() {
	}

	postCardType(data, callback) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:3000/add-card-type", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
		    	callback(this.status, JSON.parse(this.responseText));
		    }
		};
		
		xhr.send(data);
	}

}