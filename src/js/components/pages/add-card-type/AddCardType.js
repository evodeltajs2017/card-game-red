class AddCardType {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		this.createDomElement();
		this.render();
		this.addEventListeners();
	}

	createDomElement() {
		const div = document.createElement("div");
		div.className = "add-card-type-container";
		this.container.appendChild(div);
		this.domElement = div;

		return this.domElement;
	}

	render() {
		const htmlTemplate =
			`<div class="add-card-type-header">
				<div class="add-card-type-title">
					<h1>Add Card Type</h1>
				</div>
				<div class="add-card-type-buttons">
					<button class="save-btn">Save</button>
					<button class="cancel-btn">Cancel</button>
				</div>
			</div>
			<div class="add-card-type-content">
				<div class="card-type-view-container">
					<div class="card-type-view">
						<div class="card-image"></div>
						<div class="card-cost"></div>
						<div class="card-damage"></div>
						<div class="card-health"></div>
						<div class="card-name"><h2>Name</h2></div>
					</div>
				</div>
				<div class="card-type-form">
					<form action="">
				  		<label>Name</label>
				  		<input class="card-name-input" type="text" name="name">
				  		<label>Cost</label>
				  		<input class="card-cost-input" type="text" name="cost">
				  		<label>Damage</label>
				  		<input class="card-damage-input" type="text" name="damage">
				  		<label>Health</label>
				  		<input class="card-health-input" type="text" name="health">
				  		<label>Image</label>
				  		<input class="card-image-input" type="text" name="image">
					</form>
				</div>
			</div>`;

		this.domElement.innerHTML = htmlTemplate;
	}

	addEventListeners() {
		this.domElement.querySelector(".card-name-input").addEventListener("keyup", (e) => {
			this.domElement.querySelector(".card-name").innerHTML =
			this.domElement.querySelector(".card-name-input").value;
		}, false);

		this.domElement.querySelector(".card-cost-input").addEventListener("keyup", (e) => {
			this.domElement.querySelector(".card-cost").innerHTML =
			this.domElement.querySelector(".card-cost-input").value;
		}, false);

		this.domElement.querySelector(".card-damage-input").addEventListener("keyup", (e) => {
			this.domElement.querySelector(".card-damage").innerHTML =
			this.domElement.querySelector(".card-damage-input").value;
		}, false);

		this.domElement.querySelector(".card-health-input").addEventListener("keyup", (e) => {
			this.domElement.querySelector(".card-health").innerHTML =
			this.domElement.querySelector(".card-health-input").value;
		}, false);

		this.domElement.querySelector(".card-image-input").addEventListener("keyup", (e) => {
			this.domElement.querySelector(".card-image").innerHTML =
			this.domElement.querySelector(".card-image-input").value;
		}, false);

		this.domElement.querySelector(".save-btn").addEventListener("click", () => { this.saveCard() }, false);
	}

	saveCard() {

		let name = this.domElement.querySelector(".card-name-input").value;
		let cost = this.domElement.querySelector(".card-cost-input").value;
		let damage = this.domElement.querySelector(".card-damage-input").value;
		let health = this.domElement.querySelector(".card-health-input").value;
		let image = this.domElement.querySelector(".card-image-input").value;

		let cardDataArr = {
			["Name"]: name,
			["Cost"]: cost,
			["Damage"]: damage,
			["Health"]: health,
			["Image"]: image		
		}

		const postCardType = new CardTypeRepository();
		postCardType.postCardType((status, cardDataArr) => {
			if (status !== 200) {
				alert("Card not added");
			} else {
				return cardDataArr;
			}
		});
		console.log(cardDataArr);
		// return cardDataArr;
	}

	destroy() {
	}
}