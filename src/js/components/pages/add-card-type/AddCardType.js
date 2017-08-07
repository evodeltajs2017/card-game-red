class AddCardType {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const domElement = new HtmlElements();
		this.domElement = domElement.createAddCardTypeTemplate();
		this.addEventListeners();
		//this.addValidationMessages();
	}

	addEventListeners() {
		this.domElement.querySelector(".card-name-input").addEventListener("keyup", () => {
			this.domElement.querySelector(".card-name h2").innerHTML =
			this.domElement.querySelector(".card-name-input").value;
		}, false);

		this.domElement.querySelector(".card-cost-input").addEventListener("keyup", () => {
			this.domElement.querySelector(".card-cost").innerHTML =
			this.domElement.querySelector(".card-cost-input").value;
		}, false);

		this.domElement.querySelector(".card-damage-input").addEventListener("keyup", () => {
			this.domElement.querySelector(".card-damage").innerHTML =
			this.domElement.querySelector(".card-damage-input").value;
		}, false);

		this.domElement.querySelector(".card-health-input").addEventListener("keyup", () => {
			this.domElement.querySelector(".card-health").innerHTML =
			this.domElement.querySelector(".card-health-input").value;
		}, false);

		this.domElement.querySelector(".card-image-input").addEventListener("click", () => {
			this.domElement.querySelector(".fa").className =
			`fa ${this.domElement.querySelector(".card-image-input").value} fa-5x`;
		}, false);

		this.domElement.querySelector(".save-btn").addEventListener("click", () => { 
			this.saveCard();
			this.validateCard();
			this.domElement.querySelector(".add-card-form").reset();
		}, false);

		this.domElement.querySelector(".cancel-btn").addEventListener("click", () => { 
			this.domElement.querySelector(".add-card-form").reset();
		}, false);
		
	}

	// addValidationMessages() {
	// 	let error = this.domElement.querySelector('.error');
	// 	let cardAddForm = this.domElement.querySelector('.add-card-form');
	// 	let costInput = this.domElement.querySelector(".card-cost-input");

	// 	cardAddForm.querySelector("input[type='number']").addEventListener("input", () => {
	// 		if (costInput.validity.valid) {
	// 		    error.innerHTML = "";
	// 		    error.className = "error";
	// 		}
	// 	}, false);

	// 	this.domElement.querySelector(".save-btn").addEventListener("click", (event) => {
	// 		if (!costInput.validity.valid) {
	// 			costInput.setCustomValidity('Value must be between 0 and 10"')
	// 			error.innerHTML = event.validationMessage;
	// 			error.className = "error active";
	// 			event.preventDefault();
	// 		}
	// 	}, false);
	// }

	saveCard() {
		let card = {
			"Name": "",
			"Cost": null,
			"Damage": null,
			"Health": null,
			"ImageIdentifier": ""
		};

		card.Name = this.domElement.querySelector(".card-name-input").value.trim();
		card.Cost = parseInt(this.domElement.querySelector(".card-cost-input").value.trim(), 10);
		card.Damage = parseInt(this.domElement.querySelector(".card-damage-input").value.trim(), 10);
		card.Health = parseInt(this.domElement.querySelector(".card-health-input").value.trim(), 10);
		card.ImageIdentifier = this.domElement.querySelector(".card-image-input").value.trim();

		let validation = new CardValidations(card);
		let validCard = validation.validateCard();
		console.log(validCard);
	}

	validateCard() {

	    let inputElements, inputClass, inputType, i, inputLength, inputNode, id;

	    inputElements = this.domElement.getElementsByTagName("input");
	    id = this.domElement.getElementById("ideal");

	    for (i = 0, inputLength = inputElements.length; i < inputLength; i++) {
	        inputClass = inputElements[i].className;
	        inputType = inputElements[i].type;
	        inputNode = this.domElement.getElementsByClassName(inputClass);
	         
            if (inputElements[i].value === "") {
                let spanTag = document.createElement("span");
                spanTag.innerHTML = "error";
                inputNode.id.insertBefore(spanTag, inputNode.nextSibling);
            }
	        
	    }
	    return false; // Do Nothing

	}
		// let validCard = (validation.validateCardNumInputs(card.Cost) && validation.validateCardNumInputs(card.Damage) && validation.validateCardNumInputs(card.Health)
		// 				&& validation.validateCardName(card.Name)) ? JSON.stringify(card) : false;

		// (validCard) ? this.displayServerResponse(validCard) : false;

	displayServerResponse(data) {
		const cardType = new CardTypeRepository();
		cardType.postCardType(data, (status, response) => {

			if (status !== 200) {
				alert("Server error!");
			} else {
				alert(response);
			}
		});
	}

	destroy() {
	}
}