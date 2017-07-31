class OpenPacks {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.innerHTML = "<h1>open packs</h1>";
		this.container.appendChild(div);
	}

	destroy() {
	}
}