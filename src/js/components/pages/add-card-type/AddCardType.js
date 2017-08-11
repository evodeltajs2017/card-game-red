class AddCardType {
	constructor(container, router) {
		this.container = container;
		this.router = router;
	}

	initialize() {
		const domElement = new HtmlElements();
		this.domElement = domElement.createAddCardTypeTemplate();
		this.addEventListeners();
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
			Array.from( this.domElement.querySelectorAll(".error")).forEach( (x) => {x.style.visibility = "hidden"}, false );
			this.saveCard( (card) => { this.displayServerResponse(card)})
		}, false);

		this.domElement.querySelector(".cancel-btn").addEventListener("click", () => { 
			this.domElement.querySelector(".add-card-form").reset();
			Array.from( this.domElement.querySelectorAll(".error")).forEach( (x) => {x.style.visibility = "hidden"} );
			this.router.go("/");
		}, false);
		
	}

	saveCard(callback) {
		let card = {};
		card.Name = this.domElement.querySelector(".card-name-input").value.trim();
		card.Cost = parseInt(this.domElement.querySelector(".card-cost-input").value.trim(), 10);
		card.Damage = parseInt(this.domElement.querySelector(".card-damage-input").value.trim(), 10);
		card.Health = parseInt(this.domElement.querySelector(".card-health-input").value.trim(), 10);
		card.ImageIdentifier = this.domElement.querySelector(".card-image-input").value.trim();

		let validation = new CardValidations(card);
		validation.validateCard(card, (errorCard) => {
			let validationMessage = new ValidationMessages;

	        if (errorCard._error) {
	        	validationMessage.displayCardErrors(errorCard);
	        } else {
				callback(card);
			}
		});
		
	}

	displayServerResponse(data) {
		const cardType = new CardTypeRepository();

		cardType.postCardType(data).then(
			(response) => {
				if (response.indexOf("success") >= 0) {
					alert("Card added successfully!");
					this.router.go("/card-types");
				} else {
					let validationMessage = new ValidationMessages;
					return validationMessage.displayCardErrors(JSON.parse(response));
				}
			});
	}

	destroy() {
	}
}