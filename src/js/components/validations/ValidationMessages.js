class ValidationMessages {
	constructor() {
	}

	displayCardErrors(card) {
	    let inputElements, elementName, inputLength, spanTag, errors = 0;
	    inputElements = Array.from(document.getElementsByTagName("input"));
	    inputElements.push(document.getElementsByTagName("select")[0]);
	    spanTag = document.getElementsByClassName("error");
	    //console.log(card);

	    for (let i = 0, inputLength = inputElements.length; i < inputLength; i++) {
	    	elementName = inputElements[i].attributes["name"].value;
	        elementName = elementName.charAt(0).toUpperCase() + elementName.slice(1);
	        
            if (inputElements[i].value != card[elementName] || inputElements[i].value === NaN) {
                spanTag[i + 1].innerHTML = card[elementName];
                document.getElementsByClassName("card-field")[i].style.visibility = "visible";
                document.getElementsByClassName("card-field")[i].style.opacity = 1;
                spanTag[i + 1].style.visibility = "visible";
                spanTag[i + 1].style.opacity = 1;
                errors++;
            }
	    }
	    if (card.Unique !== undefined) {
	    	let uniqueErrorSpanTag = document.getElementsByClassName("unique");
	    	uniqueErrorSpanTag[0].innerHTML = card.Unique;
	    	document.getElementsByClassName("card-field")[0].style.visibility = "visible";
            document.getElementsByClassName("card-field")[0].style.opacity = 1;
            uniqueErrorSpanTag[0].style.visibility = "visible";
            uniqueErrorSpanTag[0].style.opacity = 1;
	    }
	    return errors === 0 ? card : {};
	}
}