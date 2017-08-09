class ValidationMessages {
	constructor() {
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
}