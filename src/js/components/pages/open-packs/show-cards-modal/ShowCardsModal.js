const marginLeftModal = 650;
const marginTopModal = 250;
const radius = 315;
const pi = 3.14;
const piRadians = 180;

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
        let x = marginLeftModal + (radius + 100) * Math.sin(pi / piRadians * index * (2*piRadians/cardsNumber));
        let y = marginTopModal + radius * Math.cos(pi / piRadians * index * (2*piRadians/cardsNumber));

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