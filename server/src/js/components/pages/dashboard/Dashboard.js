class Dashboard {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.innerHTML = "<h1>dashboard</h1>";
		this.container.appendChild(div);

		const repo = new UserRepository();
		repo.getUnopenedCardPacks((status, data) => {
			if (status !== 200) {
				div.innerHTML = "<h1>error</h1>";
			} else {
				console.log(status, data);
			}
		});
	}

	destroy() {
	}
}