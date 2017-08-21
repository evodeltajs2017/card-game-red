class HtmlElements {
	constructor(container) {
		this.container = document.querySelector(".content-container");
	}

	createAddCardTypeTemplate() {
		const div = document.createElement("div");
		div.className = "add-card-type-container";
		this.container.appendChild(div);
		this.domElement = div;

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
					</div>
				</div>
				<div class="card-type-form">
					<form class="add-card-form" action="">
						<div class="card-field">
					  		<label>Name</label>
					  		<input class="card-name-input" type="text" name="name" autofocus required>
					  		<span class="error"></span>
					  		<span class="error unique"></span>
				  		</div>
				  		<div class="card-field">
					  		<label>Cost</label>
					  		<input class="card-cost-input" type="number" name="cost" min="0" max="10" required>
					  		<span class="error"></span>
				  		</div>
				  		<div class="card-field">
					  		<label>Damage</label>
					  		<input class="card-damage-input" type="number" name="damage" min="0" max="10" required>
					  		<span class="error"></span>
				  		</div>
				  		<div class="card-field">
					  		<label>Health</label>
					  		<input class="card-health-input" type="number" name="health" min="0" max="10" required>
					  		<span class="error"></span>
					  	</div>
				  		<div class="card-field">
					  		<label>Image</label>
					  		<select class="card-image-input" type="text" name="imageIdentifier" required>
					  			<option selected="selected"></option>
							    <option value="fa-university">University</option>
							    <option value="fa-car">Car</option>
							    <option value="fa-bell-o">Bell</option>
							    <option value="fa-cubes">Cubes</option>
							    <option value="fa-gift">Gift</option>
						  	</select>
						  	<span class="error"></span>
						</div>
					</form>
				</div>
			</div>`;

		this.domElement.innerHTML = htmlTemplate;
		return this.domElement;
	}

	createCardCollection() {
		const div = document.createElement("div");
		div.className = "card-collection-container";
		this.container.appendChild(div);
		this.domElement = div;

		const htmlTemplate =
			`<div class="card-collection-header">
				<div class="card-collection-title">
					<h1>Card Collection</h1>
				</div>
				<div class="card-collection-search">
					<input type="text" class="search-input" placeholder="Search cards">
					<input type="submit" class="search-button" value="Search">
				</div>
			</div>
			<div class="card-collection-content">
			</div>`;

		this.domElement.innerHTML = htmlTemplate;
		return this.domElement;
	}
}