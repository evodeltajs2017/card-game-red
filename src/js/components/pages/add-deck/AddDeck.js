class AddDeck {

	constructor(container) {
		this.container = container;
	}

	initialize() {
		const divMain = document.createElement("div");
		divMain.innerHTML = 
			`<div class="add-deck-container" style="height:${0.77 * screen.height}px">
				<div class="header">
					<div class="title"><h1>Create deck</h1></div>
					<div class="buttons">
						<button class="saveButton">Save</button>
					</div>
				</div> 
				<div class="content"></div>
			</div>`;
		this.container.appendChild(divMain);
		document.querySelector(`.add-deck-container .content`).innerHTML = `
			<div class="available-cards"></div>
			<div class="choosed-cards"></div>
		`;
	}

	destroy() {
	}

}
