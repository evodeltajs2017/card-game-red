const container = document.querySelector(".content-container");

for (let i = 0; i < 10; i++) {
	let x = 200 + 100 * Math.sin(3.14 / 180 * i * 36);
	let y = 200 + 100 * Math.cos(3.14 / 180 * i * 36);

	const mp = new MousePosition(container);
	mp.initialize();

	mp.domElement.style.position = "absolute";
	mp.domElement.style.left = x + "px";
	mp.domElement.style.top = y + "px";
}