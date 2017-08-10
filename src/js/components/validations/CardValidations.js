class CardValidations {
	constructor(object) {
		this.object = object;
	}

	validateCard() {
		let card = this.object;
		let key = null;
		for (key in card) {
		    if (card.hasOwnProperty(key) && key !== undefined) {
		    	if (typeof card[key] === "string") 
		    	{
		    		if (card[key] === "") 
		    		{
	    				card[key] = `${key} cannot be empty`;
	    			} 
	    			else if (card[key].length > 30) 
	    			{
	    				card[key] = "Card name too long";
	    			}
	    			else if ((key === "Name" || key === "ImageIdentifier") && !isNaN(card[key])) 
	    			{
	    				card[key] = `${key} cannot be number`;
	    			} 
	    		} 
	    		else if (typeof card[key] === "number") 
	    		{
					if(card[key] < 0 || card[key] > 10 || isNaN(card[key]))
					{
			    		card[key] = `${key} not valid. Please select a number between 0 and 10`;
			    	} 
			    	else 
			    	{
			    		card[key] = card[key];
			    	}
			    }
		    }
		}
		return card;
	}

	isNameUnique() {
		return true;
	}
}