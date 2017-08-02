class CardTypeRepository {
	constructor() {
	}

	postCardType() {
		const xhr = new XMLHttpRequest();
		let cardData = new AddCardType();
		cardData.saveCard();

		xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
		    	document.getElementByClass("card-type-view").innerHTML = this.responseText;
		    }
		};

		xhr.open("POST", "http://localhost:3000/add-card-type", true);
		xhr.send(cardData);
	}
}