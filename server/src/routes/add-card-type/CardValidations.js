class CardValidations {
	constructor() {
	}

	validateCard(callback, card) {
		// let newCard = {};
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
		this.isNameUnique(card.Name, (isUnique) => {
			if (isUnique === false) {
				card.Unique = "This name is already taken. Please choose another one."
			}
			callback(card);
		});
	}

	isNameUnique(name, callback) {
		callback(true);
	}
}

module.exports = CardValidations;