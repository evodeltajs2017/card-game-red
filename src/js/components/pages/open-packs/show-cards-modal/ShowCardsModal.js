class ShowCardsModal{
    constructor(container, refreshCallback) {
        this.container = container;
        this.refreshCallback = refreshCallback;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = "cards-modal";
        div.innerHTML = `<div class="modal-content"></div>`;
        this.container.appendChild(div);

        window.addEventListener("click", (event) => {
            if (event.target === document.querySelector(".cards-modal")) {
                this.closeModalHandler();
            }
        }, false);

        document.querySelector(".modal-content").addEventListener("click", () => {this.closeModalHandler();}, false);
    }

    render(cardsData){
        document.querySelector(".cards-modal").style.display = "block";
        const modalContent = document.querySelector(".modal-content");

        for(let i=0; i<5 ;i++){
            const card = new Card(modalContent, cardsData[i]);
            card.initialize();

            let x = 650 + 300 * Math.sin(3.14 / 180 * i * 72);
            let y = 300 + 300 * Math.cos(3.14 / 180 * i * 72);

            card.domElement.style.position = "absolute";
            card.domElement.style.left = x + "px";
            card.domElement.style.top = y + "px";
        }
    }

    closeModalHandler(){
        document.querySelector(".cards-modal").style.display = "none";
        document.querySelector(".modal-content").innerHTML = "";
        this.refreshCallback();
    }

}