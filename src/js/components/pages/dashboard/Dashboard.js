class Dashboard {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.innerHTML = "<h1>dashboard</h1>";
		this.container.appendChild(div);
	}

	destroy() {
	}
}