class CardValidations {
	constructor() {
	}

	validateCard(card, callback) {
		let key = null;
		for (key in card) {
		    if (card.hasOwnProperty(key) && key !== undefined) {
		    	if (typeof card[key] === "string") 
		    	{
		    		if (card[key] === "") 
		    		{
	    				card[key] = `${key} cannot be empty`;
	    				card._error = true;
	    			} 
	    			else if (card[key].length > 30) 
	    			{
	    				card[key] = "card name too long";
	    				card._error = true;
	    			}
	    			else if ((key === "Name" || key === "ImageIdentifier") && /\d/.test(card[key])) 
	    			{
	    				card[key] = `${key} cannot be or contain a number`;
	    				card._error = true;
	    			}
	    		} 
	    		else if (typeof card[key] === "number" || card[key] === null)
	    		{
					if(card[key] < 0 || card[key] > 10 || isNaN(card[key]) || card[key] === null || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/.test(card[key]))
					{
			    		card[key] = `${key} not valid. Please select a number between 0 and 10`;
			    		card._error = true;
			    	} 
			    	else 
			    	{
			    		card[key] = card[key];
			    	}
			    }
		    }
		}
		this.isNameUnique(card.Name, (isUnique) => {
			if (isUnique === false) {
				card.Unique = "This name is already taken. Please choose another one."
				card._error = true;
			}
			callback(card);
		});
	}

	isNameUnique(name, callback) {
		callback(true);
	}
}