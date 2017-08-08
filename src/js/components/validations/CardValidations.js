class CardValidations {
	constructor(object) {
		this.object = object;
		this.isNameUnique();
	}

	validateCard() {
		let card = this.object;
		let key = null;
		let pattern = new RegExp("")
		for (key in card) {
			console.log(key);
		    if (card.hasOwnProperty(key) && key !== undefined) {
		    	if (typeof card[key] === "string" && card[key] === "") {
	    			card[key] = `${key} cannot be empty`;
	    		} else if (typeof card[key] === "string" && card[key].length > 30) {
	    			card[key] = "Card name too long";
	    		} else if (key === "Name" || key === "ImageIdentifier" && typeof card[key] === "number") {
	    			card[key] = `${key} cannot be number`;
			    } else if (typeof card[key] === "number" && card[key] < 0 || card[key] > 10 || isNaN(card[key])) {
			    	card[key] = `${key} not valid. Please select a number between 0 and 10`;
			    } else {
			    	card[key] = card[key];
			    }
		    }
		}
		return card;
	}

	displayCardErrors(card) {
	    let inputElements, elementName, inputLength, spanTag, errors = 0;

	    inputElements = Array.from(document.getElementsByTagName("input"));
	    inputElements.push(document.getElementsByTagName("select")[0]);
	    spanTag = document.getElementsByClassName("error");

	    for (let i = 0, inputLength = inputElements.length; i < inputLength; i++) {
	    	elementName = inputElements[i].attributes["name"].value;
	        elementName = elementName.charAt(0).toUpperCase() + elementName.slice(1);
	        
            if (inputElements[i].value != card[elementName] || inputElements[i].value === NaN) {
                spanTag[i].innerHTML = card[elementName];
                document.getElementsByClassName("card-field")[i].style.visibility = "visible";
                document.getElementsByClassName("card-field")[i].style.opacity = 1;
                spanTag[i].style.visibility = "visible";
                spanTag[i].style.opacity = 1;
                errors++;
            }
	    }
	    return errors === 0 ? card : {};
	}

	isNameUnique() {
		return true;
	}
}