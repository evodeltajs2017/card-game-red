class MousePosition {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.className = "mouse-position";
		this.container.appendChild(div);
		this.domElement = div;

		document.addEventListener("mousemove", (e) => {
			let x = e.screenX;
			let y = e.screenY;

			div.innerHTML = `X: ${x}, Y: ${y}`;
		}, false);
	}
}