class CardValidations {
	constructor(object) {
		this.object = object;
		this.isNameUnique();
	}

	// validateCardNumInputs(validNumField) {
	// 	validNumField = (validNumField >= 0 && validNumField <= 10 && validNumField !== null) ? true : alert(`${validNumField} is not valid. Please select a number between 0 and 10`);
	// 	return validNumField;
	// }

	// validateCardName(validCardName) {
	// 	validCardName = (validCardName !== "" && validCardName.length < 30) ? true : alert(`Card name cannot be empty`);
	// 	return validCardName;
	// }

	validateCard() {
		let card = this.object;
		let key = null;
		for (key in card) {
		    if (card.hasOwnProperty(key) && key !== undefined) {
		        if (typeof card[key] === "string" && card[key] === "") {
	    			card[key] = `${key} cannot be empty`;
	    		} else if (typeof card[key] === "string" && card[key].length > 30) {
	    			card[key] = "Card name too long";
			    } else if (typeof card[key] === "number" && card[key] < 0 && card[key] > 10) {
			    	card[key] = "${key} not valid. Please select a number between 0 and 10";
			    } else {
			    	card[key] = card[key];
			    }
		    }
		}

		return card;
	}

	isNameUnique() {
		return true;
	}
}