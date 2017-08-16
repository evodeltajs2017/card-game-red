class Dashboard {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.className = "dashboard-container";
		// div.innerHTML = `<div class="header-container">
		// 					<div class="header">
		// 						<div class="title">
		// 							<h1>Dashboard</h1>
		// 						</div>
		// 					</div>
		// 					<div class="play-button">
		// 						<button>Start Game!</button>
		// 					</div>
		// 				</div>
		// 				<div class="game-board-container"></div>`;
		 this.container.appendChild(div);
		 this.domElement = div;
        //
		// this.domElement.querySelector("button").addEventListener('click', () => {
		// 	this.play();
		// }, false);

		div.innerHTML = `<div class="game-board-container"></div>`;
		this.play();

	}

	play(){
		//this.domElement.querySelector(".header-container").innerHTML = "";
        let gameBoard = new Game(this.domElement.querySelector(".game-board-container"));
        gameBoard.initialize("Player name");
	}

	destroy() {
	}
}