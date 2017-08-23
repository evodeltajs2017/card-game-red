class Dashboard {
	constructor(container) {
		this.container = container;
	}

	initialize() {
		const div = document.createElement("div");
		div.className = "dashboard-container";
		div.innerHTML = `<div class="header-container">
							<div class="header">
								<div class="title">
									<h1>Dashboard</h1>
								</div>
							</div>
							<div class="name">Who dares face the mighty Lich King? <br>
								<input type="text" id="playerName" placeholder="Your name" autofocus>
							</div>
							<div class="play-button">
								<button class="play-btn">Start Game!</button>
							</div>
						</div>
						<div class="game-board-container"></div>`;
		 this.container.appendChild(div);
		 this.domElement = div;

		this.domElement.querySelector(".play-btn").addEventListener('click', () => {
			this.play();
		}, false);


        this.domElement.querySelector("#playerName").addEventListener('keyup', (e) => {
            if(e.keyCode == 13){
            	this.play();
			}
        }, false);
	}

	play(){
		let playerName = this.domElement.getElementsByTagName("input")[0].value;

		if(playerName === ""){
			alert("You must insert your name in the input box!");
			return;
		}

        this.domElement.querySelector(".header-container").innerHTML = "";

        let gameBoard = new Game(this.domElement.querySelector(".game-board-container"), playerName);
        gameBoard.initialize();
	}

	destroy() {
	}
}