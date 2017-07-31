class AddCardType {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.innerHTML = "<h1>add card type</h1>";
		this.container.appendChild(div);
	}

	destroy() {
	}
}