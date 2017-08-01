class AddCardType {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.className = "add-card-type-container";
		this.container.appendChild(div);
		this.domElement = div;

		this.render();
	}

	render() {
		const htmlTemplate =
		`<div class="add-card-type-header">
			<div class="add-card-type-title">
				<h1>Add Card Type</h1>
			</div>
			<div class="add-card-type-buttons">
				<button>Save</button>
				<button>Cancel</button>
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
			  		<input id="card-name" type="text" name="name">
			  		<label>Cost</label>
			  		<input id="card-cost" type="text" name="cost">
			  		<label>Damage</label>
			  		<input id="card-damage" type="text" name="damage">
			  		<label>Health</label>
			  		<input id="card-health" type="text" name="health">
			  		<label>Image</label>
			  		<input id="card-image" type="text" name="image">
				</form>
			</div>
		</div>`;

		this.domElement.innerHTML = htmlTemplate;

		this.domElement.querySelector("#card-cost").addEventListener("keypress", (e) => {
			let key = e.keyCode;
			if (key === 13) {
				this.domElement.querySelector(".card-cost").innerHTML = "4";
			}
		}, false);
	}

	destroy() {
	}
}