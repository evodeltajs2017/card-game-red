class Navbar {
	constructor(container, router) {
		this.container = container;
		this.router = router;

		this.buttons = [
			{ name: "Dashboard", url: "/" },
			{ name: "Add card type", url: "/add-card-type" },
			{ name: "View card types", url: "/card-types" },
			{ name: "Open card packs", url: "/open-packs" },
			{ name: "View card collection", url: "/card-collection" },
			{ name: "View decks", url: "/view-decks" },
			{ name: "Add deck", url: "/add-deck" }
		];
	}

	initialize() {
		const div = document.createElement("div");
		div.className = "navbar";
		this.container.appendChild(div);
		this.domElement = div;

		this.render();
	}

	render() {
		let html = "";
		this.buttons.forEach(x => {
			html += `<button>${x.name}</button>`;
		});

		this.domElement.innerHTML = html;
		Array.from(this.domElement.children).forEach((x, i) => {
			const button = this.buttons[i];

			x.addEventListener("click", (e) => {
				this.router.go(button.url);
			}, false);
		});
	}
}