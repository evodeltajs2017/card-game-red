class CardPack{
    constructor(container) {
        this.container = container;
    }

    initialize() {
        const div = document.createElement("div");
        div.className = "card-pack";
        this.container.appendChild(div);
        this.domElement = div;
    }
}