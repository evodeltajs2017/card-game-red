class ShowCardsModal{

    constructor(container, refreshCallback) {
        this.container = container;
        this.refreshCallback = refreshCallback;
        this.marginLeftModal = 650;
        this.marginTopModal = 250;
        this.radius = 315;
        this.pi = 3.14;
        this.piRadians = 180;
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
        const cardsNumber = 5;

        for(let i=0; i<cardsNumber ;i++){
            const card = new Card(modalContent, cardsData[i]);
            card.initialize();

            setTimeout(() => {
                this.setCardStyle(card, cardsNumber, i);
            }, 15);
        }
    }

    setCardStyle(card, cardsNumber, index){
        let x = this.marginLeftModal + (this.radius + 100) * Math.sin(this.pi / this.piRadians * index * (2*this.piRadians/cardsNumber));
        let y = this.marginTopModal + this.radius * Math.cos(this.pi / this.piRadians * index * (2*this.piRadians/cardsNumber));

        card.domElement.style.position = "absolute";
        card.domElement.style.left = x + "px";
        card.domElement.style.top = y + "px";
    }

    closeModalHandler(){
        document.querySelector(".cards-modal").style.display = "none";
        document.querySelector(".modal-content").innerHTML = "";
        this.refreshCallback();
    }

    show(cardsData){
        this.render(cardsData);
    }

}